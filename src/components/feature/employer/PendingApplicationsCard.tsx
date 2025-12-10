"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export interface Application {
    id: string;
    applicantName: string;
    applicantAvatar?: string;
    workerId?: number; // Added to link to profile
    jobId: string;
    jobTitle: string;
    appliedDate: string;
}

interface PendingApplicationsCardProps {
    applications: Application[];
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function PendingApplicationsCard({
    applications,
    onApprove,
    onReject,
}: PendingApplicationsCardProps) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Pending Applications
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No pending applications
                    </p>
                ) : (
                    applications.map((app) => (
                        <div
                            key={app.id}
                            className="flex items-center gap-3 rounded-lg border p-3"
                        >
                            {/* Clickable Avatar */}
                            {app.workerId ? (
                                <Link href={`/profile/employee/${app.workerId}`}>
                                    <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                                        <AvatarImage src={app.applicantAvatar} alt={app.applicantName} />
                                        <AvatarFallback>{getInitials(app.applicantName)}</AvatarFallback>
                                    </Avatar>
                                </Link>
                            ) : (
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={app.applicantAvatar} alt={app.applicantName} />
                                    <AvatarFallback>{getInitials(app.applicantName)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className="flex-1 min-w-0">
                                {app.workerId ? (
                                    <Link
                                        href={`/profile/employee/${app.workerId}`}
                                        className="font-medium truncate hover:text-primary transition-colors block"
                                    >
                                        {app.applicantName}
                                    </Link>
                                ) : (
                                    <h4 className="font-medium truncate">{app.applicantName}</h4>
                                )}
                                <Link
                                    href={`/employer/jobs/${app.jobId}`}
                                    className="text-xs text-muted-foreground hover:text-primary truncate block"
                                >
                                    {app.jobTitle}
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                    {app.appliedDate}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    className="h-8 w-8 p-0 border-0 text-green-600 hover:text-green-700 hover:bg-green-100"
                                    variant="outline"
                                    onClick={() => onApprove?.(app.id)}
                                >
                                    <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                    className="h-8 w-8 p-0 border-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                                    variant="outline"
                                    onClick={() => onReject?.(app.id)}
                                >
                                    <XCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

