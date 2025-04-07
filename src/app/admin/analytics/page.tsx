"use client";
import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getAnalytics } from "@/services/admin-services";

// Define interfaces based on backend response
interface User {
  _id: string;
  identifier: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

interface Subscription {
  Id: string;
  CompanyName: string;
  RegisterDate: string;
  Action: string;
}

interface Payment {
  id: string;
  CompanyName: string;
  customerDetails: {
    name: string;
    id: string;
  };
  plans: {
    amount: number;
    interval: string;
  }[];
  Plan: string;
  Transaction: string;
}

interface AnalyticsData {
  totalUser: number;
  activeUsers: number;
  totalDownload: number;
  totalAudioPlays: number;
  newUser: User[];
  subscriptionExpireToday: Subscription[];
  paymentToday: Payment[];
}

const PAGE_SIZE = 20;

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAnalytics("/admin/analysis");
        console.log("response:", response);
        if (response.data.success) {
          setAnalyticsData(response.data.data);
        } else {
          toast.error("Failed to fetch analytics data");
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast.error("Failed to fetch analytics data");
      }
    };
    fetchData();
  }, []);

  if (!analyticsData) {
    return (
      <SkeletonTheme
        baseColor="#0B132B"
        highlightColor="#1B2236"
        borderRadius="0.5rem"
      >
        <div className="py-4">
          <div className="mb-8 text-white text-2xl font-bold">
            Track and measure user engagement and app performance.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-[#1b2236] rounded-lg p-4">
                <Skeleton height={20} width={100} />
                <Skeleton height={32} width={60} style={{ marginTop: "8px" }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-4 mt-6">
            <div className="col-span-12 lg:col-span-6 w-full">
              <div className="space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
                <Skeleton height={28} width={200} />
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-0 border-b border-[#666666]">
                        <TableHead className="w-[100px] py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(5)].map((_, index) => (
                        <TableRow key={index} className="border-0">
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-6 space-y-4">
              <div className="col-span-full h-auto w-full">
                <div className="space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
                  <Skeleton height={28} width={200} />
                  <Table>
                    <TableHeader>
                      <TableRow className="border-0 border-b border-[#666666]">
                        <TableHead className="w-[100px] py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(3)].map((_, index) => (
                        <TableRow key={index} className="border-0">
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} width={60} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="col-span-full">
                <div className="space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
                  <Skeleton height={28} width={200} />
                  <Table>
                    <TableHeader>
                      <TableRow className="border-0 border-b border-[#666666]">
                        <TableHead className="w-[100px] py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                        <TableHead className="py-4">
                          <Skeleton height={20} />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(3)].map((_, index) => (
                        <TableRow key={index} className="border-0">
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                          <TableCell className="py-4">
                            <Skeleton height={20} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  const stats = [
    { label: "Total Users", value: analyticsData.totalUser.toString() },
    { label: "Active Users", value: analyticsData.activeUsers.toString() },
    { label: "Total Downloads", value: analyticsData.totalDownload.toString() },
    { label: "Audio Plays", value: analyticsData.totalAudioPlays.toString() },
  ];

  const indexOfLastInvoice = currentPage * PAGE_SIZE;
  const indexOfFirstInvoice = indexOfLastInvoice - PAGE_SIZE;
  const recentUsers = analyticsData.newUser.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const subscriptionExpiringToday = analyticsData.subscriptionExpireToday;
  const paymentToday = analyticsData.paymentToday;

  const handleViewClick = () => {
    router.push(`/company/users/details`);
  };

  return (
    <SkeletonTheme
      baseColor="#0B132B"
      highlightColor="#1B2236"
      borderRadius="0.5rem"
    >
      <div className="py-4">
        <div className="mb-8 text-white text-2xl font-bold">
          Track and measure user engagement and app performance.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#1b2236] rounded-lg p-4 text-white">
              <div className="text-sm font-normal mb-2">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-6 w-full">
          <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
            <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
              Recent New Users
            </h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                    <TableHead className="w-[100px] py-4">Id</TableHead>
                    <TableHead className="py-4">Name of Customer</TableHead>
                    <TableHead className="py-4">Company Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow
                      key={user._id}
                      className="border-0 text-sm font-normal hover:bg-transparent"
                    >
                      <TableCell className="py-4">{user.identifier}</TableCell>
                      <TableCell className="py-4">{`${user.firstName} ${user.lastName}`}</TableCell>
                      <TableCell className="py-4">{user.companyName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 space-y-4">
          <div className="col-span-full h-auto w-full">
            <div className="space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
              <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
                Subscription Expire Today
              </h2>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                      <TableHead className="w-[100px] py-4">Id</TableHead>
                      <TableHead className="py-4">Company Name</TableHead>
                      <TableHead className="py-4">Register Date</TableHead>
                      <TableHead className="py-4">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionExpiringToday.length === 0 ? (
                      <TableRow key="no-subscriptions">
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-white"
                        >
                          No subscriptions expiring today
                        </TableCell>
                      </TableRow>
                    ) : (
                      subscriptionExpiringToday.map((subscription) => (
                        <TableRow
                          key={subscription.Id}
                          className="border-0 text-sm font-normal hover:bg-transparent"
                        >
                          <TableCell className="py-4">
                            {subscription.Id}
                          </TableCell>
                          <TableCell className="py-4">
                            {subscription.CompanyName}
                          </TableCell>
                          <TableCell className="py-4">
                            {subscription.RegisterDate}
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <Button
                              className="px-3 !py-0 h-6 !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                              onClick={handleViewClick}
                            >
                              {subscription.Action}
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
 
          <div className="col-span-full">
            <div className="space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
              <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
                Recent Payments
              </h2>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                      <TableHead className="w-[100px] py-4">Id</TableHead>
                      <TableHead className="py-4">Company Name</TableHead>
                      <TableHead className="py-4">Plan</TableHead>
                      <TableHead className="py-4">Transaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentToday.length === 0 ? (
                      <TableRow key="no-payments">
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-white"
                        >
                          No recent payments
                        </TableCell>
                      </TableRow>
                    ) : (
                      paymentToday.map((payment) => (
                        <TableRow
                          key={payment.id}
                          className="border-0 text-sm font-normal hover:bg-transparent"
                        >
                          <TableCell className="py-4">
                            {payment.customerDetails.id}
                          </TableCell>
                          <TableCell className="py-4">
                            {payment.customerDetails.name}
                          </TableCell>
                          <TableCell className="py-4">
                            {payment.plans.map((plan, index) => (
                              <div key={index}>{plan.interval}</div>
                            ))}
                          </TableCell>
                          <TableCell className="py-4">
                            {payment.plans.map((plan, index) => (
                              <div key={index}>
                                ${(plan.amount / 100).toFixed(2)}
                              </div>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default Page;
