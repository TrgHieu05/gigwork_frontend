import { Card, CardContent } from "@/components/ui/card";

interface EmployeeStatsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    iconBgColor?: string;
    iconColor?: string;
}

export function EmployeeStatsCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconBgColor = "bg-primary/10",
    iconColor = "text-primary",
}: EmployeeStatsCardProps) {
    return (
        <Card className="flex-1">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-3xl font-bold mt-1">{value}</p>
                        <p className="text-sm text-primary mt-1">{subtitle}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${iconBgColor}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
