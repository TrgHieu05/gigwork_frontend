"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

// Types
type JobHistoryStatus = "open" | "ongoing" | "completed" | "closed";
type ApplicationHistoryStatus = "pending" | "approved" | "rejected";

interface JobHistory {
  id: string;
  title: string;
  status: JobHistoryStatus;
  location: string;
  dateRange: string;
  applicantsCount: number;
  hiredCount: number;
}

interface ApplicationHistory {
  id: string;
  applicantName: string;
  applicantAvatar?: string;
  jobTitle: string;
  appliedDate: string;
  status: ApplicationHistoryStatus;
}

interface HiredEmployee {
  id: string;
  name: string;
  avatar?: string;
  jobTitle: string;
  hiredDate: string;
  salary: string;
}

// Mock data
const mockJobs: JobHistory[] = [
  { id: "1", title: "Warehouse Associate", status: "open", location: "Chicago, IL", dateRange: "Oct 22 - Oct 26", applicantsCount: 67, hiredCount: 12 },
  { id: "2", title: "Retail Sales Associate", status: "completed", location: "New York, NY", dateRange: "Oct 15 - Oct 21", applicantsCount: 89, hiredCount: 15 },
  { id: "3", title: "Event Staff", status: "ongoing", location: "Los Angeles, CA", dateRange: "Oct 25 - Oct 27", applicantsCount: 45, hiredCount: 8 },
  { id: "4", title: "Construction Helper", status: "closed", location: "Houston, TX", dateRange: "Oct 1 - Oct 7", applicantsCount: 56, hiredCount: 10 },
];

const mockApplications: ApplicationHistory[] = [
  { id: "1", applicantName: "John Smith", jobTitle: "Warehouse Associate", appliedDate: "Oct 15, 2024", status: "pending" },
  { id: "2", applicantName: "Emily Johnson", jobTitle: "Retail Sales", appliedDate: "Oct 14, 2024", status: "approved" },
  { id: "3", applicantName: "Michael Brown", jobTitle: "Event Staff", appliedDate: "Oct 13, 2024", status: "rejected" },
  { id: "4", applicantName: "Sarah Davis", jobTitle: "Warehouse Associate", appliedDate: "Oct 12, 2024", status: "approved" },
];

const mockHiredEmployees: HiredEmployee[] = [
  { id: "1", name: "James Wilson", jobTitle: "Warehouse Associate", hiredDate: "Oct 16, 2024", salary: "$18/hr" },
  { id: "2", name: "Lisa Anderson", jobTitle: "Retail Sales", hiredDate: "Oct 15, 2024", salary: "$19/hr" },
  { id: "3", name: "Robert Taylor", jobTitle: "Event Staff", hiredDate: "Oct 14, 2024", salary: "$22/hr" },
];

const jobStatusConfig: Record<JobHistoryStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  open: { label: "Open", variant: "default" },
  ongoing: { label: "Ongoing", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  closed: { label: "Closed", variant: "secondary" },
};

const appStatusConfig: Record<ApplicationHistoryStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function HistoryPage() {
  const [mainTab, setMainTab] = useState("jobs");
  const [jobFilter, setJobFilter] = useState("all");
  const [appFilter, setAppFilter] = useState("all");

  const filteredJobs = jobFilter === "all" ? mockJobs : mockJobs.filter(j => j.status === jobFilter);
  const filteredApps = appFilter === "all" ? mockApplications : mockApplications.filter(a => a.status === appFilter);

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
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="hired">Employees Hired</TabsTrigger>
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
            {filteredJobs.map((job) => (
              <Link key={job.id} href={`/employer/jobs/${job.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{job.title}</h3>
                          <Badge variant={jobStatusConfig[job.status].variant}>
                            {jobStatusConfig[job.status].label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {job.dateRange}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium">{job.applicantsCount}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span className="font-medium">{job.hiredCount}</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <div className="space-y-4">
            {/* App Filter */}
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((filter) => (
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
            {filteredApps.map((app) => (
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
                    <Badge variant={appStatusConfig[app.status].variant}>
                      {appStatusConfig[app.status].label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Hired Tab */}
        <TabsContent value="hired">
          <div className="space-y-4">
            {mockHiredEmployees.map((emp) => (
              <Card key={emp.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={emp.avatar} />
                        <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{emp.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          <span>{emp.jobTitle}</span>
                          <span>•</span>
                          <span>{emp.hiredDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {emp.salary}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}