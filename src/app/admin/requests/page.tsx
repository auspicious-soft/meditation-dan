"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Import CSS for skeleton
import { getCompanyJoinRequest, updateCompanyJoinRequest } from "@/services/admin-services";
import { Loader2 } from "lucide-react"; // Import Loader2 for the loading state

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
}

const PAGE_SIZE = 10;

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [requests, setRequests] = useState<CompanyJoinRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null); // New state for approval loading

  // Fetch company join requests on mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getCompanyJoinRequest("/admin/company-join-requests");
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
  const handleApprove = async (requestId: string) => {
    setApprovingRequestId(requestId); // Set loading state for this request
    try {
      const response = await updateCompanyJoinRequest(
        `/admin/company-join-requests/${requestId}?status=approve`
      );
      if (response.data.success) {
        toast.success("Request approved successfully");
        await fetchRequests(); // Refetch to update UI
      } else {
        toast.error("Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    } finally {
      setApprovingRequestId(null); // Reset loading state
    }
  };

  // Handle denial
  const handleDeny = async () => {
    if (!selectedRequestId) return;
    try {
      const response = await updateCompanyJoinRequest(
        `/admin/company-join-requests/${selectedRequestId}?status=deny`
      );
      if (response.data.success) {
        toast.success("Request denied successfully");
        setIsDialogOpen(false);
        setSelectedRequestId(null);
        await fetchRequests(); // Refetch to update UI
      } else {
        toast.error("Failed to deny request");
      }
    } catch (error: any) {
      if (typeof error === "object" && error !== null && "response" in error && (error as any).response?.data?.message) {
        toast.error((error as any).response.data.message);
      } else {
        toast.error("Failed to deny request");
      }
    }
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
        <div className="grid grid-cols-12 gap-4 h-screen">
          <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
            <Skeleton height={28} width={200} />
            <div className="overflow-x-auto">
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
      <div className="grid grid-cols-12 gap-4 h-screen">
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-3">Users</h2>
          <div className="overflow-x-auto">
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
                {currentRequests.length > 0 ? (
                  currentRequests.map((request) => (
                    <TableRow key={request._id} className="border-0 text-sm font-normal hover:bg-transparent">
                      <TableCell className="py-4 w-1/4">{request.companyId?.identifier || "N/A"}</TableCell>
                      <TableCell className="py-4 w-1/4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {request.companyId?.companyName || "N/A"}
                      </TableCell>
                      <TableCell className="py-4 w-1/4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {request.companyId?.email || "N/A"}
                      </TableCell>
                      <TableCell className="text-right py-4 w-1/4 whitespace-nowrap min-w-[120px]">
                        <div className="flex gap-x-2 justify-end">
                          <Button
                            className="bg-[#14AB00] hover:bg-[#14AB00] hover:cursor-pointer flex items-center justify-center"
                            onClick={() => request.companyId?._id && handleApprove(request.companyId._id)}
                            disabled={request.status !== "Pending" || approvingRequestId === request.companyId?._id}
                          >
                            {approvingRequestId === request.companyId?._id ? (
                              <Loader2 size={20} className="animate-spin text-white" />
                            ) : (
                              <Image src="/GreenTick.svg" alt="Check" width={20} height={20} />
                            )}
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedRequestId(request.companyId?._id ?? null);
                              setIsDialogOpen(true);
                            }}
                            className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer flex items-center justify-center"
                            disabled={request.status !== "Pending"}
                          >
                            <Image src="/Cross.svg" alt="Cross" width={20} height={20} />
                          </Button>
                        </div>
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#141B2D] border-[#1F2937] w-full max-w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image src="/error.svg" alt="error" width={20} height={20} />
              </div>
              <DialogTitle className="text-lg font-semibold text-center">Delete ?</DialogTitle>
              <DialogDescription className="text-sm text-gray-400">
                Are you sure you want to deny this request? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-4 mt-4">
              <Button
                variant="outline"
                className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] w-32 sm:w-44 h-10 sm:h-11"
                onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedRequestId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="w-32 sm:w-44 hover:cursor-pointer h-10 sm:h-11"
                onClick={handleDeny}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SkeletonTheme>
  );
};

export default Page;