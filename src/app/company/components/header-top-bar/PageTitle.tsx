"use client";

import { usePathname } from "next/navigation";

const PageTitle = () => {
  const pathname = usePathname();
  
  // Get the last part of the URL
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home";
  let pageTitle = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  // Check if the pathname matches the pattern for company detail
  const companyDetailPattern = /^\/admin\/company-lists\/company-detail\/\d+$/;
  if (companyDetailPattern.test(pathname)) {
    pageTitle = "Company Detail";
  }
  const userprofileEditPattern = /^\/admin\/user-lists\/user-profile-edit\/\d+$/;
  if (userprofileEditPattern.test(pathname)) {
    pageTitle = "User Profile Edit";
  }
  const blockedUserPattern = /^\/admin\/blocked-users\/user-detail\/\d+$/;
  if (blockedUserPattern.test(pathname)) {
    pageTitle = "Blocked User Detail";
  }
  return (
        <h1 className="text-2xl font-bold hidden md:block">{pageTitle}</h1>
  );
};

export default PageTitle;
