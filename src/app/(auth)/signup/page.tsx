"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/actions";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoAuth from "../components/LogoAuth";
import BannerImage from "../components/BannerImage";

export default function SignupPage() {
 const [email, setEmail] = useState("");
 const [companyName, setCompanyName] = useState("");
 const [password, setPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [isPending, startTransition] = React.useTransition();
 const [errorMessage, setErrorMessage] = useState("");
 const { data: session } = useSession();
 const router = useRouter();


 useEffect(() => {
  if (session) {
   router.push("/admin/dashboard");
  }
 }, [router, session]);

 const togglePasswordVisibility = useCallback(() => {
  setShowPassword((prev) => !prev);
 }, []);

 const toggleConfirmPasswordVisibility = useCallback(() => {
  setShowConfirmPassword((prev) => !prev);
 }, []);

 const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
        console.log('handleSubmit: ', handleSubmit);
  event.preventDefault();

  // Console log all user details
  const userDetails = {
  email,
  companyName,
  password,
  };
  console.log("User Signup Details:", userDetails);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
   toast.error("Please enter a valid email.");
   return;
  }
  if (password !== confirmPassword) {
   toast.error("Passwords do not match.");
   return;
  }
  if ( !password ) {
   toast.error("Please fill in all required fields.");
   return;
  }

  startTransition(async () => {
   try {
    const response: any = await signupAction({
    email,
    companyName,
    password,
    });
    console.log('response: ', response);

    if (response?.success) {
     toast.success(response.message);
     router.push("/request-pending");
     
     
    } else {
     toast.error(response?.message || "Signup failed. Please try again.");
    }
   } catch (error) {
    console.error("Signup action error:", error);
    toast.error("Something went wrong! Please try again.");
   }
  });
 };

 return (
  <div className="grid grid-cols-12 h-screen">
   <div className="col-span-12 md:col-span-5 flex justify-center items-center flex-col p-4 md:p-8">
    <LogoAuth />
    <div className="max-w-[400px] w-full">
     <Card className="w-full max-w-md bg-navy-950 text-white border-none shadow-none md:pt-20">
      <CardHeader className="p-0">
       <CardTitle className="text-white text-[30px] md:text-[36px]">Sign Up</CardTitle>
       <p className="text-[#959595] text-base md:text-lg font-normal">Please sign up for an account to access and use the dashboard.</p>
      </CardHeader>
      <CardContent className="p-0">
       <form onSubmit={handleSubmit}>
        <div className="space-y-6">

 

  <Input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[50px]" required />

  <Input id="companyName" type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[50px]" />

       

  <div className="relative">
          <Input
           id="password"
           placeholder="Password"
           type={showPassword ? "text" : "password"}
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           className="text-[#9a9a9a] bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[50px]"
           required
          />
          <button type="button" className="text-[#9a9a9a] absolute right-4 top-5 hover:cursor-pointer" onClick={togglePasswordVisibility} aria-label="Toggle password visibility">
           {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
  </div>

  <div className="relative">
          <Input
           id="confirmPassword"
           type={showConfirmPassword ? "text" : "password"}
           placeholder="Confirm Password"
           value={confirmPassword}
           onChange={(e) => setConfirmPassword(e.target.value)}
           className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[50px]"
           required
          />
          <button type="button" className="text-[#9a9a9a] absolute right-4 top-5 hover:cursor-pointer" onClick={toggleConfirmPasswordVisibility} aria-label="Toggle confirm password visibility">
           {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
         </div>

         {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}

         

         <Button type="submit" className="cursor-pointer px-3 py-1.5 bg-[#1a3f70] h-[50px] rounded-lg text-white text-lg font w-full leading-[30px] hover:bg-[#1a3f70]" disabled={isPending}>
          {isPending ? "Signing up..." : "Send Request"}
         </Button>
         <div className="flex items-center justify-center">
          <Link href="/" className="text-[#9a9a9a] text-base font-medium">
           Already have an account?
           <span className="hover:underline"> Sign In</span>
          </Link>
         </div>
        </div>
       </form>
      </CardContent>
     </Card>
    </div>
   </div>

   <div className="col-span-12 md:col-span-7">
    <BannerImage />
   </div>
  </div>
 );
}


