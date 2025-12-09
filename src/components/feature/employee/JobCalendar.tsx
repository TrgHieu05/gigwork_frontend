"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ArrowUp, ArrowDown, MapPin, Clock, Briefcase } from "lucide-react";

// Job info for calendar display
interface CalendarJob {
    id: string | number;
    title: string;
    location?: string;
    startTime?: string;
    status?: string;
}

interface DayWithJob {
    day: number;
    jobs: CalendarJob[];
}

interface JobCalendarProps {
    daysWithJobs?: number[] | DayWithJob[];
}

export function JobCalendar({ daysWithJobs = [] }: JobCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // Normalize daysWithJobs to always be DayWithJob[] format
    const normalizedDays: DayWithJob[] = daysWithJobs.map((item) => {
        if (typeof item === "number") {
            return { day: item, jobs: [] };
        }
        return item;
    });

    const getJobsForDay = (day: number): CalendarJob[] => {
        const dayData = normalizedDays.find(d => d.day === day);
        return dayData?.jobs || [];
    };

    const hasDayWithJobs = (day: number): boolean => {
        return normalizedDays.some(d => d.day === day);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        // Get day of week (0 = Sunday, adjust for Monday start)
        let startDayOfWeek = firstDay.getDay() - 1;
        if (startDayOfWeek < 0) startDayOfWeek = 6;

        const days: { day: number; isCurrentMonth: boolean; isToday: boolean }[] = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                isToday:
                    i === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear(),
            });
        }

        // Next month days to fill remaining cells (ensure 6 rows)
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        return days;
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const days = getDaysInMonth(currentDate);

    return (
        <Card>
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">
                            {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
                        </span>
                        <button
                            onClick={prevMonth}
                            className="p-1 hover:bg-muted rounded"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={prevMonth}
                            className="p-1 hover:bg-muted rounded"
                        >
                            <ArrowUp className="h-4 w-4 text-primary" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-1 hover:bg-muted rounded"
                        >
                            <ArrowDown className="h-4 w-4 text-primary" />
                        </button>
                    </div>
                </div>

                {/* Days of week header */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
                    {daysOfWeek.map((day) => (
                        <div
                            key={day}
                            style={{ textAlign: "center", padding: "8px 0", fontSize: "14px", fontWeight: 500, color: "#6b7280" }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                    {days.map((dayInfo, index) => {
                        const hasJob = dayInfo.isCurrentMonth && hasDayWithJobs(dayInfo.day);
                        const jobsForDay = dayInfo.isCurrentMonth ? getJobsForDay(dayInfo.day) : [];
                        const isHovered = hoveredDay === dayInfo.day && dayInfo.isCurrentMonth;

                        return (
                            <div
                                key={index}
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "40px",
                                    fontSize: "14px",
                                    borderRadius: "9999px",
                                    cursor: hasJob ? "pointer" : dayInfo.isCurrentMonth ? "default" : "default",
                                    backgroundColor: dayInfo.isToday ? "hsl(var(--primary))" : "transparent",
                                    color: dayInfo.isToday
                                        ? "hsl(var(--primary-foreground))"
                                        : !dayInfo.isCurrentMonth
                                            ? "#d1d5db"
                                            : "inherit",
                                }}
                                onMouseEnter={() => hasJob && setHoveredDay(dayInfo.day)}
                                onMouseLeave={() => setHoveredDay(null)}
                            >
                                {dayInfo.day}
                                {/* Red dot for days with jobs */}
                                {hasJob && !dayInfo.isToday && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "4px",
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "9999px",
                                            backgroundColor: "#ef4444",
                                        }}
                                    />
                                )}

                                {/* Hover tooltip with job cards */}
                                {isHovered && jobsForDay.length > 0 && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            zIndex: 50,
                                            marginTop: "8px",
                                            minWidth: "220px",
                                            maxWidth: "280px",
                                        }}
                                    >
                                        <div className="bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-3 space-y-2">
                                            <div className="text-xs font-semibold text-muted-foreground mb-2">
                                                Jobs on {monthNames[currentDate.getMonth()]} {dayInfo.day}
                                            </div>
                                            {jobsForDay.map((job, jobIndex) => (
                                                <div
                                                    key={job.id || jobIndex}
                                                    className="p-2 bg-muted/50 rounded-md space-y-1"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Briefcase className="h-3 w-3 text-primary" />
                                                        <span className="font-medium text-sm truncate">{job.title}</span>
                                                    </div>
                                                    {job.location && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="truncate">{job.location}</span>
                                                        </div>
                                                    )}
                                                    {job.startTime && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{job.startTime}</span>
                                                        </div>
                                                    )}
                                                    {job.status && (
                                                        <Badge variant="outline" className="text-xs mt-1">
                                                            {job.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Arrow pointing up */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "-6px",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: 0,
                                                height: 0,
                                                borderLeft: "6px solid transparent",
                                                borderRight: "6px solid transparent",
                                                borderBottom: "6px solid white",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
