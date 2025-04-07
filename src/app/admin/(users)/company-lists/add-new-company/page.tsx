"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react"; // Added useState
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";// Adjust the import path
import { toast } from "sonner";
import { addNewCompanyStats } from "@/services/admin-services";
import { ChevronLeft } from "lucide-react";

// Validation Schema
const schema = yup.object({
  company: yup.string().required("Company name is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface FormData {
  company: string;
  email: string;
  password: string;
}

const Page = () => {
  const [backendError, setBackendError] = useState<string | null>(null); // State for backend errors

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      company: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setBackendError(null); // Clear previous backend errors before submitting

      const payload = {
        companyName: data.company, // Adjust field names based on your backend requirements
        email: data.email,
        password: data.password,
      };

      const response = await addNewCompanyStats("/admin/create-company", payload);

      if (response?.status === 201 || response?.status === 200) {
        toast.success("Company added successfully");
        reset(); // Reset the form after successful submission
        window.location.href = "/admin/company-lists";
      } else {
        const errorMessage = response?.data?.message || "Failed to add company";
        setBackendError(errorMessage); // Set backend error
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error adding company:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred while adding the company";
      setBackendError(errorMessage); // Set backend error from catch block
      toast.error(errorMessage);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
       <div className="flex items-center gap-2 mb-4"> 
       <Button
            variant="destructive"
            className="bg-[#0B132B] hover:bg-[#0B132B] p-0 h-7 w-7 hover:cursor-pointer"
            onClick={() => (window.location.href = "/admin/company-lists")}
          >
            <ChevronLeft  />
          </Button>
        <h2 className="text-white text-[20px] md:text-2xl font-bold ">
          Add New Company
        </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-white dm-sans text-base font-normal">
                Company Name
              </Label>
              <Input
                id="company"
                type="text"
                {...register("company")}
                className="bg-[#0f172a] h-12 border-none text-white"
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
                Email Address
              </Label>
              <Input
                id="email"
                type="text"
                {...register("email")}
                className="bg-[#0f172a] h-12 border-none text-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white dm-sans text-base font-normal">
                Login Password
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                className="bg-[#0f172a] h-12 border-none text-white"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Display backend error */}
          {backendError && (
            <p className="text-red-500 text-sm mt-4">{backendError}</p>
          )}

          <div>
            <Button
              type="submit"
              className="mt-6 bg-[#1A3F70] w-64 h-11 hover:bg-[#1A3F70] dm-sans text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;