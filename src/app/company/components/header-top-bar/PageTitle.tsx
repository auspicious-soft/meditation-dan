"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const PageTitle = () => {
  const pathname = usePathname();
  const router = useRouter();

  const lastSegment = pathname.split("/").filter(Boolean).pop() || "Home";
  let pageTitle = lastSegment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const UserDetailPattern = /^\/company\/users\/details\/[0-9a-fA-F]{24}$/;
  const UserEditPattern = /^\/company\/users\/edit\/[0-9a-fA-F]{24}$/;
  const UserAddPattern = /^\/company\/users\/add-user$/;
  
  const isUserDetail = UserDetailPattern.test(pathname);
  const isUserEdit = UserEditPattern.test(pathname);
  const isUserAdd = UserAddPattern.test(pathname);
  if (isUserDetail) {
    pageTitle = "User Detail";
  }
  if (isUserEdit) {
    pageTitle = "Edit User";
  }

  return (
    <div className="flex items-center gap-2">
      {(isUserDetail || isUserEdit || isUserAdd) && (
        <Button
          variant="destructive"
          className="bg-[#0B132B] hover:bg-[#0B132B] p-0 h-7 w-7 hover:cursor-pointer"
          onClick={() => router.back()}
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </Button>
      )}
      <h1 className="text-2xl font-bold hidden md:block">{pageTitle}</h1>
    </div>
  );
};

export default PageTitle;
