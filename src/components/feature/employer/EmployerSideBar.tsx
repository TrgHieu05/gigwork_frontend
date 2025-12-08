'use client'

import {
  LayoutDashboard,
  FileSearch,
  FilePenLine,
  History,
  Bell,
  Settings,
  LogOut,
  Plus,
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
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoutModal, useLogoutModal } from "@/components/shared/LogoutModal";

const itemsTop = [
  {
    title: "Dashboard",
    url: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Jobs",
    url: "/employer/jobs",
    icon: FileSearch,
  },
  {
    title: "My Jobs",
    url: "/employer/my-jobs",
    icon: FilePenLine,
  },
  {
    title: "History",
    url: "/employer/history",
    icon: History,
  },
  {
    title: "Notifications",
    url: "/employer/notifications",
    icon: Bell,
  },
]

const itemsBottom = [
  {
    title: "Settings",
    url: "/employer/settings",
    icon: Settings,
  },
]

// Mock user data
const mockUser = {
  name: "Jane Smith",
  avatar: null,
};

export function EmployerSideBar() {
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
          <div>
            {/* Logo */}
            <SidebarHeader className="px-4 pb-4">
              <Link href="/employer/dashboard" className="flex items-center">
                <span className="text-2xl font-bold">
                  <span className="text-primary">gig</span>
                  <span className="text-foreground">work</span>
                </span>
              </Link>
            </SidebarHeader>

            {/* Post Job CTA */}
            <div className="px-3 mb-4">
              <Link href="/employer/create-job">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </Link>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {itemsTop.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url}>
                        <Link href={item.url} className={pathname === item.url ? "bg-primary text-primary-foreground" : ""}>
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
                  <SidebarMenuButton asChild isActive={pathname === "/employer/profile"}>
                    <Link href="/employer/profile" className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{mockUser.name}</span>
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
  );
}