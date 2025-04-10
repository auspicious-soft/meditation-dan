// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getCompanyDetails, updateCompanyDetails } from "@/services/company-services";
// import { signIn, useSession } from "next-auth/react";
// import React, { useState, useEffect } from "react";
// import useSWR from "swr";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// const Page = () => {
//   const { data: session, status } = useSession();

//   // Initialize formData with empty values, will be updated from API
//   const [formData, setFormData] = useState({
//     email: "",
//     companyName: "",
//     password: "",
//     totalUsers: 0, // Add totalUsers to the formData state
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [initialCompanyName, setInitialCompanyName] = useState("");

//   // Fetch company details only when session is ready
//   const { data, error: swrError, mutate, isLoading: swrIsLoading } = useSWR(
//     status === "authenticated" && session?.user?.id 
//       ? `/company/company-details/${session.user.id}` 
//       : null,
//     getCompanyDetails,
//     { 
//       revalidateOnFocus: false,
//       onSuccess: (response) => {
//         const companyData = response?.data?.data || response?.data || {};
//         console.log('companyData: ', companyData);
//         setFormData({
//           email: companyData.email || "",
//           password: "",
//           companyName: companyData.companyName || "",
//           totalUsers: companyData.totalUsers || 0, // Map totalUsers from API response
//         });
//         setInitialCompanyName(companyData.companyName || "");
//       },
//       onError: (err) => {
//         console.error('SWR Error:', err); // Log any errors
//       },
//     }
//   );

//   // Determine if data is loading (initial fetch)
//   const isDataLoading = swrIsLoading && !swrError && status === "authenticated";

//   // Update formData if session changes and data is available
//   useEffect(() => {
//     if (status === "authenticated" && data) {
//       const companyData = data?.data?.data || data?.data || {};
//       setFormData({
//         email: companyData.email || "",
//         companyName: companyData.companyName || "",
//         totalUsers: companyData.totalUsers || 0, // Map totalUsers in useEffect
//       });
//       setInitialCompanyName(companyData.companyName || "");
//     }
//   }, [status, data]);

//   const handleChange = (field: string, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: field === "totalUsers" ? parseInt(value) || 0 : value, // Parse totalUsers as integer
//     });
//   };

//   const handleSave = async () => {
//     if (!session?.user?.id) {
//       toast.error("User ID not found");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const payload = {
//         companyName: formData.companyName,

//       };

//       const response = await updateCompanyDetails(
//         `/company/update-company/${session?.user.id}`,
//         payload
//       );

//       if (response?.data?.success) {
//         toast.success("Company details updated successfully");
//         mutate(); // Revalidate the data after successful update
//         setInitialCompanyName(formData.companyName); // Update initial value after successful save
//         await signIn("credentials", {
//           email: formData.email,
//           fullName: formData.companyName, // Use companyName as fullName
//           _id: session.user.id,
//           role: session.user.role || "company",
//           redirect: false,
//         });
//       } else {
//         toast.error(response?.data?.message || "Failed to update company details");
//       }
//     } catch (error) {
//       console.error("Error updating company details:", error);
//       toast.error("An error occurred while updating company details");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Check if there are changes in companyName
//   const hasChanges = formData.companyName !== initialCompanyName;

//   return (
//     <div className="flex flex-1 flex-col gap-4">
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
//               Email Address
//             </Label>
//             {isDataLoading ? (
//               <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
//             ) : (
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleChange("email", e.target.value)} 
//                 className="bg-[#1B2236] h-12 border-none text-white"
//                 disabled 
//               />
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
//               Company Name
//             </Label>
//             {isDataLoading ? (
//               <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
//             ) : (
//               <Input
//                 id="companyName"
//                 type="text" 
//                 value={formData.companyName}
//                 onChange={(e) => handleChange("companyName", e.target.value)}
//                 className="bg-[#1B2236] h-12 border-none text-white"
//               />
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="totalUsers" className="text-white dm-sans text-base font-normal">
//               Total Active Users
//             </Label>
//             {isDataLoading ? (
//               <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
//             ) : (
//               <Input
//                 id="totalUsers"
//                 type="number"
//                 value={formData.totalUsers}
//                 onChange={(e) => handleChange("totalUsers", e.target.value)}
//                 className="bg-[#1B2236] h-12 border-none text-white"
//                 disabled // Disable since it's likely read-only
//               />
//             )}
//           </div>
//         </div>

//         <div>
//           <Button
//             className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white flex items-center justify-center hover:cursor-pointer"
//             onClick={handleSave}
//             disabled={isLoading || !hasChanges} // Disable if loading or no changes
//           >
//             {isLoading ? (
//               <Loader2 size={20} className="animate-spin text-white" />
//             ) : (
//               "Save"
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;


"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCompanyDetails, updateCompanyDetails } from "@/services/company-services";
import { signIn, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();

  // Initialize formData with empty values
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
    password: "",
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState({
    companyName: "",
    password: "", // Store initial password for comparison
  });

  // Fetch company details
  const { data, error: swrError, mutate, isLoading: swrIsLoading } = useSWR(
    status === "authenticated" && session?.user?.id 
    ? `/company/company-details/${session.user.id}` 
    : null,
    getCompanyDetails,
    { 
      revalidateOnFocus: false,
      onSuccess: (response) => {
        const companyData = response?.data?.data || response?.data || {};
        setFormData({
          email: companyData.email || "",
          companyName: companyData.companyName || "",
          password: companyData.password || "", // Store actual password
          totalUsers: companyData.totalUsers || 0,
        });
        setInitialData({
          companyName: companyData.companyName || "",
          password: companyData.password || "", // Store initial password
        });
      },
      onError: (err) => {
        console.error('SWR Error:', err);
      },
    }
  );
  console.log('data: ', data);

  const isDataLoading = swrIsLoading && !swrError && status === "authenticated";

  useEffect(() => {
    if (status === "authenticated" && data) {
      const companyData = data?.data?.data || data?.data || {};
      setFormData({
        email: companyData.email || "",
        companyName: companyData.companyName || "",
        password: companyData.password || "",
        totalUsers: companyData.totalUsers || 0,
      });
      setInitialData({
        companyName: companyData.companyName || "",
        password: companyData.password || "",
      });
    }
  }, [status, data]);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: field === "totalUsers" ? parseInt(value) || 0 : value,
    });
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast.error("User ID not found");
      return;
    }

    setIsLoading(true);
    try {
      // Only include changed fields in the payload
      const payload: { companyName: string; password?: string } = {
        companyName: formData.companyName,
      };

      // Only add password to payload if it has changed
      if (formData.password !== initialData.password) {
        payload.password = formData.password;
      }

      const response = await updateCompanyDetails(
        `/company/update-company/${session?.user.id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Company details updated successfully");
        mutate(); // Revalidate data
        setInitialData({
          companyName: formData.companyName,
          password: formData.password, // Update initial password after save
        });
        await signIn("credentials", {
          email: formData.email,
          fullName: formData.companyName,
          _id: session.user.id,
          role: session.user.role || "company",
          redirect: false,
          ...(payload.password && { password: formData.password }), // Include password if changed
        });
      } else {
        toast.error(response?.data?.message || "Failed to update company details");
      }
    } catch (error) {
      console.error("Error updating company details:", error);
      toast.error("An error occurred while updating company details");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there are any changes
  const hasChanges = 
    formData.companyName !== initialData.companyName || 
    formData.password !== initialData.password;

  // Mask password for display (show asterisks unless being edited)
  const maskedPassword = formData.password ? "*".repeat(formData.password.length) : "";

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
              Email Address
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)} 
                className="bg-[#1B2236] h-12 border-none text-white"
                disabled 
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
              Company Name
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <Input
                id="companyName"
                type="text" 
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="bg-[#1B2236] h-12 border-none text-white"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white dm-sans text-base font-normal">
              Password
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <Input
                id="password"
                type="text" // Changed to text to show masked value
                value={formData.password === initialData.password ? maskedPassword : formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="bg-[#1B2236] h-12 border-none text-white"
                placeholder="Enter new password"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalUsers" className="text-white dm-sans text-base font-normal">
              Total Active Users
            </Label>
            {isDataLoading ? (
              <div className="w-full h-12 bg-gray-700 animate-pulse rounded-md"></div>
            ) : (
              <Input
                id="totalUsers"
                type="number"
                value={formData.totalUsers}
                onChange={(e) => handleChange("totalUsers", e.target.value)}
                className="bg-[#1B2236] h-12 border-none text-white"
                disabled
              />
            )}
          </div>
        </div>

        <div>
          <Button
            className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white flex items-center justify-center hover:cursor-pointer"
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin text-white" />
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;