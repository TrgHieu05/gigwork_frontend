"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ArrowUp, ArrowDown, MapPin, Clock, Briefcase, DollarSign } from "lucide-react";

// Job info for calendar display
export interface CalendarJob {
    id: string | number;
    title: string;
    location?: string;
    startTime?: string;
    status?: string;
    salary?: string;
}

export interface DayWithJob {
    day: number;
    month: number;
    year: number;
    jobs: CalendarJob[];
}

interface JobCalendarProps {
    daysWithJobs?: DayWithJob[];
}

export function JobCalendar({ daysWithJobs = [] }: JobCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // Get jobs for a specific day in current month/year
    const getJobsForDay = (day: number): CalendarJob[] => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const dayData = daysWithJobs.find(d =>
            d.day === day && d.month === month && d.year === year
        );
        return dayData?.jobs || [];
    };

    // Check if a day in current month has jobs
    const hasDayWithJobs = (day: number): boolean => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        return daysWithJobs.some(d =>
            d.day === day && d.month === month && d.year === year
        );
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
                        const isHovered = hoveredDay === dayInfo.day && dayInfo.isCurrentMonth && hasJob;

                        // Calculate column position for tooltip alignment
                        const colIndex = index % 7;
                        const isLeftSide = colIndex < 2;
                        const isRightSide = colIndex > 4;

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
                                {hasJob && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "2px",
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
                                            left: isLeftSide ? "0" : isRightSide ? "auto" : "50%",
                                            right: isRightSide ? "0" : "auto",
                                            transform: isLeftSide || isRightSide ? "none" : "translateX(-50%)",
                                            zIndex: 50,
                                            marginTop: "8px",
                                            minWidth: "250px",
                                            maxWidth: "320px",
                                        }}
                                    >
                                        <div className="bg-white dark:bg-gray-900 border rounded-lg shadow-xl p-3 space-y-3">
                                            <div className="text-xs font-semibold text-muted-foreground border-b pb-2">
                                                Jobs on {monthNames[currentDate.getMonth()]} {dayInfo.day}, {currentDate.getFullYear()}
                                            </div>
                                            {jobsForDay.map((job, jobIndex) => (
                                                <div
                                                    key={job.id || jobIndex}
                                                    className="p-3 bg-muted/50 rounded-lg space-y-2 border"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <Briefcase className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                        <span className="font-semibold text-sm">{job.title}</span>
                                                    </div>
                                                    {job.location && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <MapPin className="h-3 w-3 flex-shrink-0" />
                                                            <span className="truncate">{job.location}</span>
                                                        </div>
                                                    )}
                                                    {job.salary && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <DollarSign className="h-3 w-3 flex-shrink-0" />
                                                            <span>{job.salary}</span>
                                                        </div>
                                                    )}
                                                    {job.startTime && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3 flex-shrink-0" />
                                                            <span>{job.startTime}</span>
                                                        </div>
                                                    )}
                                                    {job.status && (
                                                        <Badge
                                                            variant={
                                                                job.status === 'accepted' || job.status === 'ongoing' ? "default" :
                                                                    job.status === 'completed' ? "secondary" :
                                                                        job.status === 'pending' ? "outline" : "outline"
                                                            }
                                                            className="text-xs mt-1"
                                                        >
                                                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
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
                                                left: isLeftSide ? "16px" : isRightSide ? "auto" : "50%",
                                                right: isRightSide ? "16px" : "auto",
                                                transform: isLeftSide || isRightSide ? "none" : "translateX(-50%)",
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
