"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

const Page = () => {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    password:''
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
    <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
      <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
      Add New Company
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white dm-sans text-base font-normal">First Name</Label>
                <Input
                  id="company"
                  type='text'
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white dm-sans text-base font-normal">Last Name</Label>
                <Input
                  id="email"
                  type='text'
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans text-base font-normal">Email Address</Label>
                <Input
                  id="password"
                  type='password'
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
            </div>
            
            <div>
              <Button 
                className="mt-4 bg-[#1A3F70] w-64 h-11 hover:bg-[#1A3F70] dm-sans text-white" 
                // onClick={handleSave}
              >
                Save
              </Button>
            </div>
    </div>
  </div>
  )
}

export default Page