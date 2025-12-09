import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";
import Link from "next/link";

export interface ActiveJob {
    id: string;
    title: string;
    company: string;
    salary: string;
    status: string;
    startDate: string;
    duration: string;
    location: string;
}

interface ActiveJobCardProps {
    job: ActiveJob;
}

export function ActiveJobCard({ job }: ActiveJobCardProps) {
    return (
        <div className="p-4 border rounded-lg space-y-3">
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
                    <p className="font-semibold text-primary">{job.salary}</p>
                    <Badge
                        className={`mt-1 ${job.status === "In Progress"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                    >
                        {job.status}
                    </Badge>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div>
                    <p className="text-xs">Start date</p>
                    <p className="font-medium text-foreground">{job.startDate}</p>
                </div>
                <div>
                    <p className="text-xs">Duration</p>
                    <p className="font-medium text-foreground">{job.duration}</p>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs">Location</p>
                    <p className="font-medium text-foreground truncate">{job.location}</p>
                </div>
            </div>

            <div className="flex justify-end">
                <Link href={`/employee/jobs/${job.id}`}>
                    <Button variant="outline" size="small">
                        View details
                    </Button>
                </Link>
            </div>
        </div>
    );
}
