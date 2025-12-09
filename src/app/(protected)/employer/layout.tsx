import { EmployerSideBar } from "@/components/feature/employer/EmployerSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleProvider } from "@/contexts/RoleContext";

export default function EmployerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleProvider role="employer">
      <div className="h-screen w-screen flex flex-row">
        {/* LEFT */}
        <SidebarProvider>
          <EmployerSideBar />
        </SidebarProvider>

        {/* RIGHT */}
        <div className="h-full flex-1 bg-[#f9f9f9]">
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}