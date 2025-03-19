"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import BannerImage from "../components/BannerImage";
import LogoAuth from "../components/LogoAuth";

export default function Home() {
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-12 md:col-span-5 w-full space-y-1 flex justify-center items-center flex-col p-4 md:p-8">
        <LogoAuth />
        <div className="flex justify-center items-center max-w-[400px] w-full">
          <Card className="w-full max-w-md bg-navy-950 gap-8 text-white border-none shadow-none md:pt-20">
            <CardHeader className="p-0">
              <CardTitle className="justify-start text-white text-[30px] md:text-[36px]">
                Create New Password
              </CardTitle>
              <p className="text-[#959595] text-base md:text-lg font-normal">
                Create a new password of at least 8 characters long.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Old Password */}
                  <div className="relative">
                    <Input
                      id="old-password"
                      placeholder="Old Password"
                      type={showOldPassword ? "text" : "password"}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <Input
                      id="new-password"
                      placeholder="New Password"
                      type={showNewPassword ? "text" : "password"}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Re-enter New Password */}
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      placeholder="Re-enter New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px]"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-5 text-gray-400 cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="col-span-12 md:col-span-7 w-full space-y-1 rounded-3xl ">
        <BannerImage />
      </div>
    </div>
  );
}
