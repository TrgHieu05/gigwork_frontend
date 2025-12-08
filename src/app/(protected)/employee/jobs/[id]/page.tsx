"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Building,
    MapPin,
    Clock,
    Calendar,
    DollarSign,
    Users,
    Briefcase,
    CheckCircle,
    Heart,
    Share2,
} from "lucide-react";
import { ApplyModal, useApplyModal } from "@/components/feature/employee/ApplyModal";

// Mock job data
const mockJob = {
    id: "1",
    title: "Warehouse Assistant",
    company: "LogiCorp",
    location: "71/10, TL14 Street, Anh Phu Dong Ward, District 12, TPHCM",
    salary: "$15",
    salaryType: "hour",
    duration: "3 days",
    dateRange: "Dec 20 - Dec 22, 2025",
    startDate: "20/12/2025",
    endDate: "22/12/2025",
    workHours: "8:00 AM - 5:00 PM",
    category: "Warehouse",
    postedDate: "2 days ago",
    applicants: 12,
    positions: 5,
    isUrgent: true,
    description: `We are looking for reliable warehouse assistants to help with our busy holiday season. The role involves picking, packing, and organizing inventory in our modern warehouse facility.

You will be working as part of a dynamic team in a fast-paced environment. This is a great opportunity for those looking for flexible work with competitive pay.`,
    requirements: [
        "Must be able to lift up to 25kg",
        "Basic English communication skills",
        "Punctual and reliable",
        "Previous warehouse experience is a plus but not required",
        "Must have valid ID",
    ],
    benefits: [
        "Competitive hourly rate",
        "Free lunch provided",
        "Transportation allowance",
        "Flexible scheduling",
        "Potential for long-term employment",
    ],
    employerInfo: {
        name: "LogiCorp",
        rating: 4.5,
        totalJobs: 45,
        description: "Leading logistics company in Vietnam with over 10 years of experience.",
    },
};

export default function EmployeeJobDetailsPage() {
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("description");
    const [applicationStatus, setApplicationStatus] = useState<"none" | "pending" | "approved" | "rejected">("none");
    const { isOpen, openModal, closeModal } = useApplyModal();

    const handleApply = () => {
        closeModal();
        setApplicationStatus("pending");
    };

    return (
        <>
            <div className="h-full p-6 overflow-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            className="h-9 w-9 p-0 border-0"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{mockJob.title}</h1>
                                {mockJob.isUrgent && (
                                    <Badge variant="destructive">Urgent</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Building className="h-4 w-4" />
                                <span>{mockJob.company}</span>
                                <span>•</span>
                                <span>{mockJob.postedDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-9 w-9 p-0"
                            onClick={() => setIsSaved(!isSaved)}
                        >
                            <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button variant="outline" className="h-9 w-9 p-0">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ display: "flex", gap: "24px" }}>
                    {/* Left Side - 70% */}
                    <div style={{ flex: "7", minWidth: 0 }}>
                        {/* Quick Info Cards */}
                        <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                            <Card className="flex-1">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Salary</p>
                                        <p className="font-semibold">{mockJob.salary}/{mockJob.salaryType}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="flex-1">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Duration</p>
                                        <p className="font-semibold">{mockJob.duration}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="flex-1">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Users className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Positions</p>
                                        <p className="font-semibold">{mockJob.positions} available</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                                <TabsTrigger value="employer">Employer</TabsTrigger>
                            </TabsList>

                            <TabsContent value="description">
                                <Card>
                                    <CardContent className="p-6 space-y-6">
                                        <div>
                                            <h3 className="font-semibold mb-3">Job Details</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>{mockJob.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{mockJob.dateRange}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>{mockJob.workHours}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                    <span>{mockJob.category}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-3">Description</h3>
                                            <p className="text-muted-foreground whitespace-pre-line">
                                                {mockJob.description}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold mb-3">Benefits</h3>
                                            <ul className="space-y-2">
                                                {mockJob.benefits.map((benefit, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="requirements">
                                <Card>
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold mb-4">Requirements</h3>
                                        <ul className="space-y-3">
                                            {mockJob.requirements.map((req, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="employer">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                                <Building className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{mockJob.employerInfo.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>⭐ {mockJob.employerInfo.rating}</span>
                                                    <span>•</span>
                                                    <span>{mockJob.employerInfo.totalJobs} jobs posted</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm">
                                            {mockJob.employerInfo.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Right Side - 30% */}
                    <div style={{ flex: "3", minWidth: 0 }}>
                        <Card className="sticky top-6">
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary">
                                        {mockJob.salary}<span className="text-lg font-normal">/{mockJob.salaryType}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {mockJob.applicants} applicants
                                    </p>
                                </div>

                                {applicationStatus === "none" ? (
                                    <Button className="w-full h-12 text-lg" onClick={openModal}>
                                        Apply Now
                                    </Button>
                                ) : (
                                    <div className={`w-full h-12 flex items-center justify-center rounded-sm text-lg font-medium ${applicationStatus === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : applicationStatus === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                        {applicationStatus === "pending" && "⏳ Pending"}
                                        {applicationStatus === "approved" && "✓ Approved"}
                                        {applicationStatus === "rejected" && "✗ Rejected"}
                                    </div>
                                )}

                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Start: {mockJob.startDate}</span>
                                </div>

                                <div className="border-t pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium">{mockJob.duration}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Work Hours</span>
                                        <span className="font-medium">{mockJob.workHours}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Positions</span>
                                        <span className="font-medium">{mockJob.positions} available</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <ApplyModal
                isOpen={isOpen}
                onClose={closeModal}
                onConfirm={handleApply}
                jobTitle={mockJob.title}
                company={mockJob.company}
            />
        </>
    );
}
