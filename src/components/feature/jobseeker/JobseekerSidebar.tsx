"use client"

import { 
    LayoutDashboard,
    Search,
    FileText,
    Settings,
    LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import Link from "next/link";

const itemsTop = [
    {
        title: "Dashboard",
        url: "/jobseeker/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Find Jobs",
        url: "/jobseeker/jobs",
        icon: Search,
    },
    {
        title: "My Applications",
        url: "/jobseeker/applications",
        icon: FileText,
    },
]

const itemsBottom = [
    {
        title: "Settings",
        url: "/jobseeker/settings",   
        icon: Settings,
    },
    {
        title: "Log out",
        url: "/logout",
        icon: LogOut,
    },
]

export function JobseekerSidebar() {
    const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between py-4">
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsTop.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemsBottom.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
