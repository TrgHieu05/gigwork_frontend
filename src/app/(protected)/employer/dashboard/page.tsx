"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/shared/StatsCard";
import { RecentJobsCard, Job } from "@/components/feature/employer/RecentJobsCard";
import {
  PendingApplicationsCard,
  Application,
} from "@/components/feature/employer/PendingApplicationsCard";
import { FileText, Briefcase, Users, Loader2 } from "lucide-react";

// Import services
import { authService, getErrorMessage } from "@/services/auth";
import { profileService, UserProfile } from "@/services/profile";
import { jobsService, Job as ApiJob } from "@/services/jobs";
import { applicationsService } from "@/services/applications";

export default function EmployerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [companyName, setCompanyName] = useState("Company");
  const [jobs, setJobs] = useState<ApiJob[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Get current user info from local storage (fast, reliable)
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser?.email) {
          setCompanyName(currentUser.email.split("@")[0]);
        }
      } catch (e) {
        console.error("Error getting local user info:", e);
      }

      // Fetch profile and jobs in parallel
      try {
        const [profileResult, jobsResult] = await Promise.allSettled([
          profileService.getCurrentUser(),
          jobsService.listJobs()
        ]);

        let currentUserId: number | undefined;

        // Handle Profile Result
        if (profileResult.status === 'fulfilled') {
          const profile = profileResult.value;
          setUserData(profile);
          currentUserId = profile.id;
          if (profile.employerProfile?.companyName) {
            setCompanyName(profile.employerProfile.companyName);
          }
        } else {
          console.error("Error fetching profile:", getErrorMessage(profileResult.reason));
          console.error("Raw profile error:", profileResult.reason);
        }

        // Handle Jobs Result
        if (jobsResult.status === 'fulfilled') {
          const allJobs = jobsResult.value.items;
          
          // Filter jobs by current employer ID
          if (currentUserId) {
            const myJobs = allJobs.filter(job => job.employerId === currentUserId);
            
            // Fetch detailed info for each job to get applications
            // listJobs API might not return applications or return empty array
            const detailedJobs = await Promise.all(
              myJobs.map(async (job) => {
                try {
                  return await jobsService.getJob(job.id);
                } catch (e) {
                  console.error(`Failed to fetch details for job ${job.id}`, e);
                  return job;
                }
              })
            );
            
            setJobs(detailedJobs);
          } else {
            console.warn("Could not filter jobs: User ID missing");
            setJobs([]);
          }
        } else {
          console.error("Error fetching jobs:", getErrorMessage(jobsResult.reason));
        }

      } catch (error) {
        console.error("Unexpected error in dashboard data fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (applicationId: string) => {
    try {
      await applicationsService.accept(Number(applicationId));
      
      // Update local state
      setJobs(currentJobs => currentJobs.map(job => {
        if (!job.applications) return job;
        
        const hasApp = job.applications.some(app => String(app.id) === applicationId);
        if (hasApp) {
          return {
            ...job,
            applications: job.applications.map(app => 
              String(app.id) === applicationId ? { ...app, status: "accepted" } : app
            )
          };
        }
        return job;
      }));
    } catch (err) {
      console.error("Error accepting application:", err);
      alert("Failed to accept application");
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await applicationsService.reject(Number(applicationId));
      
      // Update local state
      setJobs(currentJobs => currentJobs.map(job => {
        if (!job.applications) return job;
        
        const hasApp = job.applications.some(app => String(app.id) === applicationId);
        if (hasApp) {
          return {
            ...job,
            applications: job.applications.map(app => 
              String(app.id) === applicationId ? { ...app, status: "rejected" } : app
            )
          };
        }
        return job;
      }));
    } catch (err) {
      console.error("Error rejecting application:", err);
      alert("Failed to reject application");
    }
  };

  // Transform recent jobs from API to component format
  // Use real jobs data with actual application counts
  const recentJobs: Job[] = jobs.slice(0, 5).map((job) => ({
    id: String(job.id),
    title: job.title,
    status: job.status === "open" ? "active" : job.status === "completed" ? "closed" : "active",
    postedDate: new Date(job.startDate).toLocaleDateString("en-GB"),
    applicationsCount: job.applications?.length || 0, // Real application count
  }));

  // Transform applications from jobs
  const pendingApplications: Application[] = jobs.flatMap((job) =>
    (job.applications || [])
      .filter((app) => app.status === "pending")
      .slice(0, 5)
      .map((app) => ({
        id: String(app.id),
        applicantName: app.worker?.name || `Worker #${app.workerId}`,
        jobId: String(job.id),
        jobTitle: job.title,
        appliedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recently",
      }))
  ).slice(0, 5);

  // Calculate stats
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
  const jobsPosted = jobs.length;
  const employeesHired = jobs.reduce(
    (sum, job) => sum + (job.applications?.filter((a: { status: string }) => a.status === "accepted" || a.status === "completed").length || 0),
    0
  );
  const openJobs = jobs.filter((job) => job.status === "open").length;

  if (isLoading) {
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