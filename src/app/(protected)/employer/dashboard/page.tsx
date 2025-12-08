"use client";

import { StatsCard } from "@/components/shared/StatsCard";
import { RecentJobsCard, Job } from "@/components/feature/employer/RecentJobsCard";
import {
  PendingApplicationsCard,
  Application,
} from "@/components/feature/employer/PendingApplicationsCard";
import { FileText, Briefcase, Users } from "lucide-react";

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: "1",
    title: "Construction Helper in District 7",
    status: "active",
    postedDate: "05/12/2024",
    applicationsCount: 12,
  },
  {
    id: "2",
    title: "Warehouse Loading Staff",
    status: "active",
    postedDate: "03/12/2024",
    applicationsCount: 8,
  },
  {
    id: "3",
    title: "Office Cleaning Staff",
    status: "closed",
    postedDate: "28/11/2024",
    applicationsCount: 15,
  },
  {
    id: "4",
    title: "Weekend Restaurant Helper",
    status: "active",
    postedDate: "25/11/2024",
    applicationsCount: 6,
  },
  {
    id: "5",
    title: "Part-time Delivery Driver",
    status: "draft",
    postedDate: "20/11/2024",
    applicationsCount: 0,
  },
];

const mockApplications: Application[] = [
  {
    id: "1",
    applicantName: "John Smith",
    jobId: "1",
    jobTitle: "Construction Helper in District 7",
    appliedDate: "Today, 09:30",
  },
  {
    id: "2",
    applicantName: "Emily Johnson",
    jobId: "2",
    jobTitle: "Warehouse Loading Staff",
    appliedDate: "Today, 08:15",
  },
  {
    id: "3",
    applicantName: "Michael Brown",
    jobId: "1",
    jobTitle: "Construction Helper in District 7",
    appliedDate: "Yesterday, 16:45",
  },
  {
    id: "4",
    applicantName: "Sarah Davis",
    jobId: "4",
    jobTitle: "Weekend Restaurant Helper",
    appliedDate: "Yesterday, 14:20",
  },
];

export default function EmployerDashboard() {
  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Applications"
          value={45}
          icon={FileText}
          trend={12}
          description="this month"
        />
        <StatsCard
          title="Jobs Posted"
          value={8}
          icon={Briefcase}
          trend={3}
          description="this month"
        />
        <StatsCard
          title="Employees Hired"
          value={23}
          icon={Users}
          trend={5}
          description="this month"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <RecentJobsCard jobs={mockJobs} />

        {/* Pending Applications */}
        <PendingApplicationsCard applications={mockApplications} />
      </div>
    </div>
  );
}