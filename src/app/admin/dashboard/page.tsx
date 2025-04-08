"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminDashboardStats, sendReminder } from "@/services/admin-services";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Updated Invoice interface to match API response
interface Invoice {
  Id: string;
  identifier: string;
  CompanyName: string;
  NameCustomer?: string;
  DueDate: string;
  Action: string;
  email?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    companies: {
      _id: string;
      identifier: string;
      companyName: string;
      subscriptionExpiryDate: string;
    }[];
    recentUsers: {
      _id: string;
      identifier: string;
      companyName: string;
      email: string;
      createdAt: string;
    }[];
  };
}

const DashBoard = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [invoices, setInvoices] = useState<Invoice[]>([]); // For Recent New Company (recentUsers)
  const [expiringSubscriptions, setExpiringSubscriptions] = useState<Invoice[]>([]); // For Subscriptions Expiring (companies)
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reminderLoading, setReminderLoading] = useState<string | null>(null); // Track loading state for reminder

  const PAGE_SIZE = 10;
  const indexOfLastInvoice = currentPage * PAGE_SIZE;
  const indexOfFirstInvoice = indexOfLastInvoice - PAGE_SIZE;
  const currentInvoices = invoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
  const totalPages = Math.ceil(invoices.length / PAGE_SIZE);

  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardStats("/admin/dashboard", {
          page: currentPage,
          limit: PAGE_SIZE,
        });
        console.log("response:", response);
        const data: ApiResponse = response.data;

        if (data.success) {
          // Map recentUsers to Invoice interface (Recent New Company)
          const mappedRecentUsers = data.data.recentUsers.map((user) => ({
            Id: user._id,
            identifier: user.identifier,
            CompanyName: user.companyName,
            NameCustomer: "N/A", // No customer name in response
            DueDate: user.createdAt, // Using createdAt as register date
            Action: "View", // Static action for button
            email: user.email,
          }));
          setInvoices(mappedRecentUsers);

          // Map companies to Invoice interface (Subscriptions Expiring Within One Week)
          const mappedCompanies = data.data.companies.map((company) => ({
            Id: company._id,
            identifier: company.identifier,
            CompanyName: company.companyName,
            DueDate: company.subscriptionExpiryDate, // Using subscriptionExpiryDate
            Action: "Reminder", // Static action for button
          }));
          setExpiringSubscriptions(mappedCompanies);
        } else {
          setError(data.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentPage]); // Refetch when page changes

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleClick = (id: string) => {
    router.push(`/admin/company-detail/${id}`);
  };

  const handleReminderClick = async (id: string) => {
    setReminderLoading(id); // Set loading state for this specific reminder
    try {
      const response = await sendReminder(`/admin/subscription-expire-remainder/${id}`); // Send Id in route
      console.log("Reminder response:", response.data); // Debug the response
      // Check if the response indicates success (flexible check)
      if (response.data && (response.data.success === true || response.status === 200)) {
        toast.success("Reminder sent successfully!");
      } else {
        toast.error("Failed to send reminder: " + (response.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error sending reminder:", err);
      if (err instanceof Error) {
        if ((err as any).response?.data?.message) {
          toast.error("Error sending reminder: " + (err as any).response.data.message);
        } else {
          toast.error("Error sending reminder: " + err.message);
        }
      } else {
        toast.error("Error sending reminder: Unknown error");
      }
    } finally {
      setReminderLoading(null); // Reset loading state
    }
  };

  if (loading) {
    return (
      <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-bold block md:hidden">
            <Skeleton width={150} height={24} />
          </h1>
          <div className="flex flex-1 flex-col gap-4">
            {/* Subscriptions Expiring Section */}
            <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
              <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
                <Skeleton width={300} height={24} />
              </h2>
              <Skeleton count={3} height={40} />
            </div>

            {/* Recent New Company Section */}
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
                <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
                  <Skeleton width={200} height={24} />
                </h2>
                <Table>
                  <TableHeader>
                    <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                      <TableHead className="w-[100px] py-4">ID</TableHead>
                      <TableHead className="py-4">Company Name</TableHead>
                      <TableHead className="py-4">Email Id</TableHead>
                      <TableHead className="py-4">Register Date</TableHead>
                      <TableHead className="text-right py-4">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <TableRow
                          key={`skeleton-${index}`}
                          className="border-0 text-sm font-normal hover:bg-transparent"
                        >
                          <TableCell className="py-4">
                            <Skeleton width={80} height={16} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton width={150} height={16} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton width={200} height={16} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton width={100} height={16} />
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <Skeleton width={50} height={24} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-bold block md:hidden">Dashboard</h1>
        <div className="flex flex-1 flex-col gap-4">
          <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
            <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
              Subscriptions Expiring Within One Week
            </h2>
            <div className="w-full rounded-none overflow-hidden">
              <div className="w-full overflow-auto max-h-[210px] scroll-container">
                <Table className="min-w-[500px] scrollbar-thin scroll-container">
                  <TableHeader>
                    <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                      <TableHead className="w-[100px] py-4">ID</TableHead>
                      <TableHead className="py-4">Company Name</TableHead>
                      <TableHead className="py-4">Due Date</TableHead>
                      <TableHead className="text-right py-4">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-white py-4">
                          No subscriptions expiring within one week.
                        </TableCell>
                      </TableRow>
                    ) : (
                      expiringSubscriptions.map((subscription) => (
                        <TableRow
                          key={subscription.Id}
                          className="border-0 text-sm font-normal hover:bg-transparent"
                        >
                          <TableCell className="py-4">{subscription.identifier}</TableCell>
                          <TableCell className="py-4">{subscription.CompanyName}</TableCell>
                          <TableCell className="py-4">
                            {new Date(subscription.DueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <Button
                              className="px-3 !py-0 h-6 w-44 !bg-[#1a3f70] hover:cursor-pointer rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                              onClick={() => handleReminderClick(subscription.Id)}
                              disabled={reminderLoading === subscription.Id}
                            >
                              {reminderLoading === subscription.Id ? (
                                <Loader2 size={20} className="animate-spin text-white" />
                              ) : (
                                subscription.Action
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
              <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
                Companies Registered Recently
              </h2>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                      <TableHead className="w-[100px] py-4">ID</TableHead>
                      <TableHead className="py-4">Company Name</TableHead>
                      <TableHead className="py-4">Email Id</TableHead>
                      <TableHead className="py-4">Register Date</TableHead>
                      <TableHead className="text-right py-4">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-white py-4">
                          No recent companies found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentInvoices.map((invoice) => (
                        <TableRow
                          key={invoice.Id}
                          className="border-0 text-sm font-normal hover:bg-transparent"
                        >
                          <TableCell className="py-4">{invoice.identifier}</TableCell>
                          <TableCell className="py-4">{invoice.CompanyName}</TableCell>
                          <TableCell className="py-4">{invoice.email}</TableCell>
                          <TableCell className="py-4">
                            {new Date(invoice.DueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <Button
                              className="px-3 !py-0 h-6 !bg-[#1a3f70] hover:cursor-pointer rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                              onClick={() => handleClick(invoice.Id)}
                            >
                              {invoice.Action}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default DashBoard;