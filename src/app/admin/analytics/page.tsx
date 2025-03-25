"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const stats = [
   { label: "Total Users", value: "1245" },
   { label: "Active Users", value: "52" },
   { label: "Total Downloads", value: "12524" },
   { label: "Audio Plays", value: "55654" },
 ];

interface Invoice {
 Id: string;
 CompanyName: string;
 NameofCustomer: string;
}

const invoices: Invoice[] = [
 { Id: "#0032", NameofCustomer: "Rakesh Choudhary", CompanyName: "Innovative Tech Solutions Inc."},
 { Id: "#0033", NameofCustomer: "Ravi Pandit", CompanyName: "Creative Minds Software Co." },
 { Id: "#0034", NameofCustomer: "Harsh Bhatia", CompanyName: "NextGen Digital Services Ltd." },
 { Id: "#0035", NameofCustomer: "Gautam Patial", CompanyName: "Pioneering Software Innovations LLC." },
 { Id: "#0036", NameofCustomer: "Gurnam Singh", CompanyName: "Visionary Apps Corp." },
 { Id: "#0037", NameofCustomer: "Rajat Kumar", CompanyName: "Synergy Software Group." },
 { Id: "#0038", NameofCustomer: "Vijay Pathania", CompanyName: "Dynamic Code Labs." },
 { Id: "#0039", NameofCustomer: "Gautam Patial", CompanyName: "TechWave Solutions." },
 { Id: "#0040", NameofCustomer: "Harsh Bhatia", CompanyName: "FutureTech Systems" },
 { Id: "#0041", NameofCustomer: "Gautam Patial", CompanyName: "Smart Solutions Technologies." },
 { Id: "#0042", NameofCustomer: "Harsh Bhatia", CompanyName: "FutureWave Enterprises." },
];


// bottom 
interface Subscription {
 Id: string;
 CompanyName: string;
 RegisterDate: string;
 Action: string;
}

const invoicees: Subscription[] = [
 { Id: "#0032", RegisterDate: "08/01/2025", CompanyName: "Elite Software Enterprises", Action: "View"},
 { Id: "#0033", RegisterDate: "08/01/2025", CompanyName: "Quantum Innovations Ltd.",  Action: "View"},
 { Id: "#0034", RegisterDate: "08/01/2025", CompanyName: "Digital Dreamers Inc.", Action: "View" },
];

// bottom last 
interface Payments {
 Id: string;
 CompanyName: string;
 Plan: string;
 Transaction: string;
}

const Recent : Payments[] = [
 { Id: "#0032", Plan: "Monthly", CompanyName: "Elite Software Enterprises", Transaction: "$125"},
 { Id: "#0033", Plan: "Monthly", CompanyName: "Quantum Innovations Ltd.", Transaction: "$321"},
 { Id: "#0034", Plan: "Monthly", CompanyName: "Digital Dreamers Inc.", Transaction: "$321" },
];





const PAGE_SIZE = 20;

const Page = () => {
 const router = useRouter();
 const [currentPage, setCurrentPage] = useState<number>(1);

 const indexOfLastInvoice = currentPage * PAGE_SIZE;
 const indexOfFirstInvoice = indexOfLastInvoice - PAGE_SIZE;
 const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
const currentInvoicees = invoicees.slice(indexOfFirstInvoice, indexOfLastInvoice);
const totalPages = Math.ceil(invoices.length / PAGE_SIZE);
const currentRecent = Recent.slice(indexOfFirstInvoice, indexOfLastInvoice);

//  const handlePageChange = (newPage: number) => {
//   if (newPage >= 1 && newPage <= totalPages) {
//    setCurrentPage(newPage);
//   }
//  };
 const handleViewClick = () => {
    router.push(`/company/users/details`);
   };
 

 return (
  <>

{/* top  */}
<div className="p-4">
      <div className="mb-8  text-white text-2xl font-bold">
        Track and measure user engagement and app performance.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#1b2236] rounded-lg p-4 text-white">
            <div className="text-sm font-normal mb-2">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  

<div className="flex flex-col  md:flex-row justify-between  mx-0 margin-[10px]">

{/* bottom left  */}
<div className="grid grid-cols-12 mr-[25px] mb-[25px] h-screen w-full md:w-[80%] lg:w-[60%] px-4 sm:px-6">
  <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
    <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">Recent New Users</h2>
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
            <TableHead className="w-[100px] py-4">Id</TableHead>
            <TableHead className="py-4">Name of Customer</TableHead>
            <TableHead className="py-4">Company Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInvoices.map((invoice) => (
            <TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
              <TableCell className="py-4">{invoice.Id}</TableCell>
              <TableCell className="py-4">{invoice.NameofCustomer}</TableCell>
              <TableCell className="py-4">{invoice.CompanyName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
</div>


{/* bottom right  */}
<div className="">
<div className=" grid grid-cols-12  h-auto w-full">
    <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
     <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">Subscription Expire Today</h2>
     <div>
      <Table>
       <TableHeader>
        <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
         <TableHead className="w-[100px] py-4">Id</TableHead>
         <TableHead className="py-4">Company Name</TableHead>
         <TableHead className="py-4">Register Date</TableHead>
         <TableHead className="py-4">Action</TableHead>

        </TableRow>
       </TableHeader>
       <TableBody>
        {currentInvoicees.map((Subscription) => (
         <TableRow key={Subscription.Id} className="border-0 text-sm font-normal hover:bg-transparent">
          <TableCell className="py-4">{Subscription.Id}</TableCell>
          <TableCell className="py-4">{Subscription.CompanyName}</TableCell>
          <TableCell className="py-4">{Subscription.RegisterDate}</TableCell>
          <TableCell className="text-right py-4">
          <Button className="px-3 !py-0 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight" onClick={() => handleViewClick()}>
            {Subscription.Action}
           </Button>
           </TableCell>

       
          
         </TableRow>
        ))}
       </TableBody>
      </Table>


     </div>

    </div>
   </div>


{/* bottom last  */}
<div className="mt-[25px] grid grid-cols-12 h-auto w-full">
    <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
     <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">Subscription Expire Today</h2>
     <div>
      <Table>
       <TableHeader>
        <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
         <TableHead className="w-[100px] py-4">Id</TableHead>
         <TableHead className="py-4">Company Name</TableHead>
         <TableHead className="py-4">Plan</TableHead>
         <TableHead className="py-4">Transcation</TableHead>

        </TableRow>
       </TableHeader>
       <TableBody>
        {currentRecent.map((Payments) => (
         <TableRow key={Payments.Id} className="border-0 text-sm font-normal hover:bg-transparent">
          <TableCell className="py-4">{Payments.Id}</TableCell>
          <TableCell className="py-4">{Payments.CompanyName}</TableCell>
          <TableCell className="py-4">{Payments.Plan}</TableCell>
          <TableCell className="py-4">{Payments.Transaction}</TableCell>
          <TableCell className="text-right py-4">
          {/* <Button className="px-3 !py-0 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight" onClick={() => handleViewClick()}>
            {Payments.Action}
           </Button> */}
           </TableCell>

       
          
         </TableRow>
        ))}
       </TableBody>
      </Table>


     </div>

    </div>
   </div>


   </div>
   </div>



  </>
 );
};

export default Page;
