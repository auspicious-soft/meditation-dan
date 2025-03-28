// import type { Metadata } from "next";
// import "./globals.css";
// import { DM_Sans } from "next/font/google";
// import { Toaster } from "sonner";

// // const dmSans = ({
// //   subsets: ["latin"],
// //   weight: ["400", "500", "700"], 
// //   variable: "--font-dm-sans",
// // });

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   weight: ["400", "500", "700"], 
//   variable: "--font-dm-sans",
// });

// export const metadata: Metadata = {
//   title: "Meditation",
//   description: "",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
    
//     // <body className={` ${dmSans.variable}`}>{children}</body>
//     // <div >{children}</div>
//     <html lang="en">
//       <body className={dmSans.variable}>
//       <Toaster />    
//         {children}</body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { auth } from "@/auth";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-dm-sans",
});

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

  return (
  
    <html lang="en">
      <body className={`${dmSans.variable}`} suppressHydrationWarning>
        <SessionProvider session={session}>
          <Toaster richColors />
          <AppRouterCacheProvider>
            {children}
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}