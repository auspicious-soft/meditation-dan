import React from "react";
import PageTitle from "./PageTitle";
import UserProfile from "./UserProfile";
import MobileTrigger from "./MobileTrigger";
import NotificationsPanel from "./NotificationCard";

const TopBar = () => {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap md:flex-row">
      <PageTitle />
      <MobileTrigger />
      <div className="card-bg rounded-lg p-[10px] flex items-center justify-between gap-5"> 
      <NotificationsPanel />
        <UserProfile />
      </div>
    </div>
  );
};

export default TopBar;
