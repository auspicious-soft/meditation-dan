"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import image from "../../../../public/images/pexels.webp";
import { getAdminDetails, updateAdminDetails, updateAdminProfilePic } from "@/services/admin-services";


const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
  });
  const [profileImage, setProfileImage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try { // Replace with your token logic
        const response = await getAdminDetails(`/admin`);
        const adminData = response.data.data; // Adjust based on your API response structure
        setFormData({
          firstName: adminData.firstName || "",
          lastName: adminData.lastName || "",
          email: adminData.email || "",
          gender: adminData.gender || "",
        });
        setProfileImage(adminData.profileImage || ""); // Assuming profileImage is a URL
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
      setProfileImage(imageUrl);
      setSelectedFile(file); // Store the file for upload
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {

      // Update profile data
      await updateAdminDetails(`/admin`, formData);
      toast.success("Profile updated successfully");

      // Update profile picture if a new image was selected
      if (selectedFile) {
        const formDataPayload = new FormData();
        formDataPayload.append("profileImage", selectedFile);
        await updateAdminProfilePic(`/admin/profile/pic`, formDataPayload);
        toast.success("Profile picture updated successfully");
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
          <div className="flex flex-row flex-wrap items-end gap-3">
            <Image
              src={profileImage || image}
              alt="Profile Image"
              width={250}
              height={170}
            />
            <label htmlFor="profileImageUpload">
              <Button
                variant="outline"
                className="bg-slate-900 border-[#D7D7D7] h-8 dm-sans text-zinc-300 hover:text-zinc-300 text-sm hover:bg-slate-800"
                disabled={isLoading}
              >
                Change image
              </Button>
            </label>
            <input
              type="file"
              id="profileImageUpload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
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

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-white dm-sans text-base font-normal">
              Gender
            </Label>
            <Input
              id="gender"
              type="text"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="bg-[#1B2236] h-12 border-none text-white"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Button
            className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white"
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