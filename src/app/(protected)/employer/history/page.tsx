"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  DollarSign,
  Loader2,
} from "lucide-react";
import { JobCard, JobCardData, JobStatus } from "@/components/feature/employer/JobCard";
import { jobsService, Job, getJobLocationString } from "@/services/jobs";
import { profileService } from "@/services/profile";

// Types
type ApplicationHistoryStatus = "pending" | "accepted" | "rejected" | "completed";

interface ApplicationHistory {
  id: string;
  applicantName: string;
  applicantAvatar?: string;
  jobTitle: string;
  appliedDate: string;
  status: ApplicationHistoryStatus;
  salary?: number;
}

const appStatusConfig: Record<ApplicationHistoryStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  completed: { label: "Completed", variant: "secondary" },
};

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// Transform API job to JobCardData
function transformApiJob(apiJob: Job): JobCardData {
  const startDate = new Date(apiJob.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + apiJob.durationDays);

  return {
    id: String(apiJob.id),
    title: apiJob.title,
    status: (apiJob.status as JobStatus) || "open",
    location: getJobLocationString(apiJob),
    duration: `${apiJob.durationDays} days`,
    salary: apiJob.salary ? `${apiJob.salary.toLocaleString()} VND` : "Negotiable",
    dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    applicantsCount: apiJob.workerQuota,
    hiredCount: 0,
    viewsCount: 0,
    postedDate: apiJob.createdAt ? new Date(apiJob.createdAt).toLocaleDateString() : "Recently",
  };
}

export default function HistoryPage() {
  const [mainTab, setMainTab] = useState("jobs");
  const [jobFilter, setJobFilter] = useState("all");
  const [appFilter, setAppFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [applications, setApplications] = useState<ApplicationHistory[]>([]);
  const [hiredEmployees, setHiredEmployees] = useState<ApplicationHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch jobs from API
        const jobsResponse = await jobsService.listJobs();
        const transformedJobs = jobsResponse.items.map(transformApiJob);
        setJobs(transformedJobs);

        // Get user profile with applications data
        const profile = await profileService.getCurrentUser();

        // Transform applications from profile
        if (profile.recentApplications) {
          const apps: ApplicationHistory[] = profile.recentApplications.map((app) => ({
            id: String(app.applicationId),
            applicantName: "Candidate", // Name not available in simplified profile view
            jobTitle: app.jobTitle || "Unknown Job",
            appliedDate: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently",
            status: app.status as ApplicationHistoryStatus,
            salary: undefined, // Salary not available in simplified profile view
          }));

          setApplications(apps);

          // Filter hired employees (accepted or completed applications)
          const hired = apps.filter(a => a.status === "accepted" || a.status === "completed");
          setHiredEmployees(hired);
        }
      } catch (error) {
        console.error("Error fetching history data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredJobs = jobFilter === "all" ? jobs : jobs.filter(j => j.status === jobFilter);
  const filteredApps = appFilter === "all" ? applications : applications.filter(a => a.status === appFilter);

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
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground">View your past activities and records</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="hired">Employees Hired ({hiredEmployees.length})</TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <div className="space-y-4">
            {/* Job Filter */}
            <div className="flex gap-2">
              {["all", "open", "ongoing", "completed", "closed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setJobFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${jobFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                    }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            {/* Job List */}
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} variant="compact" isOwner={true} />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No jobs found
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <div className="space-y-4">
            {/* App Filter */}
            <div className="flex gap-2">
              {["all", "pending", "accepted", "rejected", "completed"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAppFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${appFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                    }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            {/* App List */}
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={app.applicantAvatar} />
                          <AvatarFallback>{getInitials(app.applicantName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{app.applicantName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="h-3 w-3" />
                            <span>{app.jobTitle}</span>
                            <span>•</span>
                            <span>{app.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={appStatusConfig[app.status]?.variant || "outline"}>
                        {appStatusConfig[app.status]?.label || app.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No applications found
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Hired Tab */}
        <TabsContent value="hired">
          <div className="space-y-4">
            {hiredEmployees.length > 0 ? (
              hiredEmployees.map((emp) => (
                <Card key={emp.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={emp.applicantAvatar} />
                          <AvatarFallback>{getInitials(emp.applicantName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{emp.applicantName}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="h-3 w-3" />
                            <span>{emp.jobTitle}</span>
                            <span>•</span>
                            <span>{emp.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4" />
                        {emp.salary ? `${emp.salary.toLocaleString()} VND` : "N/A"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No hired employees yet
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}