"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { getAllUsers } from "@/services/admin-services";

const PAGE_SIZE = 10;

const fetcher = (url: string) => getAllUsers(url);

// Define the User type
interface User {
    _id: string;
    identifier: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    gender: string;
    email: string;
}

const Page = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data, error, isLoading, mutate } = useSWR('/admin/get-all-users', fetcher, {
        revalidateOnFocus: false,
        refreshInterval: 0
    });


    console.log("Fetched Users:", data);

    const users = data?.data && Array.isArray(data?.data?.data) ? data?.data?.data : [];
    console.log('users: ', users);
    const indexOfLastUser = currentPage * PAGE_SIZE;
    const indexOfFirstUser = indexOfLastUser - PAGE_SIZE;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleViewClick = (id: string) => {
        router.push(`/admin/user-lists/user-profile-edit/${id}`);
    };


    // const refreshData = () => {
    //     mutate();
    // };

    if (isLoading) {
        return <div className="text-white">Loading users...</div>;
    }

    if (error) {
        console.error("Error fetching users:", error);
        return <div className="text-white">Error loading users.</div>;
    }

    return (

<>
        <div className="grid grid-cols-12 gap-4 h-screen w-full">
    <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
            User Lists
        </h2>
        {/* <Button 
            className="bg-[#1a3f70] text-white px-4 py-2 rounded-md" 
            onClick={refreshData}
        >
            Refresh Data
        </Button> */}
        <Table className="border-separate border-spacing-0">

<TableHeader className="border-b border-white">
    <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
        <TableHead>ID</TableHead>
        <TableHead>Name of Customer</TableHead>
        <TableHead>Company Name</TableHead>
        <TableHead>Gender</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Action</TableHead>
    </TableRow>
    <tr>
        <td colSpan={6}>
            <hr className="border-[#666666]" />
        </td>
    </tr>
</TableHeader>

            <TableBody>
              
                {currentUsers.map((user: User) => (
                    <TableRow key={user._id} className="border-none">
                        <TableCell>{user.identifier}</TableCell>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.companyName || "N/A"}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <Button onClick={() => handleViewClick(user._id)} className="cursor-pointer !bg-[#1a3f70]">View</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

        {/* Pagination Controls */}

<div className="flex justify-end items-center gap-2 mt-4">
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



</>
);
};

export default Page;







