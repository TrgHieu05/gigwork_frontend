"use client";

import { useState, useEffect } from "react";
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
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { jobsService, Job as ApiJob, JobType, getJobLocationString } from "@/services/jobs";

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

const categories = ["All", "physical_work", "fnb", "event", "retail", "others"];
const categoryLabels: Record<string, string> = {
    "All": "All",
    "physical_work": "Physical Work",
    "fnb": "Food & Beverage",
    "event": "Events",
    "retail": "Retail",
    "others": "Others",
};

// Transform API job to UI job format
export function transformApiJob(apiJob: ApiJob): Job {
    const startDate = new Date(apiJob.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + apiJob.durationDays);

    return {
        id: String(apiJob.id),
        title: apiJob.title,
        company: apiJob.employer?.companyName || (apiJob.employer?.email ? apiJob.employer.email.split('@')[0] : "Employer"),
        location: getJobLocationString(apiJob),
        duration: `${apiJob.durationDays} days`,
        salary: apiJob.salary ? `${apiJob.salary.toLocaleString()} VND` : "Negotiable",
        salaryType: "",
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        postedDate: apiJob.createdAt ? new Date(apiJob.createdAt).toLocaleDateString() : "Recently",
        category: apiJob.type,
        description: apiJob.description,
        isUrgent: apiJob.status === "open" && apiJob.workerQuota > 5,
    };
}

interface JobSearchPageProps {
    jobs?: Job[];
}

export function JobSearchPage({ jobs: propJobs }: JobSearchPageProps) {
    const { basePath, isEmployee } = useRole();
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            if (propJobs) {
                setJobs(propJobs);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await jobsService.listJobs();
                const transformedJobs = response.items.map(transformApiJob);
                setJobs(transformedJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [propJobs]);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const filters: { addressContains?: string; type?: JobType } = {};
            if (locationQuery) filters.addressContains = locationQuery;
            if (selectedCategory !== "All") filters.type = selectedCategory as JobType;

            const response = await jobsService.listJobs(filters);
            const transformedJobs = response.items.map(transformApiJob);
            setJobs(transformedJobs);
        } catch (error) {
            console.error("Error searching jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleSaveJob = (jobId: string) => {
        setSavedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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
                        <Button onClick={handleSearch}>
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
                        {categoryLabels[category] || category}
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
