"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
 const { id } = useParams();
 console.log("id:", id);
 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
 const [userData, setUserData] = useState({
  firstName: "Alexva",
  lastName: "Rowles",
  gender: "Male",
  birthday: "20/01/1997",
  email: "alexvarowles@gmail.com",
  companyName: "Fortuity Tech Ltd.",
 });
 console.log("setUserData:", setUserData);

 const handleDeclineAccount = () => {
  // Add confirmation dialog here
  console.log("Delete account requested");
 };

//  const handleDeactivate = () => {
//   console.log("Deactivate requested");
//  };
 return (
  <div className=" text-white py-6 w-full ">
   <div className="mb-6">
    <h2 className=" text-white text-xl font-medium ">Alexa Rawles</h2>
    <p className="opacity-50">alexarawles@gmail.com</p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
    <div>
     <p className="opacity-80 text-sm text-slate-400 mb-1">First Name</p>
     <p className="text-white">{userData.firstName}</p>
    </div>

    <div>
     <p className="opacity-80 text-sm text-slate-400 mb-1">Last Name</p>
     <p className="text-white">{userData.lastName}</p>
    </div>

    <div>
     <p className="opacity-80 text-sm text-slate-400 mb-1">Gender</p>
     <p className="text-white">{userData.gender}</p>
    </div>

    <div>
     <p className="opacity-80 text-sm text-slate-400 mb-1">Email Address</p>
     <p className="text-white">{userData.email}</p>
    </div>

    <div>
     <p className="opacity-80 text-sm text-slate-400 mb-1">Birthday</p>
     <p className="text-white">{userData.birthday}</p>
    </div>

    <div>
     <p className="opacity-80 text-sm text-slate-400 mb-1">Company Name</p>
     <p className="text-white">{userData.companyName}</p>
    </div>
   </div>

   <div className="flex gap-4 mt-12">
    <Button variant="destructive" className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer" onClick={() => setIsDialogOpen(true)}>
     Decline Account
    </Button>

    <Button variant="destructive" className="bg-[#1A3F70] hover:bg-[#1A3F70] hover:cursor-pointer"  onClick={() => setIsDeactivateOpen(true)}>
    Approve Account
    </Button>

   </div>

{/* Decline dialog box */}
   <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px]  p-6 flex flex-col  items-center text-white rounded-lg">
     <DialogHeader className="text-center">
      <DialogTitle className="text-lg font-semibold text-center">Decline Account</DialogTitle>
      <DialogDescription className="text-sm text-gray-400 text-center">Are you sure you want to Decline account?</DialogDescription>
     </DialogHeader>
     <DialogFooter className="flex justify-center gap-4 mt-4">
      <Button variant="outline" className="bg-[#1A3F70]  border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11" onClick={() => setIsDialogOpen(false)}>
       No
      </Button>
      <Button variant="destructive" className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11" onClick={handleDeclineAccount}>
       Yes
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>

{/* Approve dialog box  */}
   <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
    <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px]  p-6 flex flex-col  items-center text-white rounded-lg">
     <DialogHeader className="text-center">
      <DialogTitle className="text-lg font-semibold text-center">Approve Account</DialogTitle>
      <DialogDescription className="text-sm text-gray-400 text-center">Are you sure you want to Approve Account?</DialogDescription>
     </DialogHeader>
     <DialogFooter className="flex justify-center gap-4 mt-4">
      <Button variant="outline" className="bg-[#1A3F70]  border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11" onClick={() => setIsDeactivateOpen(false)}>
       No
      </Button>
      <Button variant="destructive" className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11" onClick={handleDeclineAccount}>
       Yes
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>

  </div>
 );
};

export default Page;
