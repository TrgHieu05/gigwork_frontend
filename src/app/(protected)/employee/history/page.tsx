"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

import { EmployeeJobCard, type EmployeeJob } from "@/components/feature/employee/EmployeeJobCard";
import { EmployeeApplicationCard, type EmployeeApplication } from "@/components/feature/employee/EmployeeApplicationCard";
import { profileService } from "@/services/profile";
import { jobsService, Job } from "@/services/jobs";

export default function EmployeeHistoryPage() {
    const [activeTab, setActiveTab] = useState("jobs");
    const [applicationFilter, setApplicationFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [completedJobs, setCompletedJobs] = useState<EmployeeJob[]>([]);
    const [applicationHistory, setApplicationHistory] = useState<EmployeeApplication[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const profile = await profileService.getCurrentUser();

                // Fetch job details to get company names
                const jobIds = new Set<number>();
                profile.recentApplications?.forEach(a => {
                    if (a.jobId) jobIds.add(a.jobId);
                });

                const jobDetailsMap = new Map<number, Job>();
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
                        if (job) jobDetailsMap.set(job.id, job);
                    });
                }

                // Transform applications from profile
                if (profile.recentApplications) {
                    const apps: EmployeeApplication[] = profile.recentApplications.map((app) => {
                        // Map API status to component status
                        const statusMap: Record<string, EmployeeApplication['status']> = {
                            pending: "Pending",
                            accepted: "Accepted",
                            rejected: "Rejected",
                            completed: "Completed",
                            cancelled: "Cancelled",
                        };

                        const jobDetail = app.jobId ? jobDetailsMap.get(app.jobId) : null;
                        const companyName = jobDetail?.companyName || jobDetail?.employer?.employerProfile?.companyName || jobDetail?.employer?.companyName || app.companyName || "Unknown Company";

                        return {
                            id: String(app.applicationId),
                            title: app.jobTitle || jobDetail?.title || "Unknown Job",
                            company: companyName,
                            time: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently",
                            status: statusMap[app.status] || "Pending",
                        };
                    });

                    setApplicationHistory(apps);

                    // Filter completed jobs from applications
                    const completed: EmployeeJob[] = profile.recentApplications
                        .filter((app) => app.status === "completed")
                        .map((app) => {
                            const jobDetail = app.jobId ? jobDetailsMap.get(app.jobId) : null;
                            const companyName = jobDetail?.companyName || jobDetail?.employer?.employerProfile?.companyName || jobDetail?.employer?.companyName || app.companyName || "Unknown Company";
                            
                            return {
                                id: String(app.applicationId),
                                title: app.jobTitle || jobDetail?.title || "Unknown Job",
                                company: companyName,
                                location: "Unknown Location",
                                completedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently",
                                duration: jobDetail?.durationDays ? `${jobDetail.durationDays} days` : "N/A",
                                earned: jobDetail?.salary ? `${jobDetail.salary.toLocaleString()} VND` : "N/A",
                                rating: 0,
                            };
                        });

                    setCompletedJobs(completed);
                }
            } catch (error) {
                console.error("Error fetching history data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredApplications = applicationFilter === "all"
        ? applicationHistory
        : applicationHistory.filter(app => app.status.toLowerCase() === applicationFilter);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">History</h1>
                <p className="text-muted-foreground">View your completed jobs and application history</p>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="jobs">Completed Jobs ({completedJobs.length})</TabsTrigger>
                    <TabsTrigger value="applications">Applications ({applicationHistory.length})</TabsTrigger>
                </TabsList>

                {/* Completed Jobs Tab */}
                <TabsContent value="jobs">
                    <div className="space-y-4">
                        {completedJobs.length > 0 ? (
                            completedJobs.map((job) => (
                                <EmployeeJobCard key={job.id} job={job} variant="completed" />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">No completed jobs yet</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Applications Tab */}
                <TabsContent value="applications">
                    {/* Sub-filters */}
                    <div className="flex gap-2 mb-4">
                        {["all", "pending", "accepted", "rejected", "completed"].map((filter) => (
                            <Button
                                key={filter}
                                variant={applicationFilter === filter ? "default" : "outline"}
                                size="small"
                                onClick={() => setApplicationFilter(filter)}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app) => (
                                <EmployeeApplicationCard key={app.id} application={app} variant="full" />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">No applications found</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
