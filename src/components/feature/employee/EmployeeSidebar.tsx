"use client"

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  History,
  Bell,
  Settings,
  LogOut,
  User,
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
  SidebarHeader,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoutModal, useLogoutModal } from "@/components/shared/LogoutModal";
import { authService } from "@/services/auth";

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
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user?.email) {
      setUserName(user.email.split("@")[0]);
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    closeModal();
    router.push("/login");
  };

  return (
    <>
      <Sidebar>
        <SidebarContent className="flex flex-col justify-between py-4">
          {/* Logo */}
          <div>
            <SidebarHeader className="px-4 pb-4">
              <Link href="/employee/dashboard" className="flex items-center">
                <span className="text-2xl font-bold">
                  <span className="text-primary">gig</span>
                  <span className="text-foreground">work</span>
                </span>
              </Link>
            </SidebarHeader>

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
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Profile */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/employee/profile"}>
                    <Link href="/employee/profile" className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{userName}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

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
