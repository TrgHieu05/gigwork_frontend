"use client";

import { useEffect, useState } from "react";
import { JobSearchPage, transformApiJob, Job } from "@/components/shared/JobSearchPage";
import { jobsService } from "@/services/jobs";
import { authService } from "@/services/auth";
import { Loader2 } from "lucide-react";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          setIsLoading(false);
          return;
        }

        const response = await jobsService.listJobs();
        // Filter jobs by current employer ID
        const employerJobs = response.items
          .filter(job => job.employerId === currentUser.id)
          .map(transformApiJob);
        
        setJobs(employerJobs);
      } catch (error) {
        console.error("Error fetching employer jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <JobSearchPage jobs={jobs} />;
}