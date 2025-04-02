"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const plans = [
 { name: "Basic Plan", price: "$250/mo", features: ["Limited Access", "Limited Access", "Limited Access", "Limited Access"] },
 { name: "Basic Plan", price: "$250/mo", features: ["Limited Access", "Limited Access", "Limited Access", "Limited Access"] },
 { name: "Basic Plan", price: "$250/mo", features: ["Limited Access", "Limited Access", "Limited Access", "Limited Access"] },
];


const Page = () => {

 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [isEditOpen, setIsEditOpen] = useState(false);
 const [answer, setAnswer] = useState("");
 const [question, setQuestion] = useState("$25.99");

 const handleDeclineAccount = () => {
  console.log("Delete account requested");
 };


 function handleSaveFaq(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {

  console.log("FAQ saved:", { answer });
  setIsEditOpen(false); // Close the dialog after saving
  setQuestion(""); // Reset the question input
  setAnswer(""); // Reset the answer input
 }

 return (
  <>
   <div className="flex">
    <div className="px-16 py-3 bg-[#1A3F70] rounded-lg inline-flex justify-center items-center gap-2.5">
     <div className="text-center justify-start text-white text-base font-normal ">All</div>
    </div>

    <div className="px-16 py-3 bg-[#050D23] rounded-lg inline-flex justify-center items-center gap-2.5">
     <div className="text-center justify-start text-white text-base font-normal ">Archived</div>
    </div>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-[20px] ">
    {plans.map((plan, index) => (
     <div key={index} className=" bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9 min-h-[33vh]">
      <div className=" flex mb-[20px] justify-between">
       <div className="text-white text-xl font-semibold">{plan.name}</div>
       <div className="text-white text-lg font-semibold">{plan.price}</div>
      </div>

      <div className=" w-fit mb-[10px]  bg-[#1b2236] rounded-[12px] md:rounded-[20px]  ">
       {plan.features.map((feature, idx) => (
        <div key={idx} className="flex items-center gap-[13px]   justify-start">
         <Image src="/whitetick.svg" alt="check" width={20} height={20} />
         <div className="text-white text-xs font-normal">{feature}</div>
        </div>
       ))}
      </div>

      <div className="flex gap-[12px]">
       <Button variant="destructive" className="bg-[#D92D20]  hover:bg-[#D92D20] w-[50%] hover:cursor-pointer" onClick={() => setIsDialogOpen(true)}>
        {" "}
        Delete{" "}
       </Button>

       <Button onClick={() => setIsEditOpen(true)} className="bg-[#0B132B] hover:bg-[#0B132B]  hover:cursor-pointer w-[50%]">
        Edit
       </Button>
      </div>
     </div>
    ))}

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
     <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px]  p-6 flex flex-col  items-center text-white rounded-lg">
      <DialogHeader className="text-center">
       <div className="flex justify-center mb-4">
        <Image src="/error.svg" alt="error" width={20} height={20} />
       </div>
       <DialogTitle className="text-lg font-semibold text-center">Delete ? </DialogTitle>
       <DialogDescription className="text-sm text-gray-400 text-center">Are you sure you want to delete this ? This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-center gap-4 mt-4">
       <Button variant="outline" className="bg-[#1A3F70]  border-[#1A3F70] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11" onClick={() => setIsDialogOpen(false)}>
        Cancel
       </Button>
       <Button variant="destructive" className="bg-[#D92D20] hover:bg-[#D92D20] hover:cursor-pointer w-44 h-11" onClick={handleDeclineAccount}>
        Delete
       </Button>
      </DialogFooter>
     </DialogContent>
    </Dialog>


    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
     <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
      <DialogHeader className="text-center">
       <DialogTitle />
       <div className="self-stretch text-center justify-start text-white text-base font-semibold">Add/Edit FAQ</div>
      </DialogHeader>

      <div className="self-stretch inline-flex flex-col justify-start items-start gap-3.5">
       <label className="self-stretch opacity-80 text-white text-base font-normal">New Price</label>
       <input type="text" className="self-stretch h-12 px-4 py-3.5 bg-[#0B132B] rounded-lg text-neutral-400 text-base font-normal focus:outline-none" placeholder="Type question here" value={question} onChange={(e) => setQuestion(e.target.value)} />
      </div>

      <DialogFooter className="flex justify-end gap-[12px] mt-6">
       <Button variant="outline" className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11" onClick={() => setIsEditOpen(false)}>
        Cancel
       </Button>
       <Button variant="destructive" className="bg-[#14AB00] hover:bg-[#14AB00] hover:cursor-pointer w-44 h-11" onClick={handleSaveFaq}>
        Update
       </Button>
      </DialogFooter>
     </DialogContent>
    </Dialog>
    
   </div>
  </>
 );
};

export default Page;
