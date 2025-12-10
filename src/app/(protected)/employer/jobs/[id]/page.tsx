"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  Briefcase,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { jobsService, Job, getJobLocationString } from "@/services/jobs";
import { applicationsService } from "@/services/applications";
import { profileService } from "@/services/profile";
import { authService } from "@/services/auth";
import { EditJobModal } from "@/components/feature/employer/EditJobModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface Application {
  id: number;
  workerId: number;
  workerEmail?: string;
  status: string;
  appliedAt: string;
}

export default function EmployerJobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [isOwner, setIsOwner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const jobId = Number(params.id);
      const jobData = await jobsService.getJob(jobId);
      setJob(jobData);

      // Check ownership
      const currentUser = authService.getCurrentUser();
      if (currentUser && (
          (jobData.employerId && String(jobData.employerId) === String(currentUser.id)) ||
          (jobData.employer?.id && String(jobData.employer.id) === String(currentUser.id))
      )) {
          setIsOwner(true);
      }

      // Note: Would need API endpoint for applications by job
      // For now, using profile data
      const profile = await profileService.getCurrentUser();
      // Transform to applications format
      const apps: Application[] = profile.recentApplications
        ?.filter(a => a.jobId === jobId)
        .map(a => ({
          id: a.applicationId,
          workerId: 0,
          status: a.status,
          appliedAt: a.appliedAt,
        })) || [];
      setApplications(apps);
    } catch (err) {
      console.error("Error fetching job:", err);
      setError("Failed to load job details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleAccept = async (applicationId: number) => {
    try {
      await applicationsService.accept(applicationId);
      setApplications(apps =>
        apps.map(a => a.id === applicationId ? { ...a, status: "accepted" } : a)
      );
    } catch (err) {
      console.error("Error accepting:", err);
      alert("Failed to accept application");
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      await applicationsService.reject(applicationId);
      setApplications(apps =>
        apps.map(a => a.id === applicationId ? { ...a, status: "rejected" } : a)
      );
    } catch (err) {
      console.error("Error rejecting:", err);
      alert("Failed to reject application");
    }
  };

  const handleComplete = async (workerId: number) => {
    if (!job) return;
    try {
      await applicationsService.complete(job.id, workerId);
      alert("Marked as complete!");
    } catch (err) {
      console.error("Error completing:", err);
      alert("Failed to mark as complete");
    }
  };

  const handleDelete = async () => {
    if (!job) return;
    
    setIsDeleting(true);
    try {
      await jobsService.deleteJob(job.id);
      router.push("/employer/my-jobs");
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete job");
      setIsDeleting(false);
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

  const pendingApps = applications.filter(a => a.status === "pending");
  const acceptedApps = applications.filter(a => a.status === "accepted");

  return (
    <div className="h-full p-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="h-9 w-9 p-0 border-0"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <Badge className={status.color}>{status.label}</Badge>
            </div>
            <p className="text-muted-foreground">{typeLabels[job.type] || job.type}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isOwner && (
            <>
              <Button variant="outline" onClick={() => setShowEditModal(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{getJobLocationString(job)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date Range</p>
                      <p className="font-medium">
                        {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{job.durationDays} days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Workers Needed</p>
                      <p className="font-medium">{job.workerQuota}</p>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm text-muted-foreground">Salary</p>
                        <p className="font-medium text-green-600">{job.salary.toLocaleString()} VND</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              {isOwner && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                          {applications.length}
                        </p>
                        <p className="text-xs text-muted-foreground">Applications</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                          {acceptedApps.length}
                        </p>
                        <p className="text-xs text-muted-foreground">Accepted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="mt-6">
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications yet</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {String(app.workerId).slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Worker #{app.workerId}</p>
                          <p className="text-sm text-muted-foreground">
                            Applied {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {app.status === "pending" && (
                          <>
                            <Button
                              size="small"
                              onClick={() => handleAccept(app.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleReject(app.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {app.status === "accepted" && (
                          <>
                            <Badge className="bg-green-100 text-green-700">Accepted</Badge>
                            <Button
                              size="small"
                              onClick={() => handleComplete(app.workerId)}
                            >
                              Mark Complete
                            </Button>
                          </>
                        )}
                        {app.status === "rejected" && (
                          <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                        )}
                        {app.status === "completed" && (
                          <Badge className="bg-blue-100 text-blue-700">Completed</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {job && (
        <EditJobModal
          jobId={showEditModal ? String(job.id) : null}
          onClose={() => setShowEditModal(false)}
          onJobUpdated={() => {
            fetchData();
            setShowEditModal(false);
          }}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the job.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
