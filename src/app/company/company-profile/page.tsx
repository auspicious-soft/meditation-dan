// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getCompanyDetails, updateCompanyDetails } from "@/services/company-services";
// import { useSession } from "next-auth/react";
// import React, { useState } from "react";
// import useSWR from "swr";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react"; // Added Loader2 import

// const Page = () => {
//   const session = useSession();
//   console.log('session: ', session);

//   // Initialize formData with empty values, will be updated from API
//   const [formData, setFormData] = useState({
//     email: "",
//     companyName: "",
//   });
//   const [isLoading, setIsLoading] = useState(false); // Added for save button loading state

//   // Fetch company details
//   const { data, mutate } = useSWR(
//     session.data?.user?.id ? `/company/company-details/${session.data?.user?.id}` : null,
//     getCompanyDetails,
//     { 
//       revalidateOnFocus: false,
//       onSuccess: (response) => {
//         // Map the API response to formData when data is available
//         setFormData({
//           email: response?.data?.data?.email || "",
//           companyName: response?.data?.data?.companyName || "",
//         });
//       }
//     }
//   );


//   const handleChange = (field: string, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   const handleSave = async () => {
//     if (!session.data?.user?.id) {
//       toast.error("User ID not found");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const payload = {
//         companyName: formData.companyName,
//         // Email is not included since it's disabled and shouldn't be updated
//       };

//       const response = await updateCompanyDetails(
//         `/company/update-company/${session.data.user.id}`,
//         payload
//       );

//       if (response?.data?.success) {
//         toast.success("Company details updated successfully");
//         mutate(); // Revalidate the data after successful update
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

//   return (
//     <div className="flex flex-1 flex-col gap-4">
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label htmlFor="email" className="text-white dm-sans text-base font-normal">
//               Email Address
//             </Label>
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleChange("email", e.target.value)} 
//               className="bg-[#1B2236] h-12 border-none text-white"
//               disabled 
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
//               Company Name
//             </Label>
//             <Input
//               id="companyName"
//               type="text" 
//               value={formData.companyName}
//               onChange={(e) => handleChange("companyName", e.target.value)}
//               className="bg-[#1B2236] h-12 border-none text-white"
//             />
//           </div>
//         </div>

//         <div>
//           <Button
//             className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white flex items-center justify-center hover:cursor-pointer"
//             onClick={handleSave}
//             disabled={isLoading}
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


// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getCompanyDetails, updateCompanyDetails } from "@/services/company-services";
// import { useSession } from "next-auth/react";
// import React, { useState, useEffect } from "react";
// import useSWR from "swr";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// const Page = () => {
//   const session = useSession();
//   console.log('session: ', session);

//   // Initialize formData with empty values, will be updated from API
//   const [formData, setFormData] = useState({
//     email: "",
//     companyName: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [initialCompanyName, setInitialCompanyName] = useState(""); // Store initial company name

//   // Fetch company details
//   const { data, mutate } = useSWR(
//     session.data?.user?.id ? `/company/company-details/${session.data?.user?.id}` : null,
//     getCompanyDetails,
//     { 
//       revalidateOnFocus: false,
//       onSuccess: (response) => {
//         // Map the API response to formData when data is available
//         const newEmail = response?.data?.data?.email || "";
//         const newCompanyName = response?.data?.data?.companyName || "";
//         setFormData({
//           email: newEmail,
//           companyName: newCompanyName,
//         });
//         setInitialCompanyName(newCompanyName); // Set initial company name
//       }
//     }
//   );

//   const handleChange = (field: string, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   const handleSave = async () => {
//     if (!session.data?.user?.id) {
//       toast.error("User ID not found");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const payload = {
//         companyName: formData.companyName,
//         // Email is not included since it's disabled and shouldn't be updated
//       };

//       const response = await updateCompanyDetails(
//         `/company/update-company/${session.data.user.id}`,
//         payload
//       );

//       if (response?.data?.success) {
//         toast.success("Company details updated successfully");
//         mutate(); // Revalidate the data after successful update
//         setInitialCompanyName(formData.companyName); // Update initial value after successful save
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
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleChange("email", e.target.value)} 
//               className="bg-[#1B2236] h-12 border-none text-white"
//               disabled 
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
//               Company Name
//             </Label>
//             <Input
//               id="companyName"
//               type="text" 
//               value={formData.companyName}
//               onChange={(e) => handleChange("companyName", e.target.value)}
//               className="bg-[#1B2236] h-12 border-none text-white"
//             />
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




// "use client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getCompanyDetails, updateCompanyDetails } from "@/services/company-services";
// import { useSession } from "next-auth/react";
// import React, { useState, useEffect } from "react";
// import useSWR from "swr";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";

// const Page = () => {
//   const { data: session, status } = useSession();
//   console.log('session: ', session, 'status: ', status);

//   // Initialize formData with empty values, will be updated from API
//   const [formData, setFormData] = useState({
//     email: "",
//     companyName: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [initialCompanyName, setInitialCompanyName] = useState("");

//   // Fetch company details only when session is ready
//   const { data, error: swrError, mutate } = useSWR(
//     status === "authenticated" && session?.user?.id 
//       ? `/company/company-details/${session.user.id}` 
//       : null,
//     getCompanyDetails,
//     { 
//       revalidateOnFocus: false,
//       onSuccess: (response) => {
//         console.log('API Response:', response); // Log the full response
//         // Map the API response to formData
//         const companyData = response?.data?.data || {};
//         setFormData({
//           email: companyData.email || "",
//           companyName: companyData.companyName || "",
//         });
//         setInitialCompanyName(companyData.companyName || "");
//       },
//       onError: (err) => {
//         console.error('SWR Error:', err); // Log any errors
//       },
//     }
//   );

//   // Update formData if session changes and data is available
//   useEffect(() => {
//     if (status === "authenticated" && data?.data?.data) {
//       const companyData = data.data.data;
//       setFormData({
//         email: companyData.email || "",
//         companyName: companyData.companyName || "",
//       });
//       setInitialCompanyName(companyData.companyName || "");
//     }
//   }, [status, data]);

//   const handleChange = (field: string, value: string) => {
//     setFormData({
//       ...formData,
//       [field]: value,
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
//         // Email is not included since it's disabled and shouldn't be updated
//       };

//       const response = await updateCompanyDetails(
//         `/company/update-company/${session?.user.id}`,
//         payload
//       );

//       if (response?.data?.success) {
//         toast.success("Company details updated successfully");
//         mutate(); // Revalidate the data after successful update
//         setInitialCompanyName(formData.companyName); // Update initial value after successful save
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
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) => handleChange("email", e.target.value)} 
//               className="bg-[#1B2236] h-12 border-none text-white"
//               disabled 
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="companyName" className="text-white dm-sans text-base font-normal">
//               Company Name
//             </Label>
//             <Input
//               id="companyName"
//               type="text" 
//               value={formData.companyName}
//               onChange={(e) => handleChange("companyName", e.target.value)}
//               className="bg-[#1B2236] h-12 border-none text-white"
//             />
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
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { data: session, status } = useSession();
  console.log('session: ', session, 'status: ', status);

  // Initialize formData with empty values, will be updated from API
  const [formData, setFormData] = useState({
    email: "",
    companyName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [initialCompanyName, setInitialCompanyName] = useState("");

  // Fetch company details only when session is ready
  const { data, error: swrError, mutate, isLoading: swrIsLoading } = useSWR(
    status === "authenticated" && session?.user?.id 
      ? `/company/company-details/${session.user.id}` 
      : null,
    getCompanyDetails,
    { 
      revalidateOnFocus: false,
      onSuccess: (response) => {
        console.log('API Response:', response); // Log the full response
        // Handle different possible response structures
        const companyData = response?.data?.data || response?.data || {};
        setFormData({
          email: companyData.email || "",
          companyName: companyData.companyName || "",
        });
        setInitialCompanyName(companyData.companyName || "");
      },
      onError: (err) => {
        console.error('SWR Error:', err); // Log any errors
      },
    }
  );

  // Determine if data is loading (initial fetch)
  const isDataLoading = swrIsLoading && !swrError && status === "authenticated";

  // Update formData if session changes and data is available
  useEffect(() => {
    if (status === "authenticated" && data) {
      console.log('Data in useEffect:', data); // Log data for debugging
      const companyData = data?.data?.data || data?.data || {};
      setFormData({
        email: companyData.email || "",
        companyName: companyData.companyName || "",
      });
      setInitialCompanyName(companyData.companyName || "");
    }
  }, [status, data]);

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast.error("User ID not found");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        companyName: formData.companyName,
        // Email is not included since it's disabled and shouldn't be updated
      };

      const response = await updateCompanyDetails(
        `/company/update-company/${session?.user.id}`,
        payload
      );

      if (response?.data?.success) {
        toast.success("Company details updated successfully");
        mutate(); // Revalidate the data after successful update
        setInitialCompanyName(formData.companyName); // Update initial value after successful save
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

  // Check if there are changes in companyName
  const hasChanges = formData.companyName !== initialCompanyName;

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
        </div>

        <div>
          <Button
            className="mt-4 bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] dm-sans text-white flex items-center justify-center hover:cursor-pointer"
            onClick={handleSave}
            disabled={isLoading || !hasChanges} // Disable if loading or no changes
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