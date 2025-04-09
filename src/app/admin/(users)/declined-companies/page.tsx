"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import CSS for skeleton
import { getCompanyJoinRequest, updateCompanyJoinRequest } from "@/services/admin-services";

// Define interface for company join request based on backend response
interface CompanyJoinRequest {
  _id: string;
  identifier: string;
  companyId: {
    _id: string;
    companyName: string;
    email: string;
    identifier?: string; // Add optional identifier property
  } | null;
  status: string;
  description: string;
}

const PAGE_SIZE = 10;

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requests, setRequests] = useState<CompanyJoinRequest[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch company join requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getCompanyJoinRequest("/admin/rejected/company-join-requests");
      console.log('response:', response);
      if (response.data.success) {
        setRequests(response.data.data);
      } else {
        toast.error("Failed to fetch company join requests");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch company join requests");
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastInvoice = currentPage * PAGE_SIZE;
  const indexOfFirstInvoice = indexOfLastInvoice - PAGE_SIZE;
  const currentRequests = requests.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(requests.length / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle approval

  // Handle denial


  // Loading state with skeleton
  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
        <div className="grid grid-cols-12 gap-4 ">
          <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
            <Skeleton height={28} width={200} />
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                    <TableHead className="py-4">ID</TableHead>
                    <TableHead className="py-4">Company Name</TableHead>
                    <TableHead className="py-4">Reason To Decline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index} className="border-0">
                      <TableCell className="py-4 w-1/4"><Skeleton height={20} /></TableCell>
                      <TableCell className="py-4 w-1/4"><Skeleton height={20} /></TableCell>
                      <TableCell className="py-4 w-1/4"><Skeleton height={20} /></TableCell>
                      <TableCell className="text-right py-4 w-1/4 whitespace-nowrap min-w-[120px]">
                        <div className="flex gap-x-2 justify-end">
                          <Skeleton height={36} width={36} />
                          <Skeleton height={36} width={36} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-3">Company</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                  <TableHead className="py-4">ID</TableHead>
                  <TableHead className="py-4">Company Name</TableHead>
                  <TableHead className="py-4">Reason To Decline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRequests.length > 0 ? (
                  currentRequests.map((request) => (
                    <TableRow key={request._id} className="border-0 text-sm font-normal hover:bg-transparent">
                      <TableCell className="py-4 w-1/4">{request.companyId?.identifier || "N/A"}</TableCell>
                      <TableCell className="py-4 w-1/4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {request.companyId?.companyName || "N/A"}
                      </TableCell>
                      <TableCell className="py-4 w-1/4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {request.description || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <p className="text-white text-center">No requests found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mt-4">
              <Button
                className="bg-[#0B132B]"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-white text-sm">Page {currentPage} of {totalPages}</span>
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

        {/* Denial Confirmation Dialog */}
       
      </div>
    </SkeletonTheme>
  );
};

export default Page;