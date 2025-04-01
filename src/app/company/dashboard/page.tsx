"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getCompanyDashboard } from "@/services/company-services";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const RecentNewUsers = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch data using SWR with pagination parameters
  const { data, error, isLoading, mutate } = useSWR(
    `/company/dashboard?page=${currentPage}&limit=5`,
    getCompanyDashboard,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  // Extract recentUsers and pagination data from the API response
  const recentUsers = data?.data?.data?.recentUsers || [];
  const transactions = data?.data?.data?.transactions || [];
  const pagination = data?.data?.data?.pagination || { limit: 5, page: 1, totalUsers: 0 };

  // Use pagination data from the API
  const totalUsers = pagination.totalUsers;
  const totalPages = Math.ceil(totalUsers / pagination.limit);

  const handleViewClick = (id:string) => {
    router.push(`/company/users/details/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-4"></div>

      <h1 className="text-2xl font-bold block md:hidden">Dashboard</h1>

      <div className="flex flex-1 flex-col gap-4">
        {/* Recent Payments Section */}
        <div className="px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-[20px]">
          <div className="mb-[29px] justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
            Recent Payments
          </div>
          <div className="w-full rounded-none overflow-hidden">
            <div className="w-full overflow-auto h-[210px] scroll-container">
              <Table className="min-w-[500px] scrollbar-thin scroll-container">
                <TableHeader>
                  <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                    <TableHead className="w-[150px] py-4">ID</TableHead>
                    <TableHead className="text-center py-4">Purchase Date</TableHead>
                    <TableHead className="text-center py-4">Plan</TableHead>
                    <TableHead className="text-right py-4">Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(null).map((_, index) => (
                      <TableRow key={index} className="border-0">
                        <TableCell className="py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={100} />
                          </SkeletonTheme>
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={80} />
                          </SkeletonTheme>
                        </TableCell>
                        <TableCell className="text-center py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={60} />
                          </SkeletonTheme>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={50} />
                          </SkeletonTheme>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((invoice: any) => (
                      <TableRow key={invoice.id} className="border-0 text-sm font-normal hover:bg-transparent">
                        <TableCell className="py-4">{invoice.id}</TableCell>
                        <TableCell className="text-center py-4">
                          {new Date(invoice.purchaseDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center py-4">{invoice.planName}</TableCell>
                        <TableCell className="text-right py-4">${invoice.price}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Recent New Users Section */}
        <div className="mt-[10px] px-[36px] py-[30px] h-auto bg-[#1B2236] rounded-tl-[20px] rounded-tr-[20px]">
          <div className="justify-center text-white text-2xl font-bold font-['SF_Pro_Display'] leading-loose">
            Recent New Users
          </div>
          <div className="w-full rounded-none overflow-hidden">
            <div className="w-full overflow-auto h-[300px] scroll-container">
              <Table className="min-w-[500px] scrollbar-thin scroll-container">
                <TableHeader>
                  <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                    <TableHead className="w-[100px] py-4">ID</TableHead>
                    <TableHead className="py-4">Name of Customer</TableHead>
                    <TableHead className="py-4">Email Id</TableHead>
                    <TableHead className="py-4">Register Date</TableHead>
                    <TableHead className="text-right py-4">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(null).map((_, index) => (
                      <TableRow key={index} className="border-0">
                        <TableCell className="py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={80} />
                          </SkeletonTheme>
                        </TableCell>
                        <TableCell className="py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={120} />
                          </SkeletonTheme>
                        </TableCell>
                        <TableCell className="py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={150} />
                          </SkeletonTheme>
                        </TableCell>
                        <TableCell className="py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={80} />
                          </SkeletonTheme>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                            <Skeleton height={10} width={40} />
                          </SkeletonTheme>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : recentUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentUsers.map((user: any) => (
                      <TableRow key={user.identifier} className="border-0 text-sm font-normal hover:bg-transparent">
                        <TableCell className="py-4">{user.identifier}</TableCell>
                        <TableCell className="py-4">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="py-4">{user.email}</TableCell>
                        <TableCell className="py-4">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Button
                            className="px-3 !py-0 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                            onClick={() => handleViewClick(user._id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              className="bg-[#0B132B]"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="text-white text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              className="bg-[#0B132B]"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentNewUsers;