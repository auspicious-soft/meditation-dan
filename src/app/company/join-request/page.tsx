"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import useSWR from "swr";
import { getAllPendingJoinRequests, getApproveOrDeclinePendingJoinRequest } from "@/services/company-services";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const PAGE_SIZE = 10; // Adjust as needed

  const { data, error, isLoading, mutate } = useSWR(
    `/company/join-requests?page=${currentPage}&limit=${PAGE_SIZE}`,
    getAllPendingJoinRequests,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  const joinRequests = data?.data?.data || [];
  console.log('joinRequests: ', joinRequests);
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

  const handleApproveClick = async(id: string) => {
   console.log("Delete account requested");
   const response = await getApproveOrDeclinePendingJoinRequest(`/company/join-requests/${id}?status=approve`);
   console.log('response: ', response);
    mutate();
  };

  const handleDeleteAccount = async(id:string) => {
    console.log("Delete account requested");
    const response = await getApproveOrDeclinePendingJoinRequest(`/company/join-requests/${id}?status=deny`);
    setIsDialogOpen(false);
    // Add your delete logic here
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">Pending Join Requests</h2>
        <div>
          <Table>
            <TableHeader>
              <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                <TableHead className="w-[100px] py-4">ID</TableHead>
                <TableHead className="py-4">User Name</TableHead>
                <TableHead className="py-4">Company Name</TableHead>
                <TableHead className="py-4">Email</TableHead>
                <TableHead className="py-4">Gender</TableHead>
                <TableHead className="text-right py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <TableRow key={index} className="border-0 hover:bg-transparent">
                    <TableCell className="py-4"><Skeleton className="h-4 w-[80px] bg-gray-700" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-[150px] bg-gray-700" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-[200px] bg-gray-700" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-[180px] bg-gray-700" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-[80px] bg-gray-700" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-[100px] bg-gray-700 ml-auto" /></TableCell>
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
                    <TableCell className="py-4">{request.userId?.gender}</TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex gap-x-2 justify-end">
                        <Button onClick={() => handleApproveClick(request.userId?._id)} className="bg-[#14AB00]">
                          <Image src="/GreenTick.svg" alt="Check" width={20} height={20} />
                        </Button>
                        <Button onClick={() => setIsDialogOpen(true)} className="bg-[#FF4747]">
                          <Image src="/Cross.svg" alt="Cross" width={20} height={20} />
                        </Button>
                      </div>
                    </TableCell>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-[#141B2D] border-[#1F2937] w-full max-w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
              <DialogHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Image src="/error.svg" alt="error" width={20} height={20} />
                </div>
                <DialogTitle className="text-lg font-semibold text-center">Delete?</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                  Are you sure you want to delete this? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] w-32 sm:w-44 h-10 sm:h-11"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="w-32 sm:w-44 h-10 sm:h-11"
                  onClick={() => handleDeleteAccount(request.userId?._id)}
                >
                  Delete
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
                className="bg-[#0B132B]"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <span className="text-white text-sm">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                className="bg-[#0B132B]"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}

          {/* Delete Confirmation Dialog */}
          {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="bg-[#141B2D] border-[#1F2937] w-full max-w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
              <DialogHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Image src="/error.svg" alt="error" width={20} height={20} />
                </div>
                <DialogTitle className="text-lg font-semibold text-center">Delete?</DialogTitle>
                <DialogDescription className="text-sm text-gray-400">
                  Are you sure you want to delete this? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] w-32 sm:w-44 h-10 sm:h-11"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="w-32 sm:w-44 h-10 sm:h-11"
                  onClick={handleDeleteAccount(request.userId?._id)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </div>
      </div>
    </div>
  );
};

export default Page;