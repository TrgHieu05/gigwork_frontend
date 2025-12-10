"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobCard, JobCardData, JobStatus } from "@/components/feature/employer/JobCard";
import { Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { Job, getJobLocationString } from "@/services/jobs";
import { applicationsService, JobApplicationFull } from "@/services/applications";
import { useCurrentUser } from "@/hooks/useProfile";
import { useJobs } from "@/hooks/useJobs";
import { EditJobModal } from "@/components/feature/employer/EditJobModal";

// Transform API job to JobCardData format with applications data
function transformApiJob(apiJob: Job, applications: JobApplicationFull[]): JobCardData {
    const startDate = new Date(apiJob.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + apiJob.durationDays);

    const apiStatus = apiJob.status?.toLowerCase() || "open";
    const statusMap: Record<string, JobStatus> = {
        open: "open",
        full: "full",
        ongoing: "ongoing",
        completed: "completed",
    };

    const hiredCount = applications.filter(app =>
        app.status.toLowerCase() === 'accepted' || app.status.toLowerCase() === 'hired'
    ).length;

    return {
        id: String(apiJob.id),
        title: apiJob.title,
        status: statusMap[apiStatus] || "open",
        location: getJobLocationString(apiJob),
        duration: `${apiJob.durationDays} days`,
        salary: apiJob.salary ? `${apiJob.salary.toLocaleString()} VND` : "Negotiable",
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        applicantsCount: applications.length,
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
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [jobs, setJobs] = useState<JobCardData[]>([]);
    const [isLoadingApps, setIsLoadingApps] = useState(false);

    // Use SWR hooks for cached data
    const { profile: userData, isLoading: profileLoading } = useCurrentUser();
    const { jobs: apiJobs, isLoading: jobsLoading, mutate: mutateJobs } = useJobs();

    // Filter jobs by current employer
    const myJobs = useMemo(() => {
        if (!userData?.id) return [];
        return apiJobs.filter(job => job.employerId === userData.id);
    }, [apiJobs, userData?.id]);

    // Fetch applications and transform jobs
    useEffect(() => {
        if (myJobs.length === 0) {
            setJobs([]);
            return;
        }

        const fetchApplications = async () => {
            setIsLoadingApps(true);
            try {
                const jobsWithApps = await Promise.all(
                    myJobs.map(async (job) => {
                        try {
                            const apps = await applicationsService.getByJobId(job.id);
                            return transformApiJob(job, apps);
                        } catch (e) {
                            console.error(`Failed to fetch applications for job ${job.id}`, e);
                            return transformApiJob(job, []);
                        }
                    })
                );
                setJobs(jobsWithApps);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setIsLoadingApps(false);
            }
        };

        fetchApplications();
    }, [myJobs]);

    const filteredJobs = activeTab === "all"
        ? jobs
        : jobs.filter((job) => job.status === activeTab);

    const handleEdit = (id: string) => {
        setEditingJobId(id);
    };

    const handleJobUpdated = useCallback(() => {
        mutateJobs(); // Revalidate jobs cache
    }, [mutateJobs]);

    const handleRepost = (id: string) => {
        console.log("Repost job:", id);
    };

    // Only show loading on first load (no cached data)
    if ((profileLoading || jobsLoading) && myJobs.length === 0) {
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
