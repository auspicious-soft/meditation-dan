"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import BannerImage from "./components/BannerImage";
import LogoAuth from "./components/LogoAuth";

export default function Home() {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface SignInFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }

  const handleSubmit = (e: React.FormEvent<SignInFormElement>) => {
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
                Sign in
              </CardTitle>
              <p className="text-[#959595] text-base md:text-lg font-normal">
                Please login to continue to your account.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <Input
                    id="email"
                    type="Email"
                    placeholder="Email"
                    className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px] "
                    required
                  />
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px] "
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-5 text-gray-400 cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        className="w-[18px] h-[18px] border-2 border-white rounded-[4px] data-[state=checked]:bg-white data-[state=checked]:border-[#357aff]"
                      ></Checkbox>

                      <Label
                        htmlFor="remember"
                        className="text-[#9a9a9a] text-base font-medium"
                      >
                        Keep me logged in
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-[#9a9a9a] text-base font-medium"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]"
                  >
                    Sign in
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
