"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserAccount } from "@/services/company-services";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

// Function to generate a random password
const generateRandomPassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const Page = () => {
  const { data: session } = useSession();
  console.log('session:', session);
  const router = useRouter();

  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // gender: "",
    // companyName: "",
    // birthday: "",
    // password: "",
  });

  // State to manage companyName and loading/error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    // Clear error specifically when email is cleared
    if (field === "email" && value.trim() === "") {
      setError(null);
    }
  };

  useEffect(() => {
    if (session?.user?.fullName) {
      setCompanyName(session.user.fullName);
    }
  }, [session]);

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      // "gender",
      // "companyName",
      // "birthday",
      // "password"
    ];
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        return `Please fill in the ${field} field.`;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const isFormComplete = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== ""
    );
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    const randomPassword = generateRandomPassword();
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        // gender: formData.gender,
        companyName: companyName,
        // dob: formData.birthday,
        password: randomPassword,
      };
      const response = await createUserAccount("/company/users", payload);
      console.log('response: ', response);
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
    } catch (err: any) {
      toast.error(err.response.data.message || "Failed to create user", {
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

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="bg-[#1B2236] rounded-[20px]">
        <div className="space-y-6 py-[30px] px-[36px]">
          
          {success && (
            <div className="text-green-500 text-sm">{success}</div>
          )}

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
                className="bg-[#0f172a] h-12 border-none text-white"
                disabled={isLoading}
                required
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
                className="bg-[#0f172a] h-12 border-none text-white"
                disabled={isLoading}
                required
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
                className="bg-[#0f172a] h-12 border-none text-white"
                disabled={isLoading}
                required
              />
              {error && formData.email.trim() !== "" && ( // Show error only if email is not empty
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </div>
          </div>

          <div>
            <Button
              className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white hover:cursor-pointer relative"
              onClick={handleSave}
              disabled={isLoading || !isFormComplete()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;