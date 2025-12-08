"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Building,
    MapPin,
    Calendar,
    DollarSign,
    Star,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data for completed jobs
const completedJobs = [
    {
        id: "1",
        title: "Warehouse Assistant",
        company: "LogiCorp",
        location: "District 12, TPHCM",
        completedDate: "15/11/2025",
        duration: "3 days",
        earned: "$180",
        rating: 5,
    },
    {
        id: "2",
        title: "Event Staff",
        company: "EventPro",
        location: "District 7, TPHCM",
        completedDate: "10/11/2025",
        duration: "2 days",
        earned: "$120",
        rating: 4,
    },
    {
        id: "3",
        title: "Retail Associate",
        company: "FashionMart",
        location: "District 1, TPHCM",
        completedDate: "01/11/2025",
        duration: "5 days",
        earned: "$250",
        rating: 5,
    },
];

// Mock data for application history
const applicationHistory = [
    {
        id: "1",
        title: "Restaurant Server",
        company: "Fine Dining Group",
        appliedDate: "05/12/2025",
        status: "Pending",
    },
    {
        id: "2",
        title: "Retail Sales",
        company: "Fashion Inc.",
        appliedDate: "03/12/2025",
        status: "Accepted",
    },
    {
        id: "3",
        title: "Delivery Driver",
        company: "QuickShip",
        appliedDate: "01/12/2025",
        status: "Rejected",
    },
    {
        id: "4",
        title: "Barista",
        company: "Coffee House",
        appliedDate: "28/11/2025",
        status: "Accepted",
    },
    {
        id: "5",
        title: "Cashier",
        company: "SuperMart",
        appliedDate: "25/11/2025",
        status: "Rejected",
    },
];

// Completed Job Card
function CompletedJobCard({ job }: { job: typeof completedJobs[0] }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                            <h4 className="font-medium">{job.title}</h4>
                            <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-green-600">{job.earned}</p>
                        <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < job.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {job.completedDate}
                    </span>
                    <span>{job.duration}</span>
                </div>

                <div className="flex justify-end mt-4">
                    <Link href={`/employee/jobs/${job.id}`}>
                        <Button variant="outline" size="small">
                            View details
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

// Application History Card
function ApplicationHistoryCard({ application }: { application: typeof applicationHistory[0] }) {
    const statusColors: Record<string, string> = {
        Pending: "bg-yellow-100 text-yellow-700",
        Accepted: "bg-green-100 text-green-700",
        Rejected: "bg-red-100 text-red-700",
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <h4 className="font-medium">{application.title}</h4>
                            <p className="text-sm text-muted-foreground">{application.company}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <Badge className={statusColors[application.status]}>
                            {application.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                            Applied: {application.appliedDate}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function EmployeeHistoryPage() {
    const [activeTab, setActiveTab] = useState("jobs");
    const [applicationFilter, setApplicationFilter] = useState("all");

    const filteredApplications = applicationFilter === "all"
        ? applicationHistory
        : applicationHistory.filter(app => app.status.toLowerCase() === applicationFilter);

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">History</h1>
                <p className="text-muted-foreground">View your completed jobs and application history</p>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="jobs">Completed Jobs</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>

                {/* Completed Jobs Tab */}
                <TabsContent value="jobs">
                    <div className="space-y-4">
                        {completedJobs.length > 0 ? (
                            completedJobs.map((job) => (
                                <CompletedJobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">No completed jobs yet</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Applications Tab */}
                <TabsContent value="applications">
                    {/* Sub-filters */}
                    <div className="flex gap-2 mb-4">
                        {["all", "pending", "accepted", "rejected"].map((filter) => (
                            <Button
                                key={filter}
                                variant={applicationFilter === filter ? "default" : "outline"}
                                size="small"
                                onClick={() => setApplicationFilter(filter)}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app) => (
                                <ApplicationHistoryCard key={app.id} application={app} />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">No applications found</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
