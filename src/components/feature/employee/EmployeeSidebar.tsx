"use client"

import {
  LayoutDashboard,
  Search,
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
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoutModal, useLogoutModal } from "@/components/shared/LogoutModal";

const itemsTop = [
  {
    title: "Dashboard",
    url: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Find Jobs",
    url: "/employee/jobs",
    icon: Search,
  },
  {
    title: "History",
    url: "/employee/history",
    icon: History,
  },
  {
    title: "Notification",
    url: "/employee/notifications",
    icon: Bell,
  },
]

const itemsBottom = [
  {
    title: "Settings",
    url: "/employee/settings",
    icon: Settings,
  },
]

export function EmployeeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, openModal, closeModal } = useLogoutModal();

  const handleLogout = () => {
    console.log("Logging out...");
    closeModal();
    router.push("/login");
  };

  return (
    <>
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

                {/* Logout Button */}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={openModal} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <LogOut />
                    <span>Log out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <LogoutModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleLogout}
      />
    </>
  )
}
