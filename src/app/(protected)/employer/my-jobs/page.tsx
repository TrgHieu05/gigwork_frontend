"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobCard, JobCardData, JobStatus } from "@/components/feature/employer/JobCard";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { jobsService, Job, getJobLocationString } from "@/services/jobs";
import { authService } from "@/services/auth";
import { EditJobModal } from "@/components/feature/employer/EditJobModal";

// Transform API job to JobCardData format
function transformApiJob(apiJob: Job): JobCardData {
    const startDate = new Date(apiJob.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + apiJob.durationDays);

    // Map API status to UI status (handle potential case mismatch)
    const apiStatus = apiJob.status?.toLowerCase() || "open";
    const statusMap: Record<string, JobStatus> = {
        open: "open",
        full: "full",
        ongoing: "ongoing",
        completed: "completed",
    };

    // Calculate hired count from applications
    const hiredCount = apiJob.applications?.filter(app => 
        app.status.toLowerCase() === 'accepted' || app.status.toLowerCase() === 'hired'
    ).length || 0;

    return {
        id: String(apiJob.id),
        title: apiJob.title,
        status: statusMap[apiStatus] || "open",
        location: getJobLocationString(apiJob),
        duration: `${apiJob.durationDays} days`,
        salary: apiJob.salary ? `${apiJob.salary.toLocaleString()} VND` : "Negotiable",
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        applicantsCount: apiJob.applications?.length || 0,
        hiredCount: hiredCount,
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
    const [editingJobId, setEditingJobId] = useState<string | null>(null);

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) return;

            // Fetch all jobs from API
            const response = await jobsService.listJobs();
            
            // Note: Since listJobs might not return applications count for all jobs,
            // we should ideally have the backend include it. 
            // If the backend list endpoint doesn't return applications, 
            // we have to be careful. Assuming it does or we accept 0 for now unless we fetch details.
            // But based on previous issue, it seems applications array might be missing or empty in list response if not eager loaded.
            // Let's verify if we need to fetch individual job details to get accurate count.
            // However, fetching details for ALL jobs is expensive.
            // Let's assume for now we use what we have, but if count is 0, it might be the API limitation.
            // Actually, to fix "0 applicants" when there ARE applicants, it means listJobs response lacks this data.
            // We can try to fetch details for the filtered jobs (usually small number for a single employer).
            
            const myJobs = response.items.filter(job => job.employerId === currentUser.id);
            
            // Fetch details for each job to ensure we get applications list
            const detailedJobs = await Promise.all(
                myJobs.map(async (job) => {
                    try {
                        return await jobsService.getJob(job.id);
                    } catch (e) {
                        console.error(`Failed to fetch details for job ${job.id}`, e);
                        return job; // Fallback to list version
                    }
                })
            );

            const transformedJobs = detailedJobs.map(transformApiJob);

            setJobs(transformedJobs);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = activeTab === "all"
        ? jobs
        : jobs.filter((job) => job.status === activeTab);

    const handleEdit = (id: string) => {
        setEditingJobId(id);
    };

    const handleJobUpdated = () => {
        fetchJobs();
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
                                    onRepost={handleRepost}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            <EditJobModal
                jobId={editingJobId}
                onClose={() => setEditingJobId(null)}
                onJobUpdated={handleJobUpdated}
            />
        </div>
    );
}
