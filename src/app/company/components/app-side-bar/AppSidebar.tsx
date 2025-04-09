"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import LogoCard from "./LogoCard";
import { NavMain } from "./NavMain";
import {  BellNotifactionIcon, CompassIcon, SubscriptionIcon, UsersIcon } from "@/lib/svg";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { getCompanyDetails } from "@/services/company-services";
import { formatDistanceToNowStrict, parseISO, isBefore } from "date-fns";

// Sample data for the sidebar menu
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/company/dashboard",
      icon: CompassIcon 
    },

    {
      title: "Users",
      url: "/company/users",
      icon: UsersIcon,
    },
    {
      title: "Blocked Users",
      url: "/company/blocked-users",
      icon: UsersIcon,
    },

    {
      title: "Subscription",
      url: "/company/subscription",
      icon: SubscriptionIcon,
    },
    
    {
      title: "Join Requests",
      url: "/company/join-request",
      icon: BellNotifactionIcon,
   
    },
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  const {data:companyDetails} = useSWR(`/company/company-details/${session.data?.user?.id}`,getCompanyDetails, { revalidateOnFocus: false });

  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#1B2236] !py-6 !px-4 !border-0 rounded-tr-[20px] rounded-br-[20px]">
      <SidebarHeader className="px-4 pt-1 pb-0 md:p-0">
        <LogoCard />
      </SidebarHeader>
      <hr className="opacity-[0.30] mb-5 md:my-6"></hr>
      <SidebarContent className="px-4 py-0 md:p-0">
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <div className="flex gap-2 items-center mt-6 text-white text-base font-normal px-4 py-0 md:p-0">
        <BellNotifactionIcon />
         Subscription Expiring in <br></br>1 Week
      </div> */}

{companyDetails?.data?.data?.subscriptionExpiryDate && (
  <div className="flex gap-2 items-center mt-6 text-white text-base font-normal px-4 py-0 md:p-0">
    <BellNotifactionIcon />
    <div>
      Subscription expires in <br />
      {isBefore(new Date(companyDetails.data.data.subscriptionExpiryDate), new Date())
        ? "Expired"
        : formatDistanceToNowStrict(
            parseISO(companyDetails.data.data.subscriptionExpiryDate),
            { unit: "day", addSuffix: false }
          )}
    </div>
  </div>
)}

      <hr className="opacity-[0.30] mt-6"></hr>
    </Sidebar>
  );
}
