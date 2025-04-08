"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { getSubscriptionReminder } from "@/services/admin-services";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Updated Invoice interface to match API response
interface Invoice {
  Id: string;
  identifier: string;
  CompanyName: string;
  registerdate: string;
  expireDate: string;
  email?: string;
  Action: string;
}

interface ApiResponse {
  success: boolean;
  message?: string; // Added optional message property
  data: {
    _id: string;
    identifier: string;
    stripeCustomerId: string;
    subscriptionStatus: string;
    subscriptionId: string;
    subscriptionStartDate: string;
    subscriptionExpiryDate: string;
    numUsersForPlan: number;
    role: string;
    planInterval: string;
    planType: string;
    companyName: string;
    email: string;
    isBlocked: boolean;
    isAccountActive: boolean;
    emailVerified: boolean;
    isVerifiedByAdmin: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    totalUsers: number;
  }[];
}

const SubscriptionReminder = () => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription reminder data on mount
  useEffect(() => {
    const fetchSubscriptionReminder = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptionReminder("/admin/subscriptions-expire-in-a-week");
        const data: ApiResponse = response.data;

        if (data.success) {
          // Map API response to Invoice interface
          const mappedInvoices = data.data.map((item) => ({
            Id: item._id,
            identifier: item.identifier,
            CompanyName: item.companyName,
            registerdate: new Date(item.createdAt).toLocaleDateString(), 
            expireDate: new Date(item.subscriptionExpiryDate).toLocaleDateString(), 
            email: item.email,
            Action: "View", // Static action for button
          }));
          setInvoices(mappedInvoices);
        } else {
          setError(data.message || "Failed to fetch subscription reminders");
        }
      } catch (err) {
        setError("Failed to fetch subscription reminders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionReminder();
  }, []); // Empty dependency array for one-time fetch on mount

  if (loading) {
    return (
      <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
            <Skeleton width={200} height={24} />
          </h2>
          <div className="w-full overflow-auto scroll-container">
            <Table className=" scrollbar-thin scroll-container">
              <TableHeader>
                <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                  <TableHead className="w-[100px] py-4">ID</TableHead>
                  <TableHead className="py-4">Company Name</TableHead>
                  <TableHead className="py-4">Register Date</TableHead>
                  <TableHead className="py-4">Expire Date</TableHead>
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
                        <Skeleton width={100} height={16} />
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
      </SkeletonTheme>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
      <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
        Subscriptions Expiring
      </h2>
      <div className="w-full rounded-none overflow-hidden">
        <div className="w-full overflow-auto  scroll-container">
          <Table className="min-w-[500px] scrollbar-thin scroll-container">
            <TableHeader>
              <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                <TableHead className="w-[100px] py-4">ID</TableHead>
                <TableHead className="py-4">Company Name</TableHead>
                <TableHead className="py-4">Register Date</TableHead>
                <TableHead className="py-4">Expire Date</TableHead>
                <TableHead className="text-right py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-white py-4">
                    No subscriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow
                    key={invoice.Id}
                    className="border-0 text-sm font-normal hover:bg-transparent"
                  >
                    <TableCell className="py-4">{invoice.identifier}</TableCell>
                    <TableCell className="py-4">{invoice.CompanyName}</TableCell>
                    <TableCell className="py-4">{invoice.registerdate}</TableCell>
                    <TableCell className="py-4">{invoice.expireDate}</TableCell>
                    <TableCell className="text-right py-4">
                      <Button
                        className="!bg-[#1a3f70] hover:cursor-pointer h-6 w-20 rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                        onClick={() => router.push(`/admin/subscription-expiring/company-detail/${invoice.Id}`)}
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
    </div>
  );
};

export default SubscriptionReminder;