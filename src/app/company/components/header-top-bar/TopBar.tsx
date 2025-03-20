import React from "react";
import SearchBar from "./searchBar";
import PageTitle from "./PageTitle";
import NotificationsPanel from "./NotificationCard";
import UserProfile from "./UserProfile";
import MobileTrigger from "./MobileTrigger";

const TopBar = () => {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap md:flex-row">
      <PageTitle />
      <MobileTrigger />
      <div className="card-bg rounded-lg p-[10px] flex items-center justify-between gap-5">
        <div className="hidden md:block">
          <SearchBar />
        </div>
        <NotificationsPanel />
        <UserProfile />
      </div>
      <div className="block md:hidden  w-full card-bg rounded-lg p-[10px]">
        <SearchBar />
      </div>
    </div>
  );
};

export default TopBar;
