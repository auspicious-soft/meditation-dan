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
import { getSingleUser, deleteUser, toggleBlockUser } from "@/services/admin-services"; // Added toggleBlockUser import
import { useParams } from "next/navigation";
import React, { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner"; // Added toast import for feedback
import { ChevronLeft, Loader2 } from "lucide-react"; // Import Loader2 for loading states

// Skeleton Component for individual field
const SkeletonField = () => (
  <div>
    <div className="h-3 w-20 bg-gray-600 rounded mb-1 animate-pulse"></div>
    <div className="h-4 w-32 bg-gray-600 rounded animate-pulse"></div>
  </div>
);

// Skeleton Component for header
const SkeletonHeader = () => (
  <div className="mb-6">
    <div className="h-6 w-48 bg-gray-600 rounded mb-2 animate-pulse"></div>
    <div className="h-4 w-64 bg-gray-600 rounded animate-pulse"></div>
  </div>
);

const fetcher = async (url: string) => {
  console.log("Fetching URL:", url);
  const response = await getSingleUser(url);
  return response.data;
};

const Page = () => {
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [unblocking, setUnblocking] = useState<boolean>(false); // Loading state for Unblock
  const [deleting, setDeleting] = useState<boolean>(false); // Loading state for Delete

  const { data: apiResponse, error, isLoading, mutate } = useSWR(
    id ? `/admin/user/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );
  const userData = apiResponse?.data;

  const handleUnblock = async () => {
    setUnblocking(true); // Start loading for unblock
    try {
      const payload: { isBlocked: boolean } = { isBlocked: false };
      const response = await toggleBlockUser(`/admin/user/${id}/block`, payload);
      if (response.data.success) {
        toast.success("User unblocked successfully!");
        mutate(); // Refresh user data after unblocking
        setTimeout(() => {
          window.location.href = "/admin/blocked-users";
        }, 1000);
      } else {
        throw new Error(response.data.message || "Failed to unblock user");
      }
    } catch (err) {
      console.error("Error unblocking user:", err);
      toast.error(err instanceof Error ? err.message : "Failed to unblock user");
    } finally {
      setUnblocking(false); // Stop loading for unblock
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true); // Start loading for delete
    try {
      await deleteUser(`/admin/user/delete-user/${id}`);
      console.log("User deleted successfully");
      setIsDialogOpen(false);
      mutate("/admin/get-all-users"); // Refresh the user list
      toast.success("User deleted successfully!");
      setTimeout(() => {
        window.location.href = "/admin/user-lists";
      }, 1000);
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false); // Stop loading for delete
    }
  };

  if (error) return <div className="text-white">Error loading user data</div>;
  if (!id) return <div className="text-white">No user ID provided</div>;

  return (
    <div className="text-white py-6 w-full h-screen">
      {isLoading ? (
        <>
          <SkeletonHeader />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <SkeletonField key={index} />
              ))}
          </div>
          <div className="flex gap-4 mt-12">
            <div className="h-10 w-32 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-600 rounded animate-pulse"></div>
          </div>
        </>
      ) : !userData ? (
        <div className="text-white">No user data found</div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-4 ">
            <Button
            variant="destructive"
            className="bg-[#303850] hover:bg-[#47557c] p-0 h-7 w-7 hover:cursor-pointer"
            onClick={() => (window.location.href = "/admin/blocked-users")}
          >
            <ChevronLeft  />
          </Button>
            <h2 className="text-white text-xl font-medium">
              {userData.firstName} {userData.lastName}
            </h2>
            </div>
            <p className="opacity-80">{userData.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div>
              <p className="text-sm text-slate-400 mb-1">First Name</p>
              <p className="text-white">{userData?.firstName || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Last Name</p>
              <p className="text-white">{userData?.lastName || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Email Address</p>
              <p className="text-white">{userData?.email || "N/A"}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">Company Name</p>
              <p className="text-white">{userData?.companyName || "N/A"}</p>
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
              variant="default"
              className="bg-[#1A3F70] hover:bg-[#1A3F70] hover:cursor-pointer flex items-center justify-center"
              onClick={handleUnblock}
              disabled={unblocking}
            >
              {unblocking ? (
                <Loader2 size={20} className="animate-spin text-white" />
              ) : (
                "Unblock"
              )}
            </Button>
          </div>
        </>
      )}

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
  );
};

export default Page;