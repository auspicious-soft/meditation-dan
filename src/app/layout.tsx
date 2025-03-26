import type { Metadata } from "next";
import "./globals.css";
// import { DM_Sans } from "next/font/google";

const dmSans = ({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Meditation",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    // <body className={` ${dmSans.variable}`}>{children}</body>
    // <div >{children}</div>
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
