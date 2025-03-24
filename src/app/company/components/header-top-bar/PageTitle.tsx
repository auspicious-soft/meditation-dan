"use client";

import { usePathname } from "next/navigation";

const PageTitle = () => {
  const pathname = usePathname();
  
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home";
  let pageTitle = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  
  // const Userpattern = /^\/company\/users\/add-user$/;
  // if(Userpattern.test(pathname)){
  //   pageTitle="User Profile Edit"
  // }

  // const UserList = /^\/company\/(users)\/user-list\/\d+$/;
  // if (UserList.test(pathname)) {
  //   pageTitle = "Users";
  // }

  // const UserDetail = /^\/company\/users\/\d+$/;
  // if (UserDetail.test(pathname)) {
  //   pageTitle = "User  Detail";
  // }

  // const JoinRequests = /^\/company\/join-request$/;
  // if (JoinRequests.test(pathname)) {
  //   pageTitle = "Join Requests";
  // }

  // const UserRequest = /^\/company\/join-request\/single-user-request\d+$/;
  // if (UserRequest.test(pathname)) {
  //   pageTitle = "User Request";
  // }

  // const companyDetailPattern = /^\/admin\/company-lists\/company-detail\/\d+$/;
  // if (companyDetailPattern.test(pathname)) {
  //   pageTitle = "Company Detail";
  // }

  // const CompanyProfile = /^\/company\/company-profile\/\d+$/;
  // if (CompanyProfile.test(pathname)) {
  //   pageTitle = "Company  Profile";
  // }



  return (
        <h1 className="text-2xl font-bold hidden md:block">{pageTitle}</h1>
  );
};

export default PageTitle;
