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
import { ChevronLeft, Loader2 } from "lucide-react";

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
  dob: string | null; // Allow dob to be null, but not editable
  companyName: string;
  totalMeditationListen?: number;
  isBlocked?: boolean;
}

// Define validation errors interface
interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  companyName?: string;
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
    isBlocked: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [togglingBlock, setTogglingBlock] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (data?.data?.data) {
      setFormData({
        ...data.data.data,
        dob: data.data.data.dob ? data.data.data.dob.split("T")[0] : "",
        isBlocked: data.data.data.isBlocked || false,
      });
    }
  }, [data]);

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate First Name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = "First name must not exceed 50 characters";
      isValid = false;
    }

    // Validate Last Name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = "Last name must not exceed 50 characters";
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Validate Company Name
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
      isValid = false;
    } else if (formData.companyName.length > 100) {
      newErrors.companyName = "Company name must not exceed 100 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof UserData, value: string) => {
    if (field === "totalMeditationListen") return;
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    // Clear error for the field being edited
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: undefined,
    }));
  };

  const handleToggleBlock = async () => {
    setTogglingBlock(true);
    try {
      const newBlockedState = !formData.isBlocked;
      const payload: BlockCompanyPayload = { isBlocked: newBlockedState };
      const response = await toggleBlockUser(`/admin/user/${id}/block`, payload);
      if (response.data.success) {
        toast.success(`User ${newBlockedState ? "blocked" : "unblocked"} successfully!`, {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        setFormData((prevState) => ({
          ...prevState,
          isBlocked: newBlockedState,
        }));
        setTimeout(() => {
          window.location.href = "/admin/user-lists";
        }, 1000);
      } else {
        throw new Error(response.data.message || `Failed to ${newBlockedState ? "block" : "unblock"} user`);
      }
    } catch (err) {
      console.error(`Error ${formData.isBlocked ? "unblocking" : "blocking"} user:`, err);
      toast.error(err instanceof Error ? err.message : `Failed to ${formData.isBlocked ? "unblock" : "block"} user`, {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setTogglingBlock(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving.", {
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
    setSaving(true);
    try {
      const { totalMeditationListen, dob, gender, ...updateData } = formData; // Exclude dob and gender from update
      await updateUser(`/admin/user/update/${id}`, updateData);
      console.log("User updated successfully:", updateData);
      mutate("/admin/get-all-users");
      toast.success("User updated successfully!", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
      setTimeout(() => {
        window.location.href = "/admin/user-lists";
      }, 1000);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteUser(`/admin/user/delete-user/${id}`);
      console.log("User deleted successfully");
      setIsDialogOpen(false);
      mutate("/admin/get-all-users");
      toast.success("User deleted successfully!", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
      setTimeout(() => {
        window.location.href = "/admin/user-lists";
      }, 1000);
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setDeleting(false);
    }
  };

  const fields = [
    { label: "First Name", field: "firstName" },
    { label: "Last Name", field: "lastName" },
    { label: "Email Address", field: "email" },
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
              {Array(5) // Adjusted to 5 fields instead of 7
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
                  <ChevronLeft />
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
                    type={field === "dob" ? "date" : "text"} // Removed type from fields array, handled inline
                    value={String(formData[field as keyof UserData] || "")}
                    onChange={(e) => handleChange(field as keyof UserData, e.target.value)}
                    className="bg-[#0f172a] h-12 border-none text-white"
                    disabled={field === "totalMeditationListen"}
                    aria-invalid={errors[field as keyof ValidationErrors] ? "true" : "false"}
                  />
                  {errors[field as keyof ValidationErrors] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field as keyof ValidationErrors]}</p>
                  )}
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
                {saving ? <Loader2 size={20} className="animate-spin text-white" /> : "Save"}
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
                {deleting ? <Loader2 size={20} className="animate-spin text-white" /> : "Yes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Page;