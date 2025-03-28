// "use client";
// import React from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import LogoAuth from "../components/LogoAuth";
// import BannerImage from "../components/BannerImage";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";

// export default function Home() {
//   interface FormElements extends HTMLFormControlsCollection {
//     email: HTMLInputElement;
//     password: HTMLInputElement;
//   }

//   interface SignInFormElement extends HTMLFormElement {
//     readonly elements: FormElements;
//   }

//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<SignInFormElement>) => {
//     e.preventDefault();
//     const email = e.currentTarget.elements.email.value;

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forgot-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();
//       console.log('data: ', data);

//       if (response.ok && data.success) {
//         toast.success(data.message);

//         router.push("/reset-password");
//       } else {
//         toast.error(data.message || "Failed to send reset email.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="grid grid-cols-12 h-screen">
//       <div className="col-span-12 md:col-span-5 w-full space-y-1 flex justify-center items-center flex-col p-4 md:p-8">
//         <LogoAuth />
//         <div className="flex justify-center items-center max-w-[400px] w-full">
//           <Card className="w-full max-w-md bg-navy-950 gap-8 text-white border-none shadow-none md:pt-20">
//             <CardHeader className="p-0">
//               <CardTitle className="justify-start text-white text-[30px] md:text-[36px]">Forgot Password</CardTitle>
//               <p className="text-[#959595] text-base md:text-lg font-normal">Enter the email address associated with your account.</p>
//             </CardHeader>
//             <CardContent className="p-0">
//               <form onSubmit={handleSubmit}>
//                 <div className="space-y-6">
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Email Address"
//                     className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]"
//                     required
//                   />
//                   <Button
//                     type="submit"
//                     className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]"
//                   >
//                     Continue
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//       <div className="col-span-12 md:col-span-7 w-full space-y-1 rounded-3xl">
//         <BannerImage />
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoAuth from "../components/LogoAuth";
import BannerImage from "../components/BannerImage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from '@/components/ui/spinner';
export default function Home() {
  interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }

  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent<SignInFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;
    setLoading(true); // Set loading to true when request starts

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('data: ', data);

      if (response.ok && data.success) {
        toast.success(data.message);
        router.push("/reset-password");
      } else {
        toast.error(data.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while processing your request.");
    } finally {
      setLoading(false); // Set loading to false when request finishes
    }
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-12 md:col-span-5 w-full space-y-1 flex justify-center items-center flex-col p-4 md:p-8">
        <LogoAuth />
        <div className="flex justify-center items-center max-w-[400px] w-full">
          <Card className="w-full max-w-md bg-navy-950 gap-8 text-white border-none shadow-none md:pt-20">
            <CardHeader className="p-0">
              <CardTitle className="justify-start text-white text-[30px] md:text-[36px]">Forgot Password</CardTitle>
              <p className="text-[#959595] text-base md:text-lg font-normal">Enter the email address associated with your account.</p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]"
                    required
                  />
                  <Button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]"
                    disabled={loading} 
                  >
                    {loading ? (
                      <Spinner size="medium" />
                    ) : (
                      "Continue"
                    )}
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
