// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { loginAction } from "@/actions"; // Ensure this function correctly sends a request
// import { toast } from "sonner";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { EyeOffIcon, EyeIcon } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import Link from "next/link";
// import { useSession } from "next-auth/react";
// import LogoAuth from "../components/LogoAuth";
// import BannerImage from "../components/BannerImage";
// import { text } from "stream/consumers";

// export default function LoginPage() {
//  const [email, setEmail] = useState("");
//  const [isPending, startTransition] = React.useTransition();
//  const router = useRouter();
//  const [errorMessage, setErrorMessage] = useState("");
//  const { data: session } = useSession();
//  const [firstName, setFirstName] = useState("");
//  const [lastName, setLastName] = useState("");
//  const [companyName, setCompanyName] = useState("");
//   const [gender, setGender] = useState("");
//   const [birthday, setBirthday] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);


//  useEffect(() => {
//   if (session) {
//    if ((session as any)?.user?.role === "company") {
//     console.log("(session as any)?.user?.role: ", (session as any)?.user?.role);
//     window.location.href = "/company/dashboard";
//    } else {
//     window.location.href = "/admin/dashboard";
//    }
//   }
//  }, [router, session]);

//  // Toggle password visibility
//  const togglePasswordVisibility = useCallback(() => {
//   setShowPassword((prev) => !prev);
//  }, []);

//  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
//   event.preventDefault();
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   const phoneRegex = /^\d{10}$/;
//   if (!emailRegex.test(email) && !phoneRegex.test(email)) {
//    toast.error("Please enter a valid email or phone number.");
//    return;
//   }
//   if (!password) {
//    toast.error("Password is required.");
//    return;
//   }
//   startTransition(async () => {
//    try {
//     const response = await loginAction({ email, password });
//     if (response?.success) {
//      toast.success("Logged in successfully");
//      // Redirect based on role
//      const userRole = response?.data?.user?.role;
//      console.log("response: ", response);
//      router.push(userRole === "company" ? "/company/dashboard" : "/admin/dashboard");
//     } else if (response?.message === "Invalid password") {
//      setErrorMessage("Incorrect password. Please try again.");
//     } else {
//      toast.error(response?.message || "Invalid email or password.");
//     }
//    } catch (error) {
//     console.error("Login action error:", error);
//     toast.error("Something went wrong! Please try again.");
//    }
//   });
//  };

//  return (
//   <div className="grid grid-cols-12 h-screen">
//    {/* Left Section - Signup Form */}
//    <div className=" col-span-12 md:col-span-5 flex justify-center items-center flex-col p-4 md:p-8">
//     <LogoAuth />
//     <div className="max-w-[400px] w-full">
//      <Card className=" w-full max-w-md bg-navy-950 text-white border-none shadow-none md:pt-20">
//       <CardHeader className="p-0">
//        <CardTitle className="text-white text-[30px] md:text-[36px]">Sign Up</CardTitle>
//        <p className="text-[#959595] text-base md:text-lg font-normal">Please sign up for an account to access and use the dashboard.</p>
//       </CardHeader>
//       <CardContent className="p-0">
//        <form onSubmit={handleSubmit}>
//         <div className="space-y-6">
 

// <div className="flex gap-[20px]">
// <Input
//   id="firstName"
//   type="text"
//   placeholder="First Name"
//   value={firstName}
//   onChange={(e) => setFirstName(e.target.value)}
//   className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
//   required
// />

// <Input
//         id="lastName"
//         type="text"
//         placeholder="Last Name"
//         value={lastName}
//         onChange={(e) => setLastName(e.target.value)}
//         className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
//         required
//       />
// </div>


// <Input id="email" type="text" placeholder="Email " value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]" required />

// <Input
//         id="companyName"
//         type="text"
//         placeholder="Company Name"
//         value={companyName}
//         onChange={(e) => setCompanyName(e.target.value)}
//         className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
// />


// <select
//     id="gender"
//     value={gender}
//     onChange={(e) => setGender(e.target.value)}
//     className="w-full  rounded-[10px] border !border-[#d9d9d9] bg-[#0b132b] text-[#959595] text-lg  leading-[27px] h-[60px]  focus:!border-blue-500 focus:ring-0"
//     required
//   >
//     <option value="" disabled>Gender</option>
//     <option value="male">Male</option>
//     <option value="female">Female</option>
//     <option value="other">Other</option>
//   </select>




// <div className="relative w-full">
//   <input
//     id="birthday"
//     type="text"
//     value={birthday}
//     onChange={(e) => setBirthday(e.target.value)}
//     onFocus={(e) => (e.target.type = "date")} 
//     onBlur={(e) => (e.target.type = birthday ? "date" : "text")} 
//     className="peer bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px] w-full px-3 text-[#959595]"
//     placeholder="Birthday"
//     required
//   />
//   <label
//     htmlFor="birthday"
//     className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#959595] text-lg pointer-events-none transition-all peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#959595] peer-valid:top-2 peer-valid:text-sm peer-valid:text-blue-500"
//   >
//     Birthday
//   </label>
// </div>



// <div className="relative">
//         <Input
//           id="password"
//           placeholder="Password"
//           type={showPassword ? "text" : "password"}
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="text-[#9a9a9a] bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
//           required
//           autoComplete="current-password"
//         />
//         <button
//           type="button"
//           className="text-[#9a9a9a] absolute right-4 top-5"
//           onClick={() => setShowPassword((prev) => !prev)}
//           aria-label="Toggle password visibility"
//         >
//           {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
//         </button>
//       </div>
      

//       <div className="relative mt-4">
//         <Input
//           id="confirmPassword"
//           type={showConfirmPassword ? "text" : "password"}
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
//           required
//         />
//         <button
//           type="button"
//           className="text-[#9a9a9a] absolute right-4 top-5"
//           onClick={() => setShowConfirmPassword((prev) => !prev)}
//           aria-label="Toggle confirm password visibility"
//         >
//           {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
//         </button>
//       </div>


  
         
//          {/* {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>} */}

//          <div className="flex items-center justify-between">

        
//           <Link href="/" className="text-[#9a9a9a] text-base font-medium">
//   Already have an account?
//   <span className="hover:underline"> Sign In</span>
// </Link>  
//          </div>

//          {/* Sign In Button */}
//          <Button type="submit" className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] hover:bg-[#1a3f70]" disabled={isPending}>
//           {isPending ? "Signing in..." : "Request Send"}
//          </Button>
//         </div>
//        </form>
//       </CardContent>
//      </Card>
//     </div>
//    </div>

//    {/* Right Section - Banner Image */}
//    <div className="col-span-12 md:col-span-7">
//     <BannerImage />
//    </div>
//   </div>
//  );
// }



"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signupAction } from "@/actions"; 
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSession } from "next-auth/react";
import LogoAuth from "../components/LogoAuth";
import BannerImage from "../components/BannerImage";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session } = useSession();

  
  useEffect(() => {
    if (session) {
      router.push("/admin/dashboard");
    }
  }, [router, session]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    
    // Console log all user details
    const userDetails = {
      firstName,
      lastName,
      email,
      companyName,
      gender,
      birthday,
      password,
    };
    console.log("User Signup Details:", userDetails);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!firstName || !lastName || !password || !gender || !birthday) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        const response:any = await signupAction({
          firstName, lastName,  email,  companyName,  gender,  birthday,  password,    });
        
        if (response?.success) {
          toast.success("Account created successfully");
          router.push("/admin/dashboard");
        } else {
          toast.error(response?.message || "Signup failed. Please try again.");
        }
      } catch (error) {
        console.error("Signup action error:", error);
        toast.error("Something went wrong! Please try again.");
      }
    });
  };



  return (
    <div className="grid grid-cols-12 h-screen">
      <div className="col-span-12 md:col-span-5 flex justify-center items-center flex-col p-4 md:p-8">
        <LogoAuth />
        <div className="max-w-[400px] w-full">
          <Card className="w-full max-w-md bg-navy-950 text-white border-none shadow-none md:pt-20">
            <CardHeader className="p-0">
              <CardTitle className="text-white text-[30px] md:text-[36px]">Sign Up</CardTitle>
              <p className="text-[#959595] text-base md:text-lg font-normal">
                Please sign up for an account to access and use the dashboard.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="flex gap-[20px]">
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                      required
                    />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                      required
                    />
                  </div>

                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                    required
                  />

                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                  />

                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-[10px] border !border-[#d9d9d9] bg-[#0b132b] text-[#959595] text-lg leading-[27px] h-[60px] focus:!border-blue-500 focus:ring-0"
                    required
                  >
                    <option value="" disabled>
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>

                  <div className="relative w-full">
                    <input
                      id="birthday"
                      type="text"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => (e.target.type = birthday ? "date" : "text")}
                      className="peer bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px] w-full px-3 text-[#959595]"
                      placeholder="Birthday"
                      required
                    />
                    <label
                      htmlFor="birthday"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#959595] text-lg pointer-events-none transition-all peer-focus:top-2 peer-focus:text-sm peer-focus:text-[#959595] peer-valid:top-2 peer-valid:text-sm peer-valid:text-blue-500"
                    >
                      Birthday
                    </label>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-[#9a9a9a] bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                      required
                    />
                    <button
                      type="button"
                      className="text-[#9a9a9a] absolute right-4 top-5"
                      onClick={togglePasswordVisibility}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-transparent rounded-[10px] border !border-[#d9d9d9] text-lg focus:!border-blue-500 focus:ring-0 leading-[27px] h-[60px]"
                      required
                    />
                    <button
                      type="button"
                      className="text-[#9a9a9a] absolute right-4 top-5"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
                    </button>
                  </div>

                  {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}

                  <div className="flex items-center justify-between">
                    <Link href="/" className="text-[#9a9a9a] text-base font-medium">
                      Already have an account?
                      <span className="hover:underline"> Sign In</span>
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1a3f70] h-auto rounded-lg text-white text-lg font w-full leading-[30px] hover:bg-[#1a3f70]"
                    disabled={isPending}
                  >
                    {isPending ? "Signing up..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-12 md:col-span-7">
        <BannerImage />
      </div>
    </div>
  );
}