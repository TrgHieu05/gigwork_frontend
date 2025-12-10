"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Clock,
    DollarSign,
    Calendar,
    Building,
    Heart,
} from "lucide-react";
import Link from "next/link";
import { useRole } from "@/contexts/RoleContext";

export interface SearchJobCardProps {
    job: {
        id: string;
        title: string;
        company: string;
        companyLogo?: string;
        location: string;
        duration: string;
        salary: string;
        salaryType: string;
        dateRange: string;
        postedDate: string;
        category: string;
        description: string;
        isUrgent?: boolean;
    };
    isSaved?: boolean;
    onToggleSave?: (id: string) => void;
    showSaveButton?: boolean;
}

export function SearchJobCard({ 
    job, 
    isSaved = false, 
    onToggleSave, 
    showSaveButton = false 
}: SearchJobCardProps) {
    const { basePath } = useRole();

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <Link href={`${basePath}/jobs/${job.id}`}>
                                        <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                            {job.title}
                                        </h3>
                                    </Link>
                                    {job.isUrgent && (
                                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Building className="h-4 w-4" />
                                    <span>{job.company}</span>
                                </div>
                            </div>
                            {/* Save button */}
                            {showSaveButton && onToggleSave && (
                                <button
                                    onClick={() => onToggleSave(job.id)}
                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                >
                                    <Heart
                                        className={`h-5 w-5 ${isSaved
                                            ? "fill-red-500 text-red-500"
                                            : "text-muted-foreground"
                                            }`}
                                    />
                                </button>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {job.duration}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {job.dateRange}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-semibold text-green-600">{job.salary}</span>
                                <span className="text-sm text-muted-foreground">/{job.salaryType || "project"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {job.postedDate}
                                </span>
                                <Link href={`${basePath}/jobs/${job.id}`}>
                                    <Button variant="outline" size="small">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
