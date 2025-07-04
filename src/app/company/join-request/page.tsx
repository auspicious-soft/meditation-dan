"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useSWR from "swr";
import { getAllPendingJoinRequests, getApproveOrDeclinePendingJoinRequest } from "@/services/company-services";
import { toast } from "sonner";
import SearchBar from "@/components/ui/SearchBar";
import { useState } from "react";
import { Loader2 } from "lucide-react"; // Add this import
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState<string | null>(null); // Track loading for approve
  const [loadingDeny, setLoadingDeny] = useState<string | null>(null); // Track loading for deny
  const PAGE_SIZE = 10;
  const [searchParams, setsearchParams] = useState("");

  const { data, error, isLoading, mutate } = useSWR(
    `/company/join-requests?description=${searchParams}&page=${currentPage}&limit=${PAGE_SIZE}`,
    getAllPendingJoinRequests,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  const joinRequests = data?.data?.data || [];
  const pagination = data?.data?.pagination || {
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleApproveClick = async (id: string) => {
    setLoadingApprove(id);
    try {
      const response = await getApproveOrDeclinePendingJoinRequest(`/company/join-requests/${id}?status=approve`);
      console.log('response: ', response);
      if (response?.data?.success) {
        toast.success("Account approved successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        mutate();
      }
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to approve account", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setLoadingApprove(null);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    setLoadingDeny(id);
    try {
      console.log("Delete account requested");
      const response = await getApproveOrDeclinePendingJoinRequest(`/company/join-requests/${id}?status=deny`);
      console.log('response: ', response);
      if (response?.data?.success) {
        toast.success("Request declined successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
        mutate();
      } else {
        toast.error(response?.data?.message || "Failed to declined request", {
                duration: Infinity,
                position: "top-center",
                action: {
                  label: "OK",
                  onClick: (toastId : any) => toast.dismiss(toastId),
                },
                closeButton: false,
              });
      }
    } catch (err: any) {
      toast.error("Failed to decline request", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setLoadingDeny(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4  w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <div className="flex justify-between">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">Pending Join Requests</h2>
          <SearchBar setQuery={setsearchParams} query={searchParams} />
        </div>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                <TableHead className="w-[100px] py-4">ID</TableHead>
                <TableHead className="py-4">User Name</TableHead>
                <TableHead className="py-4">Company Name</TableHead>
                <TableHead className="py-4">Email</TableHead>
                <TableHead className="text-right py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {isLoading ? (
                Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <TableRow key={index} className="border-0 hover:bg-transparent">
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={12} width={80} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={12} width={150} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={12} width={200} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <Skeleton height={12} width={180} />
                      </SkeletonTheme>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <SkeletonTheme baseColor="#ebebeb" highlightColor="#1b2236" borderRadius={10}>
                        <div className="flex justify-end gap-2">
                          <Skeleton height={30} width={42} />
                          <Skeleton height={30} width={42} />
                        </div>
                      </SkeletonTheme>
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-red-500 py-4">
                    Failed to load join requests
                  </TableCell>
                </TableRow>
              ) : joinRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-white py-4">
                    No pending join requests found
                  </TableCell>
                </TableRow>
              ) : (
                joinRequests.map((request: any) => (
                  <TableRow key={request._id} className="border-0 text-sm font-normal hover:bg-transparent">
                    <TableCell className="py-4">{request.userId?.identifier}</TableCell>
                    <TableCell className="py-4">{request.userId?.firstName} {request.userId?.lastName}</TableCell>
                    <TableCell className="py-4">{request.companyId?.companyName}</TableCell>
                    <TableCell className="py-4">{request.userId?.email}</TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex gap-x-2 justify-end">
                        <Button 
                          onClick={() => handleApproveClick(request.userId?._id)} 
                          className="bg-[#14AB00] hover:cursor-pointer hover:bg-[#14AB00]"
                          disabled={loadingApprove === request.userId?._id}
                        >
                          {loadingApprove === request.userId?._id ? (
                            <Loader2 size={20} className="animate-spin text-white" />
                          ) : (
                            <Image src="/GreenTick.svg" alt="Check" width={20} height={20} className="bg-[#14AB00] hover:cursor-pointer hover:bg-[#14AB00]" />
                          )}
                        </Button>
                        <Button 
                          onClick={() => setIsDialogOpen(true)} 
                          className="bg-[#FF4747] hover:cursor-pointer hover:bg-[#FF4747]"
                          disabled={loadingDeny === request.userId?._id}
                        >
                          {loadingDeny === request.userId?._id ? (
                            <Loader2 size={20} className="animate-spin text-white" />
                          ) : (
                            <Image src="/Cross.svg" alt="Cross" width={20} height={20} />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogContent className="bg-[#141B2D] border-[#1F2937] w-full max-w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
                        <DialogHeader className="text-center">
                          <div className="flex justify-center mb-4">
                            <Image src="/error.svg" alt="error" width={20} height={20} />
                          </div>
                          <DialogTitle className="text-lg font-semibold text-center">Decline?</DialogTitle>
                          <DialogDescription className="text-sm text-gray-400">
                            Are you sure you want to decline this? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-center gap-4 mt-4">
                          <Button
                            variant="outline"
                            className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] w-32 sm:w-44 h-10 sm:h-11 hover:cursor-pointer"
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            className="w-32 sm:w-44 h-10 sm:h-11 hover:cursor-pointer"
                            onClick={() => handleDeleteAccount(request.userId?._id)}
                            disabled={loadingDeny === request.userId?._id}
                          >
                            {loadingDeny === request.userId?._id ? (
                              <Loader2 size={20} className="animate-spin text-white" />
                            ) : (
                              "Decline"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          {!isLoading && !error && joinRequests.length > 0 && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <Button
                className="bg-[#0B132B] hover:cursor-pointer"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <span className="text-white text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                className="bg-[#0B132B] hover:cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
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