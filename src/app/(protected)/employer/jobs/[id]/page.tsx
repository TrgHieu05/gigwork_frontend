"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  Mail,
  Phone,
  MessageSquare,
  Star,
} from "lucide-react";
import { CommentModal, useCommentModal } from "@/components/shared/CommentModal";

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
  workConfirmed?: boolean;
}

interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  rating?: number;
  createdAt: string;
  type: "from_employee" | "from_employer";
}

// Mock data
const mockJobDetails: Record<string, JobDetails> = {
  "1": {
    id: "1",
    title: "Warehouse Associate",
    status: "completed",
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
  { id: "2", applicantName: "Emily Johnson", appliedDate: "Oct 14, 2024", status: "approved", experience: "3 years logistics", phone: "(555) 234-5678", email: "emily@email.com", workConfirmed: true },
  { id: "3", applicantName: "Michael Brown", appliedDate: "Oct 13, 2024", status: "pending", experience: "1 year retail", phone: "(555) 345-6789", email: "michael@email.com" },
  { id: "4", applicantName: "Sarah Davis", appliedDate: "Oct 12, 2024", status: "rejected", experience: "No experience", phone: "(555) 456-7890", email: "sarah@email.com" },
  { id: "5", applicantName: "James Wilson", appliedDate: "Oct 11, 2024", status: "approved", experience: "5 years warehouse", phone: "(555) 567-8901", email: "james@email.com" },
];

const mockComments: Comment[] = [
  { id: "1", authorName: "Emily Johnson", content: "Great employer! Very organized and clear instructions.", rating: 5, createdAt: "Oct 27, 2024", type: "from_employee" },
  { id: "2", authorName: "James Wilson", content: "Good work environment. Would work here again.", rating: 4, createdAt: "Oct 27, 2024", type: "from_employee" },
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
  const searchParams = useSearchParams();
  const jobId = params.id as string;

  const initialTab = searchParams.get("tab") || "details";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [applications, setApplications] = useState(mockApplications);
  const [comments, setComments] = useState(mockComments);
  const [selectedEmployee, setSelectedEmployee] = useState<Application | null>(null);
  const { isOpen, openModal, closeModal } = useCommentModal();

  const job = mockJobDetails[jobId] || mockJobDetails["1"];
  const isOwner = true;
  const isActive = job.status === "open" || job.status === "ongoing";
  const isCompleted = job.status === "completed" || job.status === "closed";

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

  const handleConfirmWork = (appId: string) => {
    setApplications(prev => prev.map(app =>
      app.id === appId ? { ...app, workConfirmed: true } : app
    ));
  };

  const handleOpenComment = (employee: Application) => {
    setSelectedEmployee(employee);
    openModal();
  };

  const handleSubmitComment = (comment: string, rating?: number) => {
    if (selectedEmployee) {
      const newComment: Comment = {
        id: String(Date.now()),
        authorName: "Employer", // Current user
        content: comment,
        rating,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        type: "from_employer",
      };
      setComments(prev => [...prev, newComment]);
    }
  };

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;
  const approvedEmployees = applications.filter(a => a.status === "approved");
  const employeeComments = comments.filter(c => c.type === "from_employee");

  return (
    <>
      <div className="h-full p-6 space-y-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="h-9 w-9 p-0 border-0" onClick={() => router.back()}>
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
            <Button variant="outline" className="h-9 w-9 p-0">
              <Share2 className="h-4 w-4" />
            </Button>
            {isOwner && isActive && (
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
            {isOwner && (
              <>
                <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
                <TabsTrigger value="employees">Employees ({approvedCount})</TabsTrigger>
                <TabsTrigger value="comments">Comments ({employeeComments.length})</TabsTrigger>
              </>
            )}
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
          {isOwner && (
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
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {app.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {app.phone}
                                  </span>
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
          )}

          {/* Employees Tab */}
          {isOwner && (
            <TabsContent value="employees">
              <div className="space-y-4">
                {approvedEmployees.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No employees assigned yet</h3>
                      <p className="text-muted-foreground">
                        Approved applicants will appear here.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  approvedEmployees.map((emp) => (
                    <Card key={emp.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={emp.applicantAvatar} />
                              <AvatarFallback>{getInitials(emp.applicantName)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{emp.applicantName}</h3>
                              <p className="text-sm text-muted-foreground">{emp.experience}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {emp.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {emp.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <>
                                {emp.workConfirmed ? (
                                  <Badge className="bg-green-100 text-green-700">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Work Confirmed
                                  </Badge>
                                ) : (
                                  <Button
                                    size="small"
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                    onClick={() => handleConfirmWork(emp.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Confirm Work
                                  </Button>
                                )}
                                <Button
                                  size="small"
                                  variant="outline"
                                  onClick={() => handleOpenComment(emp)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Comment
                                </Button>
                              </>
                            )}
                            <Badge variant="default" className="bg-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Hired
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          {/* Comments Tab */}
          {isOwner && (
            <TabsContent value="comments">
              <div className="space-y-4">
                {employeeComments.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2">No comments yet</h3>
                      <p className="text-muted-foreground">
                        Comments from employees will appear here after job completion.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  employeeComments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={comment.authorAvatar} />
                            <AvatarFallback>{getInitials(comment.authorName)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">{comment.authorName}</h4>
                                <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
                              </div>
                              {comment.rating && (
                                <div className="flex items-center gap-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < comment.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="mt-2 text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Comment Modal */}
      <CommentModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleSubmitComment}
        recipientName={selectedEmployee?.applicantName || ""}
        showRating={true}
        title="Rate & Comment Employee"
      />
    </>
  );
}
