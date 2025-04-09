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
import { getCompanyDetailStats } from "@/services/admin-services";
import { toast } from "sonner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchBar from "@/components/ui/SearchBar";

// Updated Invoice interface based on backend data
interface Invoice {
  _id: string;
  companyName: string;
  email: string;
  subscriptionStatus: string;
  planInterval: string | null;
  subscriptionStartDate: string | null;
  subscriptionExpiryDate: string | null;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Invoice[];
  total: number;
  page: number;
  limit: number;
  statusCode: number;
  message?: string;
}

const RecentNewUsers = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Single search term

  // Fetch company details with pagination and search
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const payload: {
          page: number;
          limit: number;
          description?: string; // Single search parameter for backend
        } = {
          page: currentPage,
          limit: 10,
        };

        // Add search term to payload if it exists
        if (searchTerm.trim()) {
          payload.description = searchTerm.trim();
        }

        const response = await getCompanyDetailStats("/admin/get-all-companies", payload);
        const data: ApiResponse = response.data;

        if (data.success) {
          setInvoices(data.data);
          setTotalPages(Math.ceil(data.total / data.limit));
        } else {
          setError(data.message || "Failed to fetch company details.");
          console.error(data.message);
          toast.error(data.message || "Failed to fetch company details.");
        }
      } catch (err) {
        setError("Failed to fetch company details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [currentPage, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewClick = (id: string) => {
    router.push(`/admin/company-lists/company-detail/${id}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px]  md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <div className="flex items-center justify-between space-y-2 flex-wrap mb-4">
            <h2 className="text-white text-[20px] md:text-2xl font-bold ">
              Company Lists
            </h2>
            <div className="flex items-center space-y-2 flex-wrap gap-2">
            <Button
              className="w-44 h-10 px-12 py-2 !bg-[#1a3f70] rounded inline-flex justify-center items-center hover:cursor-pointer text-white text-sm !font-normal !leading-tight !tracking-tight"
              onClick={() => router.push("/admin/company-lists/add-new-company")}
            >
              + Add New Company
            </Button>
            <SearchBar setQuery={setSearchTerm} query={searchTerm} />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                <TableHead className="w-[100px] py-4">Company Name</TableHead>
                <TableHead className="py-4">Email Id</TableHead>
                <TableHead className="py-4">Plan</TableHead>
                <TableHead className="py-4">Register Date</TableHead>
                <TableHead className="py-4">Expiry Date</TableHead>
                <TableHead className="text-right py-4">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow
                      key={`skeleton-${index}`}
                      className="border-0 text-sm font-normal hover:bg-transparent"
                    >
                      <TableCell className="py-4">
                        <Skeleton width={100} height={16} />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton width={200} height={16} />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton width={80} height={16} />
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
                  ))
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-white py-4">
                    No companies found.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow
                    key={invoice._id}
                    className="border-0 text-sm font-normal hover:bg-transparent"
                  >
                    <TableCell className="py-4">{invoice.companyName}</TableCell>
                    <TableCell className="py-4">{invoice.email}</TableCell>
                    <TableCell className="py-4">{invoice.planInterval || "N/A"}</TableCell>
                    <TableCell className="py-4">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4">
                      {invoice.subscriptionExpiryDate
                        ? new Date(invoice.subscriptionExpiryDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <Button
                        className="px-3 !py-0 w-16 h-6 hover:cursor-pointer !bg-[#1a3f70] rounded inline-flex justify-center items-center text-white text-sm !font-normal !leading-tight !tracking-tight"
                        onClick={() => handleViewClick(invoice._id)}
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
          {!loading && totalPages > 1 && (
            <div className="flex justify-end hover:cursor-pointer items-center gap-2 mt-4">
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
    </SkeletonTheme>
  );
};

export default RecentNewUsers;