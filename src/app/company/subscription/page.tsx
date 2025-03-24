"use client";
import React from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const invoices = [
 {
  Id: "#0032",
  CompanyName: "Kismet Tech Enterprises..",
  DueDate: "Monthly",
  Action: "$125",
 },
 {
  Id: "#0033",
  CompanyName: "Destiny Development Corp.",
  DueDate: "Monthly",
  Action: "$321",
 },
 {
  Id: "#0034",
  CompanyName: "Fortune Software Group.",
  DueDate: "Annual",
  Action: "$321",
 },
 {
  Id: "#0035",
  CompanyName: "Acme Corporation",
  DueDate: "Monthly",
  Action: "$125",
 },
];






export const Page = () => {
 
 return (
  <>
 

<div className="py-[30px] px-[36px] h-auto bg-[#1B2236] rounded-[20px] max-w-full">
  <div className="mb-[64px] text-white text-2xl text-left">Subscription Plan</div>

  {/* Wrapper for subscription plans */}
  <div className="flex flex-wrap lg:flex-nowrap justify-center gap-6">
    {/* Silver Plan */}
    <div className="w-full mt-[10px] max-w-sm h-fit bg-white rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 p-4">
      <div className="mt-6 font-bold flex items-center justify-center w-36 h-9 rounded-lg border border-neutral-800">
        <div className="text-neutral-800 text-xl font-medium">Silver Plan</div>
      </div>

      <div className="mt-5 text-center">
        <span className="text-[#1A3F70] text-4xl sm:text-5xl font-bold">$150</span>
        <span className="text-[#1A3F70] text-base sm:text-lg font-medium">/Monthly</span>
      </div>

      <div className="mt-8 flex flex-col gap-2 w-full px-4">
        {Array(4).fill("Limited Access").map((text, index) => (
          <div key={index} className="flex items-center gap-3">
            <Image src="/bluetick.svg" alt="check" width={20} height={20} />
            <div className="text-zinc-900 text-xs font-normal leading-7 break-words">{text}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center w-full">
        <button className="h-12 w-full max-w-[200px] bg-[#1A3F70] rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-medium">Choose Plan</span>
        </button>
      </div>
    </div>

    {/* Bronze Plan */}
    <div className="w-full max-w-sm h-fit bg-[#1A3F70] rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 p-4">
      <div className="mt-6 font-bold flex items-center justify-center w-36 h-9 rounded-lg border border-white">
        <div className="text-white text-xl font-medium">Bronze Plan</div>
      </div>

      <div className="mt-5 text-center">
        <span className="text-white text-4xl sm:text-5xl font-bold">$250</span>
        <span className="text-white text-base sm:text-lg font-medium">/Monthly</span>
      </div>

      <div className="mt-8 flex flex-col gap-2 w-full px-4">
        {Array(4).fill("Limited Access").map((text, index) => (
          <div key={index} className="flex items-center gap-3">
            <Image src="/whitetick.svg" alt="check" width={20} height={20} />
            <div className="text-white text-xs font-normal leading-7 break-words">{text}</div>
            <Image src="/whitetick.svg" alt="check" width={20} height={20} />
            <div className="text-white text-xs font-normal leading-7 break-words">{text}</div>
          </div>
        ))}
      </div>

      <div className="mt-[30px] flex justify-center w-full">
        <button className="h-12 w-full max-w-[200px] bg-white rounded-lg flex items-center justify-center">
          <span className="text-[#1A3F70] text-lg font-medium">Currently Plan</span>
        </button>
      </div>
      <div className="mt-[10px] text-center text-white text-xs font-normal">Expire on 31/01/2025</div>
    </div>

    {/* Gold Plan */}
<div className="w-full mt-[10px] max-w-sm h-fit bg-white rounded-lg flex flex-col items-center transition-transform duration-300 hover:scale-105 p-4">
  <div className="mt-6 font-bold flex items-center justify-center w-36 h-9 rounded-lg border border-neutral-800">
    <div className="text-neutral-800 text-xl font-medium">Gold Plan</div>
  </div>

  <div className="mt-5 text-center">
    <span className="text-[#1A3F70] text-4xl sm:text-5xl font-bold">$337</span>
    <span className="text-[#1A3F70] text-base sm:text-lg font-medium">/Monthly</span>
  </div>

  <div className="flex">
    <div className="mt-8 flex flex-col gap-2 w-full px-2">
      {["Unlimited Signups", "Unlimited Access", "Unlimited Downloads"].map((text, index) => (
        <div key={index} className="flex items-center gap-3">
          <Image src="/bluetick.svg" alt="check" width={20} height={20} />
          <div className="text-black text-xs font-normal leading-7 break-words whitespace-nowrap">{text}</div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Image src="/bluetick.svg" alt="check" width={20} height={20} />
        <div className="text-black text-xs font-normal leading-7 break-words whitespace-nowrap">Unlimited</div>
      </div>
    </div>
    <div className="mt-8 flex flex-col gap-2 w-full px-4">
      {["Unlimited Signups", "Unlimited Access", "Unlimited Downloads"].map((text, index) => (
        <div key={index} className="flex items-center gap-3">
          <Image src="/bluetick.svg" alt="check" width={20} height={20} />
          <div className="text-black text-xs font-normal leading-7 break-words whitespace-nowrap">{text}</div>
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Image src="/bluetick.svg" alt="check" width={20} height={20} />
        <div className="text-black text-xs font-normal leading-7 break-words whitespace-nowrap">Unlimited</div>
      </div>
    </div>
  </div>

  <div className="mt-6 flex justify-center w-full">
    <button className="h-12 w-full max-w-[200px] bg-[#1A3F70] rounded-lg flex items-center justify-center">
      <span className="text-white text-lg font-medium">Choose Plan</span>
    </button>
  </div>
</div>


  </div>
</div>



{/* bottom  */}

     <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
      <div className="mb-[29px]  justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">Recent Payments</div>
      <div className=" w-full rounded-none overflow-hidden">
       <div className="w-full overflow-auto h-[210px] scroll-container">
        <Table className="min-w-[500px] scrollbar-thin scroll-container">
         <TableHeader>
          <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
           <TableHead className="w-[100px] py-4">Id</TableHead>
           <TableHead className="py-4">Company Name</TableHead>
           <TableHead className="py-4">Plan</TableHead>
           <TableHead className="text-right py-4">Transaction</TableHead>
          </TableRow>
         </TableHeader>

         <TableBody>
          {invoices.map((invoice) => (
           <TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
            <TableCell className="py-4">{invoice.Id}</TableCell>
            <TableCell className="py-4">{invoice.CompanyName}</TableCell>
            <TableCell className="py-4">{invoice.DueDate}</TableCell>
            <TableCell className="text-right py-4 ">{invoice.Action}</TableCell>
           </TableRow>
          ))}
         </TableBody>
        </Table>
       </div>
      </div>
     </div>

  </>
 );
};

export default Page;
