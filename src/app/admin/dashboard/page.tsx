import React from "react";
import SubscriptionReminderTable from "../components/(dasboard)/SubscriptionReminderTable";
import RecentNewUsers from "../components/(dasboard)/RecentNewUsers";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth()
  return (
    <div className="flex flex-1 flex-col gap-4">
      <h1 className="text-2xl font-bold block md:hidden">Dashboard</h1>
      <div className="flex flex-1 flex-col gap-4">
        
          <div className="col-span-12 space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9 ">
            <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
            Subscriptions Expiring Within One Week
            </h2>
            <SubscriptionReminderTable />
          </div>         
        

        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12  space-y-6 bg-[#1b2236] rounded-[12px] md:rounded-[20px] py-4 px-4 md:py-8 md:px-9">
            <h2 className="text-white text-[20px] md:text-2xl font-bold mb-3">
              Recent New Users
            </h2>
            <RecentNewUsers />
          </div>
        </div>
      </div>
    </div>
  );
}
