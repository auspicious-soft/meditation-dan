"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useRouter } from "next/navigation";




const invoices = [
 {
  Id: "#0032",
  CompanyName: "Favorable Digital Services.",
  DueDate: "Monthly",
  Action: "$125",
 },
 {
  Id: "#0033",
  CompanyName: "Blessed Codeworks.",
  DueDate: "Annual",
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

interface Invoice {
  Id: string;
  NameCustomer: string;
  DueDate: string;
  Action: string;
  email: string;
 }

const Users: Invoice[] = [
 { Id: "#0032", NameCustomer: "Rakesh Choudhary",  email: "rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
 { Id: "#0033", NameCustomer: "Ravi Pandit", email: "rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
 { Id: "#0034", NameCustomer: "Harsh Bhatia", email: "rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
 { Id: "#0035", NameCustomer: "Gautam Patial", email: "rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
 { Id: "#0036", NameCustomer: "Gurnam Singh", email: "rakeshchoudhary123@gmail.com", DueDate: "09/01/2025", Action: "View" },
 { Id: "#0037", NameCustomer: "Rajat Kumar", email: "rakeshchoudhary123@gmail.com", DueDate: "10/01/2025", Action: "View" },
 { Id: "#0038", NameCustomer: "Vijay Pathania", email: "rakeshchoudhary123@gmail.com", DueDate: "11/01/2025", Action: "View" },
];

const PAGE_SIZE = 20;


const RecentNewUsers = () => {
 const router = useRouter();
 const [currentPage, setCurrentPage] = useState<number>(1);


 const totalPages = Math.ceil(invoices.length / PAGE_SIZE);

 const handleViewClick = () => {
  // router.push(`/invoice/${id}`);
  router.push(`/company/users/details`);
 };

 const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages) {
   setCurrentPage(newPage);
  }
 };

 return (
  <>
   <div className="flex flex-1 flex-col gap-4">
    <h1 className="text-2xl font-bold block md:hidden">Dashboard</h1>
{/* container  */}

    <div className="flex flex-1 flex-col gap-4">

{/* top  */}
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

{/* bottom  */}
<div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-tl-[20px] rounded-tr-[20px]">
  <div className="justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">Recent New Users</div>
  <div className="w-full rounded-none overflow-hidden">
    <div className="w-full overflow-auto h-[300px] scroll-container"> {/* Added scroll height */}
      <Table className="min-w-[500px] scrollbar-thin scroll-container">
        <TableHeader>
          <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
            <TableHead className="w-[100px] py-4">Id</TableHead>
            <TableHead className="py-4">Name of Customer</TableHead>
            <TableHead className="py-4">Email Id</TableHead>
            <TableHead className="py-4">Register Date</TableHead>
            <TableHead className="text-right py-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Users.map((invoice) => (
            <TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
              <TableCell className="py-4">{invoice.Id}</TableCell>
              <TableCell className="py-4">{invoice.NameCustomer}</TableCell>
              <TableCell className="py-4">{invoice.email}</TableCell>
              <TableCell className="py-4">{invoice.DueDate}</TableCell>
              <TableCell className="text-right py-4">
                <Button className="px-3 !py-0 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight" onClick={() => handleViewClick()}>
                  {invoice.Action}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
  {/* Pagination Controls */}
  <div className="flex justify-end items-center gap-2 mt-4">
    <Button className="bg-[#0B132B]" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
      Previous
    </Button>
    <span className="text-white text-sm">
      Page {currentPage} of {totalPages}
    </span>
    <Button className="bg-[#0B132B]" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
      Next
    </Button>
  </div>
</div>



    </div>
   </div>
  </>
 );
};

export default RecentNewUsers;
