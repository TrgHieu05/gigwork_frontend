import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building } from "lucide-react";

export interface EmployeeApplication {
    id: string;
    title: string;
    company: string;
    time: string; // e.g., "2 days ago" or "05/12/2025"
    status: "Pending" | "Accepted" | "Rejected";
}

interface EmployeeApplicationCardProps {
    application: EmployeeApplication;
    variant?: "compact" | "full"; // compact for dashboard, full for history
}

const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
};

const statusIcons: Record<string, string> = {
    Pending: "↻",
    Accepted: "✓",
    Rejected: "✗",
};

export function EmployeeApplicationCard({ application, variant = "compact" }: EmployeeApplicationCardProps) {
    if (variant === "compact") {
        // Compact version for dashboard (no Card wrapper)
        return (
            <div className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Building className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h4 className="font-medium text-sm">{application.title}</h4>
                        <p className="text-xs text-muted-foreground">{application.company}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{application.time}</p>
                    </div>
                </div>
                <Badge className={statusColors[application.status] || ""}>
                    {statusIcons[application.status] || ""} {application.status}
                </Badge>
            </div>
        );
    }

    // Full version for history page (with Card wrapper)
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
                            {statusIcons[application.status]} {application.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                            Applied: {application.time}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
