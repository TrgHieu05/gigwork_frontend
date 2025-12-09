import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    description?: string;
    trend?: number;
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
    return (
        <Card className="flex-1">
            <CardContent className="flex flex-col gap-2 p-5">
                {/* Top row: Title and Icon */}
                <div className="flex items-start justify-between">
                    <span className="text-lg font-semibold">{title}</span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/30 bg-primary/5">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>

                {/* Value */}
                <span className="text-4xl font-bold">{value}</span>

                {/* Description with trend */}
                {(description || trend !== undefined) && (
                    <div className="flex items-center gap-1 text-sm">
                        {trend !== undefined && (
                            <span className={trend >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                                {trend >= 0 ? `+${trend}` : trend}
                            </span>
                        )}
                        {description && (
                            <span className="text-muted-foreground">{description}</span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
