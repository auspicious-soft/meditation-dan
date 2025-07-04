"use client";
// export const dynamic = "force-dynamic";
import React, { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { loginAction } from "@/actions"; // Ensure this function correctly sends a request
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LogoAuth from "./(auth)/components/LogoAuth";
import BannerImage from "./(auth)/components/BannerImage";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const { data: session } = useSession();

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    if (!emailRegex.test(email) && !phoneRegex.test(email)) {
      toast.error("Please enter a valid email or phone number.", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId: any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
      return;
    }
    if (!password) {
      toast.error("Password is required.", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId: any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
      return;
    }
    startTransition(async () => {
      try {
        const response = await loginAction({ email, password });
        console.log("response: ", response);

        if (response?.success) {
          const userRole = response?.data?.user?.role;
          if (userRole === "user") {
            toast.error("You are not authorized to access this page.", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId: any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
            return;
          }

          toast.success("Logged in successfully", {
            duration: Infinity,
            position: "top-center",
            action: {
              label: "OK",
              onClick: (toastId: any) => toast.dismiss(toastId),
            },
            closeButton: false,
          });
          router.push(
            userRole === "company" ? "/company/dashboard" : "/admin/dashboard"
          );
        } else {
          if (response?.message === "Not verified by Admin yet") {
            router.push("/request-pending");
          } else if (response?.message === "Request rejected by Admin") {
            router.push("/request-rejected");
          } else {
            toast.error(response?.message || "Invalid email or password.", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId: any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
          }
        }
      } catch (error) {
        console.error("Login action error:", error);
        toast.error("Something went wrong! Please try again.", {
          duration: Infinity,
          position: "top-center",
          action: {
            label: "OK",
            onClick: (toastId: any) => toast.dismiss(toastId),
          },
          closeButton: false,
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      {/* Left Section - Login Form */}
      <div className="col-span-12 md:col-span-5 flex justify-center items-center flex-col p-4 md:p-8">
        <LogoAuth />
        <div className="max-w-[400px] w-full">
          <Card className="w-full max-w-md bg-navy-950 text-white border-none shadow-none md:pt-20">
            <CardHeader className="p-0">
              <CardTitle className="text-white text-[30px] md:text-[36px]">
                Sign in
              </CardTitle>
              <p className="text-[#959595] text-base md:text-lg font-normal">
                Please login to continue to your account.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Email/Phone Input */}
                  <Input
                    id="email"
                    type="text"
                    placeholder="Email or Phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                    required
                  />

                  {/* Password Input */}
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                      required
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className="absolute right-4 top-5 text-gray-400 hover:cursor-pointer"
                      onClick={togglePasswordVisibility}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {/* {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>} */}

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    {/* <div className="flex items-center space-x-2">
           <Checkbox id="remember" className="w-[18px] h-[18px] border-2 border-white rounded-[4px]" />
           <Label htmlFor="remember" className="text-[#9a9a9a] text-base font-medium">
            Keep me logged in
           </Label>
          </div> */}
                    <Link
                      href="/forgot-password"
                      className="text-[#9a9a9a] text-base font-medium hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg hover:cursor-pointer text-white text-lg font w-full leading-[30px] hover:bg-[#1a3f70]"
                    disabled={isPending}
                  >
                    {isPending ? "Signing in..." : "Sign in"}
                  </Button>
                  <div className="flex items-center justify-center mx-auto">
                    <Link
                      href="/signup"
                      className="text-[#9a9a9a] text-base font-medium"
                    >
                      Don&apos;t have an account?
                      <span className="hover:underline"> Sign Up</span>
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section - Banner Image */}
      <div className="col-span-12 md:col-span-7">
        <BannerImage />
      </div>
    </div>
  );
}
