"use client";

import { usePathname } from "next/navigation";

const PageTitle = () => {
  const pathname = usePathname();

  // Get the last part of the URL
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home";
  const pageTitle = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  return (
        <h1 className="text-2xl font-bold hidden md:block">{pageTitle}</h1>
  );
};

export default PageTitle;
