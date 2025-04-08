"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { getSingleCompanydetailStats, sendReminder } from "@/services/admin-services"; // Import sendReminder
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Loader2 } from "lucide-react"; // Import Loader2 for loading spinner
import { toast } from "sonner"; // Import toast for notifications

// Define the interface for the API response
interface ApiResponse {
  success: boolean;
  message?: string;
  data: {
    companyName: string;
    email: string;
    planType?: string; // Optional if not always present
    subscriptionExpiryDate?: string; // Optional if not always present
    totalUsers?: number; // Assuming this maps to totalUsers
    // Add other fields as per your API response
  };
}

const Page = () => {
  const { id } = useParams();
  console.log("id:", id);

  const [formData, setFormData] = useState({
    companyName: "",
    subscriptionPlan: "",
    email: "",
    subscriptionExpireDate: "",
    totalUsers: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<ApiResponse["data"] | null>(null); // Type-safe state for user data
  const [reminderLoading, setReminderLoading] = useState<string | null>(null); // State for reminder loading

  // Fetch company details by id
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await getSingleCompanydetailStats(`/admin/get-company-by-id/${id}`);
        console.log("response:", response);
        const data: ApiResponse = response.data;

        if (data.success) {
          setUserData(data.data);
          // Initialize form data with fetched values
          setFormData({
            companyName: data.data.companyName || "",
            subscriptionPlan: data.data.planType || "",
            email: data.data.email || "",
            subscriptionExpireDate: data.data.subscriptionExpiryDate
              ? new Date(data.data.subscriptionExpiryDate).toLocaleDateString()
              : "",
            totalUsers: data.data.totalUsers?.toString() || "", // Convert number to string for Input
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
    } else {
      setLoading(false); // Handle case where id is undefined
      setError("No company ID provided.");
    }
  }, [id]); // Re-run when id changes

  // Handle reminder click
  const handleReminderClick = async (id: string) => {
    setReminderLoading(id); // Set loading state for this specific reminder
    try {
      const response = await sendReminder(`/admin/subscription-expire-remainder/${id}`); // Send Id in route
      console.log("Reminder response:", response.data); // Debug the response
      // Check if the response indicates success (flexible check)
      if (response.data && (response.data.success === true || response.status === 200)) {
        toast.success("Reminder sent successfully!");
      } else {
        toast.error("Failed to send reminder: " + (response.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
      if (err instanceof Error) {
        if ((err as any).response?.data?.message) {
          toast.error("Error sending reminder: " + (err as any).response.data.message);
        } else {
          toast.error("Error sending reminder: " + err.message);
        }
      } else {
        toast.error("Error sending reminder: Unknown error");
      }
    } finally {
      setReminderLoading(null); // Reset loading state
    }
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
        <div className="grid grid-cols-12 gap-4 h-screen w-full">
          <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
            <h2 className="text-white text-xl font-medium">
              <Skeleton width={200} height={24} />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton width={100} height={16} />
                <Skeleton height={48} />
              </div>
              <div className="space-y-2">
                <Skeleton width={100} height={16} />
                <Skeleton height={48} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton width={100} height={16} />
                <Skeleton height={48} />
              </div>
              <div className="space-y-2">
                <Skeleton width={100} height={16} />
                <Skeleton height={48} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton width={100} height={16} />
                <Skeleton height={48} />
              </div>
            </div>
            <Skeleton width={150} height={44} />
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-12 gap-4 h-screen w-full">
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <h2 className="text-white text-xl font-medium">
          {userData?.companyName || "Fortunate Tech Solutions Inc."}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white opacity-80 dm-sans text-base font-normal">
              Company Name
            </Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              readOnly // Prevent editing
              className="bg-[#0f172a] h-12 border-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">
              Email Address
            </Label>
            <Input
              id="email"
              type="text"
              value={formData.email}
              readOnly // Prevent editing
              className="bg-[#0f172a] h-12 border-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="subscriptionPlan" className="text-white dm-sans opacity-80 text-base font-normal">
              Subscription Plan
            </Label>
            <Input
              id="subscriptionPlan"
              type="text"
              value={formData.subscriptionPlan}
              readOnly // Prevent editing
              className="bg-[#0f172a] h-12 border-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscriptionExpireDate" className="text-white dm-sans opacity-80 text-base font-normal">
              Subscription Expire Date
            </Label>
            <Input
              id="subscriptionExpireDate"
              type="text"
              value={formData.subscriptionExpireDate}
              readOnly // Prevent editing
              className="bg-[#0f172a] h-12 border-none"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="totalUsers" className="text-white dm-sans opacity-80 text-base font-normal">
              Total Users
            </Label>
            <Input
              id="totalUsers"
              type="text"
              value={formData.totalUsers}
              readOnly // Prevent editing
              className="bg-[#0f172a] h-12 border-none"
            />
          </div>
        </div>

        <Button
          variant="destructive"
          className="bg-[#1A3F70] w-48 h-11 hover:bg-[#1A3F70] hover:cursor-pointer"
          onClick={() => handleReminderClick(id as string)} // Trigger reminder function
          disabled={reminderLoading === id}
        >
          {reminderLoading === id ? (
            <Loader2 size={20} className="animate-spin text-white" />
          ) : (
            "Send Reminder"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Page;