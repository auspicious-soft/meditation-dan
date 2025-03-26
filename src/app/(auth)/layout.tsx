import "../globals.css";
// import { DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import localFont from "next/font/local";
// import "./globals.css";
import { Toaster } from "sonner";
// import Providers from "./components/ProgressBarProvider";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body >
      <SessionProvider session={session}>
          <SessionProvider>
          <Toaster richColors />
          <AppRouterCacheProvider>
            {children}
          </AppRouterCacheProvider>
          </SessionProvider>
        </SessionProvider>  
    </body>
    </html>

  );
}
