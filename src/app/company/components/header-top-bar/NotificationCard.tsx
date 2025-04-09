"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X as Mail, Check, Bell } from "lucide-react";
import { CustomCrossIcon, NotifactionIcon } from "@/lib/svg";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { getCompanyNotifications } from "@/services/company-services";
import { formatDate } from "@/lib/utils";

const NotificationsPanel: React.FC = () => {
  const session = useSession();
  const { data } = useSWR(
    `/company/${session.data?.user?.id}/notifications`,
    getCompanyNotifications,
    { revalidateOnFocus: false }
  );
  
  const allNotifications = data?.data?.data || [];
  
  // Get today's date for comparison (April 8, 2025)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  // Calculate yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Filter notifications
  const todayNotifications = allNotifications.filter((notification: any) => {
    const notifDate = new Date(notification.date);
    return (
      notifDate.toDateString() === today.toDateString() &&
      !isNaN(notifDate.getTime()) // Ensure valid date
    );
  });
  
  const pastNotifications = allNotifications.filter((notification: any) => {
    const notifDate = new Date(notification.date);
    return (
      notifDate < today &&
      !isNaN(notifDate.getTime()) // Ensure valid date
    );
  });

  
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "mail":
        return <Mail className="w-5 h-5 text-white" />;
      case "check":
        return <Check className="w-5 h-5 text-white" />;
      case "bell":
        return <Bell className="w-5 h-5 text-white" />;
      default:
        return <Bell className="w-5 h-5 text-white" />; // Default to bell
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer border-0 bg-transparent hover:bg-transparent outline-none p-0 h-auto w-auto [&_svg]:!size-6 relative"
        >
          <NotifactionIcon />
        </Button>
      </SheetTrigger>
      <SheetContent className="button-hide w-full !max-w-[692px] p-0 bg-[#1b2236] rounded-tl-[20px] text-white border-0 gap-5 sm:max-w-md crosshide">
        <SheetHeader className="pb-0 pt-5 md:pt-8 md:px-9 md:pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex justify-between flex-col gap-2">
              <SheetTitle className="text-white text-2xl font-bold">
                Notifications
              </SheetTitle>
              <p className="text-[#d7d7d7] text-sm font-medium">
                Stay Updated with Your Latest Notifications
              </p>
            </div>
            <div className="flex gap-[24px]">
              <SheetClose className="cursor-pointer ring-offset-background transition-opacity focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <CustomCrossIcon />
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <hr className="opacity-[0.30] bg-[#666666]"></hr>

        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className="pt-0 px-4 md:px-9 pb-2">
            {/* Today's Notifications */}
            {todayNotifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-[#d7d7d7] text-lg !font-normal mb-5">
                  Today
                </h2>
                {Array.isArray(todayNotifications) && todayNotifications.map((notification: any) => (
                  <div key={notification._id} className="flex items-start mb-5">
                    <div className="mr-3 mt-1 bg-white/10 rounded p-[10px]">
                      {renderIcon(notification.icon || "bell")}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-base">{notification.description}</p>
                      <p className="text-[#d7d7d7] text-sm">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Past Notifications */}
            {pastNotifications.length > 0 && (
              <div>
                <h2 className="text-[#d7d7d7] text-lg !font-normal mb-4">
                  Yesterday and Past
                </h2>
                {Array.isArray(pastNotifications) && pastNotifications.map((notification: any) => (
                  <div key={notification.id} className="flex items-start mb-5">
                    <div className="mr-3 mt-1 bg-white/10 rounded p-[10px]">
                      {renderIcon(notification.icon || "bell")}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-base">{notification.description}</p>
                      <p className="text-[#d7d7d7] text-sm">
                        {formatDate(notification.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Notifications Message */}
            {allNotifications.length === 0 && (
              <div className="text-center py-10">
                <p className="text-[#d7d7d7] text-base">No notifications available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;