"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckSquare, DollarSign, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

// Import shared components
import { JobCalendar } from "@/components/feature/employee/JobCalendar";
import { EmployeeStatsCard } from "@/components/feature/employee/EmployeeStatsCard";
import { EmployeeJobCard, type EmployeeJob } from "@/components/feature/employee/EmployeeJobCard";
import { EmployeeApplicationCard, type EmployeeApplication } from "@/components/feature/employee/EmployeeApplicationCard";

// Import services
import { authService } from "@/services/auth";
import { profileService, UserProfile } from "@/services/profile";

export default function EmployeeDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [userName, setUserName] = useState("User");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Get current user info from localStorage
                const currentUser = authService.getCurrentUser();
                if (currentUser?.email) {
                    setUserName(currentUser.email.split("@")[0]);
                }

                // Fetch full user data including stats
                const profile = await profileService.getCurrentUser();
                setUserData(profile);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Transform API data to component format
    const stats = {
        applications: {
            count: userData?.applicationCounts
                ? Object.values(userData.applicationCounts).reduce((a, b) => a + b, 0)
                : 0,
            pending: userData?.applicationCounts?.pending ?? 0,
        },
        jobsCompleted: {
            count: userData?.applicationCounts?.completed ?? 0,
            thisMonth: 0, // Would need additional API data
        },
        totalEarned: {
            amount: 0, // Would need additional API data
            changePercent: 0,
        },
    };

    // Transform recent applications from API
    const recentApplications: EmployeeApplication[] = userData?.recentApplications?.map((app) => ({
        id: String(app.applicationId),
        title: app.jobTitle || "Unknown Job",
        company: "Company", // Not in API response
        time: new Date(app.appliedAt).toLocaleDateString(),
        status: app.status === "accepted" ? "Accepted"
            : app.status === "pending" ? "Pending"
                : app.status === "completed" ? "Completed"
                    : "Rejected",
    })) || [];

    // Transform recent jobs from API
    const activeJobs: EmployeeJob[] = userData?.recentJobs?.map((job) => ({
        id: String(job.id),
        title: job.title,
        company: "Employer", // Not in API response
        salary: "", // Not in API response
        status: "Upcoming",
        startDate: new Date(job.startDate).toLocaleDateString(),
        duration: `${job.workerQuota} workers`,
        location: job.location,
    })) || [];

    // Extract days with jobs for calendar
    const daysWithJobs = userData?.recentJobs?.map((job) => {
        const date = new Date(job.startDate);
        return date.getDate();
    }) || [];

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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
                            value={stats.applications.count}
                            subtitle={`${stats.applications.pending} is pending`}
                            icon={FileText}
                            iconBgColor="bg-blue-100"
                            iconColor="text-blue-600"
                        />
                        <EmployeeStatsCard
                            title="Job completed"
                            value={stats.jobsCompleted.count}
                            subtitle={`+${stats.jobsCompleted.thisMonth} this month`}
                            icon={CheckSquare}
                            iconBgColor="bg-green-100"
                            iconColor="text-green-600"
                        />
                        <EmployeeStatsCard
                            title="Total earned"
                            value={`$${stats.totalEarned.amount}`}
                            subtitle={`+${stats.totalEarned.changePercent}% this month`}
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
                            {activeJobs.length > 0 ? (
                                activeJobs.map((job) => (
                                    <EmployeeJobCard key={job.id} job={job} variant="active" />
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    No active jobs yet. Browse available jobs to get started!
                                </p>
                            )}
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
                            {recentApplications.length > 0 ? (
                                recentApplications.map((app) => (
                                    <EmployeeApplicationCard key={app.id} application={app} variant="compact" />
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">
                                    No applications yet. Start applying for jobs!
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
