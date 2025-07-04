"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminDetails, updateAdminDetails, updateAdminProfilePic } from "@/services/admin-services";
import { Upload, Trash2, ChevronLeft } from "lucide-react";
import { generateSignedUrlForAdminProfile, getImageUrlOfS3 } from "@/actions";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Validation utility function
const validateForm = (formData: { firstName: string; lastName: string; email: string }, originalEmail: string) => {
  const errors: { [key: string]: string } = {};

  // Validate First Name
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (!nameRegex.test(formData.firstName)) {
    errors.firstName = "First name should contain only letters and spaces";
  }

  // Validate Last Name
  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (!nameRegex.test(formData.lastName)) {
    errors.lastName = "Last name should contain only letters and spaces";
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  } else if (formData.email !== originalEmail) {
    errors.email = "Email cannot be changed"; // Restrict email changes unless backend supports it
  }

  return errors;
};

// Image validation function
const validateImage = (file: File | null): string | null => {
  if (!file) return null;

  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  const allowedTypes = ["image/jpeg", "image/png"];

  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG and PNG images are allowed";
  }
  if (file.size > maxSize) {
    return "Image size must not exceed 5MB";
  }
  return null;
};

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState<string>("");
  const [hadInitialImage, setHadInitialImage] = useState<boolean>(false);
  const [imageRemoved, setImageRemoved] = useState<boolean>(false);
  const router = useRouter();

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAdminDetails(`/admin`);
        const adminData = response.data.data;
        setFormData({
          firstName: adminData.firstName || "",
          lastName: adminData.lastName || "",
          email: adminData.email || "",
        });
        setOriginalEmail(adminData.email || "");
        // Get the full S3 URL for the profile image
        if (adminData.profilePic) {
          const s3Url = await getImageUrlOfS3(adminData.profilePic);
          setProfileImage(adminData.profilePic);
          setImagePreview(s3Url);
          setHadInitialImage(true);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        toast.error("Failed to load admin profile", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Validate on change
    const newErrors = validateForm({ ...formData, [field]: value }, originalEmail);
    setErrors(newErrors);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateImage(file);
      if (validationError) {
        setImageError(validationError);
        setImagePreview("");
        setSelectedFile(null);
        toast.error(validationError, {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
        return;
      }
      setImageError(null); // Clear previous error
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setSelectedFile(file);
      setImageRemoved(false); // Reset the removed flag when a new image is selected
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    
    // If there was an initial image and no new file is selected, mark as removed
    if (hadInitialImage) {
      setImageRemoved(true);
      setImageError("Profile image is required. Please upload a new image.");
    }
    
    setProfileImage("");
  };

  // Validate profile completeness including image
  const validateProfileCompleteness = () => {
    const validationErrors = validateForm(formData, originalEmail);
    
    // Check if image is required but missing
    if (imageRemoved && !selectedFile) {
      setImageError("Profile image is required. Please upload a new image.");
      return { ...validationErrors, image: "Profile image is required" };
    }
    
    return validationErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateProfileCompleteness();
    
    if (Object.keys(validationErrors).length > 0 || imageError) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors before saving", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
      return;
    }

    setIsLoading(true);
    try {
      // Update profile data and capture response
      const profileUpdateResponse = await updateAdminDetails(`/admin`, formData);
      if (profileUpdateResponse && profileUpdateResponse.data.success) {
        let successMessage = "Profile updated successfully";

        // Update profile picture if a new image was selected
        let imageUpdateResponse;
        if (selectedFile) {
          const image = selectedFile;
          const imageFileName = `${Date.now()}-${image.name}`;
          const fileType = image.type;

          // Generate signed URL for S3 upload
          const { signedUrl, key } = await generateSignedUrlForAdminProfile(formData.email, imageFileName, fileType);
          console.log("key:", key);

          // Upload the image to S3 using the signed URL
          const imageUploadResponse = await fetch(signedUrl, {
            method: "PUT",
            body: image,
            headers: { "Content-Type": image.type },
          });

          if (!imageUploadResponse.ok) {
            throw new Error("Failed to upload image to S3");
          }

          // Update backend with the new S3 key
          imageUpdateResponse = await updateAdminProfilePic(`/admin/profile/pic`, { profilePic: key });

          if (imageUpdateResponse && imageUpdateResponse.data.success) {
            setProfileImage(key);
            setSelectedFile(null);
            setImageRemoved(false);
            successMessage += " ";
          } else {
            throw new Error(imageUpdateResponse?.data?.message || "Failed to update profile picture");
          }
        } else if (imageRemoved) {
          // This case should be prevented by validation, but as a fallback:
          throw new Error("Profile image is required. Please upload a new image.");
        }

        // Update session with the latest data if all updates are successful
        const userName = `${formData.firstName} ${formData.lastName}`;
        const updatedProfilePicKey = imageUpdateResponse?.data?.data?.profilePic || profileUpdateResponse.data.data.profilePic || profileImage;
        await signIn("credentials", {
          email: formData.email,
          fullName: userName,
          _id: profileUpdateResponse.data.data._id || "",
          role: profileUpdateResponse.data.data.role || "admin",
          profilePic: updatedProfilePicKey || "",
          redirect: false,
        });

        toast.success(successMessage.trim(), {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      }); // Single toast with combined message
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error(profileUpdateResponse?.data?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save profile", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4 ">
          <Button
            variant="destructive"
            className="bg-[#343741] hover:bg-[#343741] p-0 h-7 w-7 hover:cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft />
          </Button>
          <p className="text-zinc-300 text-base SF Pro Display font-normal">Profile Image</p>
          </div>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <Card className="w-44 min-h-40 flex items-center justify-center bg-[#0B132B] border-none rounded-lg relative">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={176}
                    height={176}
                    className="rounded-lg object-cover"
                    key={imagePreview}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 hover:bg-[#373f57] right-0 hover:cursor-pointer text-zinc-500"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} className="text-white hover:cursor-pointer" />
                  </Button>
                </>
              ) : (
                <Upload size={32} className="text-gray-400" />
              )}
            </Card>
            <div>
              <label htmlFor="image-upload">
                <input
                  type="file"
                  className="hidden"
                  id="image-upload"
                  accept="image/jpeg,image/png"
                  onChange={handleImageChange}
                />
                <div className="border p-1 px-4 rounded-sm max-w-36 hover:cursor-pointer border-white text-gray-300 cursor-pointer">
                  {imagePreview ? "Change Image" : "Choose Image"}
                </div>
              </label>
              {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white dm-sans text-base font-normal">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="bg-[#1B2236] h-12 border-none text-white"
              disabled={isLoading}
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white dm-sans text-base font-normal">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="bg-[#1B2236] h-12 border-none text-white"
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-[#1B2236] h-12 border-none text-white"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
        </div>

        <div>
          <Button
            className="mt-4 bg-[#1A3F70] w-28 h-11 hover:cursor-pointer hover:bg-[#1A3F70] dm-sans text-white"
            onClick={handleSave}
            disabled={isLoading || Object.keys(errors).length > 0 || !!imageError}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;