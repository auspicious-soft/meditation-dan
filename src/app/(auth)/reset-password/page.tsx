"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LogoAuth from "../components/LogoAuth";
import BannerImage from "../components/BannerImage";
import {
  InputOTP,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

export default function Home() {
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
                Enter OTP
              </CardTitle>
              <p className="text-[#959595] text-base md:text-lg font-normal">
                Enter the OTP received in your email.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <InputOTP maxLength={6} className="border-none justify-between flex !gap-10">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 flex items-center justify-center border border-[#ffffff] rounded-full bg-transparent text-white text-lg"
                      >
                        <InputOTPSlot
                          index={index}
                          className="w-full h-full text-center bg-transparent border-none rounded-full !text-lg !ring-0 "
                         
                        />
                      </div>
                    ))}
                  </InputOTP>
                <Link href="/new-password">
                  <Button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]"
                  >
                    Sign in
                  </Button>
                  </Link>
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
