"use client";
import React, { useState } from "react"; // Added useState
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoAuth from "../components/LogoAuth";
import BannerImage from "../components/BannerImage";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useRouter } from "next/navigation"; // Added for programmatic navigation
import { toast } from "sonner"; // Optional: for user feedback
import { sendOtpService, verifySignupOtpService } from "@/services/admin-services";

export default function Home() {
 interface FormElements extends HTMLFormControlsCollection {
  otp: HTMLInputElement; // Adjusted for OTP input
 }
 const [isPending, startTransition] = React.useTransition();

 interface SignInFormElement extends HTMLFormElement {
  readonly elements: FormElements;
 }

 const [otpValue, setOtpValue] = useState("");
 const router = useRouter();

 const handleSubmit = (e: React.FormEvent<SignInFormElement>) => {
  e.preventDefault();

  if (!otpValue || otpValue.length < 4) {
   toast.error("Please enter a valid OTP.", {
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
  startTransition(async () => {
   try {
    const response = await verifySignupOtpService({ otp: otpValue });

    if (response.data.success) {
     toast.success(response.data.message, {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
    //  router.push(`/new-password?otp=${encodeURIComponent(otpValue)}`);
     router.push(`/company/dashboard`);
    } else {
     toast.error(response.data.message || "Invalid OTP.", {
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
    if ((error as any)?.response?.data?.message) {
     toast.error((error as any)?.response?.data?.message, {
             duration: Infinity,
             position: "top-center",
             action: {
               label: "OK",
               onClick: (toastId : any) => toast.dismiss(toastId),
             },
             closeButton: false,
           });
    } else {
     toast.error("An unexpected error occurred.", {
             duration: Infinity,
             position: "top-center",
             action: {
               label: "OK",
               onClick: (toastId : any) => toast.dismiss(toastId),
             },
             closeButton: false,
           });
    }
   }
  });
 };
 return (
  <div className="grid grid-cols-12 h-screen">
   <div className="col-span-12 md:col-span-5 w-full space-y-1 flex justify-center items-center flex-col p-4 md:p-8">
    <LogoAuth />
    <div className="flex justify-center items-center max-w-[400px] w-full">
     <Card className="w-full max-w-md bg-navy-950 gap-8 text-white border-none shadow-none md:pt-20">
      <CardHeader className="p-0">
       <CardTitle className="justify-start text-white text-[30px] md:text-[36px]">Enter OTP</CardTitle>
       <p className="text-[#959595] text-base md:text-lg font-normal">Enter the OTP received in your email.</p>
      </CardHeader>
      <CardContent className="p-0">
       <form onSubmit={handleSubmit}>
        <div className="space-y-6">
         <InputOTP
          maxLength={4}
          value={otpValue} // Bind OTP value to state
          onChange={(value) => setOtpValue(value)} // Update state on change
          className="border-none justify-between flex !gap-10"
         >
          {[...Array(4)].map((_, index) => (
           <div key={index} className="w-12 h-12 flex items-center justify-center border border-[#ffffff] rounded-full bg-transparent text-white text-lg">
            <InputOTPSlot index={index} className="w-full h-full text-center bg-transparent border-none rounded-full !text-lg !ring-0" />
           </div>
          ))}
         </InputOTP>
         <Button type="submit" className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w 전에w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]">
          {isPending ? "Signing in..." : "Sign Up"}
         </Button>
        </div>
       </form>
      </CardContent>
     </Card>
    </div>
   </div>
   <div className="col-span-12 md:col-span-7 w-full space-y-1 rounded-3xl">
    <BannerImage />
   </div>
  </div>
 );
}
