"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
   const [formData, setFormData] = useState({
    firstname: '',
    lastName: '',
    gender:"",
    email:'',
    dob:"",
    companyName:"",    
    });
    const [meditationListen, setMeditationListen] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDeleteAccount = () => {
      console.log('delete account')
    }
  
    const handleSave = () => {
      console.log('save')
    }

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
      <div>
        <h2 className=" text-white text-xl font-medium ">
      Alexa Rawles
      </h2>
      <p className='opacity-80'>alexarawles@gmail.com</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white opacity-80 dm-sans text-base font-normal">First Name</Label>
                <Input
                  id="firstname"
                  type='text'
                  value={formData.firstname}
                  onChange={(e) => handleChange('firstname', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white dm-sans opacity-80 text-base font-normal">Last Name</Label>
                <Input
                  id="lastName"
                  type='text'
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>
            </div>
                        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Gender</Label>
                <Input
                  id="gender"
                  type='text'
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Email Address</Label>
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
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Birthday</Label>
                <Input
                  id="dob"
                  type='text'
                  value={formData.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Company Name</Label>
                <Input
                  id="companyName"
                  type='text'
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white dm-sans opacity-80 text-base font-normal">Total Meditaion Listened To</Label>
                <Input
                  id="meditationListen"
                  type='text'
                  value={meditationListen}
                  onChange={(e) => setMeditationListen(e.target.value)}
                  className="bg-[#0f172a] h-12 border-none"
                />
              </div>              
                           
            </div>
            <div className="flex gap-4 mt-12">
        <Button
            variant="destructive"
            className="bg-[#FF4747] w-48 h-11 hover:bg-[#FF4747] hover:cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            Delete Account
          </Button>
          
          <Button 
            variant="default"
            className="bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] hover:cursor-pointer"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>   
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px]  p-6 flex flex-col  items-center text-white rounded-lg">
    <DialogHeader className="text-center">
      <DialogTitle className="text-lg font-semibold text-center">Delete Account</DialogTitle>
      <DialogDescription className="text-sm text-gray-400 text-center">
        Are you sure you want to delete your account?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="flex justify-center gap-4 mt-4">
      <Button
        variant="outline"
        className="bg-[#1A3F70]  border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
        onClick={() => setIsDialogOpen(false)}
      >
        No
      </Button>
      <Button
        variant="destructive"
        className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11"
        onClick={handleDeleteAccount}
      >
        Yes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  </div>
  )
}

export default Page
