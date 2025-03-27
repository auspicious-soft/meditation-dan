// "use client";
// import React, { Suspense, useEffect, useState, useTransition } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { EyeOffIcon, EyeIcon } from "lucide-react";
// import BannerImage from "../components/BannerImage";
// import LogoAuth from "../components/LogoAuth";
// // "use client";
// import ChangePasswordImage from "@/assets/images/LoginImage.png";
// import Logo from "@/assets/images/appLogo.png";
// import Image from "next/image";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { loginAction } from "@/actions";
// // import InputField from "../components/InputField";
// // import LoginImage from "../components/LoginImage";
// import { resetUserPassword } from "@/services/admin-services";

// export default function Home() {
//  const [showOldPassword, setShowOldPassword] = React.useState(false);
//  const [showNewPassword, setShowNewPassword] = React.useState(false);
//  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

//  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//  //   e.preventDefault();
//  //   console.log("Form submitted");
//  // };

//  // new
//  const [formData, setFormData] = useState({
//   newPassword: "",
//   confirmPassword: "",
//  });

//  // export default function ChangePasswordPage() {
//  //  const [formData, setFormData] = useState({
//  //   newPassword: "",
//  //   confirmPassword: "",
//  //  });

//  const handleChange = (e: any) => {
//   setFormData({ ...formData, [e.target.name]: e.target.value });
//  };

//  const router = useRouter();
//  const searchParams = useSearchParams();
//  const [isPending, startTransition] = useTransition();

//  useEffect(() => {
//   const otp = searchParams.get("otp");
//   if (!otp) {
//    router.push("/forgot-password");
//    //  toast.error("Please complete the forgot password process first");
//   }
//  }, [router, searchParams]);

//  const handleSubmit = async (event: React.FormEvent) => {
//   event.preventDefault();
//   const form = event.target as HTMLFormElement;
//   const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value;
//   const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
//   const otp = searchParams.get("otp");

//   if (newPassword === confirmPassword) {
//    startTransition(async () => {
//     try {
//      const response = await resetUserPassword({ password: newPassword as string, otp: otp as string });
//      if (response.status === 200) {
//       toast.success("Password Updated successfully");
//       router.push("/");
//      } else {
//       toast.error("Something went wrong");
//      }
//     } catch (error: any) {
//      if (error.status === 404) {
//       toast.error("Invalid OTP");
//      } else {
//       toast.error("new-password-otp-verified");
//      }
//     }
//    });
//   } else {
//    toast.warning("Password must match");
//   }
//  };

//  return (
//   <div className="grid grid-cols-12 h-screen">
//    <div className="col-span-12 md:col-span-5 w-full space-y-1 flex justify-center items-center flex-col p-4 md:p-8">
//     <LogoAuth />
//     <div className="flex justify-center items-center max-w-[400px] w-full">
//      <Card className="w-full max-w-md bg-navy-950 gap-8 text-white border-none shadow-none md:pt-20">
//       <CardHeader className="p-0">
//        <CardTitle className="justify-start text-white text-[30px] md:text-[36px]">Create New Password</CardTitle>
//        <p className="text-[#959595] text-base md:text-lg font-normal">Create a new password of at least 8 characters long.</p>
//       </CardHeader>
//       <CardContent className="p-0">
//        <form onSubmit={handleSubmit}>
//         <div className="space-y-6">
//          {/* Old Password */}
//          <div className="relative">
//           <Input id="old-password" placeholder="Old Password" type={showOldPassword ? "text" : "password"} className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]" required />
//           <button type="button" className="absolute right-4 top-5 text-gray-400 cursor-pointer" onClick={() => setShowOldPassword(!showOldPassword)}>
//            {showOldPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
//           </button>
//          </div>

//          {/* New Password */}
//          <div className="relative">
//           <Input id="new-password" placeholder="New Password" type={showNewPassword ? "text" : "password"} className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]" required />
//           <button type="button" className="absolute right-4 top-5 text-gray-400 cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
//            {showNewPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
//           </button>
//          </div>

//          {/* Re-enter New Password */}
//          <div className="relative">
//           <Input id="confirm-password" placeholder="Re-enter New Password" type={showConfirmPassword ? "text" : "password"} className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]" required />
//           <button type="button" className="absolute right-4 top-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//            {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
//           </button>
//          </div>

//          <Button type="submit" className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]">
//           Update Password
//          </Button>
//         </div>
//        </form>
//       </CardContent>
//      </Card>
//     </div>
//    </div>
//    <div className="col-span-12 md:col-span-7 w-full space-y-1 rounded-3xl ">
//     <BannerImage />
//    </div>
//   </div>
//  );
// }

"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import BannerImage from "../components/BannerImage";
import LogoAuth from "../components/LogoAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function NewPasswordPage() {
 const [showNewPassword, setShowNewPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const [newPassword, setNewPassword] = useState("");
 const [confirmPassword, setConfirmPassword] = useState("");
 const router = useRouter();
 const searchParams = useSearchParams();
 const [isPending, startTransition] = useTransition();

 useEffect(() => {
  const otp = searchParams.get("otp");
  if (!otp) {
   toast.error("Please enter an OTP first.");
   router.push("/forgot-password");
  }
 }, [router, searchParams]);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const otp = searchParams.get("otp");

  if (!otp) {
   toast.error("OTP is missing.");
   return;
  }

  if (newPassword !== confirmPassword) {
   toast.warning("Passwords must match.");
   return;
  }

  if (newPassword.length < 8) {
   toast.warning("Password must be at least 8 characters long.");
   return;
  }

  startTransition(async () => {
   try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}https://api.inscape.life/api/otp-new-password-verification`, {
     method: "PATCH",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify({ otp, password: newPassword }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
     toast.success("Password updated successfully!");
     router.push("/admin/dashboard");
    } else {
     toast.error(data.message || "Invalid OTP or failed to update password.");
    }
   } catch (error) {
    console.error("Error updating password:", error);
    toast.error("Something went wrong. Please try again.");
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
       <CardTitle className="justify-start text-white text-[30px] md:text-[36px]">Create New Password</CardTitle>
       <p className="text-[#959595] text-base md:text-lg font-normal">Create a new password of at least 8 characters long.</p>
      </CardHeader>
      <CardContent className="p-0">
       <form onSubmit={handleSubmit}>
        <div className="space-y-6">
         {/* New Password */}
         <div className="relative">
          <Input
           id="new-password"
           placeholder="New Password"
           type={showNewPassword ? "text" : "password"}
           value={newPassword}
           onChange={(e) => setNewPassword(e.target.value)}
           className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
           required
          />
          <button type="button" className="absolute right-4 top-5 text-gray-400 cursor-pointer" onClick={() => setShowNewPassword(!showNewPassword)}>
           {showNewPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
         </div>

         {/* Confirm Password */}
         <div className="relative">
          <Input
           id="confirm-password"
           placeholder="Re-enter New Password"
           type={showConfirmPassword ? "text" : "password"}
           value={confirmPassword}
           onChange={(e) => setConfirmPassword(e.target.value)}
           className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
           required
          />
          <button type="button" className="absolute right-4 top-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
           {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
          </button>
         </div>

         <Button type="submit" disabled={isPending} className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]">
          {isPending ? "Updating..." : "Update Password"}
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
