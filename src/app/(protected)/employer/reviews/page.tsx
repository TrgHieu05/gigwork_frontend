"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, ArrowRight, MessageSquare, Star, Users, Calendar } from "lucide-react";
import { jobsService, Job, getJobLocationString } from "@/services/jobs";
import { reviewsService, Review } from "@/services/reviews";
import { applicationsService } from "@/services/applications";
import { authService } from "@/services/auth";
import Link from "next/link";
import { ReviewModal } from "@/components/shared/ReviewModal";

interface HiredWorkerReview {
  workerId: number;
  workerName: string;
  workerEmail?: string;
  review?: Review;
  status: string;
  applicationId?: number;
  jobId: number;
}

interface CompletedJobWithReviews {
  job: Job;
  hiredWorkers: HiredWorkerReview[];
}

export default function EmployerReviewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [completedJobs, setCompletedJobs] = useState<CompletedJobWithReviews[]>([]);
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<HiredWorkerReview | null>(null);

  const handleWriteReview = (worker: HiredWorkerReview) => {
    setSelectedWorker(worker);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (comment: string) => {
    if (!selectedWorker) return;

    console.log("Selected Worker for Review:", selectedWorker);

    // Check if required IDs exist (checking undefined/null specifically, allowing 0 if valid though unlikely)
    if (selectedWorker.applicationId === undefined || selectedWorker.workerId === undefined) {
      console.error("Missing required data for review. Worker object:", selectedWorker);
      alert("Cannot submit review: Missing application or worker ID. Please refresh the page.");
      return;
    }

    try {
      console.log("Creating review...");
      await reviewsService.createReview({
        applicationId: Number(selectedWorker.applicationId),
        revieweeId: Number(selectedWorker.workerId),
        comment: comment,
      });

      // Update the local state to show the new review immediately
      setCompletedJobs(prevJobs => 
        prevJobs.map(jobData => ({
          ...jobData,
          hiredWorkers: jobData.hiredWorkers.map(w => {
            if (w.workerId === selectedWorker.workerId && w.applicationId === selectedWorker.applicationId) {
              return {
                ...w,
                review: {
                  id: Date.now(), // Temporary ID until refresh
                  jobId: jobData.job.id,
                  reviewerId: authService.getCurrentUser()?.id || 0,
                  revieweeId: w.workerId,
                  comment: comment,
                  createdAt: new Date().toISOString()
                }
              };
            }
            return w;
          })
        }))
      );

      setReviewModalOpen(false);
      setSelectedWorker(null);
      alert("Review submitted successfully!");
    } catch (error: any) {
      console.error("Failed to submit review:", error);
      if (error.response) {
        console.error("Error Status:", error.response.status);
        console.error("Error Data:", error.response.data);
      }
      const backendMessage = error?.response?.data?.message || error?.message || "Unknown error";
      alert(`Failed to submit review: ${backendMessage}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) return;

        // 1. Fetch all jobs
        const jobsResponse = await jobsService.listJobs();
        const myJobs = jobsResponse.items.filter(job => job.employerId === currentUser.id);
        
        // 2. Filter for completed jobs or jobs with completed status
        // Note: We might want to include jobs that are "ongoing" or "full" if they have hired workers
        // But user request specifically said "job đã hoàn tất" (completed jobs)
        // Let's filter by status 'completed' first, but maybe also include any job that has hired workers for review context
        // For strict adherence to "completed jobs", we filter by status.
        // However, checking API, status might be 'completed'.
        
        // Fetch details for ALL my jobs to check status and applications correctly
        const detailedJobs = await Promise.all(
          myJobs.map(async (job) => {
            try {
              // Fetch job details to get applications array
              const detailedJob = await jobsService.getJob(job.id);
              
              // Always fetch applications to ensure we have the complete list and correct statuses,
              // matching the logic in My Jobs page.
              try {
                  const apps = await applicationsService.getByJobId(job.id);
                  // Map JobApplicationFull to the structure expected in Job.applications
                  // We cast to any for the worker mapping if properties mismatch slightly, 
                  // but we ensure id and email are present.
                  detailedJob.applications = apps.map(app => ({
                      id: app.id,
                      workerId: app.workerId,
                      status: app.status,
                      createdAt: app.appliedAt,
                      worker: app.worker ? {
                          id: app.worker.id,
                          email: app.worker.email,
                          // Attempt to preserve name if it exists in the response even if not in interface
                          name: (app.worker as any).name 
                      } : undefined
                  }));
              } catch (appErr) {
                  console.error(`Failed to fetch applications for job ${job.id}`, appErr);
                  // If fetch fails, we rely on what getJob returned, or default to empty
                  if (!detailedJob.applications) detailedJob.applications = [];
              }
              
              return detailedJob;
            } catch (e) {
              console.error(`Failed to fetch details for job ${job.id}`, e);
              return null;
            }
          })
        );

        const validJobs = detailedJobs.filter((job): job is Job => job !== null);
        
        // Filter jobs that are completed OR have applications with status 'completed'
        const relevantJobs = validJobs.filter(job => 
          job.status === 'completed' || 
          (job.applications && job.applications.some(app => app.status === 'completed'))
        );

        // 3. For each relevant job, build the review data
        const jobsWithReviews: CompletedJobWithReviews[] = await Promise.all(
          relevantJobs.map(async (job) => {
            // Ensure applications is an array. If undefined/null, default to empty array.
            const apps = job.applications || [];
            
            // Check status case-insensitively
            const hiredApps = apps.filter(app => {
              const status = app.status?.toLowerCase();
              return status === 'completed' || status === 'accepted' || status === 'hired';
            });

            const hiredWorkers: HiredWorkerReview[] = [];

            for (const app of hiredApps) {
              // Fetch reviews for this worker
              let review: Review | undefined;
              try {
                // We need to find if *we* (employer) reviewed *this worker* for *this job*
                // The API getReviews(userId) gets reviews FOR that user.
                // So if we fetch reviews for the worker, we can search for one from us.
                const workerReviews = await reviewsService.getReviews(app.workerId);
                review = workerReviews.find(r => 
                  r.jobId === job.id && 
                  String(r.reviewerId) === String(currentUser.id)
                );
              } catch (e) {
                console.error(`Failed to fetch reviews for worker ${app.workerId}`, e);
              }

              hiredWorkers.push({
                workerId: app.workerId,
                workerName: app.worker?.name || app.worker?.email?.split('@')[0] || `Worker #${app.workerId}`,
                workerEmail: app.worker?.email,
                status: app.status,
                review: review,
                applicationId: app.id,
                jobId: job.id
              });
            }

            return {
              job,
              hiredWorkers
            };
          })
        );

        // Filter out jobs with no hired workers if desired, or keep them to show "No workers hired"
        // Let's keep them if status is completed, even if 0 hired (though unlikely for completed job)
        setCompletedJobs(jobsWithReviews);

      } catch (error) {
        console.error("Error fetching reviews data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleJobExpand = (jobId: number) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    } else {
      setExpandedJobId(jobId);
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
        <h1 className="text-2xl font-bold">Reviews & Completed Jobs</h1>
        <p className="text-muted-foreground">
          View completed jobs and your reviews for hired workers.
        </p>
      </div>

      <div className="space-y-4">
        {completedJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No completed jobs found.</p>
            </CardContent>
          </Card>
        ) : (
          completedJobs.map(({ job, hiredWorkers }) => (
            <Card key={job.id} className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleJobExpand(job.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge variant="outline" className={
                        job.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100'
                      }>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(job.startDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {hiredWorkers.length} Hired
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className={`h-5 w-5 transition-transform ${expandedJobId === job.id ? "rotate-90" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedJobId === job.id && (
                <div className="border-t bg-muted/10 p-6 space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    Hired Workers & Reviews
                  </h4>
                  
                  {hiredWorkers.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No workers were hired for this job.</p>
                  ) : (
                    <div className="grid gap-4">
                      {hiredWorkers.map((worker) => (
                        <div key={worker.workerId} className="bg-background border rounded-lg p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Link href={`/profile/employee/${worker.workerId}?name=${encodeURIComponent(worker.workerName)}&email=${encodeURIComponent(worker.workerEmail || '')}`}>
                                <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                                  <AvatarFallback>
                                    {worker.workerName.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </Link>
                              <div>
                                <Link 
                                  href={`/profile/employee/${worker.workerId}?name=${encodeURIComponent(worker.workerName)}&email=${encodeURIComponent(worker.workerEmail || '')}`}
                                  className="font-medium hover:text-primary transition-colors"
                                >
                                  {worker.workerName}
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {worker.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {/* Review Section */}
                            <div className="flex-1 max-w-xl">
                              {worker.review ? (
                                <div className="bg-muted/30 rounded-md p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(worker.review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-foreground">
                                    {worker.review.comment || "No comment provided."}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center justify-end h-full">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleWriteReview(worker);
                                      }}
                                    >
                                      Write Review
                                    </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {selectedWorker && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedWorker(null);
          }}
          onSubmit={handleSubmitReview}
          revieweeName={selectedWorker.workerName}
        />
      )}
    </div>
  );
}
