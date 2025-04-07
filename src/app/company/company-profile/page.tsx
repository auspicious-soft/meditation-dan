"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompanyDetails, updateCompanyDetails } from "@/services/company-services";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Added Loader2 import

const Page = () => {
  const session = useSession();
  console.log('session: ', session);

  // Initialize formData with empty values, will be updated from API
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Added for save button loading state

  // Fetch company details
  const { data, mutate } = useSWR(
    session.data?.user?.id ? `/company/company-details/${session.data?.user?.id}` : null,
    getCompanyDetails,
    { 
      revalidateOnFocus: false,
      onSuccess: (response) => {
        // Map the API response to formData when data is available
        setFormData({
          email: response?.data?.data?.email || "",
          companyName: response?.data?.data?.companyName || "",
        });
      }
    }
  );

  console.log('companyName from API: ', data?.data?.data.companyName);
  console.log('email from API: ', data?.data?.data.email);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!session.data?.user?.id) {
      toast.error("User ID not found");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        companyName: formData.companyName,
        // Email is not included since it's disabled and shouldn't be updated
      };

      const response = await updateCompanyDetails(
        `/company/update-company/${session.data.user.id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Company details updated successfully");
        mutate(); // Revalidate the data after successful update
      } else {
        toast.error(response?.data?.message || "Failed to update company details");
      }
    } catch (error) {
      console.error("Error updating company details:", error);
      toast.error("An error occurred while updating company details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-6">
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
              disabled 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
              Company Name
            </Label>
            <Input
              id="companyName"
              type="text" 
              value={formData.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              className="bg-[#1B2236] h-12 border-none text-white"
            />
          </div>
        </div>

        <div>
          <Button
            className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white flex items-center justify-center"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-white" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;