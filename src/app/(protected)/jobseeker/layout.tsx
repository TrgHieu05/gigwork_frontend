import { JobseekerSidebar } from "@/components/feature/jobseeker/JobseekerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function JobseekerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container h-screen w-screen flex flex-row">
        {/* LEFT */}
        <SidebarProvider>
            <JobseekerSidebar />
        </SidebarProvider>
        
        {/* RIGHT */}
        <div className="h-full w-5/6 p-6">
            {children}
        </div>
    </div>
  );
}
