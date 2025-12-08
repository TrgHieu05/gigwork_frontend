"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Clock,
    DollarSign,
    Calendar,
    Users,
    Eye,
    MoreVertical,
    Pencil,
    UserCheck,
} from "lucide-react";
import Link from "next/link";

export type JobStatus = "open" | "full" | "closed" | "upcoming" | "ongoing" | "completed";

export interface JobCardData {
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
}

interface JobCardProps {
    job: JobCardData;
    onEdit?: (id: string) => void;
    onClose?: (id: string) => void;
    onRepost?: (id: string) => void;
}

const statusConfig: Record<JobStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    open: { label: "Active", variant: "default" },
    full: { label: "Full", variant: "secondary" },
    closed: { label: "Closed", variant: "secondary" },
    upcoming: { label: "Upcoming", variant: "outline" },
    ongoing: { label: "Ongoing", variant: "default" },
    completed: { label: "Completed", variant: "secondary" },
};

export function JobCard({ job, onEdit, onClose, onRepost }: JobCardProps) {
    const isActive = job.status === "open" || job.status === "ongoing";

    return (
        <Card className="w-full">
            <CardContent className="p-5 space-y-4">
                {/* Header: Title, Status Badge, More Menu */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={`/employer/jobs/${job.id}`} className="hover:underline">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                        </Link>
                        <Badge variant={statusConfig[job.status].variant}>
                            {statusConfig[job.status].label}
                        </Badge>
                    </div>
                    <button className="p-1 hover:bg-muted rounded">
                        <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Job Details Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.duration}
                    </span>
                    <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {job.dateRange}
                    </span>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium text-primary">{job.applicantsCount}</span>
                            <span className="text-muted-foreground">applicants</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="font-medium">{job.hiredCount}</span>
                            <span className="text-muted-foreground">hired</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{job.viewsCount} views</span>
                        </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        Posted {job.postedDate}
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                    {isActive ? (
                        <>
                            <Link href={`/employer/jobs/${job.id}/applicants`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <Users className="h-4 w-4 mr-2" />
                                    View Applicants ({job.applicantsCount})
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={() => onEdit?.(job.id)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={() => onClose?.(job.id)}
                            >
                                Close Job
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href={`/employer/jobs/${job.id}`} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    View Details
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={() => onRepost?.(job.id)}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Repost Job
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
