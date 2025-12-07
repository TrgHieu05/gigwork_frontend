import { EmployerSideBar } from "@/components/feature/employer/EmployerSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function EmployerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container h-screen w-screen flex flex-row">
        {/* LEFT */}
        <SidebarProvider>
            <EmployerSideBar />
        </SidebarProvider>
        
        {/* RIGHT */}
        <div className="h-full w-5/6">
            {children}
        </div>
    </div>
  );
}