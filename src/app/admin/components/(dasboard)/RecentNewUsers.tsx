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
    DueDate: string;
    Action: string;
    email: string;
}

const invoices: Invoice[] = [
    { Id: "#0032", NameCustomer: "Rakesh Choudhary",  CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
    { Id: "#0033", NameCustomer: "Rakesh Choudhary", CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
    { Id: "#0034", NameCustomer: "Rakesh Choudhary", CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
    { Id: "#0035", NameCustomer: "Rakesh Choudhary", CompanyName: "Acme Corporation", email:"rakeshchoudhary123@gmail.com", DueDate: "08/01/2025", Action: "View" },
    { Id: "#0036", NameCustomer: "Rakesh Choudhary", CompanyName: "Beta Ltd.", email:"rakeshchoudhary123@gmail.com", DueDate: "09/01/2025", Action: "View" },
    { Id: "#0037", NameCustomer: "Rakesh Choudhary", CompanyName: "Gamma Inc.", email:"rakeshchoudhary123@gmail.com", DueDate: "10/01/2025", Action: "View" },
    { Id: "#0038", NameCustomer: "Rakesh Choudhary", CompanyName: "Delta LLC", email:"rakeshchoudhary123@gmail.com", DueDate: "11/01/2025", Action: "View" },
];

const PAGE_SIZE = 20;

const RecentNewUsers = () => {
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
        router.push(`/invoice/${id}`);
    };

    return (
        <div>
                <Table>
                    <TableHeader>
                        <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                            <TableHead className="w-[100px] py-4">Id</TableHead>
                            <TableHead className="py-4">Name of Customer</TableHead>
                            <TableHead className="py-4">Company Name</TableHead>
                            <TableHead className="py-4">Emai Id</TableHead>
                            <TableHead className="py-4">Register Date</TableHead>
                            <TableHead className="text-right py-4">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentInvoices.map((invoice) => (
                            <TableRow key={invoice.Id} className="border-0 text-sm font-normal hover:bg-transparent">
                                <TableCell className="py-4">{invoice.Id}</TableCell>
                                <TableCell className="py-4">{invoice.NameCustomer}</TableCell>
                                <TableCell className="py-4">{invoice.CompanyName}</TableCell>
                                <TableCell className="py-4">{invoice.email}</TableCell>
                    
                                <TableCell className="py-4">{invoice.DueDate}</TableCell>
                                <TableCell className="text-right py-4">
                                    <Button 
                                        className="px-3 !py-0 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                                        onClick={() => handleViewClick(invoice.Id)}
                                    >
                                        {invoice.Action}
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
    );
};

export default RecentNewUsers;