"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserAccount } from "@/services/company-services";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  // State to manage form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    companyName: "",  
    // birthday: "",
    password: "",
  });

  // Set companyName from session when available
  useEffect(() => {
    if (session?.user?.fullName) {
      setFormData((prevData) => ({
        ...prevData,
        companyName: session.user.fullName,  // Set from session data
      }));
    }
  }, [session]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "gender",
      "companyName",
      // "birthday",
      "password"
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
      formData.email.trim() !== "" &&
      formData.gender.trim() !== "" &&
      formData.companyName.trim() !== "" &&
      // formData.birthday.trim() !== "" &&
      formData.password.trim() !== ""
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

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender,
        companyName: formData.companyName,  
        // dob: formData.birthday,
        password: formData.password,
      };
      const response = await createUserAccount("/company/users", payload);
      console.log('response: ', response);
      if (response?.data?.success) {
        toast.success(response.data.message);
        router.push("/company/users");
      }
    } catch (err: any) {
      toast.error(err.response.data.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="bg-[#1B2236] rounded-[20px]">
        <div className="space-y-6 py-[30px] px-[36px]">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
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
              <Label htmlFor="gender" className="text-white dm-sans text-base font-normal">
                Gender
              </Label>
              <Input
                id="gender"
                type="text"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="bg-[#0f172a] h-12 border-none text-white"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                value={formData.companyName}  // This will be the value set from the session
                onChange={() => { }}
                className="bg-[#0f172a] h-12 border-none text-white"
                disabled={true}  // Make this field disabled to prevent editing
                required
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* <div className="space-y-2">
              <Label htmlFor="birthday" className="text-white dm-sans text-base font-normal">
                Birthday
              </Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => handleChange("birthday", e.target.value)}
                className="bg-[#0f172a] h-12 border-none text-white"
                disabled={isLoading}
                required
              />
            </div> */}
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
            </div>
            <div className="space-y-2  ">
              <Label htmlFor="password" className="text-white dm-sans text-base font-normal">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="bg-[#0f172a] h-12 border-none text-white w-full"
                disabled={isLoading}
                required
              />
            </div>

          </div>



          <div>
            <Button
              className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white"
              onClick={handleSave}
              disabled={isLoading || !isFormComplete()}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
