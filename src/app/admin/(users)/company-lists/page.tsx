"use client";
import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Invoice {
  _id: string;
  companyName: string;
  email: string;
  subscriptionStatus: string;
  planInterval: string | null;
  subscriptionStartDate: string | null;
  subscriptionExpiryDate: string | null;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
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

type SortField = 'companyName' | 'email' | 'planInterval' | 'createdAt' | 'subscriptionExpiryDate' | 'firstName' | 'lastName';
type SortDirection = 'asc' | 'desc';

const RecentNewUsers = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Fetch company details with pagination and search
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const payload: {
          page: number;
          limit: number;
          description?: string;
        } = {
          page: currentPage,
          limit: limit,
        };

        if (searchTerm.trim()) {
          payload.description = searchTerm.trim();
        }

        const response = await getCompanyDetailStats("/admin/get-all-companies", payload);
        console.log("response:", response); // For debugging
        const data: ApiResponse = response.data;

        if (data.success) {
          // If data is empty and not on the first page, go back to the previous page
          if (data.data.length === 0 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            return; // Prevent further processing to avoid setting empty data
          }

          setInvoices(data.data);
          // Calculate total pages, ensuring no extra page is added
          const calculatedTotalPages = data.total > 0 ? Math.ceil(data.total / data.limit) : 1;
          setTotalPages(calculatedTotalPages);

          // If currentPage exceeds totalPages, adjust it
          if (currentPage > calculatedTotalPages) {
            setCurrentPage(calculatedTotalPages);
            return; // Trigger refetch with the corrected page
          }
        } else {
          setError(data.message || "Failed to fetch company details.");
          console.error(data.message);
          toast.error(data.message || "Failed to fetch company details.", {
                  duration: Infinity,
                  position: "top-center",
                  action: {
                    label: "OK",
                    onClick: (toastId : any) => toast.dismiss(toastId),
                  },
                  closeButton: false,
                });
        }
      } catch (err) {
        setError("Failed to fetch company details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [currentPage, searchTerm, limit]);

  // Sort invoices on frontend
  const sortedInvoices = useMemo(() => {
    if (!sortField) return invoices;

    return [...invoices].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'companyName':
          aValue = a.companyName?.toLowerCase() || '';
          bValue = b.companyName?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'planInterval':
          aValue = a.planInterval?.toLowerCase() || '';
          bValue = b.planInterval?.toLowerCase() || '';
          break;
        case 'firstName':
          aValue = a.firstName?.toLowerCase() || '';
          bValue = b.firstName?.toLowerCase() || '';
          break;
        case 'lastName':
          aValue = a.lastName?.toLowerCase() || '';
          bValue = b.lastName?.toLowerCase() || '';
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'subscriptionExpiryDate':
          aValue = a.subscriptionExpiryDate ? new Date(a.subscriptionExpiryDate).getTime() : 0;
          bValue = b.subscriptionExpiryDate ? new Date(b.subscriptionExpiryDate).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [invoices, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return '↕️';
    }
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setCurrentPage(1); // Reset to first page when limit changes
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
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <div className="flex items-center justify-between space-y-2 flex-wrap mb-4">
            <h2 className="text-white text-[20px] md:text-2xl font-bold">
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
                <TableHead 
                  className="w-[100px] py-4 cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('companyName')}
                >
                  <div className="flex items-center gap-1">
                    Company Name {getSortIcon('companyName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center gap-1">
                    First Name {getSortIcon('firstName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('lastName')}
                >
                  <div className="flex items-center gap-1">
                    Last Name {getSortIcon('lastName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email Id {getSortIcon('email')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('planInterval')}
                >
                  <div className="flex items-center gap-1">
                    Plan {getSortIcon('planInterval')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center gap-1">
                    Register Date {getSortIcon('createdAt')}
                  </div>
                </TableHead>
                <TableHead 
                  className="py-4 cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('subscriptionExpiryDate')}
                >
                  <div className="flex items-center gap-1">
                    Expiry Date {getSortIcon('subscriptionExpiryDate')}
                  </div>
                </TableHead>
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
              ) : sortedInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-white py-4">
                    No companies found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedInvoices.map((invoice) => (
                  <TableRow
                    key={invoice._id}
                    className="border-0 text-sm font-normal hover:bg-transparent"
                  >
                    <TableCell className="py-4">{invoice.companyName}</TableCell>
                    <TableCell className="py-4">{invoice.firstName || "N/A"}</TableCell>
                    <TableCell className="py-4">{invoice.lastName || "N/A"}</TableCell>
                    <TableCell className="py-4">{invoice.email || "N/A"}</TableCell>
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
          {/* Pagination Controls with Limit Dropdown */}
          {!loading && (totalPages > 1 || limit !== 10) && (
            <div className="flex justify-end items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Select
                  value={limit.toString()}
                  onValueChange={handleLimitChange}
                >
                  <SelectTrigger className="w-[100px] bg-[#0B132B] text-white border-[#666666]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0B132B] text-white border-[#666666]">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-white text-sm">per page</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-[#0B132BB]"
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
            </div>
          )}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default RecentNewUsers;