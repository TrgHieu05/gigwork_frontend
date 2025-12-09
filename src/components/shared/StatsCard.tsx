"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: number;
    iconColor?: string;
    iconBgColor?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    iconColor = "text-primary",
    iconBgColor = "bg-primary/10",
}: StatsCardProps) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        {(description || trend !== undefined) && (
                            <div className="flex items-center gap-2">
                                {trend !== undefined && (
                                    <span className={`text-sm font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                                        {trend >= 0 ? "+" : ""}{trend}
                                    </span>
                                )}
                                {description && (
                                    <span className="text-sm text-muted-foreground">{description}</span>
                                )}
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg border ${iconBgColor}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
