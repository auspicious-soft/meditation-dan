"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import LogoCard from "./LogoCard";
import { NavMain } from "./NavMain";
import { AudioTagesIcon, BellNotifactionIcon, CompassIcon, SecurityIcon, SubscriptionIcon, UsersIcon } from "@/lib/svg";

// Sample data for the sidebar menu
const data = {
  navMain: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: CompassIcon 
    },
    {
      title: "Users",
      url: "#",
      icon: UsersIcon,
      items: [
        { title: "Company Lists", url: "/admin/company-lists" },
        { title: "User Lists", url: "/admin/user-lists" },
        { title: "Blocked Users", url: "/admin/blocked-users" },
      ],
    },
    {
      title: "Audio Library",
      url: "#",
      icon: SecurityIcon,
      items: [
        { title: "All Collections", url: "/admin/all-collections" },
        { title: "User Lists", url: "/admin/audio-files" },
      ],
    },
    {
      title: "Audio Tags",
      url: "/admin/audio-tags",
      icon: AudioTagesIcon,
    },
    {
      title: "Subscription",
      url: "/admin/subscription",
      icon: SubscriptionIcon,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: SubscriptionIcon,
    },
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#1B2236] !py-6 !px-4 !border-0 rounded-tr-[20px] rounded-br-[20px]">
      <SidebarHeader className="px-4 pt-1 pb-0 md:p-0">
        <LogoCard />
      </SidebarHeader>
      <hr className="opacity-[0.30] mb-5 md:my-6"></hr>
      <SidebarContent className="px-4 py-0 md:p-0">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <div className="flex gap-2 items-center mt-6 text-white text-base font-normal px-4 py-0 md:p-0">
        <BellNotifactionIcon />
         Subscriptions Expiring in <br></br>1 Week
      </div>
      <hr className="opacity-[0.30] mt-6"></hr>
    </Sidebar>
  );
}
