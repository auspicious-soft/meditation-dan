"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompanyDetails, updateCompanyDetails } from "@/services/company-services";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();

  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    password: "",
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState({
    companyName: "",
    password: "",
  });
  // State for error messages
  const [errors, setErrors] = useState({
    email: "",
    companyName: "",
    password: "",
    totalUsers: "",
  });

  // Fetch company details
  const { data, error: swrError, mutate, isLoading: swrIsLoading } = useSWR(
    status === "authenticated" && session?.user?.id 
      ? `/company/company-details/${session.user.id}` 
      : null,
    getCompanyDetails,
    { 
      revalidateOnFocus: false,
      onSuccess: (response) => {
        const companyData = response?.data?.data || response?.data || {};
        setFormData({
          email: companyData.email || "",
          companyName: companyData.companyName || "",
          password: companyData.password || "",
          totalUsers: companyData.totalUsers || 0,
        });
        setInitialData({
          companyName: companyData.companyName || "",
          password: companyData.password || "",
        });
      },
      onError: (err) => {
        console.error('SWR Error:', err);
      },
    }
  );

  const isDataLoading = swrIsLoading && !swrError && status === "authenticated";

  useEffect(() => {
    if (status === "authenticated" && data) {
      const companyData = data?.data?.data || data?.data || {};
      setFormData({
        email: companyData.email || "",
        companyName: companyData.companyName || "",
        password: companyData.password || "",
        totalUsers: companyData.totalUsers || 0,
      });
      setInitialData({
        companyName: companyData.companyName || "",
        password: companyData.password || "",
      });
    }
  }, [status, data]);

  const validateForm = () => {
    const newErrors = {
      email: "",
      companyName: "",
      password: "",
      totalUsers: "",
    };
    let isValid = true;

    // Company Name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
      isValid = false;
    }

    // Password validation
    if (formData.password !== initialData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: field === "totalUsers" ? parseInt(value) || 0 : value,
    });

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast.error("User ID not found", {
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

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload: { companyName: string; password?: string } = {
        companyName: formData.companyName,
      };

      if (formData.password !== initialData.password) {
        payload.password = formData.password;
      }

      const response = await updateCompanyDetails(
        `/company/update-company/${session?.user.id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Company details updated successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        mutate();
        setInitialData({
          companyName: formData.companyName,
          password: formData.password,
        });
        await signIn("credentials", {
          email: formData.email,
          fullName: formData.companyName,
          _id: session.user.id,
          role: session.user.role || "company",
          redirect: false,
          ...(payload.password && { password: formData.password }),
        });
      } else {
        toast.error(response?.data?.message || "Failed to update company details", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      }
    } catch (error) {
      console.error("Error updating company details:", error);
      toast.error("An error occurred while updating company details", {
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

  const hasChanges = 
    formData.companyName !== initialData.companyName || 
    formData.password !== initialData.password;

  // Mask password with a fixed 6 asterisks
  const maskedPassword = formData.password ? "******" : "";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
              Email Address
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)} 
                  className="bg-[#1B2236] h-12 border-none text-white"
                  disabled 
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
              Company Name
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <div>
                <Input
                  id="companyName"
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="bg-[#1B2236] h-12 border-none text-white"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white dm-sans text-base font-normal">
              Password
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <div>
                <Input
                  id="password"
                  type="text"
                  value={formData.password === initialData.password ? maskedPassword : formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="bg-[#1B2236] h-12 border-none text-white"
                  placeholder="Enter new password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalUsers" className="text-white dm-sans text-base font-normal">
              Total Active Users
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <div>
                <Input
                  id="totalUsers"
                  type="number"
                  value={formData.totalUsers}
                  onChange={(e) => handleChange("totalUsers", e.target.value)}
                  className="bg-[#1B2236] h-12 border-none text-white"
                  disabled
                />
                {errors.totalUsers && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalUsers}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <Button
            className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white flex items-center justify-center hover:cursor-pointer"
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
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