"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invoice {
  Id: string;
  CompanyName: string;
  NameCustomer: string;
  plan: string;
  registrationdate: string;
  expirydate: string;
  email: string;
}

const invoices: Invoice[] = [
  {
    Id: "1",
    CompanyName: "Acme Corporation",
    NameCustomer: "John Doe",
    email: "rakeshchoudhary123@gmail.com",
    plan: "monthly",
    registrationdate: "08/01/2025",
    expirydate: "08/01/2025",
  },
  {
    Id: "2",
    CompanyName: "Acme Corporation",
    NameCustomer: "Jane Smith",
    email: "rakeshchoudhary123@gmail.com",
    plan: "monthly",
    registrationdate: "08/01/2025",
    expirydate: "08/01/2025",
  },
  {
    Id: "3",
    CompanyName: "Acme Corporation",
    NameCustomer: "Alice Johnson",
    email: "rakeshchoudhary123@gmail.com",
    plan: "monthly",
    registrationdate: "08/01/2025",
    expirydate: "08/01/2025",
  },
  {
    Id: "4",
    CompanyName: "Acme Corporation",
    NameCustomer: "Bob Brown",
    email: "rakeshchoudhary123@gmail.com",
    plan: "monthly",
    registrationdate: "08/01/2025",
    expirydate: "08/01/2025",
  },
  {
    Id: "5",
    CompanyName: "Beta Ltd.",
    NameCustomer: "Charlie Davis",
    email: "rakeshchoudhary123@gmail.com",
    plan: "monthly",
    registrationdate: "08/01/2025",
    expirydate: "08/01/2025",
  },
  {
    Id: "6",
    CompanyName: "Gamma Inc.",
    NameCustomer: "Diana Evans",
    email: "rakeshchoudhary123@gmail.com",
    plan: "monthly",
    registrationdate: "08/01/2025",
    expirydate: "08/01/2025",
  },
  {
    Id: "7",
    CompanyName: "Delta LLC",
    NameCustomer: "Ethan Foster",
    email: "rakeshchoudhary123@gmail.com",
    plan: "monthly",
    registrationdate: "08/01/2025",
    expirydate: "08/01/2025",
  },
];

const PAGE_SIZE = 20;

const RecentNewUsers = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const indexOfLastInvoice = currentPage * PAGE_SIZE;
  const indexOfFirstInvoice = indexOfLastInvoice - PAGE_SIZE;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(invoices.length / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewClick = (id: string) => {
    router.push(`/invoice/${id}`);
  };

  return (
    <div className="grid grid-cols-12 gap-4 w-full">
      <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <div className="flex items-center justify-between flex-wrap mb-0">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
            Company Lists
          </h2>
          <Button className="px-3 !py-0 h-8 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
          onClick={() => router.push('/admin/add-company')}
          >
            + Add New Company
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
              <TableHead className="w-[100px] py-4">Company Name</TableHead>
              <TableHead className="py-4">Email Id</TableHead>
              <TableHead className="py-4">Plan</TableHead>
              <TableHead className="py-4">Register Date</TableHead>
              <TableHead className="py-4">Expiry Date</TableHead>
              <TableHead className="text-right py-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentInvoices.map((invoice) => (
              <TableRow
                key={invoice.Id}
                className="border-0 text-sm font-normal hover:bg-transparent"
              >
                <TableCell className="py-4">{invoice.CompanyName}</TableCell>
                <TableCell className="py-4">{invoice.email}</TableCell>
                <TableCell className="py-4">{invoice.plan}</TableCell>
                <TableCell className="py-4">
                  {invoice.registrationdate}
                </TableCell>

                <TableCell className="py-4">{invoice.expirydate}</TableCell>
                <TableCell className="text-right py-4">
                  <Button
                    className="px-3 !py-0 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                    onClick={() => handleViewClick(invoice.Id)}
                  >
                    view
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Controls */}
        <div className="flex justify-end items-center gap-2 mt-4 ">
          <Button
            className="bg-[#0B132B]"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-white text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            className="bg-[#0B132B]"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecentNewUsers;
