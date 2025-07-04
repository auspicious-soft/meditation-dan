import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { auth } from "@/auth";
import 'react-loading-skeleton/dist/skeleton.css'
import Providers from "@/components/progress-provider";


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
          <Providers>
               <Toaster
  position="top-center" // Centered at the top
  closeButton // Show close button by default
  duration={Infinity} // Toasts stay until dismissed
/>
            <AppRouterCacheProvider>
              {children}
            </AppRouterCacheProvider>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}