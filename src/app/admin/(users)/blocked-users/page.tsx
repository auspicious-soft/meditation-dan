"use client"
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
    gender: string;
    email: string;
}

const invoices: Invoice[] = [
    { Id: "1", NameCustomer: "Rakesh Choudhary",  CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", gender: "male"  },
    { Id: "2", NameCustomer: "Rakesh Choudhary", CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", gender: "male"  },
    { Id: "3", NameCustomer: "Rakesh Choudhary", CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", gender: "male"  },
    { Id: "4", NameCustomer: "Rakesh Choudhary", CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", gender: "male",  },
    { Id: "5", NameCustomer: "Rakesh Choudhary", CompanyName: "Beta Ltd.", email:"rakeshchoudhary123@gmail.com", gender: "male"  },
    { Id: "6", NameCustomer: "Rakesh Choudhary", CompanyName: "Gamma Inc.", email:"rakeshchoudhary123@gmail.com", gender: "male"  },
    { Id: "7", NameCustomer: "Rakesh Choudhary", CompanyName: "Delta LLC", email:"rakeshchoudhary123@gmail.com", gender: "male"  },
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
            router.push(`/admin/blocked-users/user-detail/${id}`);
        };
    
    return (
        <div className="grid grid-cols-12 gap-4 h-screen w-full">
        <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
          User Lists
          </h2>
          <div>
                <Table>
                    <TableHeader>
                        <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                            <TableHead className="w-[100px] py-4">Id</TableHead>
                            <TableHead className="py-4">Name of Customer</TableHead>
                            <TableHead className="py-4">Company Name</TableHead>
                            <TableHead className="py-4">Gender</TableHead>
                            <TableHead className="py-4">Emai Id</TableHead>
                            <TableHead className="text-right py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentInvoices.map((invoice) => (
                            <TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
                                <TableCell className="py-4">{invoice.Id}</TableCell>
                                <TableCell className="py-4">{invoice.NameCustomer}</TableCell>
                                <TableCell className="py-4">{invoice.CompanyName}</TableCell>
                                <TableCell className="py-4">{invoice.gender}</TableCell>
                                <TableCell className="py-4">{invoice.email}</TableCell>                    
                                <TableCell className="text-right py-4">
                                    <Button 
                                        className="px-3 !py-0 w-16 h-6 hover:cursor-pointer !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                                        onClick={() => handleViewClick(invoice.Id)}
                                    >
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
                <span className="text-white text-sm">Page {currentPage} of {totalPages}</span>
                <Button className="bg-[#0B132B]" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </Button>
            </div>
        </div>
        </div>
      </div>
    );
}

export default Page;
