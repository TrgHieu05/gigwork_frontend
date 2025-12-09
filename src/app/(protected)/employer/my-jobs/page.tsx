"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobCard, JobCardData, JobStatus } from "@/components/feature/employer/JobCard";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { jobsService, Job, getJobLocationString } from "@/services/jobs";

// Transform API job to JobCardData format
function transformApiJob(apiJob: Job): JobCardData {
    const startDate = new Date(apiJob.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + apiJob.durationDays);

    // Map API status to UI status
    const statusMap: Record<string, JobStatus> = {
        open: "open",
        full: "full",
        ongoing: "ongoing",
        completed: "completed",
    };

    return {
        id: String(apiJob.id),
        title: apiJob.title,
        status: statusMap[apiJob.status] || "open",
        location: getJobLocationString(apiJob),
        duration: `${apiJob.durationDays} days`,
        salary: "$15/hr", // Not in API
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        applicantsCount: apiJob.workerQuota,
        hiredCount: 0, // Would need additional API
        viewsCount: 0, // Would need additional API
        postedDate: apiJob.createdAt ? new Date(apiJob.createdAt).toLocaleDateString() : "Recently",
    };
}

const tabs: { value: JobStatus | "all"; label: string }[] = [
    { value: "all", label: "All Jobs" },
    { value: "open", label: "Open" },
    { value: "full", label: "Full" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
];

export default function MyJobsPage() {
    const [activeTab, setActiveTab] = useState<JobStatus | "all">("all");
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<JobCardData[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                // Fetch all jobs from API
                const response = await jobsService.listJobs();
                const transformedJobs = response.items.map((job) => {
                    const startDate = new Date(job.startDate);
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + job.durationDays);

                    return {
                        id: String(job.id),
                        title: job.title,
                        status: (job.status as JobStatus) || "open",
                        location: getJobLocationString(job),
                        duration: `${job.durationDays} days`,
                        salary: job.salary ? `${job.salary.toLocaleString()} VND` : "Negotiable",
                        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
                        applicantsCount: job.workerQuota,
                        hiredCount: 0,
                        viewsCount: 0,
                        postedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "Recently",
                    };
                });

                setJobs(transformedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = activeTab === "all"
        ? jobs
        : jobs.filter((job) => job.status === activeTab);

    const handleEdit = (id: string) => {
        console.log("Edit job:", id);
    };

    const handleClose = async (id: string) => {
        try {
            await jobsService.deleteJob(Number(id));
            setJobs(jobs.filter(j => j.id !== id));
        } catch (error) {
            console.error("Error closing job:", error);
            alert("Failed to close job");
        }
    };

    const handleRepost = (id: string) => {
        console.log("Repost job:", id);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            {/* Header with CTA */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Jobs</h1>
                    <p className="text-muted-foreground">
                        Manage and track all your job postings
                    </p>
                </div>
                <Link href="/employer/create-job">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Post Job
                    </Button>
                </Link>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as JobStatus | "all")}>
                <TabsList>
                    {tabs.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={activeTab}>
                    <div className="space-y-4">
                        {filteredJobs.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                {jobs.length === 0
                                    ? "You haven't posted any jobs yet. Click 'Post Job' to get started!"
                                    : "No jobs found in this category"
                                }
                            </div>
                        ) : (
                            filteredJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    onEdit={handleEdit}
                                    onClose={handleClose}
                                    onRepost={handleRepost}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}