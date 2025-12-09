"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    ArrowLeft,
    MapPin,
    Clock,
    Calendar,
    Users,
    Briefcase,
    Heart,
    Share2,
    Loader2,
    CheckCircle,
    DollarSign,
} from "lucide-react";
import { jobsService, Job } from "@/services/jobs";
import { applicationsService } from "@/services/applications";
import { authService } from "@/services/auth";

const typeLabels: Record<string, string> = {
    physical_work: "Physical Work",
    fnb: "Food & Beverage",
    event: "Event",
    retail: "Retail",
    others: "Others",
};

const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "bg-green-100 text-green-700" },
    full: { label: "Full", color: "bg-yellow-100 text-yellow-700" },
    ongoing: { label: "Ongoing", color: "bg-blue-100 text-blue-700" },
    completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
};

export default function EmployeeJobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const jobId = Number(params.id);
                const jobData = await jobsService.getJob(jobId);
                setJob(jobData);
            } catch (err) {
                console.error("Error fetching job:", err);
                setError("Failed to load job details");
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchJob();
        }
    }, [params.id]);

    const handleApply = async () => {
        if (!job) return;

        setIsApplying(true);
        try {
            await applicationsService.apply(job.id);
            setHasApplied(true);
            alert("Application submitted successfully!");
        } catch (err: unknown) {
            console.error("Error applying:", err);
            // Extract error message from API response
            let errorMessage = "Failed to apply for this job";
            if (err && typeof err === "object" && "response" in err) {
                const axiosError = err as { response?: { data?: { detail?: string; title?: string; message?: string }; status?: number } };
                if (axiosError.response?.data?.detail) {
                    errorMessage = axiosError.response.data.detail;
                } else if (axiosError.response?.data?.title) {
                    errorMessage = axiosError.response.data.title;
                } else if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.response?.status === 403) {
                    errorMessage = "You must be registered as a worker to apply for jobs";
                } else if (axiosError.response?.status === 409) {
                    errorMessage = "This job is no longer accepting applications";
                } else if (axiosError.response?.status === 401) {
                    errorMessage = "Please login to apply for this job";
                }
            }
            alert(errorMessage);
        } finally {
            setIsApplying(false);
        }
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: job?.title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">{error || "Job not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    const startDate = new Date(job.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + job.durationDays);
    const status = statusConfig[job.status] || statusConfig.open;

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="outline"
                    className="h-9 w-9 p-0 border-0"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold">Job Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Header Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarFallback className="text-lg bg-primary/10">
                                            <Briefcase className="h-8 w-8 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-semibold">{job.title}</h2>
                                            <Badge className={status.color}>{status.label}</Badge>
                                        </div>
                                        <p className="text-muted-foreground mt-1">
                                            {typeLabels[job.type] || job.type}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="small"
                                        onClick={handleSave}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`}
                                        />
                                    </Button>
                                    <Button variant="outline" size="small" onClick={handleShare}>
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{job.durationDays} days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{job.workerQuota} workers needed</span>
                                </div>
                                {job.salary && (
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-semibold text-green-600">
                                            {job.salary.toLocaleString()} VND
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Job Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {job.description}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Apply Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Workers Needed</p>
                                    <p className="text-3xl font-bold text-primary">{job.workerQuota}</p>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    <p>Start Date: {startDate.toLocaleDateString()}</p>
                                    <p>Duration: {job.durationDays} days</p>
                                </div>

                                {hasApplied ? (
                                    <Button disabled className="w-full">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Applied
                                    </Button>
                                ) : job.status === "open" ? (
                                    <Button
                                        className="w-full"
                                        onClick={handleApply}
                                        disabled={isApplying}
                                    >
                                        {isApplying ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Applying...
                                            </>
                                        ) : (
                                            "Apply Now"
                                        )}
                                    </Button>
                                ) : (
                                    <Button disabled className="w-full">
                                        Not Available
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Job Info Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Job Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Type</span>
                                <span className="font-medium">{typeLabels[job.type] || job.type}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Location</span>
                                <span className="font-medium">{job.location}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration</span>
                                <span className="font-medium">{job.durationDays} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <Badge className={status.color}>{status.label}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
