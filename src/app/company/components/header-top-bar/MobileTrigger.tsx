import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";
const MobileTrigger = () => {
  return (
    <div className=" items-center gap-2 flex md:hidden">
      <SidebarTrigger />
      <Link href="/">
        <Image src="/images/logo.svg" alt="Logo" width={109} height={54} />
      </Link>
    </div>
  );
};

export default MobileTrigger;
