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
import { deactivateUserAccount, deleteUser, getUserDetailStats } from "@/services/company-services";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR(`/company/users/${id}`, getUserDetailStats, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  const userDetails = data?.data?.data ?? {};

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false); // Loading state for delete
  const [isDeactivateLoading, setIsDeactivateLoading] = useState(false); // Loading state for deactivate

  const handleDeleteAccount = async () => {
    setIsDeleteLoading(true); // Start loading
    try {
      const response = await deleteUser(`/company/users/${id}`);
      if (response?.data?.success) {
        toast.success(response.data.message, {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        router.push("/company/users");
      }
    } catch (error) {
      toast.error("Failed to delete account", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setIsDeleteLoading(false); // Stop loading
      setIsDialogOpen(false);
    }
  };

  const handleDeactivate = async () => {
    setIsDeactivateLoading(true); // Start loading
    try {
      console.log("Deactivate requested");
      const response = await deactivateUserAccount(`company/users/${id}/deactivate`);
      if (response?.data?.success) {
        mutate(); // Revalidate SWR data
        toast.success(response.data.message, {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
      }
      router.back();
      console.log("response: ", response);
    } catch (error) {
      toast.error("Failed to deactivate account", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setIsDeactivateLoading(false); // Stop loading
      setIsDeactivateOpen(false);
    }
  };

  // Helper to safely format date or return a fallback
  const formatDate = (date: string | undefined) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  if (isLoading) {
    return (
      <div className="text-white py-6 w-full ">
        {/* Header Section */}
        <div className="mb-2">
          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
            <Skeleton height={20} width={250} /> {/* Name */}
            <Skeleton height={14} width={180} className="mt-2 opacity-50" /> {/* Email */}
          </SkeletonTheme>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* First Name */}
          <div>
            <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
              <Skeleton height={10} width={80} className="mb-1 opacity-80" /> {/* Label */}
              <Skeleton height={12} width={120} /> {/* Value */}
            </SkeletonTheme>
          </div>
          {/* Last Name */}
          <div>
            <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
              <Skeleton height={10} width={80} className="mb-1 opacity-80" /> {/* Label */}
              <Skeleton height={12} width={120} /> {/* Value */}
            </SkeletonTheme>
          </div>
          {/* Email Address */}
          <div>
            <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
              <Skeleton height={10} width={100} className="mb-1 opacity-80" /> {/* Label */}
              <Skeleton height={12} width={200} /> {/* Value */}
            </SkeletonTheme>
            </div>
          {/* Company Name */}
          <div>
            <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
              <Skeleton height={10} width={100} className="mb-1 opacity-80" /> {/* Label */}
              <Skeleton height={12} width={180} /> {/* Value */}
            </SkeletonTheme>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex gap-4 mt-12">
          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
            <Skeleton height={40} width={120} /> {/* Delete Button */}
            <Skeleton height={40} width={150} /> {/* Block/Unblock Button */}
          </SkeletonTheme>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-white py-6 w-full  flex items-center justify-center">
        <p>Failed to load user details. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="text-white w-full ">
      <div className="mb-6">
        <h2 className="text-white text-xl font-medium">
          {userDetails.firstName || "N/A"} {userDetails.lastName || ""}
        </h2>
        <p className="opacity-50">{userDetails.email || "N/A"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <p className="opacity-80 text-sm text-slate-400 mb-1">First Name</p>
          <p className="text-white">{userDetails.firstName || "N/A"}</p>
        </div>

        <div>
          <p className="opacity-80 text-sm text-slate-400 mb-1">Last Name</p>
          <p className="text-white">{userDetails.lastName || "N/A"}</p>
        </div>

        <div>
          <p className="opacity-80 text-sm text-slate-400 mb-1">Email Address</p>
          <p className="text-white">{userDetails.email || "N/A"}</p>
        </div>

        <div>
          <p className="opacity-80 text-sm text-slate-400 mb-1">Company Name</p>
          <p className="text-white">{userDetails.companyName || "N/A"}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-12">
        <Button
          variant="destructive"
          className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          Delete Account
        </Button>

        <Button
          variant="destructive"
          className="bg-[#1A3F70] hover:bg-[#1A3F70] hover:cursor-pointer"
          onClick={() => setIsDeactivateOpen(true)}
        >
          {userDetails.isBlocked === true ? "Unblock" : "Block"} Account
        </Button>
      </div>

      {/* Delete Dialog Box */}
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
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? (
                <span className="flex items-center">
                  <Loader2 size={24} className="animate-spin text-white" />
                </span>
              ) : (
                "Yes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Dialog Box */}
      <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-semibold text-center">
              {userDetails.isBlocked === true ? "Unblock" : "Blocked"} Account
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-400 text-center">
              Are you sure you want to {userDetails.isBlocked === true ? "unblock" : "block"} this
              account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
              onClick={() => setIsDeactivateOpen(false)}
            >
              No
            </Button>
            <Button
              variant="destructive"
              className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11 flex items-center justify-center"
              onClick={handleDeactivate}
              disabled={isDeactivateLoading}
            >
              {isDeactivateLoading ? (
                <span className="flex items-center">
                  <Loader2 size={24} className="animate-spin text-white" />
                </span>
              ) : (
                "Yes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;