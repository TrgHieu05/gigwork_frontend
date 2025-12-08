"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { EmployeeJobCard, type EmployeeJob } from "@/components/feature/employee/EmployeeJobCard";
import { EmployeeApplicationCard, type EmployeeApplication } from "@/components/feature/employee/EmployeeApplicationCard";

// Mock data for completed jobs
const completedJobs: EmployeeJob[] = [
    {
        id: "1",
        title: "Warehouse Assistant",
        company: "LogiCorp",
        location: "District 12, TPHCM",
        completedDate: "15/11/2025",
        duration: "3 days",
        earned: "$180",
        rating: 5,
    },
    {
        id: "2",
        title: "Event Staff",
        company: "EventPro",
        location: "District 7, TPHCM",
        completedDate: "10/11/2025",
        duration: "2 days",
        earned: "$120",
        rating: 4,
    },
    {
        id: "3",
        title: "Retail Associate",
        company: "FashionMart",
        location: "District 1, TPHCM",
        completedDate: "01/11/2025",
        duration: "5 days",
        earned: "$250",
        rating: 5,
    },
];

// Mock data for application history
const applicationHistory: EmployeeApplication[] = [
    {
        id: "1",
        title: "Restaurant Server",
        company: "Fine Dining Group",
        time: "05/12/2025",
        status: "Pending",
    },
    {
        id: "2",
        title: "Retail Sales",
        company: "Fashion Inc.",
        time: "03/12/2025",
        status: "Accepted",
    },
    {
        id: "3",
        title: "Delivery Driver",
        company: "QuickShip",
        time: "01/12/2025",
        status: "Rejected",
    },
    {
        id: "4",
        title: "Barista",
        company: "Coffee House",
        time: "28/11/2025",
        status: "Accepted",
    },
    {
        id: "5",
        title: "Cashier",
        company: "SuperMart",
        time: "25/11/2025",
        status: "Rejected",
    },
];

export default function EmployeeHistoryPage() {
    const [activeTab, setActiveTab] = useState("jobs");
    const [applicationFilter, setApplicationFilter] = useState("all");

    const filteredApplications = applicationFilter === "all"
        ? applicationHistory
        : applicationHistory.filter(app => app.status.toLowerCase() === applicationFilter);

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">History</h1>
                <p className="text-muted-foreground">View your completed jobs and application history</p>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                    <TabsTrigger value="jobs">Completed Jobs</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                </TabsList>

                {/* Completed Jobs Tab */}
                <TabsContent value="jobs">
                    <div className="space-y-4">
                        {completedJobs.length > 0 ? (
                            completedJobs.map((job) => (
                                <EmployeeJobCard key={job.id} job={job} variant="completed" />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">No completed jobs yet</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Applications Tab */}
                <TabsContent value="applications">
                    {/* Sub-filters */}
                    <div className="flex gap-2 mb-4">
                        {["all", "pending", "accepted", "rejected"].map((filter) => (
                            <Button
                                key={filter}
                                variant={applicationFilter === filter ? "default" : "outline"}
                                size="small"
                                onClick={() => setApplicationFilter(filter)}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((app) => (
                                <EmployeeApplicationCard key={app.id} application={app} variant="full" />
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <p className="text-muted-foreground">No applications found</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
