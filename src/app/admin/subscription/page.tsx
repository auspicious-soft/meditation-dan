"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle } from 'lucide-react'



const plans = [
  { name: "Basic Plan", price: "$250/mo", features: ["Limited Access", "Limited Access", "Limited Access" , "Limited Access"] },
  { name: "Basic Plan", price: "$250/mo", features: ["Limited Access", "Limited Access", "Limited Access", "Limited Access"] },
  { name: "Basic Plan", price: "$250/mo", features: ["Limited Access", "Limited Access", "Limited Access", "Limited Access"] }
];


// const features = ["Limited Access", "Limited Access", "Limited Access", "Limited Access"];

const Page = () => {
  const [formData, setFormData] = useState({
    silverPlan: '',
    bronzePlan: '',
    goldPlan:''
  });

   const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);





  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });

  };

  const handleDeleteAccount = () => {
    // Add confirmation dialog here
    console.log("Delete account requested");
   };

   const cancelDelete = () => {
    // setAudioToDelete(null);
    setIsDialogOpen(false);
  };


  return (
    <>
    <div className='flex'>
    <div className="px-16 py-3 bg-[#1A3F70] rounded-lg inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-start text-white text-base font-normal ">All</div>
</div>

<div className="px-16 py-3 bg-[#050D23] rounded-lg inline-flex justify-center items-center gap-2.5">
    <div className="text-center justify-start text-white text-base font-normal ">Archived</div>
</div>
</div>




<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ">
  {plans.map((plan, index) => (
    <div
      key={index}
      className="space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9 min-h-[33vh]"
    >
      <div className=" flex justify-between">
        <div className="text-white text-xl font-semibold">{plan.name}</div>
        <div className="text-white text-lg font-semibold">{plan.price}</div>
      </div>

      <div className=" w-fit  bg-[#1b2236] rounded-[12px] md:rounded-[20px]  ">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-[13px] mb-[10px]  justify-start">
            <Image src="/whitetick.svg" alt="check" width={20} height={20} />
            <div className="text-white text-xs font-normal">{feature}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-[12px]">
        <Button className="bg-[#D92D20] hover:cursor-pointer w-[50%]">
          Delete
        </Button>
        <Button className="bg-[#0B132B] hover:cursor-pointer w-[50%]">
          Edit
        </Button>
      </div>
    </div>
  ))}


  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
      <DialogHeader className="text-center">
        <DialogTitle className="text-lg font-semibold">Delete Account</DialogTitle>
        <DialogDescription className="text-sm text-gray-400">Are you sure you want to delete your account?</DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
          onClick={() => setIsDialogOpen(false)}
        >
          No
        </Button>
        <Button
          variant="destructive"
          className="bg-[#D92D20] hover:bg-[#D92D20] hover:cursor-pointer w-44 h-11"
          onClick={handleDeleteAccount}
        >
          Yes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>


  {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#141B2D] border-[#1F2937] w-full max-w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Image src="/error.svg" alt="error" width={20} height={20} />
            </div>
            <DialogTitle className="text-lg font-semibold text-center">Delete ?</DialogTitle>
            <DialogDescription className="text-sm text-gray-400">
              Are you sure you want to deny this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] w-32 sm:w-44 h-10 sm:h-11"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedRequestId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-32 sm:w-44 h-10 sm:h-11"
              onClick={handleDeny}
            >
              Deny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}



</div>




  </>
  )
}

export default Page