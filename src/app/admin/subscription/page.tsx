"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'

const Page = () => {
  const [formData, setFormData] = useState({
    silverPlan: '',
    bronzePlan: '',
    goldPlan:''
  });

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });

  };

  return (
    <div className="grid grid-cols-12 gap-4  w-full">
    <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
      <h2 className="text-white text-[20px] md:text-2xl font-bold mb-6">
      Subscription
      </h2>
      <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white dm-sans text-base font-normal">Monthly (Silver Plan)</Label>
                <Input
                  id="silverPlan"
                  type='text'
                  value={formData.silverPlan}
                  onChange={(e) => handleChange('silverPlan', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white dm-sans text-base font-normal">Monthly (Bronze Plan)</Label>
                <Input
                  id="bronzePlan"
                  type='text'
                  value={formData.bronzePlan}
                  onChange={(e) => handleChange('bronzePlan', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans text-base font-normal">Monthly (Gold Plan)</Label>
                <Input
                  id="goldPlan"
                  type='password'
                  value={formData.goldPlan}
                  onChange={(e) => handleChange('goldPlan', e.target.value)}
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