"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckSquare, DollarSign, ArrowRight } from "lucide-react";
import Link from "next/link";

// Import extracted components
import { JobCalendar } from "@/components/feature/employee/JobCalendar";
import { EmployeeStatsCard } from "@/components/feature/employee/EmployeeStatsCard";
import { ActiveJobCard, type ActiveJob } from "@/components/feature/employee/ActiveJobCard";
import { ApplicationCard, type Application } from "@/components/feature/employee/ApplicationCard";

// Mock data
const mockStats = {
    applications: { count: 6, pending: 2 },
    jobsCompleted: { count: 3, thisMonth: 1 },
    totalEarned: { amount: 250, changePercent: 67.5 },
};

const mockActiveJobs: ActiveJob[] = [
    {
        id: "1",
        title: "Warehouse Assistant",
        company: "LogiCorp",
        salary: "$15/hr",
        status: "Upcoming",
        startDate: "20/12/2025",
        duration: "3 days",
        location: "71/10, TL14 Street, Anh Phu Dong Ward, District 12, TPHCM",
    },
    {
        id: "2",
        title: "Event Staff",
        company: "EventPro",
        salary: "$12/hr",
        status: "Upcoming",
        startDate: "22/12/2025",
        duration: "2 days",
        location: "Convention Center, District 7, TPHCM",
    },
    {
        id: "3",
        title: "Retail Associate",
        company: "FashionMart",
        salary: "$10/hr",
        status: "In Progress",
        startDate: "18/12/2025",
        duration: "5 days",
        location: "Vincom Plaza, District 1, TPHCM",
    },
];

const mockRecentApplications: Application[] = [
    {
        id: "1",
        title: "Restaurant Server",
        company: "Fine Dining Group",
        time: "2 days ago",
        status: "Pending",
    },
    {
        id: "2",
        title: "Retail Sales",
        company: "Fashion Inc.",
        time: "3 days ago",
        status: "Accepted",
    },
    {
        id: "3",
        title: "Delivery Driver",
        company: "QuickShip",
        time: "5 days ago",
        status: "Rejected",
    },
];

// Days with jobs (for calendar dots)
const daysWithJobs = [5, 17, 18, 20, 22];

export default function EmployeeDashboard() {
    const userName = "User";

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Welcome Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Welcome, <span className="text-primary">{userName}!</span>
                </h1>
            </div>

            {/* Main Content - 6/4 split using flex */}
            <div style={{ display: "flex", gap: "24px" }}>
                {/* Left Side - 60% */}
                <div style={{ flex: "6", minWidth: 0 }}>
                    {/* Stats Cards - horizontal row */}
                    <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                        <EmployeeStatsCard
                            title="Applications"
                            value={mockStats.applications.count}
                            subtitle={`${mockStats.applications.pending} is pending`}
                            icon={FileText}
                            iconBgColor="bg-blue-100"
                            iconColor="text-blue-600"
                        />
                        <EmployeeStatsCard
                            title="Job completed"
                            value={mockStats.jobsCompleted.count}
                            subtitle={`+${mockStats.jobsCompleted.thisMonth} this month`}
                            icon={CheckSquare}
                            iconBgColor="bg-green-100"
                            iconColor="text-green-600"
                        />
                        <EmployeeStatsCard
                            title="Total earned"
                            value={`$${mockStats.totalEarned.amount}`}
                            subtitle={`+${mockStats.totalEarned.changePercent}% this month`}
                            icon={DollarSign}
                            iconBgColor="bg-primary/10"
                            iconColor="text-primary"
                        />
                    </div>

                    {/* Active Jobs */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Active jobs</CardTitle>
                                <Link
                                    href="/employee/jobs"
                                    className="text-sm text-primary flex items-center gap-1 hover:underline"
                                >
                                    See all <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockActiveJobs.map((job) => (
                                <ActiveJobCard key={job.id} job={job} />
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side - 40% */}
                <div style={{ flex: "4", minWidth: 0 }}>
                    {/* Calendar */}
                    <div style={{ marginBottom: "24px" }}>
                        <JobCalendar daysWithJobs={daysWithJobs} />
                    </div>

                    {/* Recent Applications */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Recent Applications</CardTitle>
                                <Link
                                    href="/employee/applications"
                                    className="text-sm text-primary flex items-center gap-1 hover:underline"
                                >
                                    See all <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {mockRecentApplications.map((app) => (
                                <ApplicationCard key={app.id} application={app} />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
