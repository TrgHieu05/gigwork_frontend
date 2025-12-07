import { AdminSidebar } from "@/components/feature/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container h-screen w-screen flex flex-row">
        {/* LEFT */}
        <SidebarProvider>
            <AdminSidebar />
        </SidebarProvider>
        
        {/* RIGHT */}
        <div className="h-full w-5/6 p-6">
            {children}
        </div>
    </div>
  );
}
