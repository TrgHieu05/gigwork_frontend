"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Eye,
  Pencil,
  Trash2,
  Share2,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

type JobStatus = "open" | "full" | "closed" | "upcoming" | "ongoing" | "completed";
type ApplicationStatus = "pending" | "approved" | "rejected";

interface JobDetails {
  id: string;
  title: string;
  status: JobStatus;
  location: string;
  duration: string;
  salary: string;
  dateRange: string;
  applicantsCount: number;
  hiredCount: number;
  viewsCount: number;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
  workSchedule: string;
  positions: number;
}

interface Application {
  id: string;
  applicantName: string;
  applicantAvatar?: string;
  appliedDate: string;
  status: ApplicationStatus;
  experience: string;
  phone: string;
  email: string;
}

// Mock data
const mockJobDetails: Record<string, JobDetails> = {
  "1": {
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
    description: "We are looking for reliable warehouse associates to help with inventory management, order fulfillment, and general warehouse duties.",
    requirements: [
      "Must be able to lift up to 50 lbs",
      "Previous warehouse experience preferred",
      "Reliable transportation",
      "Strong attention to detail",
    ],
    benefits: [
      "Competitive hourly rate",
      "Weekly pay",
      "Flexible scheduling",
    ],
    workSchedule: "Monday - Friday, 8:00 AM - 5:00 PM",
    positions: 15,
  },
  "2": {
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
    description: "Join our retail team for a week-long seasonal sale event.",
    requirements: [
      "Excellent customer service skills",
      "Previous retail experience",
    ],
    benefits: [
      "Employee discount",
      "Weekly pay",
    ],
    workSchedule: "Flexible shifts between 9:00 AM - 9:00 PM",
    positions: 20,
  },
};

const mockApplications: Application[] = [
  { id: "1", applicantName: "John Smith", appliedDate: "Oct 15, 2024", status: "pending", experience: "2 years warehouse", phone: "(555) 123-4567", email: "john@email.com" },
  { id: "2", applicantName: "Emily Johnson", appliedDate: "Oct 14, 2024", status: "approved", experience: "3 years logistics", phone: "(555) 234-5678", email: "emily@email.com" },
  { id: "3", applicantName: "Michael Brown", appliedDate: "Oct 13, 2024", status: "pending", experience: "1 year retail", phone: "(555) 345-6789", email: "michael@email.com" },
  { id: "4", applicantName: "Sarah Davis", appliedDate: "Oct 12, 2024", status: "rejected", experience: "No experience", phone: "(555) 456-7890", email: "sarah@email.com" },
  { id: "5", applicantName: "James Wilson", appliedDate: "Oct 11, 2024", status: "pending", experience: "5 years warehouse", phone: "(555) 567-8901", email: "james@email.com" },
];

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  open: { label: "Active", variant: "default" },
  full: { label: "Full", variant: "secondary" },
  closed: { label: "Closed", variant: "secondary" },
  upcoming: { label: "Upcoming", variant: "outline" },
  ongoing: { label: "Ongoing", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
};

const applicationStatusConfig: Record<ApplicationStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: React.ElementType }> = {
  pending: { label: "Pending", variant: "outline", icon: AlertCircle },
  approved: { label: "Approved", variant: "default", icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive", icon: XCircle },
};

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  const [activeTab, setActiveTab] = useState("details");
  const [applications, setApplications] = useState(mockApplications);

  const job = mockJobDetails[jobId] || mockJobDetails["1"];
  const isActive = job.status === "open" || job.status === "ongoing";

  const handleApprove = (appId: string) => {
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, status: "approved" as ApplicationStatus } : app
    ));
  };

  const handleReject = (appId: string) => {
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, status: "rejected" as ApplicationStatus } : app
    ));
  };

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;

  return (
    <div className="h-full p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <Badge variant={statusConfig[job.status].variant}>
                {statusConfig[job.status].label}
              </Badge>
            </div>
            <p className="text-muted-foreground">Posted {job.postedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          {isActive && (
            <>
              <Button variant="outline">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Close Job
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Applicants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{job.viewsCount}</p>
              <p className="text-sm text-muted-foreground">Views</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
        </TabsList>

        {/* Job Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{job.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{job.dateRange}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{job.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Work Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{job.workSchedule}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No applications yet
              </div>
            ) : (
              applications.map((app) => {
                const StatusIcon = applicationStatusConfig[app.status].icon;
                return (
                  <Card key={app.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={app.applicantAvatar} />
                            <AvatarFallback>{getInitials(app.applicantName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{app.applicantName}</h3>
                            <p className="text-sm text-muted-foreground">{app.experience}</p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>{app.email}</span>
                              <span>{app.phone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={applicationStatusConfig[app.status].variant}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {applicationStatusConfig[app.status].label}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Applied {app.appliedDate}
                            </p>
                          </div>
                          {app.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="small"
                                onClick={() => handleApprove(app.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="destructive"
                                onClick={() => handleReject(app.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
