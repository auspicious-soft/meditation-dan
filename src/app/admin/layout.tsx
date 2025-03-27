import type { Metadata } from "next";
import "../globals.css";
// import { DM_Sans } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-side-bar/AppSidebar";
import TopBar from "./components/header-top-bar/TopBar";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

// const dmSans = ({
//  subsets: ["latin"],
//  weight: ["400", "500", "700"],
//  variable: "--font-dm-sans",
// });

export const metadata: Metadata = {
 title: "Meditation",
 description: "",
};

export default async function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
    const session = await auth(); 

    if (!session) {
      redirect("/");
    }
  
    const userRole = (session as any)?.user?.role;
    const restrictedRoles = ['user', 'company']; 
    
    //Check if user has restricted role
    if (restrictedRoles.includes(userRole)) {
        return (
            <div>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
          <div className="flex flex-col items-center justify-center bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full p-8 text-center text-white border border-gray-700">
            <h1 className="text-3xl font-bold mb-4 text-red-400 animate-fade-in">
              Access Denied
            </h1>
            <p className="text-lg mb-6 opacity-90">
              You don&apos;t have permission to view this page.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#0000FF]	 to-[#0096FF] text-white font-semibold rounded-lg  transition-all duration-300 transform hover:scale-105"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
    }
  
 return (
//   <html lang="en">
//    <body >
<div>
    <SidebarProvider>
     <AppSidebar />
     <div className="flex flex-1 p-4 md:p-8 flex-col w-full md:w-[calc(100%-256px)] gap-8">
      <TopBar />
      <div className="flex w-full flex-col gap-4">{children}</div>
     </div>
    </SidebarProvider>
    </div>
//    </body>
//   </html>
 );
}
