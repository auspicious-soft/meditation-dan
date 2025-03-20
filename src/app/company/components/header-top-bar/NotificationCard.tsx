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

const NotificationsPanel: React.FC = () => {
  const todayNotifications = [
    {
      id: 1,
      title: "New meditation uploaded: Stress Relief Session",
      time: "July 10, 2025, 10:30 AM",
      icon: "mail",
      status: "unread",
    },
    {
      id: 2,
      title: "John Doe approved for corporate access",
      time: "July 10, 2025, 9:00 AM",
      icon: "check",
      status: "unread",
    },
    {
      id: 3,
      title: "Maintenance scheduled on July 15, 2025.",
      time: "July 10, 2025, 8:15 AM",
      icon: "bell",
      status: "read",
    },
  ];

  const tomorrowNotifications = [
    {
      id: 4,
      title: "Push notification scheduled for 'New Content Alert",
      time: "July 11, 2025, 10:00 AM",
      icon: "check",
      status: "unread",
    },
    {
      id: 5,
      title: "John Doe approved for corporate access",
      time: "July 10, 2025, 9:00 AM",
      icon: "check",
      status: "unread",
    },
    {
      id: 6,
      title: "Maintenance scheduled on July 15, 2025.",
      time: "July 10, 2025, 8:15 AM",
      icon: "bell",
      status: "read",
    },
    {
      id: 7,
      title: "John Doe approved for corporate access",
      time: "July 10, 2025, 9:00 AM",
      icon: "mail",
      status: "unread",
    },
    {
      id: 8,
      title: "Maintenance scheduled on July 15, 2025.",
      time: "July 10, 2025, 8:15 AM",
      icon: "mail",
      status: "read",
    },
    {
      id: 9,
      title: "John Doe approved for corporate access",
      time: "July 10, 2025, 9:00 AM",
      icon: "bell",
      status: "unread",
    },
  ];

  // Function to render the appropriate icon
  const renderIcon = (iconType: string) => {
    switch (iconType) {
      case "mail":
        return <Mail className="w-5 h-5 text-white" />;
      case "check":
        return <Check className="w-5 h-5 text-white" />;
      case "bell":
        return <Bell className="w-5 h-5 text-white" />;
      default:
        return <Mail className="w-5 h-5 text-white" />;
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
      <SheetContent className="button-hide w-full !max-w-[692px] p-0 bg-[#1b2236] rounded-tl-[20px] text-white border-0 gap-5 sm:max-w-md crosshide ">
        <SheetHeader className="pb-0 pt-5 md:pt-8 md:px-9 md:pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex  justify-between flex-col gap-2">
              <SheetTitle className="text-white ext-white text-2xl font-bold ">
                Notifications
              </SheetTitle>
              <p className="text-[#d7d7d7] text-sm font-medium ">
                Stay Updated with Your Latest Notifications
              </p>
            </div>
            <div className="flex  gap-[24px]">
              <SheetClose className="cursor-pointer ring-offset-background transition-opacity focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <CustomCrossIcon />
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <hr className="opacity-[0.30] bg-[#666666]"></hr>

        <ScrollArea className="h-[calc(100vh-150px)] ">
          <div className="pt-0 px-4 md:px-9 pb-2">
            {/* Today's Notifications */}
            <div className="mb-6">
              <h2 className="text-[#d7d7d7] text-lg !font-normal mb-5">
                Today
              </h2>
              {todayNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start mb-5">
                  <div className="mr-3 mt-1 bg-white/10 rounded p-[10px]">
                    {renderIcon(notification.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-base">{notification.title}</p>
                    <p className="text-[#d7d7d7] text-sm ">
                      {notification.time}
                    </p>
                  </div>
                  <div className="ml-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notification.status === "unread"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tomorrow's Notifications */}
            <div>
              <h2 className="text-[#d7d7d7] text-lg !font-normal mb-4">
                Tomorrow
              </h2>
              {tomorrowNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start mb-5">
                  <div className="mr-3 mt-1 bg-white/10 rounded p-[10px]">
                    {renderIcon(notification.icon)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-base">{notification.title}</p>
                    <p className="text-[#d7d7d7] text-sm ">
                      {notification.time}
                    </p>
                  </div>
                  <div className="ml-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        notification.status === "unread"
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
