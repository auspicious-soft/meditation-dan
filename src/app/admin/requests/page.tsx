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
import { AlertCircle, Loader2 } from "lucide-react"; // Import Loader2 for the loading state
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null); // State for approval loading
  const [denialReason, setDenialReason] = useState(""); // State for denial reason
  const [isDenying, setIsDenying] = useState(false); // New state for denial loading

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
      const payload = { status: "approve" };
      const response = await updateCompanyJoinRequest(`/admin/company-join-requests/${requestId}`, payload);
      if (response.data.success) {
        toast.success("Request approved successfully");
        await fetchRequests(); // Refetch to update UI
      } else {
        toast.error("Failed to approve request: " + (response.data.message || "Unknown error"));
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
    setIsDenying(true); // Set loading state for denial
    try {
      const payload = { status: "deny", description: "Request denied by admin" };
      const response = await updateCompanyJoinRequest(`/admin/company-join-requests/${selectedRequestId}`, payload);
      if (response.data.success) {
        toast.success("Request denied successfully");
        setIsDialogOpen(false);
        setSelectedRequestId(null);
        setDenialReason(""); // Reset denial reason
        await fetchRequests(); // Refetch to update UI
      } else {
        toast.error("Failed to deny request: " + (response.data.message || "Unknown error"));
      }
    } catch (error: any) {
      console.error("Error denying request:", error);
      if (typeof error === "object" && error !== null && "response" in error && (error as any).response?.data?.message) {
        toast.error((error as any).response.data.message);
      } else {
        toast.error("Failed to deny request");
      }
    } finally {
      setIsDenying(false); // Reset loading state
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
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-3">Company</h2>
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
          <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[60%] p-6 flex flex-col items-center text-white rounded-lg">
            <DialogHeader className="flex flex-col items-center w-full">
              <div className="p-3 bg-[#FEF3F2] rounded-full">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <DialogTitle className="text-lg font-semibold text-center">Decline ?</DialogTitle>
              {/* <div className="w-full">
                <Label>Reason to decline</Label>
                <Textarea
                  className="mt-4 w-full bg-[#0B132B] border-none rounded-lg p-2 text-white resize-none"
                  placeholder=""
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                />
              </div> */}
            </DialogHeader>
            <DialogFooter className="flex justify-center w-full gap-4 mt-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  variant="outline"
                  className="bg-[#1A3F70] cursor-pointer hover:text-white border-[#0c4a6e] hover:bg-[#1A3F70] w-full sm:max-w-52 h-10 sm:h-11"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setSelectedRequestId(null);
                    setDenialReason(""); // Reset denial reason on cancel
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="w-full sm:max-w-52 hover:cursor-pointer h-10 sm:h-11"
                  onClick={handleDeny}
                  // disabled={!denialReason.trim() || isDenying} // Disable if reason is empty or denying
                >
                  {isDenying ? (
                    <Loader2 size={20} className="animate-spin text-white" />
                  ) : (
                    "Decline"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SkeletonTheme>
  );
};

export default Page;