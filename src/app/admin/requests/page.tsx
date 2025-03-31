"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface Invoice {
 Id: string;
 CompanyName: string;
 email: string;
}

const invoices: Invoice[] = [
 { Id: "#0032", CompanyName: "Acme Corporation", email: "rakeshchoudhary123@gmail.com" },
 { Id: "#0033", CompanyName: "Acme Corporation", email: "rakeshchoudhary123@gmail.com" },
 { Id: "#0034", CompanyName: "Acme Corporation", email: "rakeshchoudhary123@gmail.com"},
 { Id: "#0035", CompanyName: "Acme Corporation", email: "rakeshchoudhary123@gmail.com" },
 { Id: "#0036", CompanyName: "Beta Ltd.", email: "rakeshchoudhary123@gmail.com" },
 { Id: "#0037", CompanyName: "Gamma Inc.", email: "rakeshchoudhary123@gmail.com" },
 { Id: "#0038", CompanyName: "Delta LLC", email: "rakeshchoudhary123@gmail.com" },
 { Id: "#0039", CompanyName: "Beta Ltd.", email: "rakeshchoudhary123@gmail.com" },
 { Id: "#0040", CompanyName: "Gamma Inc.", email: "rakeshchoudhary123@gmail.com" },
];

const PAGE_SIZE = 20;

const Page = () => {
 const router = useRouter();
 const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
 

 const indexOfLastInvoice = currentPage * PAGE_SIZE;
 const indexOfFirstInvoice = indexOfLastInvoice - PAGE_SIZE;
 const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
 const totalPages = Math.ceil(invoices.length / PAGE_SIZE);

 const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= totalPages) {
   setCurrentPage(newPage);
  }
 };

 const handleDeleteAccount = () => {
  // Add confirmation dialog here
  console.log("Delete account requested");
 };

 const handleViewClick = (id: string) => {
  router.push(`/admin/requests/company-request`);
 };

 return (

 <div className="grid grid-cols-12 gap-4 h-screen w-full  sm:p-6 md:p-8">
  <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
    <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-3">Users</h2>
    <div className="overflow-x-auto ">
      <Table>
        <TableHeader>
          <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
            <TableHead className="py-4">ID</TableHead>
            <TableHead className="py-4">Company Name</TableHead>
            <TableHead className="py-4">Email ID</TableHead>
            <TableHead className="text-right py-4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentInvoices.map((invoice) => (

<TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
  <TableCell className="py-4 w-1/4">{invoice.Id}</TableCell>
  <TableCell className="py-4 w-1/4 whitespace-nowrap overflow-hidden overflow-ellipsis">{invoice.CompanyName}</TableCell>
  <TableCell className="py-4 w-1/4 whitespace-nowrap overflow-hidden overflow-ellipsis">{invoice.email}</TableCell>
  <TableCell className="text-right py-4 w-1/4 whitespace-nowrap min-w-[120px]">
    <div className="flex gap-x-2 justify-end">
      <Button className="bg-[#14AB00]">
        <Image src="/GreenTick.svg" alt="Check" width={20} height={20} />
      </Button>
      <Button onClick={() => setIsDialogOpen(true)} className="bg-[#FF4747]">
        <Image src="/Cross.svg" alt="Cross" width={20} height={20} />
      </Button>
    </div>

    <Dialog open={!!isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="bg-[#141B2D] border-[#1F2937] w-full max-w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
        <DialogHeader className="text-center ">
          <div className="flex justify-center mb-4">
            <Image src="/error.svg" alt="error" width={20} height={20} />
          </div>
          <DialogTitle className="text-lg font-semibold text-center">Delete ?</DialogTitle>
          <DialogDescription className="text-sm text-gray-400">Are you sure you want to delete this? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-4 mt-4">
          <Button variant="outline" className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] w-32 sm:w-44 h-10 sm:h-11" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="w-32 sm:w-44 h-10 sm:h-11" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </TableCell>
</TableRow>

          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
        <Button className="bg-[#0B132B]" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <span className="text-white text-sm">Page {currentPage} of {totalPages}</span>
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
