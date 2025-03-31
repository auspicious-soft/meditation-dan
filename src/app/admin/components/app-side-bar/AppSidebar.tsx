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
import { useRouter } from "next/navigation";
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
        { title: "Audio Files", url: "/admin/audio-files" },
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
    {
      title: "Company Requests",
      url: "/admin/requests",
      icon: BellNotifactionIcon,
    },
    {
      title: "FAQs",
      url: "/admin/faqs",
      icon: BellNotifactionIcon,
    },
    
  ],
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  return (
    <Sidebar collapsible="icon" {...props} className="bg-[#1B2236] !py-6 !px-4 !border-0 rounded-tr-[20px] rounded-br-[20px]">
      <SidebarHeader className="px-4 pt-1 pb-0 md:p-0">
        <LogoCard />
      </SidebarHeader>
      <hr className="opacity-[0.30] mb-5 md:my-6"></hr>
      <SidebarContent className="px-0 py-0 md:p-0">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <div className="flex gap-2 items-center hover:cursor-pointer mt-6 text-white text-base font-normal px-4 py-0 md:p-0"
      onClick={()=> router.push('/admin/subscription-expiring')}>
        <BellNotifactionIcon />
         Subscriptions Expiring Today
      </div>
      <hr className="opacity-[0.30] mt-6"></hr>
    </Sidebar>
  );
}
