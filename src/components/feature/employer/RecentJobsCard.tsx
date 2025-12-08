import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, Users } from "lucide-react";
import Link from "next/link";

export interface Job {
    id: string;
    title: string;
    status: "active" | "closed" | "draft";
    postedDate: string;
    applicationsCount: number;
}

interface RecentJobsCardProps {
    jobs: Job[];
}

const statusConfig = {
    active: { label: "Active", variant: "default" as const },
    closed: { label: "Closed", variant: "secondary" as const },
    draft: { label: "Draft", variant: "outline" as const },
};

export function RecentJobsCard({ jobs }: RecentJobsCardProps) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Recent Jobs
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {jobs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        No jobs yet
                    </p>
                ) : (
                    jobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/employer/jobs/${job.id}`}
                            className="block rounded-lg border p-3 transition-colors hover:bg-accent"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{job.title}</h4>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {job.postedDate}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {job.applicationsCount} applicants
                                        </span>
                                    </div>
                                </div>
                                <Badge variant={statusConfig[job.status].variant}>
                                    {statusConfig[job.status].label}
                                </Badge>
                            </div>
                        </Link>
                    ))
                )}
            </CardContent>
        </Card>
    );
}
