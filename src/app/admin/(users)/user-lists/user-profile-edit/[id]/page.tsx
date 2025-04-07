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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSingleUser, updateUser, deleteUser, toggleBlockUser } from "@/services/admin-services";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { ChevronLeft, Loader2 } from "lucide-react"; // Import Loader2 for loading states

// Define the BlockCompanyPayload type
interface BlockCompanyPayload {
  isBlocked: boolean;
}

// Define the UserData type for form data
interface UserData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  dob: string;
  companyName: string;
  totalMeditationListen?: number;
  isBlocked?: boolean; // Added isBlocked field
}

// Skeleton Components
const SkeletonHeader = () => (
  <div className="space-y-2">
    <div className="h-6 w-48 bg-gray-600 rounded animate-pulse"></div>
    <div className="h-4 w-64 bg-gray-600 rounded animate-pulse"></div>
  </div>
);

const SkeletonField = () => (
  <div className="space-y-2">
    <div className="h-4 w-32 bg-gray-600 rounded animate-pulse"></div>
    <div className="h-12 w-full bg-gray-600 rounded animate-pulse"></div>
  </div>
);

const SkeletonButton = () => (
  <div className="h-11 w-48 bg-gray-600 rounded animate-pulse"></div>
);

// Fetcher function to get single user details by ID
const fetcher = (url: string) => getSingleUser(url);

const Page = () => {
  const { id } = useParams();

  const { data, error, isLoading } = useSWR(`/admin/user/${id}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });
  console.log("data:", data);

  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    dob: "",
    companyName: "",
    totalMeditationListen: 0,
    isBlocked: false, // Initialize isBlocked
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<boolean>(false); // Loading state for Delete
  const [togglingBlock, setTogglingBlock] = useState<boolean>(false); // Loading state for Block/Unblock
  const [saving, setSaving] = useState<boolean>(false); // Loading state for Save

  useEffect(() => {
    if (data?.data?.data) {
      setFormData({
        ...data.data.data,
        dob: data.data.data.dob.split("T")[0],
        isBlocked: data.data.data.isBlocked || false, // Set isBlocked from API response
      });
    }
  }, [data]);

  const handleChange = (field: keyof UserData, value: string) => {
    // Prevent updating totalMeditationListen
    if (field === "totalMeditationListen") return;
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleToggleBlock = async () => {
    setTogglingBlock(true); // Start loading for block toggle
    try {
      const newBlockedState = !formData.isBlocked; // Toggle the current state
      const payload: BlockCompanyPayload = { isBlocked: newBlockedState };
      const response = await toggleBlockUser(`/admin/user/${id}/block`, payload);
      if (response.data.success) {
        toast.success(`User ${newBlockedState ? "blocked" : "unblocked"} successfully!`);
        setFormData((prevState) => ({
          ...prevState,
          isBlocked: newBlockedState, // Update local state
        }));
        setTimeout(() => {
          window.location.href = "/admin/user-lists"; // Redirect after success
        }, 1000);
      } else {
        throw new Error(response.data.message || `Failed to ${newBlockedState ? "block" : "unblock"} user`);
      }
    } catch (err) {
      console.error(`Error ${formData.isBlocked ? "unblocking" : "blocking"} user:`, err);
      toast.error(err instanceof Error ? err.message : `Failed to ${formData.isBlocked ? "unblock" : "block"} user`);
    } finally {
      setTogglingBlock(false); // Stop loading for block toggle
    }
  };

  const handleSave = async () => {
    setSaving(true); // Start loading for save
    try {
      // Remove totalMeditationListen from the payload to prevent updating it
      const { totalMeditationListen, ...updateData } = formData;
      await updateUser(`/admin/user/update/${id}`, updateData);
      console.log("User updated successfully:", updateData);
      mutate("/admin/get-all-users");
      toast.success("User updated successfully!");
      setTimeout(() => {
        window.location.href = "/admin/user-lists";
      }, 1000);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    } finally {
      setSaving(false); // Stop loading for save
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true); // Start loading for delete
    try {
      await deleteUser(`/admin/user/delete-user/${id}`);
      console.log("User deleted successfully");
      setIsDialogOpen(false);
      mutate("/admin/get-all-users");
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

  const fields = [
    { label: "First Name", field: "firstName" },
    { label: "Last Name", field: "lastName" },
    { label: "Gender", field: "gender" },
    { label: "Email Address", field: "email" },
    { label: "Birthday", field: "dob" },
    { label: "Company Name", field: "companyName" },
    { label: "Total Meditation Listened To", field: "totalMeditationListen" },
  ];

  if (error) return <div className="text-white">Error loading user data: {error.message}</div>;

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        {isLoading ? (
          <>
            <SkeletonHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(7)
                .fill(0)
                .map((_, index) => (
                  <SkeletonField key={index} />
                ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-12">
              <SkeletonButton />
              <SkeletonButton />
            </div>
          </>
        ) : (
          <>
            <div>
              <div className="flex items-center gap-2">
              <Button
            variant="destructive"
            className="bg-[#0B132B] hover:bg-[#0B132B] p-0 h-7 w-7 hover:cursor-pointer"
            onClick={() => (window.location.href = "/admin/user-lists")}
          >
            <ChevronLeft  />
          </Button>
              <h2 className="text-white text-xl font-medium">
                {formData.firstName} {formData.lastName}
              </h2>
              </div>
              <p className="opacity-80">{formData.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(({ label, field }) => (
                <div className="space-y-2" key={field}>
                  <Label htmlFor={field} className="text-white opacity-80 text-base font-normal">
                    {label}
                  </Label>
                  <Input
                    id={field}
                    type={field === "dob" ? "date" : "text"}
                    value={String(formData[field as keyof UserData] || "")}
                    onChange={(e) => handleChange(field as keyof UserData, e.target.value)}
                    className="bg-[#0f172a] h-12 border-none text-white"
                    disabled={field === "totalMeditationListen"} // Disable totalMeditationListen field
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-12">
              <Button
                variant="destructive"
                className="bg-[#FF4747] w-48 h-11 hover:bg-[#FF4747] hover:cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                Delete Account
              </Button>
              <Button
                variant="default"
                className="bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] hover:cursor-pointer flex items-center justify-center"
                onClick={handleToggleBlock}
                disabled={togglingBlock}
              >
                {togglingBlock ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : formData.isBlocked ? "Unblock" : "Block"}
              </Button>
              <Button
                variant="default"
                className="bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] hover:cursor-pointer flex items-center justify-center"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 size={20} className="animate-spin text-white" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
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
    </div>
  );
};

export default Page;