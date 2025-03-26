"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSingleCompanydetailStats } from "@/services/admin-services";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";// Adjust the import path

// Interface based on the actual API response
interface CompanyData {
  _id: string;
  companyName: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  gender: string;
  dob: string | null;
  subscriptionExpiryDate: string | null;
  createdAt: string;
  isBlocked: boolean;
  isAccountActive: boolean;
}

interface ApiResponse {
  success: boolean;
  data: CompanyData;
  statusCode: number;
}

const Page = () => {
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUserData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch single company details on mount
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await getSingleCompanydetailStats(`/company/get-company-by-id/${id}`);
        const data: ApiResponse = response.data;

        if (data.success) {
          setUserData(data.data);
        } else {
          throw new Error("API request failed");
        }
      } catch (err) {
        setError("Failed to fetch company details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);

  const handleDeleteAccount = () => {
    console.log("Delete account requested for ID:", id);
    setIsDialogOpen(false);
    // Add actual delete logic here (e.g., API call)
  };

  const handleUnblock = () => {
    console.log("Unblock requested for ID:", id);
    // Add actual unblock logic here (e.g., API call)
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error || !userData) {
    return <div className="text-red-500">{error || "No data available"}</div>;
  }

  return (
    <div className="text-white py-6 w-full h-screen">
      <h1 className="text-xl font-medium mb-6">{userData.companyName} Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        <div>
          <p className="text-sm text-slate-400 mb-1">First Name</p>
          <p className="text-white">{userData.firstName}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-1">Last Name</p>
          <p className="text-white">{userData.lastName}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-1">Gender</p>
          <p className="text-white">{userData.gender || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-1">Email Address</p>
          <p className="text-white">{userData.email || "N/A"}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-1">Birthday</p>
          <p className="text-white">{userData.dob}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400 mb-1">Company Name</p>
          <p className="text-white">
            {userData.companyName }
          </p>
        </div>

       

       


      
      </div>

      <div className="flex gap-4 mt-12">
        <Button
          variant="destructive"
          className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          Delete Account
        </Button>

        <Button
          variant="default"
          className="bg-[#1A3F70] hover:bg-[#1A3F70] hover:cursor-pointer"
          onClick={handleUnblock}
        >
          {userData.isBlocked ? "Unblock" : "Block"}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#141B2D] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-semibold text-center">Delete Account</DialogTitle>
            <DialogDescription className="text-sm text-gray-400 text-center">
              Are you sure you want to delete this account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-4 mt-4">
            <Button
              variant="outline"
              className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
              onClick={() => setIsDialogOpen(false)}
            >
              No
            </Button>
            <Button
              variant="destructive"
              className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11"
              onClick={handleDeleteAccount}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;