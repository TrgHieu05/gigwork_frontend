"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useCurrentUser } from "@/hooks/useProfile";
import { applicationsService } from "@/services/applications";
import Link from "next/link";

type ApplicationStatus = "Pending" | "Accepted" | "Completed" | "Rejected" | "Cancelled";

interface Application {
    id: string;
    jobId: string;
    jobTitle: string;
    status: ApplicationStatus;
    appliedAt: string;
}

const statusConfig: Record<ApplicationStatus, { color: string; bg: string; icon: React.ElementType }> = {
    Pending: { color: "text-yellow-600", bg: "bg-yellow-100", icon: Clock },
    Accepted: { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle },
    Completed: { color: "text-blue-600", bg: "bg-blue-100", icon: CheckCircle },
    Rejected: { color: "text-red-600", bg: "bg-red-100", icon: XCircle },
    Cancelled: { color: "text-gray-600", bg: "bg-gray-100", icon: AlertCircle },
};

export default function EmployeeApplicationsPage() {
    // Use SWR hook for cached profile data
    const { profile: userData, isLoading, mutate } = useCurrentUser();
    const [activeTab, setActiveTab] = useState("all");

    // Transform applications from profile data
    const applications: Application[] = useMemo(() => {
        if (!userData?.recentApplications) return [];
        return userData.recentApplications.map((app) => ({
            id: String(app.applicationId),
            jobId: String(app.jobId || 0),
            jobTitle: app.jobTitle || "Unknown Job",
            status: (app.status.charAt(0).toUpperCase() + app.status.slice(1)) as ApplicationStatus,
            appliedAt: app.appliedAt,
        }));
    }, [userData?.recentApplications]);

    const filteredApplications = activeTab === "all"
        ? applications
        : applications.filter(app => app.status.toLowerCase() === activeTab);

    const counts = {
        pending: applications.filter(a => a.status === "Pending").length,
        accepted: applications.filter(a => a.status === "Accepted").length,
        completed: applications.filter(a => a.status === "Completed").length,
    };

    // Only show loading on first load (no cached data)
    if (isLoading && !userData) {
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
                <h1 className="text-2xl font-bold">My Applications</h1>
                <p className="text-muted-foreground">
                    Track and manage your job applications
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Accepted</p>
                                <p className="text-2xl font-bold text-green-600">{counts.accepted}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Completed</p>
                                <p className="text-2xl font-bold text-blue-600">{counts.completed}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
                    <TabsTrigger value="accepted">Accepted ({counts.accepted})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-4">
                    {filteredApplications.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No applications found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredApplications.map((app) => {
                            const config = statusConfig[app.status] || statusConfig.Pending;
                            const StatusIcon = config.icon;
                            return (
                                <Card key={app.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${config.bg}`}>
                                                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                                                </div>
                                                <div>
                                                    <Link href={`/employee/jobs/${app.jobId}`}>
                                                        <h3 className="font-semibold hover:text-primary transition-colors">
                                                            {app.jobTitle}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground">
                                                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className={`${config.bg} ${config.color} border-0`}>
                                                    {app.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
