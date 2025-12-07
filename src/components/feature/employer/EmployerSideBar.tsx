'use client'

import { 
    LayoutDashboard,
    FileSearch,
    FilePenLine,
    History,
    Bell,
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
import { useRouter, usePathname } from "next/navigation";

const itemsTop = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Jobs",
        url: "/jobs",
        icon: FileSearch,
    },
    {
        title: "My Jobs",
        url: "/my-jobs",
        icon: FilePenLine,
    },
    {
        title: "History",
        url: "/history",    
        icon: History,
    },
    {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
    },
]

const itemsBottom = [
    {
        title: "Settings",
        url: "/settings",   
        icon: Settings,
    },
    {
        title: "Log out",
        url: "/logout",
        icon: LogOut,
    },
]

export function EmployerSideBar() {
    const router = useRouter();
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
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}