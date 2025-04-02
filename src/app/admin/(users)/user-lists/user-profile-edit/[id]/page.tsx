// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { getSingleUser } from "@/services/admin-services";
// import { useParams } from "next/navigation";
// import React, { useState, useEffect } from "react";
// import useSWR from "swr";

// // Define the UserData type for form data
// interface UserData {
//   firstName: string;
//   lastName: string;
//   gender: string;
//   email: string;
//   dob: string;
//   companyName: string;
//   meditationListen?: string;
// }

// // Fetcher function to get single user details by ID
// const fetcher = (url: string) => getSingleUser(url);

// const Page = () => {
//   const { id } = useParams(); // Get the user ID from URL params

//   // Fetch user data using SWR
//   const { data, error, isLoading } = useSWR(`/admin/user/${id}` ,fetcher,{
    
//       revalidateOnFocus: false,
//       refreshInterval: 0
  
//   });
//   console.log("Fetched Data:", data);

//   // Initialize formData with empty values until data is fetched
//   const [formData, setFormData] = useState<UserData>({
//     firstName: "",
//     lastName: "",
//     gender: "",
//     email: "",
//     dob: "",
//     companyName: "",
//     meditationListen: "",
//   });
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   // useEffect(() => {
//   //   if (data?.data?.data) {
//   //     setFormData(data.data.data);
//   //   }
//   // }, [data]);
//   useEffect(() => {
//     if (data?.data?.data) {
//       setFormData({
//         ...data.data.data,
//         dob: data.data.data.dob.split("T")[0], // Extract only the date part
//       });
//     }
//   }, [data]);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading user data: {error.message}</div>;

//   const handleChange = (field: keyof UserData, value: string) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   const handleSave = () => {
//     console.log("Saving Data:", formData);
//     // Call API to update user data
//   };

//   const handleDeleteAccount = () => {
//     console.log("Deleting Account");
//     setIsDialogOpen(false);
//     // Call API to delete user account
//   };

//   const fields = [
//     { label: "First Name", field: "firstName" },
//     { label: "Last Name", field: "lastName" },
//     { label: "Gender", field: "gender" },
//     { label: "Email Address", field: "email" },
//     { label: "Birthday", field: "dob" },
//     { label: "Company Name", field: "companyName" },
//     { label: "Total Meditation Listened To", field: "meditationListen" },
//   ];

//   return (
//     <div className="grid grid-cols-12 gap-4 h-screen w-full">
//       <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
//         <div>
//         {/* {!id || id.length !== 24 ? null : ( */}
//           <h2 className="text-white text-xl font-medium">
//             {formData.firstName} {formData.lastName}
//           </h2>
//           {/* )} */}
//           <p className="opacity-80">{formData.email}</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {fields.map(({ label, field }) => (
//             <div className="space-y-2" key={field}>
//               <Label htmlFor={field} className="text-white opacity-80 text-base font-normal">
//                 {label}
//               </Label>
//               <Input
//                 id={field}
//                 type="text"
//                 value={formData[field as keyof UserData] || ""}
//                 onChange={(e) => handleChange(field as keyof UserData, e.target.value)}
//                 className="bg-[#0f172a] h-12 border-none"
//               />
//             </div>
//           ))}
//         </div>

//         <div className="flex flex-wrap gap-4 mt-12">
//           <Button
//             variant="destructive"
//             className="bg-[#FF4747] w-48 h-11 hover:bg-[#FF4747] hover:cursor-pointer"
//             onClick={() => setIsDialogOpen(true)}
//           >
//             Delete Account
//           </Button>
//           <Button
//             variant="default"
//             className="bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] hover:cursor-pointer"
//             onClick={handleSave}
//           >
//             Save
//           </Button>
//         </div>


//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
//             <DialogHeader className="text-center">
//               <DialogTitle className="text-lg font-semibold text-center">Delete Account</DialogTitle>
//               <DialogDescription className="text-sm text-gray-400 text-center">
//                 Are you sure you want to delete your account?
//               </DialogDescription>
//             </DialogHeader>
//             <DialogFooter className="flex  justify-center gap-4 mt-4">
//               <Button
//                 variant="outline"
//                 className="bg-[#1A3F70] border-[#0c4a6e] hover:bg-[#1A3F70] hover:text-white hover:cursor-pointer w-44 h-11"
//                 onClick={() => setIsDialogOpen(false)}
//               >
//                 No
//               </Button>
//               <Button
//                 variant="destructive"
//                 className="bg-[#FF4747] hover:bg-[#FF4747] hover:cursor-pointer w-44 h-11"
//                 onClick={handleDeleteAccount}
//               >
//                 Yes
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default Page;




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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSingleUser, updateUser, deleteUser } from "@/services/admin-services";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";

// Define the UserData type for form data
interface UserData {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  dob: string;
  companyName: string;
  meditationListen?: string;
}

// Fetcher function to get single user details by ID
const fetcher = (url: string) => getSingleUser(url);

const Page = () => {
  const { id } = useParams(); // Get the user ID from URL params

  // Fetch user data using SWR
  const { data, error, isLoading } = useSWR(`/admin/user/${id}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  // Initialize formData with empty values until data is fetched
  const [formData, setFormData] = useState<UserData>({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    dob: "",
    companyName: "",
    meditationListen: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (data?.data?.data) {
      setFormData({
        ...data.data.data,
        dob: data.data.data.dob.split("T")[0], // Extract only the date part
      });
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data: {error.message}</div>;

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(`/admin/user/update/${id}`, formData);
      console.log("User updated successfully:", formData);
      // Revalidate the user list data
      mutate("/admin/get-all-users");
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(`/admin/delete-user/${id}`);
      console.log("User deleted successfully");
      setIsDialogOpen(false);
      mutate("/admin/get-all-users");
      window.location.href = "/admin/user-lists";
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const fields = [
    { label: "First Name", field: "firstName" },
    { label: "Last Name", field: "lastName" },
    { label: "Gender", field: "gender" },
    { label: "Email Address", field: "email" },
    { label: "Birthday", field: "dob" },
    { label: "Company Name", field: "companyName" },
    { label: "Total Meditation Listened To", field: "meditationListen" },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 h-screen w-full">
      <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
        <div>
          <h2 className="text-white text-xl font-medium">
            {formData.firstName} {formData.lastName}
          </h2>
          <p className="opacity-80">{formData.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map(({ label, field }) => (
            <div className="space-y-2" key={field}>
              <Label htmlFor={field} className="text-white opacity-80 text-base font-normal">
                {label}
              </Label>
              <Input
                id={field}
                type="text"
                value={formData[field as keyof UserData] || ""}
                onChange={(e) => handleChange(field as keyof UserData, e.target.value)}
                className="bg-[#0f172a] h-12 border-none"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-12">
          <Button
            variant="destructive"
            className="bg-[#FF4747] w-48 h-11 hover:bg-[#FF4747] hover:cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            Delete Account
          </Button>
          <Button
            variant="default"
            className="bg-[#1A3F70] w-28 h-11 hover:bg-[#1A3F70] hover:cursor-pointer"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#1b2236] border-[#1F2937] w-[450px] p-6 flex flex-col items-center text-white rounded-lg">
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
    </div>
  );
};

export default Page;