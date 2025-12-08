"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRole } from "@/contexts/RoleContext";
import {
    Search,
    MapPin,
    Clock,
    DollarSign,
    Calendar,
    Briefcase,
    Filter,
    ChevronDown,
    Heart,
    Building,
} from "lucide-react";
import Link from "next/link";

export interface Job {
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
}

const mockJobs: Job[] = [
    {
        id: "1",
        title: "Warehouse Associate",
        company: "FastShip Logistics",
        location: "Chicago, IL",
        duration: "5 days",
        salary: "$18",
        salaryType: "per hour",
        dateRange: "Dec 15 - Dec 20",
        postedDate: "2 hours ago",
        category: "Warehouse",
        description: "Help with inventory management and order fulfillment in our Chicago warehouse.",
        isUrgent: true,
    },
    {
        id: "2",
        title: "Retail Sales Associate",
        company: "TrendMart",
        location: "New York, NY",
        duration: "1 week",
        salary: "$19",
        salaryType: "per hour",
        dateRange: "Dec 18 - Dec 25",
        postedDate: "5 hours ago",
        category: "Retail",
        description: "Assist customers during our holiday sale event.",
    },
    {
        id: "3",
        title: "Event Staff",
        company: "Premier Events Co.",
        location: "Los Angeles, CA",
        duration: "3 days",
        salary: "$22",
        salaryType: "per hour",
        dateRange: "Dec 20 - Dec 22",
        postedDate: "1 day ago",
        category: "Events",
        description: "Work at an exclusive corporate holiday party.",
        isUrgent: true,
    },
    {
        id: "4",
        title: "Delivery Driver",
        company: "QuickDeliver",
        location: "Miami, FL",
        duration: "2 weeks",
        salary: "$20",
        salaryType: "per hour",
        dateRange: "Dec 10 - Dec 24",
        postedDate: "1 day ago",
        category: "Delivery",
        description: "Deliver packages during the busy holiday season.",
    },
    {
        id: "5",
        title: "Restaurant Server",
        company: "The Grand Bistro",
        location: "San Francisco, CA",
        duration: "Weekend",
        salary: "$15 + tips",
        salaryType: "per hour",
        dateRange: "Dec 14 - Dec 15",
        postedDate: "2 days ago",
        category: "Food & Beverage",
        description: "Serve guests at our upscale restaurant.",
    },
    {
        id: "6",
        title: "Construction Helper",
        company: "BuildRight Inc.",
        location: "Houston, TX",
        duration: "1 week",
        salary: "$17",
        salaryType: "per hour",
        dateRange: "Dec 16 - Dec 22",
        postedDate: "3 days ago",
        category: "Construction",
        description: "Assist with general construction tasks on our commercial project.",
    },
];

const categories = ["All", "Warehouse", "Retail", "Events", "Delivery", "Food & Beverage", "Construction"];

interface JobSearchPageProps {
    jobs?: Job[];
}

export function JobSearchPage({ jobs = mockJobs }: JobSearchPageProps) {
    const { role, basePath, isEmployee } = useRole();
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [savedJobs, setSavedJobs] = useState<string[]>([]);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
        return matchesSearch && matchesLocation && matchesCategory;
    });

    const toggleSaveJob = (jobId: string) => {
        setSavedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Find Jobs</h1>
                <p className="text-muted-foreground">
                    {isEmployee
                        ? "Discover gig opportunities that match your skills"
                        : "Browse jobs posted by other employers"
                    }
                </p>
            </div>

            {/* Search Bar */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search job title or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Location..."
                                value={locationQuery}
                                onChange={(e) => setLocationQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Categories Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {filteredJobs.length} jobs found
                </p>
                <Button variant="outline" size="small">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Sort by: Newest
                </Button>
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredJobs.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                        <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No jobs found matching your criteria</p>
                    </div>
                ) : (
                    filteredJobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-md transition-shadow">
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
                                            {/* Save button - only for employee */}
                                            {isEmployee && (
                                                <button
                                                    onClick={() => toggleSaveJob(job.id)}
                                                    className="p-2 hover:bg-muted rounded-full transition-colors"
                                                >
                                                    <Heart
                                                        className={`h-5 w-5 ${savedJobs.includes(job.id)
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
                                                <span className="text-sm text-muted-foreground">/{job.salaryType}</span>
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
                    ))
                )}
            </div>
        </div>
    );
}
