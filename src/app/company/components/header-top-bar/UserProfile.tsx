import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserProfile = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="ring-0 cursor-pointer border-0 bg-transparent hover:bg-transparent outline-none p-0 h-auto w-auto [&_svg]:size-10 focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-0"
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 bg-[#1b2236] text-white border-[#666666]">
        <DropdownMenuGroup>
          <div className="flex items-center p-[8px]">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm">Stephanie Sharkey</p>
              <p className="text-[12px]">steph56@gmail.com</p>
            </div>
          </div>
          <DropdownMenuItem className="p-0 !bg-transparent">
            <Link
              className="gap-2 w-full p-[8px] hover:bg-[#1a3f70] hover:text-white rounded-sm dm-sans"
              href="/admin/admin-profile"
            >
              User Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className=" cursor-pointer gap-2 text-left justify-start bg-transparent w-full p-[8px] hover:bg-[#1a3f70] hover:text-white rounded-sm dm-sans">
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="md:p-11 bg-[#1b2236] rounded-[20px] border-0 !max-w-[428px] !gap-5">
                <AlertDialogHeader className="gap-4">
                  <AlertDialogTitle className="flex justify-center text-white text-2xl">Logout</AlertDialogTitle>
                  <AlertDialogDescription className="opacity-80 text-center justify-start text-white text-base">
                     Hi Alesva Rawles, <br></br>Are you sure you want to log out from Admin Panel?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="!justify-center">
                  <AlertDialogCancel className="cursor-pointer !bg-[#1a3f70] !text-white rounded-lg  border-0 min-w-[170px] h-11">No</AlertDialogCancel>
                  <AlertDialogAction className=" cursor-pointer !bg-[#ff4747] !text-white rounded-lg min-w-[170px] h-11">Yes</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
