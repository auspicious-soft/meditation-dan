"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LogoAuth from "../components/LogoAuth";
import BannerImage from "../components/BannerImage";
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
                Forgot Password
              </CardTitle>
              <p className="text-[#959595] text-base md:text-lg font-normal">
                Enter the email address associated with your account.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <Input
                    id="email"
                    type="Email"
                    placeholder="Email Address"
                    className="bg-transparent rounded-[10px] border !border-[#d9d9d9] !text-lg focus:!border-blue-500 focus:ring-0 focus-visible:ring-0 leading-[27px] h-[60px] "
                    required
                  />
                  <Link href="/reset-password">
                    <Button
                      type="button"
                      className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] cursor-pointer hover:bg-[#1a3f70]"
                    >
                      Continue
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
