"use client";
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
import { getBlockedUsers } from "@/services/admin-services";
import { Loader2 } from "lucide-react"; // Import Loader2 for loading state

interface Invoice {
  Id: string;
  NameCustomer: string;
  CompanyName: string;
  gender: string;
  email: string;
}

const PAGE_SIZE = 20;

const fetcher = async (route: string) => {
  const response = await getBlockedUsers(route);
  return response.data;
};

// Skeleton Row Component
const SkeletonRow = () => (
  <TableRow className="border-0 hover:bg-transparent">
    <TableCell className="py-4">
      <div className="h-4 bg-gray-600 rounded w-20 animate-pulse"></div>
    </TableCell>
    <TableCell className="py-4">
      <div className="h-4 bg-gray-600 rounded w-32 animate-pulse"></div>
    </TableCell>
    <TableCell className="py-4">
      <div className="h-4 bg-gray-600 rounded w-28 animate-pulse"></div>
    </TableCell>
    <TableCell className="py-4">
      <div className="h-4 bg-gray-600 rounded w-16 animate-pulse"></div>
    </TableCell>
    <TableCell className="py-4">
      <div className="h-4 bg-gray-600 rounded w-40 animate-pulse"></div>
    </TableCell>
    <TableCell className="py-4">
      <div className="h-6 bg-gray-600 rounded w-16 ml-auto animate-pulse"></div>
    </TableCell>
  </TableRow>
);

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null); // State to track loading for View action

  const { data, error, isLoading } = useSWR(
    `/admin/users/blocked?page=${currentPage}&limit=${PAGE_SIZE}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  const totalCount = data?.total || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewClick = (id: string) => {
    setViewingUserId(id); // Set loading state for this user
    // Simulate an async operation (e.g., fetching data before navigation)
    setTimeout(() => {
      router.push(`/admin/blocked-users/user-detail/${id}`);
      setViewingUserId(null); // Reset loading state after navigation
    }, 500); // Adjust delay as needed (e.g., if you add an async call)
  };

  if (error) {
    return <div className="text-white">Error loading users: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
          Blocked User Lists
        </h2>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                <TableHead className="w-[100px] py-4">Id</TableHead>
                <TableHead className="py-4">Name of Customer</TableHead>
                <TableHead className="py-4">Company Name</TableHead>
                <TableHead className="py-4">Gender</TableHead>
                <TableHead className="py-4">Email Id</TableHead>
                <TableHead className="text-right py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Show 5 skeleton rows while loading
                Array(5)
                  .fill(0)
                  .map((_, index) => <SkeletonRow key={index} />)
              ) : !data?.data?.users?.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-white text-center py-4">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                data.data.users.map((invoice: any, index: number) => (
                  <TableRow
                    key={invoice._id ? `user-${invoice._id}` : `index-${index}`}
                    className="border-0 text-sm font-normal hover:bg-transparent"
                  >
                    <TableCell className="py-4">{invoice.identifier}</TableCell>
                    <TableCell className="py-4">{`${invoice.firstName} ${invoice.lastName}`}</TableCell>
                    <TableCell className="py-4">{invoice.companyName}</TableCell>
                    <TableCell className="py-4">{invoice.gender}</TableCell>
                    <TableCell className="py-4">{invoice.email}</TableCell>
                    <TableCell className="text-right py-4">
                      <Button
                        className="px-3 !py-0 w-16 h-6 hover:cursor-pointer !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                        onClick={() => handleViewClick(invoice._id)}
                        disabled={viewingUserId === invoice._id}
                      >
                        {viewingUserId === invoice._id ? (
                          <Loader2 size={16} className="animate-spin text-white" />
                        ) : (
                          "View"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {!isLoading && data?.data?.users?.length > 0 && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                className="bg-[#0B132B] hover:cursor-pointer"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-white text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                className="bg-[#0B132B] hover:cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;