"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
   const [formData, setFormData] = useState({
    companyName: '',
    subscriptionPlan:"",
    email:'',
    subscriptionExpireDate:"",   
    totalUsers:"", 
    });



    const handleChange = (field: string, value: string) => {
      setFormData({
        ...formData,
        [field]: value
      });
    };
  

  const {id} = useParams()
  
  console.log('id:', id);
  return (    
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
    <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">     
        <h2 className=" text-white text-xl font-medium ">
        Fortunate Tech Solutions Inc.
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white opacity-80 dm-sans text-base font-normal">Company Name</Label>
                <Input
                  id="companyName"
                  type='text'
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white dm-sans opacity-80 text-base font-normal">Email Address</Label>
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
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Subscription Plan</Label>
                <Input
                  id="subscriptionPlan"
                  type='text'
                  value={formData.subscriptionPlan}
                  onChange={(e) => handleChange('subscriptionPlan', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Subscription Expire Date</Label>
                <Input
                  id="subscriptionExpireDate"
                  type='text'
                  value={formData.subscriptionExpireDate}
                  onChange={(e) => handleChange('subscriptionExpireDate', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Total Users</Label>
                <Input
                  id="totalUsers"
                  type='text'
                  value={formData.totalUsers}
                  onChange={(e) => handleChange('totalUsers', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
                          
            </div>
           
            
        <Button
            variant="destructive"
            className="bg-[#1A3F70] w-48 h-11 hover:bg-[#1A3F70] hover:cursor-pointer"
            onClick={() => console.log('Send Reminder')}
          >
            Send Reminder
          </Button>
          
         
    </div>
  </div>
  )
}

export default Page