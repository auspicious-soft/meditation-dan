"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSingleCompanydetailStats, deleteCompany, updateCompanyDetails } from "@/services/admin-services";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Loader2 } from "lucide-react"; // Import Loader2 for loading states

// Interface based on the actual API response
interface CompanyData {
  _id: string;
  companyName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  identifier: string;
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
  isAccountActive: boolean;
  emailVerified: boolean;
  isVerifiedByAdmin: string;
  role: string;
  stripeCustomerId: string;
  subscriptionStatus: string;
  planType: string | null;
  planInterval: string | null;
  subscriptionId: string | null;
  subscriptionStartDate: string | null;
  subscriptionExpiryDate: string | null;
  password?: string; // Assuming password is part of the data
}

interface ApiResponse {
  success: boolean;
  data: CompanyData;
  users: number;
  statusCode: number;
}

const Page = () => {
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState<CompanyData | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "", // Assuming you might want to allow password updates
    numberOfUsers: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false); // Loading state for Save
  const [deleting, setDeleting] = useState<boolean>(false); // Loading state for Delete

  // Fetch single company details on mount
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await getSingleCompanydetailStats(`/admin/get-company-by-id/${id}`);
        const data: ApiResponse = response.data;

        if (data.success) {
          setUserData(data.data);
          // Initialize form data with fetched values
          setFormData({
            companyName: data.data.companyName,
            email: data.data.email,
            firstName: data.data.firstName || "",
            lastName: data.data.lastName || "",
            password: data.data.password || "", // Assuming password is part of the data
            numberOfUsers: data.users,
          });
        } else {
          throw new Error("API request failed");
        }
      } catch (err) {
        setError("Failed to fetch company details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    setDeleting(true); // Start loading for delete
    try {
      const response = await deleteCompany(`/admin/delete-company/${id}`);
      if (response.status === 200 ) {
        toast.success("Company account deleted successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setIsDialogOpen(false);
        setTimeout(() => {
          window.location.href = "/admin/company-lists";
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Failed to delete company account", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setDeleting(false); // Stop loading for delete
    }
  };

  // Handle update company details
  const handleUpdate = async () => {
    if (!userData) return;
    setSaving(true); // Start loading for save
    try {
      // Assuming there's an updateCompany service function
      const updatePayload = {
        companyName: formData.companyName,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      };

      // You'll need to implement this service function
      const response = await updateCompanyDetails(`/admin/update/company/name/${id}`, updatePayload);

      if (response.data.success) {
        setUserData({
          ...userData,
          companyName: formData.companyName,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
        });
        toast.success("Company details updated successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setTimeout(() => {
          window.location.href = "/admin/company-lists";
        }, 1000);
      } else {
        toast.error("Failed to update company details", {
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
      console.error("Error updating company:", error);
      toast.error(
        error instanceof Error && (error as any)?.response?.data?.message
          ? (error as any).response.data.message
          : "Failed to save item"
      , {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setSaving(false); // Stop loading for save
    }
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
        <div className="text-white py-6 w-full h-screen">
          <Skeleton width={200} height={24} className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <Skeleton width={100} height={14} className="mb-1" />
                <Skeleton width={150} height={16} />
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-12">
            <Skeleton width={120} height={36} />
            <Skeleton width={120} height={36} />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error || !userData) {
    return <div className="text-red-500">{error || "No data available"}</div>;
  }

  return (
    <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
      <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
      <Button
            variant="destructive"
            className="bg-[#0B132B] hover:bg-[#0B132B] p-0 h-7 w-7 hover:cursor-pointer"
            onClick={() => (window.location.href = "/admin/company-lists")}
          >
            <ChevronLeft  />
          </Button>
          <div>
        <h1 className="text-xl font-medium text-white">Edit Company</h1>
        </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-white opacity-80 text-base font-normal">
            Company Name
          </Label>
          <Input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleInputChange}
            className="bg-[#0f172a] h-12 border-none text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white opacity-80 text-base font-normal">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-[#0f172a] h-12 border-none text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white opacity-80 text-base font-normal">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              className="bg-[#0f172a] h-12 border-none text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white opacity-80 text-base font-normal">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className="bg-[#0f172a] h-12 border-none text-white"
            />
          </div>
          
            <div className="space-y-2">
            <Label htmlFor="password" className="text-white opacity-80 text-base font-normal">
              Login Password
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter new password"
              className="bg-[#0f172a] h-12 border-none text-white"
            />
          </div>
          
          <div className="border border-[#5c5b5b] rounded">
            <Label htmlFor="numberOfUsers" className="text-white px-2 mt-1 opacity-80 text-base font-normal">
              Number of users registered
            </Label>
            <span className="h-12 flex items-center px-2 rounded-md text-[#A1A1A1]">
              {formData.numberOfUsers || "0"}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-12">
          <Button
            variant="default"
            className="bg-[#1A3F70] hover:bg-[#1A3F70] hover:cursor-pointer flex items-center justify-center"
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? (
              <Loader2 size={20} className="animate-spin text-white" />
            ) : (
              "Save"
            )}
          </Button>
          <Button
            variant="destructive"
            className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            Delete Account
          </Button>
          
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <DialogTitle className="text-lg font-semibold text-center">Delete Account</DialogTitle>
              <DialogDescription className="text-sm text-gray-400 text-center">
                Are you sure you want to delete this account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 mt-4">
              <Button
                variant="outline"
                className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
                onClick={() => setIsDialogOpen(false)}
              >
                No
              </Button>
              <Button
                variant="destructive"
                className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11 flex items-center justify-center"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  "Yes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SkeletonTheme>
  );
};

export default Page;