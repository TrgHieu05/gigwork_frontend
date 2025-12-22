"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, Calendar, Building2, ArrowRight } from "lucide-react";
import { jobsService, Job } from "@/services/jobs";
import { reviewsService, Review } from "@/services/reviews";
import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";
import { ReviewModal } from "@/components/shared/ReviewModal";
import Link from "next/link";

interface CompletedJobWithReview {
    job: Job;
    applicationId: number;
    review?: Review;
    employerName: string;
    employerId: number;
}

export default function EmployeeReviewsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [completedJobs, setCompletedJobs] = useState<CompletedJobWithReview[]>([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<CompletedJobWithReview | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Get current user profile for applications
                const currentUser = authService.getCurrentUser();
                if (!currentUser) {
                    router.push("/login");
                    return;
                }

                // We need full profile to get recentApplications
                const profile = await profileService.getCurrentUser();
                
                // 2. Filter completed applications
                const completedApps = profile.recentApplications?.filter(
                    app => app.status === "completed"
                ) || [];

                if (completedApps.length === 0) {
                    setCompletedJobs([]);
                    setIsLoading(false);
                    return;
                }

                // 3. For each completed app, fetch job details and check for reviews
                const jobsWithReviews = await Promise.all(
                    completedApps.map(async (app) => {
                        try {
                            if (!app.jobId) return null;

                            // Fetch job details to get employer info
                            const job = await jobsService.getJob(app.jobId);
                            if (!job || !job.employerId) return null;

                            const employerId = job.employerId;
                            const employerName = job.companyName || 
                                               job.employer?.employerProfile?.companyName || 
                                               job.employer?.companyName || 
                                               "Employer";

                            // Check if we have reviewed this employer for this job
                            // getReviews(id) gets reviews RECEIVED by id (reviewee)
                            const employerReviews = await reviewsService.getReviews(employerId);
                            const myReview = employerReviews.find(r => 
                                r.jobId === job.id && 
                                String(r.reviewerId) === String(currentUser.id)
                            );

                            return {
                                job,
                                applicationId: app.applicationId,
                                review: myReview,
                                employerName,
                                employerId
                            };
                        } catch (err) {
                            console.error(`Error processing job ${app.jobId}:`, err);
                            return null;
                        }
                    })
                );

                // Filter out nulls
                const validJobs = jobsWithReviews.filter((j) => j !== null) as CompletedJobWithReview[];
                setCompletedJobs(validJobs);

            } catch (error) {
                console.error("Error fetching reviews data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleWriteReview = (jobData: CompletedJobWithReview) => {
        setSelectedJob(jobData);
        setReviewModalOpen(true);
    };

    const handleSubmitReview = async (comment: string) => {
        if (!selectedJob) return;

        try {
            await reviewsService.createReview({
                applicationId: selectedJob.applicationId,
                revieweeId: selectedJob.employerId,
                comment: comment,
            });

            // Update local state
            setCompletedJobs(prev => prev.map(item => {
                if (item.job.id === selectedJob.job.id) {
                    return {
                        ...item,
                        review: {
                            id: Date.now(), // Temp ID
                            jobId: item.job.id,
                            reviewerId: authService.getCurrentUser()?.id || 0,
                            revieweeId: item.employerId,
                            comment: comment,
                            createdAt: new Date().toISOString()
                        }
                    };
                }
                return item;
            }));

            setReviewModalOpen(false);
            setSelectedJob(null);
            // alert("Review submitted successfully!"); // Optional: use toast instead
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-full p-6 overflow-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Reviews & Completed Jobs</h1>
                <p className="text-muted-foreground">
                    Review employers from your completed jobs.
                </p>
            </div>

            <div className="space-y-4">
                {completedJobs.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No completed jobs found to review.</p>
                        </CardContent>
                    </Card>
                ) : (
                    completedJobs.map((item) => (
                        <Card key={item.job.id} className="overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    {/* Job Info */}
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg">
                                                <Link href={`/employee/jobs/${item.job.id}`} className="hover:underline hover:text-primary">
                                                    {item.job.title}
                                                </Link>
                                            </h3>
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                                                Completed
                                            </Badge>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="h-4 w-4" />
                                                <Link href={`/profile/employer/${item.employerId}`} className="hover:text-primary transition-colors">
                                                    {item.employerName}
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(item.job.startDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Section */}
                                    <div className="md:w-1/2 lg:w-1/3">
                                        {item.review ? (
                                            <div className="bg-muted/30 rounded-md p-4 border">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium text-sm">Your Review</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(item.review.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground italic">
                                                    "{item.review.comment}"
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end h-full items-center">
                                                <Button 
                                                    variant="outline"
                                                    onClick={() => handleWriteReview(item)}
                                                >
                                                    <MessageSquare className="h-4 w-4 mr-2" />
                                                    Write Review
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {selectedJob && (
                <ReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => {
                        setReviewModalOpen(false);
                        setSelectedJob(null);
                    }}
                    onSubmit={handleSubmitReview}
                    revieweeName={selectedJob.employerName}
                />
            )}
        </div>
    );
}
