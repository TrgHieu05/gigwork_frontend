"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/contexts/RoleContext";
import {
    Search,
    Briefcase,
    Filter,
    ChevronDown,
    Loader2,
} from "lucide-react";
import { jobsService, Job as ApiJob, JobType, getJobLocationString } from "@/services/jobs";
import { useJobs } from "@/hooks/useJobs";
import { LocationSelector } from "@/components/shared/LocationSelector";
import { SearchJobCard } from "@/components/shared/SearchJobCard";

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
    status: string;
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
        company: apiJob.companyName || apiJob.employer?.employerProfile?.companyName || apiJob.employer?.companyName || "Employer",
        location: getJobLocationString(apiJob),
        duration: `${apiJob.durationDays} days`,
        salary: apiJob.salary ? `${apiJob.salary.toLocaleString()} VND` : "Negotiable",
        salaryType: "",
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        postedDate: apiJob.createdAt ? new Date(apiJob.createdAt).toLocaleDateString() : "Recently",
        category: apiJob.type,
        description: apiJob.description,
        status: apiJob.status,
        isUrgent: apiJob.status === "open" && apiJob.workerQuota > 5,
    };
}

interface JobSearchPageProps {
    jobs?: Job[];
}

export function JobSearchPage({ jobs: propJobs }: JobSearchPageProps) {
    const { basePath, isEmployee } = useRole();
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState({ province: "", city: "", ward: "", address: "" });
    const [tempLocationQuery, setTempLocationQuery] = useState({ province: "", city: "", ward: "", address: "" });
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [savedJobs, setSavedJobs] = useState<string[]>([]);
    const [filters, setFilters] = useState<{ province?: string; city?: string; ward?: string; type?: JobType }>({});

    // Use SWR hook for cached jobs data
    const { jobs: apiJobs, isLoading, mutate } = useJobs(Object.keys(filters).length > 0 ? filters : undefined);

    // Transform API jobs to UI format (memoized)
    const jobs: Job[] = useMemo(() => {
        if (propJobs) return propJobs;
        return apiJobs.map(transformApiJob);
    }, [propJobs, apiJobs]);

    const handleSearch = () => {
        // Commit the location filter
        setLocationQuery(tempLocationQuery);

        // Build filters for API
        const newFilters: { province?: string; city?: string; ward?: string; type?: JobType } = {};
        if (tempLocationQuery.province) newFilters.province = tempLocationQuery.province;
        if (tempLocationQuery.city) newFilters.city = tempLocationQuery.city;
        if (tempLocationQuery.ward) newFilters.ward = tempLocationQuery.ward;
        if (selectedCategory !== "All") newFilters.type = selectedCategory as JobType;

        setFilters(newFilters);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLocation =
            (!locationQuery.province || job.location.includes(locationQuery.province)) &&
            (!locationQuery.city || job.location.includes(locationQuery.city)) &&
            (!locationQuery.ward || job.location.includes(locationQuery.ward));

        const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
        return matchesSearch && matchesCategory && matchesLocation;
    });

    const toggleSaveJob = (jobId: string) => {
        setSavedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    // Only show loading on first load (no cached data)
    if (isLoading && jobs.length === 0 && !propJobs) {
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
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search job title or company..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex-shrink-0 w-full xl:w-auto">
                            <LocationSelector
                                value={tempLocationQuery}
                                onChange={setTempLocationQuery}
                                showAddress={false}
                                layout="horizontal"
                                className="w-full"
                            />
                        </div>
                        <Button onClick={handleSearch} className="w-full xl:w-auto">
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
                        <SearchJobCard
                            key={job.id}
                            job={job}
                            isSaved={savedJobs.includes(job.id)}
                            onToggleSave={toggleSaveJob}
                            showSaveButton={isEmployee}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
