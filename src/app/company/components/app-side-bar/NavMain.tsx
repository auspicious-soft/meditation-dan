"use client"

import React from "react"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ReactNode } from "react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: string | (() => ReactNode);
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="p-0 dm-sans">
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || (item.items && item.items.some(sub => pathname === sub.url))

          return item.items ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem className={isActive ? "" : ""}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className={`cursor-pointer px-[12px] py-[10px] dm-sans h-auto ${isActive ? "bg-[#1a3f70]" : "font-normal"}`}>
                  {item.icon && React.createElement(item.icon, { className: "!h-5 !w-5" })}
                    <span className="dm-sans">{item.title}</span>
                    <ChevronRight className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${isActive ? "rotate-[90deg]" : "rotate-0"}`} />

                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="border-0">
                    {item.items.map((subItem) => {
                      const isSubActive = pathname === subItem.url
                      return (
                        <SidebarMenuSubItem key={subItem.title} className={isSubActive ? "" : ""}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url} className= {`p-2 py-[10px] h-auto hover:!bg-[#0B132B]  ${isSubActive ? "bg-[#0B132B]" : " !text-[#fff] font-normal"}`}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title} className={isActive  ? "" : ""} >
              <SidebarMenuButton asChild tooltip={item.title} >
                <a href={item.url} className={`dm-sans px-[12px] py-[10px] h-auto flex items-center gap-2  ${isActive ? "bg-[#1a3f70]" : "font-normal"}`}>
                {item.icon && React.createElement(item.icon, { className: "!h-5 !w-5" })}
                  <span >{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
