"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

const Page = () => {
 const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  companyName: "",
  birthday: "",
 });

 const handleChange = (field: string, value: string) => {
  setFormData({
   ...formData,
   [field]: value,
  });
 };



 const handleSave = () => {
  console.log("Saving profile data:", formData);
 };
 return (
  <div className="flex flex-1 flex-col gap-4">
   <div className="space-y-6">


    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div className="space-y-2">
      <Label htmlFor="firstName" className="text-white dm-sans text-base font-normal">
       First Name
      </Label>
      <Input id="firstName" type="text" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} className="bg-[#1B2236] h-12 border-none" />
     </div>

     <div className="space-y-2">
      <Label htmlFor="lastName" className="text-white dm-sans text-base font-normal">
       Last Name
      </Label>
      <Input id="lastName" type="text" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} className="bg-[#1B2236] h-12 border-none" />
     </div>
    </div>


    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div className="space-y-2">
      <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
       Email Address
      </Label>
      <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="bg-[#1B2236] h-12 border-none" />
     </div>

     <div className="space-y-2">
      <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
       Gender
      </Label>
      <Input id="gender" type="text" value={formData.gender} onChange={(e) => handleChange("gender", e.target.value)} className="bg-[#1B2236] h-12 border-none" />
     </div>
    </div>


    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     <div className="space-y-2">
      <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
       Company Name
      </Label>
      <Input id="companyName" type="email" value={formData.companyName} onChange={(e) => handleChange("companyName", e.target.value)} className="bg-[#1B2236] h-12 border-none" />
     </div>

     <div className="space-y-2">
      <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
      Birthday
      </Label>
      <Input id="birthday" type="date" value={formData.birthday} onChange={(e) => handleChange("birthday", e.target.value)} className="bg-[#1B2236] h-12 border-none" />
     </div>
    </div>

    <div>
     <Button className="mt-4 bg-[#1A3F70] w-28 h=11 hover:bg-[#1A3F70] dm-sans text-white" onClick={handleSave}>
      Save
     </Button>
    </div>
   </div>
  </div>
 );
};

export default Page;
