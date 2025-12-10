"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckSquare, DollarSign, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

// Import shared components
import { JobCalendar, DayWithJob, CalendarJob } from "@/components/feature/employee/JobCalendar";
import { EmployeeStatsCard } from "@/components/feature/employee/EmployeeStatsCard";
import { EmployeeJobCard, type EmployeeJob } from "@/components/feature/employee/EmployeeJobCard";
import { EmployeeApplicationCard, type EmployeeApplication } from "@/components/feature/employee/EmployeeApplicationCard";

// Import services and hooks
import { authService } from "@/services/auth";
import { useCurrentUser } from "@/hooks/useProfile";
import { formatJobLocation, jobsService, Job } from "@/services/jobs";

export default function EmployeeDashboard() {
    // Use SWR hook for profile data - enables caching and instant display
    const { profile: userData, isLoading: profileLoading } = useCurrentUser();

    const [userName, setUserName] = useState("User");
    const [activeJobs, setActiveJobs] = useState<EmployeeJob[]>([]);
    const [recentApplications, setRecentApplications] = useState<EmployeeApplication[]>([]);
    const [jobDetailsMap, setJobDetailsMap] = useState<Map<number, Job>>(new Map());
    const [isProcessing, setIsProcessing] = useState(false);

    // Get username from localStorage
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser?.email) {
            setUserName(currentUser.email.split("@")[0]);
        }
    }, []);

    // Process user data when profile is loaded (fetch job details for enrichment)
    useEffect(() => {
        if (!userData) return;

        const processData = async () => {
            setIsProcessing(true);
            try {
                // Fetch job details to get company names and durationDays
                const jobIds = new Set<number>();
                userData.recentJobs?.forEach(j => jobIds.add(j.id));
                userData.recentApplications?.forEach(a => {
                    if (a.jobId) jobIds.add(a.jobId);
                });

                const detailsMap = new Map<number, Job>();
                if (jobIds.size > 0) {
                    const jobsPromises = Array.from(jobIds).map(async (id) => {
                        try {
                            const job = await jobsService.getJob(id);
                            return job;
                        } catch (e) {
                            console.error(`Failed to fetch job ${id}`, e);
                            return null;
                        }
                    });

                    const jobs = await Promise.all(jobsPromises);
                    jobs.forEach(job => {
                        if (job) detailsMap.set(job.id, job);
                    });
                }
                setJobDetailsMap(detailsMap);

                // Transform recent applications from API with enriched data
                const apps: EmployeeApplication[] = userData.recentApplications?.map((app) => {
                    const jobDetail = app.jobId ? detailsMap.get(app.jobId) : null;
                    const companyName = jobDetail?.companyName || jobDetail?.employer?.employerProfile?.companyName || jobDetail?.employer?.companyName || "Employer";

                    return {
                        id: String(app.applicationId),
                        title: app.jobTitle || jobDetail?.title || "Unknown Job",
                        company: companyName,
                        time: new Date(app.appliedAt).toLocaleDateString(),
                        status: app.status === "accepted" ? "Accepted"
                            : app.status === "pending" ? "Pending"
                                : app.status === "completed" ? "Completed"
                                    : "Rejected",
                    };
                }) || [];
                setRecentApplications(apps);

                // Calculate stats from recent jobs
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                const completedJobs = userData.recentJobs?.filter(j => j.status === 'completed' || j.status === 'finished') || [];

                // Calculate earned amount from completed jobs
                const earnedAmount = completedJobs.reduce((sum, job) => sum + (job.salary || 0), 0);

                // Calculate completed jobs this month
                const completedThisMonthCount = completedJobs.filter(job => {
                    const date = new Date(job.startDate);
                    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                }).length;

                // Transform recent jobs from API with enriched data
                // Filter for active jobs only (not completed/cancelled)
                const activeJobsList: EmployeeJob[] = userData.recentJobs
                    ?.filter(job => job.status !== 'completed' && job.status !== 'cancelled' && job.status !== 'finished')
                    .map((job) => {
                        const jobDetail = detailsMap.get(job.id);
                        const companyName = jobDetail?.companyName || jobDetail?.employer?.employerProfile?.companyName || jobDetail?.employer?.companyName || "Employer";

                        // Map status to display string
                        const displayStatus = job.status === 'ongoing' ? 'Ongoing'
                            : job.status === 'accepted' ? 'Accepted'
                                : 'Upcoming';

                        return {
                            id: String(job.id),
                            title: job.title,
                            company: companyName,
                            salary: jobDetail?.salary ? `${jobDetail.salary.toLocaleString()} VND` : (job.salary ? `${job.salary.toLocaleString()} VND` : ""),
                            status: displayStatus,
                            startDate: new Date(job.startDate).toLocaleDateString(),
                            duration: jobDetail?.durationDays ? `${jobDetail.durationDays} days` : `${job.workerQuota} workers`,
                            location: formatJobLocation(job.locationRef || {
                                province: "",
                                city: "",
                                address: "",
                            }),
                        };
                    }) || [];
                setActiveJobs(activeJobsList);

                // Update stats
                setStats({
                    applications: {
                        count: userData.applicationCounts
                            ? Object.values(userData.applicationCounts).reduce((a, b) => a + b, 0)
                            : 0,
                        pending: userData.applicationCounts?.pending ?? 0,
                    },
                    jobsCompleted: {
                        count: userData.applicationCounts?.completed ?? 0,
                        thisMonth: completedThisMonthCount,
                    },
                    totalEarned: {
                        amount: earnedAmount,
                        changePercent: 0,
                    },
                });

            } catch (error) {
                console.error("Error processing dashboard data:", error);
            } finally {
                setIsProcessing(false);
            }
        };

        processData();
    }, [userData]);

    // Initial stats state (will be updated by useEffect)
    const [stats, setStats] = useState({
        applications: { count: 0, pending: 0 },
        jobsCompleted: { count: 0, thisMonth: 0 },
        totalEarned: { amount: 0, changePercent: 0 }
    });

    // Build days with jobs data for calendar - use accepted applications for employees
    const daysWithJobs: DayWithJob[] = useMemo(() => {
        // For employees, jobs come from accepted applications, not recentJobs
        if (!userData?.recentApplications) return [];

        // Map to collect jobs by date key
        const dayJobMap = new Map<string, DayWithJob>();

        // Filter for accepted/confirmed applications only
        const acceptedApplications = userData.recentApplications.filter(
            app => app.status === 'accepted' || app.status === 'confirmed' || app.status === 'completed'
        );

        acceptedApplications.forEach((app) => {
            // Get job details from map (should have been fetched in useEffect)
            const jobDetail = app.jobId ? jobDetailsMap.get(app.jobId) : null;

            if (!jobDetail) {
                return;
            }

            const startDate = new Date(jobDetail.startDate);
            const duration = jobDetail.durationDays || 1;

            // Add job to each day it spans
            for (let i = 0; i < duration; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);

                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();
                const key = `${year}-${month}-${day}`;

                let dayData = dayJobMap.get(key);
                if (!dayData) {
                    dayData = { day, month, year, jobs: [] };
                    dayJobMap.set(key, dayData);
                }

                // Build location string
                const location = formatJobLocation(jobDetail.locationRef || {
                    province: "",
                    city: "",
                    address: "",
                });

                // Add job info for tooltip
                const calendarJob: CalendarJob = {
                    id: jobDetail.id,
                    title: jobDetail.title,
                    location: location || undefined,
                    salary: jobDetail.salary ? `${jobDetail.salary.toLocaleString()} VND` : undefined,
                    status: app.status,
                };
                dayData.jobs.push(calendarJob);
            }
        });

        return Array.from(dayJobMap.values());
    }, [userData?.recentApplications, jobDetailsMap]);

    // Show loading only on first load (no cached data)
    if (profileLoading && !userData) {
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
                            value={`${stats.totalEarned.amount.toLocaleString()} VND`}
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
