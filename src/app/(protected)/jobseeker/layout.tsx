import { JobseekerSidebar } from "@/components/feature/jobseeker/JobseekerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleProvider } from "@/contexts/RoleContext";

export default function JobseekerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RoleProvider role="jobseeker">
      <div className="h-screen w-screen flex flex-row">
        {/* LEFT */}
        <SidebarProvider>
          <JobseekerSidebar />
        </SidebarProvider>

        {/* RIGHT */}
        <div className="h-full flex-1 bg-[#f9f9f9]">
          {children}
        </div>
      </div>
    </RoleProvider>
  );
}
