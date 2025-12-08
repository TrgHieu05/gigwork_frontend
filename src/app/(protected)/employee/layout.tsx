import { EmployeeSidebar } from "@/components/feature/employee/EmployeeSidebar";
import { RoleProvider } from "@/contexts/RoleContext";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function EmployeeLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <RoleProvider role="employee">
            <SidebarProvider>
                <div className="flex min-h-screen w-full">
                    <EmployeeSidebar />
                    <main className="flex-1 bg-[#f9f9f9]">{children}</main>
                </div>
            </SidebarProvider>
        </RoleProvider>
    );
}
