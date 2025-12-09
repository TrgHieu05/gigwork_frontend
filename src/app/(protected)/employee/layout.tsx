import { EmployeeSidebar } from "@/components/feature/employee/EmployeeSidebar";
import { RoleProvider } from "@/contexts/RoleContext";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function EmployeeLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RoleProvider role="employee">
            <div className="h-screen w-screen flex flex-row">
                {/* LEFT */}
                <SidebarProvider>
                    <EmployeeSidebar />
                </SidebarProvider>

                {/* RIGHT */}
                <div className="h-full flex-1 bg-[#f9f9f9]">
                    {children}
                </div>
            </div>
        </RoleProvider>
    );
}
