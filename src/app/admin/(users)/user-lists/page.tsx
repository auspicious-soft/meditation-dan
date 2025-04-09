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
import { getAllUsers } from "@/services/admin-services";
import { Loader2 } from "lucide-react"; // Import Loader2 for loading state
import SearchBar from "@/components/ui/SearchBar";

const PAGE_SIZE = 10;

const fetcher = (url: string) => getAllUsers(url);

interface User {
  _id: string;
  identifier: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  gender: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  data: User[];
  total: number;
  page: number;
  limit: number;
  statusCode: number;
  message?: string;
}

const SkeletonRow = () => (
  <TableRow className="border-none">
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-24"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-32"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-28"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-40"></div>
    </TableCell>
    <TableCell>
      <div className="h-8 bg-gray-700 rounded animate-pulse w-16"></div>
    </TableCell>
  </TableRow>
);

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null); // State to track loading for View action
  const [searchTerm, setSearchTerm] = useState<string>(""); // Single search term

  // Fetch data using SWR with search term, page, and limit in the URL
  const { data, error, isLoading } = useSWR(
    `/admin/get-all-users?description=${searchTerm}&page=${currentPage}&limit=${PAGE_SIZE}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  // Extract users and pagination data from the API response
  const users = data?.data?.data || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewClick = (id: string) => {
    setViewingUserId(id); // Set loading state for this user
    // Simulate an async operation (e.g., fetching data before navigation)
    setTimeout(() => {
      router.push(`/admin/user-lists/user-profile-edit/${id}`);
      setViewingUserId(null); // Reset loading state after navigation
    }, 500); // Adjust delay as needed (e.g., if you add an async call)
  };

  if (error) {
    console.error("Error fetching users:", error);
    return <div className="text-white">Error loading users.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-4 h-screen w-full">
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <div className="flex items-center justify-between flex-wrap space-y-2 mb-4">
            <h2 className="text-white text-[20px] md:text-2xl font-bold">User Lists</h2>
            <SearchBar setQuery={setSearchTerm} query={searchTerm} />
          </div>
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
              {isLoading ? (
                // Render skeleton rows while loading
                Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <SkeletonRow key={index} />
                ))
              ) : users.length === 0 && searchTerm.trim() ? (
                // Specific message for no data with search query
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-white">
                    No users found for this search query.
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                // General no data message
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-white">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                // Render actual user data when loaded
                users.map((user: User) => (
                  <TableRow key={user._id} className="border-none">
                    <TableCell>{user.identifier}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.companyName || "N/A"}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewClick(user._id)}
                        className="cursor-pointer !bg-[#1a3f70] flex items-center justify-center"
                        disabled={viewingUserId === user._id}
                      >
                        {viewingUserId === user._id ? (
                          <Loader2 size={20} className="animate-spin text-white" />
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

          {!isLoading && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                className="bg-[#0B132B] hover:cursor-pointer"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-white text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                className="bg-[#0B132B] hover:cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;