"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAdminDetails, updateAdminDetails, updateAdminProfilePic } from "@/services/admin-services";
import { Upload, Trash2 } from "lucide-react";
import { generateSignedUrlForAdminProfile, getImageUrlOfS3 } from "@/actions";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  });
  const [adminId, setAdminId] = useState<string>(""); 
  const [profileImage, setProfileImage] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>(""); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          gender: adminData.gender || "",
        });
        setAdminId(adminData.id || "");

        // Get the full S3 URL for the profile image
        if (adminData.profilePic) {
          const s3Url = await getImageUrlOfS3(adminData.profilePic);
          setProfileImage(adminData.profilePic);
          setImagePreview(s3Url);
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error);
        toast.error("Failed to load admin profile");
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
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setSelectedFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setSelectedFile(null);
    setProfileImage("");
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Update profile data
      await updateAdminDetails(`/admin`, formData);
      toast.success("Profile updated successfully");

      // Update profile picture if a new image was selected
      if (selectedFile) {
        const image = selectedFile;
        const imageFileName = `${Date.now()}-${image.name}`;
        const fileType = image.type;

        // Generate signed URL for S3 upload
        const { signedUrl, key } = await generateSignedUrlForAdminProfile(formData.email, imageFileName, fileType);
        console.log('key:', key);

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
        await updateAdminProfilePic(`/admin/profile/pic`, { profilePic: key });
        
        // Update state with the new key
        setProfileImage(key);
        
        // Clear the selected file as it's been uploaded
        setSelectedFile(null);
       
        toast.success("Profile picture updated successfully");
        setTimeout(() =>{
          window.location.reload();
        })
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-6">
        <div>
          <p className="mb-4 text-zinc-300 text-base SF Pro Display font-normal">Profile Image</p>
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <Card className="w-44 h-44 flex items-center justify-center bg-[#0B132B] border-none rounded-lg relative">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={176}
                    height={176}
                    className="rounded-lg w-full h-full object-cover"
                    // Add a key to force React to re-render the image when the URL changes
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
                <div className="border p-1 px-4 rounded-sm hover:cursor-pointer border-white text-gray-300 cursor-pointer">
                  {imagePreview ? "Change Image" : "Choose Image"}
                </div>
              </label>
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
          </div>
        </div>

        <div>
          <Button
            className="mt-4 bg-[#1A3F70] w-28 h-11 hover:cursor-pointer hover:bg-[#1A3F70] dm-sans text-white"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;