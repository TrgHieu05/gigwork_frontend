"use client";

import { useState, useEffect, useMemo } from "react";
import { StatsCard } from "@/components/shared/StatsCard";
import { RecentJobsCard, Job } from "@/components/feature/employer/RecentJobsCard";
import {
  PendingApplicationsCard,
  Application,
} from "@/components/feature/employer/PendingApplicationsCard";
import { FileText, Briefcase, Users, Loader2 } from "lucide-react";

// Import services and hooks
import { authService } from "@/services/auth";
import { useCurrentUser } from "@/hooks/useProfile";
import { useJobs } from "@/hooks/useJobs";
import { applicationsService, JobApplicationFull } from "@/services/applications";

export default function EmployerDashboard() {
  // Use SWR hooks for cached data
  const { profile: userData, isLoading: profileLoading } = useCurrentUser();
  const { jobs: apiJobs, isLoading: jobsLoading } = useJobs();

  const [companyName, setCompanyName] = useState("Company");
  const [allApplications, setAllApplications] = useState<JobApplicationFull[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  // Get company name
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.email) {
      setCompanyName(currentUser.email.split("@")[0]);
    }
  }, []);

  useEffect(() => {
    if (userData?.employerProfile?.companyName) {
      setCompanyName(userData.employerProfile.companyName);
    }
  }, [userData]);

  // Filter jobs by current employer ID
  const myJobs = useMemo(() => {
    if (!userData?.id) return [];
    return apiJobs.filter(job => job.employerId === userData.id);
  }, [apiJobs, userData?.id]);

  // Fetch applications for my jobs
  useEffect(() => {
    if (myJobs.length === 0) return;

    const fetchApplications = async () => {
      setIsLoadingApps(true);
      try {
        const appsResults = await Promise.all(
          myJobs.map(async (job) => {
            try {
              return await applicationsService.getByJobId(job.id);
            } catch (e) {
              console.error(`Failed to fetch applications for job ${job.id}`, e);
              return [];
            }
          })
        );
        const allApps = appsResults.flat();
        setAllApplications(allApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoadingApps(false);
      }
    };

    fetchApplications();
  }, [myJobs]);

  const handleAccept = async (applicationId: string) => {
    try {
      await applicationsService.accept(Number(applicationId));
      setAllApplications(currentApps =>
        currentApps.map(app =>
          String(app.id) === applicationId ? { ...app, status: "accepted" as const } : app
        )
      );
    } catch (err) {
      console.error("Error accepting application:", err);
      alert("Failed to accept application");
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await applicationsService.reject(Number(applicationId));
      setAllApplications(currentApps =>
        currentApps.map(app =>
          String(app.id) === applicationId ? { ...app, status: "cancelled" as const } : app
        )
      );
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Failed to reject application");
    }
  };

  // Transform recent jobs from API to component format
  const recentJobs: Job[] = useMemo(() => {
    return myJobs.slice(0, 5).map((job) => ({
      id: String(job.id),
      title: job.title,
      status: job.status as any,
      postedDate: new Date(job.startDate).toLocaleDateString("en-GB"),
      applicationsCount: allApplications.filter(app => app.jobId === job.id).length,
    }));
  }, [myJobs, allApplications]);

  // Transform applications from API
  const pendingApplications: Application[] = useMemo(() => {
    return allApplications
      .filter((app) => app.status === "pending")
      .slice(0, 5)
      .map((app) => {
        const job = myJobs.find(j => j.id === app.jobId);
        return {
          id: String(app.id),
          applicantName: app.worker?.email?.split('@')[0] || `Worker #${app.workerId}`,
          workerId: app.workerId,
          jobId: String(app.jobId),
          jobTitle: job?.title || app.job?.title || "Unknown Job",
          appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently",
        };
      });
  }, [allApplications, myJobs]);

  // Calculate stats
  const totalApplications = allApplications.length;
  const jobsPosted = myJobs.length;
  const employeesHired = allApplications.filter(a => a.status === "accepted" || a.status === "completed").length;
  const openJobs = myJobs.filter((job) => job.status === "open").length;

  // Only show loading on first load (no cached data)
  if ((profileLoading || jobsLoading) && !userData && myJobs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {companyName}! Here&apos;s an overview of your activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Applications"
          value={totalApplications}
          icon={FileText}
          trend={0}
          description="received"
        />
        <StatsCard
          title="Jobs Posted"
          value={jobsPosted}
          icon={Briefcase}
          trend={openJobs}
          description="open positions"
        />
        <StatsCard
          title="Employees Hired"
          value={employeesHired}
          icon={Users}
          trend={0}
          description="workers"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <RecentJobsCard jobs={recentJobs} />

        {/* Pending Applications */}
        <PendingApplicationsCard
          applications={pendingApplications}
          onApprove={handleAccept}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}