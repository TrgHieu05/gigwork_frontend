"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JobCard, JobCardData, JobStatus } from "@/components/feature/employer/JobCard";
import { Plus } from "lucide-react";
import Link from "next/link";

const mockJobs: JobCardData[] = [
    {
        id: "1",
        title: "Warehouse Associate",
        status: "open",
        location: "Chicago, IL",
        duration: "5 days",
        salary: "$18/hr",
        dateRange: "Oct 22 - Oct 26",
        applicantsCount: 67,
        hiredCount: 12,
        viewsCount: 432,
        postedDate: "Oct 8, 2024",
    },
    {
        id: "2",
        title: "Retail Sales Associate",
        status: "closed",
        location: "New York, NY",
        duration: "1 week",
        salary: "$19/hr",
        dateRange: "Oct 15 - Oct 21",
        applicantsCount: 89,
        hiredCount: 15,
        viewsCount: 567,
        postedDate: "Oct 1, 2024",
    },
    {
        id: "3",
        title: "Event Staff",
        status: "ongoing",
        location: "Los Angeles, CA",
        duration: "3 days",
        salary: "$22/hr",
        dateRange: "Oct 25 - Oct 27",
        applicantsCount: 45,
        hiredCount: 8,
        viewsCount: 298,
        postedDate: "Oct 10, 2024",
    },
    {
        id: "4",
        title: "Delivery Driver",
        status: "upcoming",
        location: "Miami, FL",
        duration: "2 weeks",
        salary: "$20/hr",
        dateRange: "Nov 1 - Nov 14",
        applicantsCount: 34,
        hiredCount: 0,
        viewsCount: 156,
        postedDate: "Oct 15, 2024",
    },
    {
        id: "5",
        title: "Restaurant Server",
        status: "completed",
        location: "San Francisco, CA",
        duration: "Weekend",
        salary: "$15/hr + tips",
        dateRange: "Oct 12 - Oct 13",
        applicantsCount: 52,
        hiredCount: 10,
        viewsCount: 321,
        postedDate: "Sep 28, 2024",
    },
    {
        id: "6",
        title: "Construction Helper",
        status: "full",
        location: "Houston, TX",
        duration: "1 week",
        salary: "$17/hr",
        dateRange: "Oct 28 - Nov 3",
        applicantsCount: 78,
        hiredCount: 20,
        viewsCount: 445,
        postedDate: "Oct 5, 2024",
    },
];

const tabs: { value: JobStatus | "all"; label: string }[] = [
    { value: "all", label: "All Jobs" },
    { value: "open", label: "Open" },
    { value: "full", label: "Full" },
    { value: "closed", label: "Closed" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
];

export default function MyJobsPage() {
    const [activeTab, setActiveTab] = useState<JobStatus | "all">("all");

    const filteredJobs = activeTab === "all"
        ? mockJobs
        : mockJobs.filter((job) => job.status === activeTab);

    const handleEdit = (id: string) => {
        console.log("Edit job:", id);
    };

    const handleClose = (id: string) => {
        console.log("Close job:", id);
    };

    const handleRepost = (id: string) => {
        console.log("Repost job:", id);
    };

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
                                No jobs found in this category
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