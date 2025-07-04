"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteMultipleUsers, getAllUsers } from "@/services/admin-services";
import { Loader2, Trash2 } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";
import { toast, Toaster } from "sonner";

const fetcher = (url: string) => getAllUsers(url);

interface User {
  _id: string;
  identifier: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  gender: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  data: User[];
  total: number;
  page: number;
  limit: number;
  statusCode: number;
  message?: string;
}

type SortField = 'identifier' | 'firstName' | 'companyName' | 'email';
type SortDirection = 'asc' | 'desc';

const SkeletonRow = ({ hasCheckbox }: { hasCheckbox: boolean }) => (
  <TableRow className="border-none">
    {hasCheckbox && (
      <TableCell>
        <div className="h-4 w-4 bg-gray-700 rounded animate-pulse"></div>
      </TableCell>
    )}
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-24"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-32"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-28"></div>
    </TableCell>
    <TableCell>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div>
    </TableCell>
    <TableCell>
      <div className="h-8 bg-gray-700 rounded animate-pulse w-16"></div>
    </TableCell>
  </TableRow>
);

const Page = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<string>("10"); // Changed to string
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  console.log('selectedUsers:', selectedUsers);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Calculate API limit - use a very large number for "all" or the actual limit
  const apiLimit = limit === "all" ? "999999" : limit;

  // Fetch data using SWR with search term, page, and limit in the URL
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/get-all-users?description=${searchTerm}&page=${currentPage}&limit=${apiLimit}`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 0,
    }
  );

  // Extract users and pagination data from the API response
  const users = data?.data?.data || [];
  const total = data?.data?.total || 0;
  
  // Calculate total pages - if limit is "all", set to 1 page
  const limitNumber = limit === "all" ? total : parseInt(limit);
  const totalPages = limit === "all" ? 1 : Math.max(1, Math.ceil(total / limitNumber));

  // Sort users on frontend
  const sortedUsers = useMemo(() => {
    if (!sortField) return users;

    return [...users].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'identifier':
          aValue = a.identifier?.toLowerCase() || '';
          bValue = b.identifier?.toLowerCase() || '';
          break;
        case 'firstName':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase();
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'companyName':
          aValue = a.companyName?.toLowerCase() || '';
          bValue = b.companyName?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
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
  }, [users, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
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
      setSelectedUsers([]); // Clear selections when changing page
    }
  };

  const handleLimitChange = (value: string) => {
    console.log("Selected limit:", value); // Debug log
    setLimit(value);
    setCurrentPage(1);
    setSelectedUsers([]); // Clear selections when changing limit
  };

  const handleViewClick = (id: string) => {
    setViewingUserId(id);
    setTimeout(() => {
      router.push(`/admin/user-lists/user-profile-edit/${id}`);
      setViewingUserId(null);
    }, 500);
  };

  // Checkbox handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(sortedUsers.map((user: User) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const isAllSelected = sortedUsers.length > 0 && selectedUsers.length === sortedUsers.length;
  const isIndeterminate = selectedUsers.length > 0 && selectedUsers.length < sortedUsers.length;

  // Delete handler
  const handleDelete = async () => {
    if (selectedUsers.length === 0) return;
    const payload = { users: selectedUsers };
    console.log('payload:', payload);
    
    setIsDeleting(true);
    try {
     const response = await deleteMultipleUsers("/admin/delete-multiple-user", payload);
     if(response.status === 200) {
      toast.success(response.data.message || "Users deleted successfully", {
        duration: Infinity,
        position: "top-center",
        action: {
          label: "OK",
          onClick: (toastId : any) => toast.dismiss(toastId),
        },
        closeButton: false,
      });
      await mutate();
      setSelectedUsers([]);
     }
    } catch (error) {
      console.error('Error deleting users:', error);
      toast.error((error as any).response?.data.message || "Failed to delete users", {
              duration: Infinity,
              position: "top-center",
              action: {
                label: "OK",
                onClick: (toastId : any) => toast.dismiss(toastId),
              },
              closeButton: false,
            });
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    console.error("Error fetching users:", error);
    return <div className="text-white">Error loading users.</div>;
  }

  // Determine if pagination should be shown
  const showPagination = !isLoading && limit !== "all" && (totalPages > 1 || limit !== "10");

  return (
    <>
      <div className="grid grid-cols-12 gap-4 h-screen w-full">
        <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
          <div className="flex items-center justify-between flex-wrap space-y-2 mb-4">
            <h2 className="text-white text-[20px] md:text-2xl font-bold">User Lists</h2>
            <div className="flex items-center gap-4 flex-wrap">
              {selectedUsers.length > 0 && (
                <Button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  {isDeleting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                  Delete ({selectedUsers.length})
                </Button>
              )}
              <SearchBar setQuery={setSearchTerm} query={searchTerm} />
            </div>
          </div>
          
          <Table className="border-separate border-spacing-0">
            <TableHeader className="border-b border-white">
              <TableRow className="text-white text-sm font-bold dm-sans border-0 border-b border-[#666666] hover:bg-transparent">
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('identifier')}
                >
                  <div className="flex items-center gap-1">
                    ID {getSortIcon('identifier')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('firstName')}
                >
                  <div className="flex items-center gap-1">
                    User Name {getSortIcon('firstName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('companyName')}
                >
                  <div className="flex items-center gap-1">
                    Company Name {getSortIcon('companyName')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-[#2a3447] transition-colors"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email {getSortIcon('email')}
                  </div>
                </TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
              <tr>
                <td colSpan={6}>
                  <hr className="border-[#666666]" />
                </td>
              </tr>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: limit === "all" ? 10 : parseInt(limit) }).map((_, index) => (
                  <SkeletonRow key={index} hasCheckbox={true} />
                ))
              ) : sortedUsers.length === 0 && searchTerm.trim() ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-white">
                    No users found for this search query.
                  </TableCell>
                </TableRow>
              ) : sortedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-white">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedUsers.map((user: User) => (
                  <TableRow key={user._id} className="border-none">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </TableCell>
                    <TableCell>{user.identifier}</TableCell>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.companyName || "N/A"}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewClick(user._id)}
                        className="cursor-pointer !bg-[#1a3f70] flex items-center justify-center"
                        disabled={viewingUserId === user._id}
                      >
                        {viewingUserId === user._id ? (
                          <Loader2 size={20} className="animate-spin text-white" />
                        ) : (
                          "View"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {showPagination && (
            <div className="flex justify-end items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Select
                  value={limit}
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
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-white text-sm">per page</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-[#0B132B] hover:cursor-pointer"
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

          {/* Always show the Select dropdown, even when showing all items */}
          {!isLoading && limit === "all" && (
            <div className="flex justify-end items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Select
                  value={limit}
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
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-white text-sm">per page</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">
                  Showing all {total} users
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;