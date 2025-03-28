"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Invoice {
 Id: string;
 CompanyName: string;
 UserName: string;
 email: string;
 gender: string;
}

const invoices: Invoice[] = [
 { Id: "#0032", UserName: "Rakesh Choudhary", CompanyName: "Pioneering Tech Innovations Inc.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0033", UserName: "Ravi Pandit", CompanyName: "Creative Genius Software Co", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0034", UserName: "Harsh Bhatia", CompanyName: "NextGen Digital Solutions Ltd", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0035", UserName: "Gautam Patial", CompanyName: "Brilliant Apps LLC.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0036", UserName: "Gurnam Singh", CompanyName: "Groundbreaking Software Collective.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0037", UserName: "Rajat Kumar", CompanyName: "Synergistic Systems Pvt. Ltd.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0038", UserName: "Vijay Pathania", CompanyName: "Dynamic Innovations Corp.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0039", UserName: "Sanjay Choudhary", CompanyName: "TechStream Solutions.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0040", UserName: "Nimesh Gill", CompanyName: "Smart Solutions Group..", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0041", UserName: "Nitin Varodra", CompanyName: "Revolutionary Shift Technologies.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
 { Id: "#0042", UserName: "Sanjay Choudhary", CompanyName: "FutureWave Enterprises.", email: "rakeshchoudhary123@gmail.com", gender: "male" },
];

const PAGE_SIZE = 20;

const Page = () => {
 const router = useRouter();
 const [currentPage, setCurrentPage] = useState<number>(1);

 const indexOfLastInvoice = currentPage * PAGE_SIZE;
 const indexOfFirstInvoice = indexOfLastInvoice - PAGE_SIZE;
 const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
 const totalPages = Math.ceil(invoices.length / PAGE_SIZE);

 const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages) {
   setCurrentPage(newPage);
  }
 };

 const handleViewClick = (id: string) => {
  router.push(`/company/join-request/single-user-request/${id}`);
 };

 return (
  <div className="grid grid-cols-12 gap-4 h-screen w-full">
   <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
    <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">Users</h2>
    <div>
     <Table>
      <TableHeader>
       <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
        <TableHead className="w-[100px] py-4">ID</TableHead>
        <TableHead className="py-4">User Name</TableHead>
        <TableHead className="py-4">Company Name</TableHead>
        <TableHead className="py-4">Emai Id</TableHead>
        <TableHead className="py-4">Gender</TableHead>
        <TableHead className="text-right py-4">Action</TableHead>
       </TableRow>
      </TableHeader>
      <TableBody>
       {currentInvoices.map((invoice) => (
        <TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
         <TableCell className="py-4">{invoice.Id}</TableCell>
         <TableCell className="py-4">{invoice.UserName}</TableCell>
         <TableCell className="py-4">{invoice.CompanyName}</TableCell>
         <TableCell className="py-4">{invoice.email}</TableCell>
         <TableCell className="py-4">{invoice.gender}</TableCell>
         <TableCell className="text-right py-4">
        <Button className="px-3 !py-0 w-16 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight" onClick={() => handleViewClick(invoice.Id)}>
           View
          </Button>
         </TableCell>
        </TableRow>
       ))}
      </TableBody>
     </Table>
     {/* Pagination Controls */}
     <div className="flex justify-end items-center gap-2 mt-4 ">
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
 );
};

export default Page;
