import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Calendar, Star } from "lucide-react";
import Link from "next/link";

export interface EmployeeJob {
    id: string;
    title: string;
    company: string;
    location: string;
    duration: string;
    // For active jobs
    salary?: string;
    status?: string;
    startDate?: string;
    // For completed jobs
    completedDate?: string;
    earned?: string;
    rating?: number;
}

interface EmployeeJobCardProps {
    job: EmployeeJob;
    variant?: "active" | "completed";
}

export function EmployeeJobCard({ job, variant = "active" }: EmployeeJobCardProps) {
    const isCompleted = variant === "completed";

    return (
        <Card>
            <CardContent className="p-4 space-y-3">
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
                        {isCompleted ? (
                            <>
                                <p className="font-semibold text-green-600">{job.earned}</p>
                                {job.rating && (
                                    <div className="flex items-center gap-0.5 mt-1 justify-end">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${i < job.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="font-semibold text-primary">{job.salary}</p>
                                <Badge
                                    className={`mt-1 ${job.status === "In Progress"
                                            ? "bg-green-100 text-green-700"
                                            : job.status === "Completed"
                                                ? "bg-gray-100 text-gray-700"
                                                : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {job.status}
                                </Badge>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {isCompleted ? job.completedDate : job.startDate}
                    </span>
                    <span>{job.duration}</span>
                </div>

                <div className="flex justify-end">
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
