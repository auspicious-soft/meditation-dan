"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllUsers } from "@/services/company-services";
import useSWR from "swr";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import skeleton CSS
import SearchBar from "@/components/ui/SearchBar";

const PAGE_SIZE = 5; // Number of users per page (we'll override the API's limit)

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchParams, setsearchParams] = useState("");

  // Fetch data using SWR with pagination parameters
  const { data, error, isLoading, mutate } = useSWR(
    `/company/users?description=${searchParams}&page=${currentPage}&limit=${PAGE_SIZE}`, // Override the API's default limit
    getAllUsers,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );
  console.log('data: ', data);

  // Log data for debugging (remove in production)

  // Extract users and pagination data from the API response
  const users = data?.data?.data?.users || [];
  const pagination = data?.data?.data || { limit: PAGE_SIZE, page: 1, totalUsers: 0 };

  // Use pagination data from the API
  const totalUsers = pagination.totalUsers;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optionally, scroll to the top of the table after page change
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleViewClick = (userId: string) => {
    router.push(`/company/users/details/${userId}`); // Navigate to user details with ID
  };

  const handleAddUserClick = () => {
    router.push(`/company/users/add-user`);
  };

  // Helper to safely format date or return a fallback
  const formatDate = (date: string | undefined) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
      <div className="col-span-12 space-y-6 bg-[#1B2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <div className="flex justify-between">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">User Lists</h2>

          <div className="flex gap-[10px]">
          <div
            className="px-5 py-2 bg-[#1A3F70] rounded-[20px] inline-flex justify-center items-center gap-2.5 hover:cursor-pointer"
            onClick={handleAddUserClick}
          >
            <div className="text-center justify-start text-white text-sm font-normal">+ Add New User</div>
          </div>
          <SearchBar setQuery={setsearchParams} query={searchParams} />
          </div>
        </div>

        <div>
          <Table>
            <TableHeader>
              <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                <TableHead className="w-[100px] py-4">ID</TableHead>
                <TableHead className="py-4">User Name</TableHead>
                <TableHead className="py-4">Email Id</TableHead>
                {/* <TableHead className="py-4">Birthday</TableHead> */}
                <TableHead className="text-right py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(PAGE_SIZE).fill(null).map((_, index) => (
                  <TableRow key={index} className="border-0">
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={16} width={80} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={16} width={120} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={16} width={150} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={16} width={80} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={16} width={60} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={24} width={60} />
                      </SkeletonTheme>
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-white">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: any) => (
                  <TableRow key={user.identifier} className="border-0 text-sm font-normal hover:bg-transparent">
                    <TableCell className="py-4">{user.identifier}</TableCell>
                    <TableCell className="py-4">{user.firstName} {user.lastName}</TableCell>
                    <TableCell className="py-4">{user.email}</TableCell>
                    {/* <TableCell className="py-4">{formatDate(user.dob)}</TableCell> */}
                    <TableCell className="text-right py-4">
                      <Button
                        className="px-3 !py-0 w-16 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight hover:cursor-pointer"
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

          {/* Pagination Controls */}
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
        </div>
      </div>
    </div>
  );
};

export default Page;