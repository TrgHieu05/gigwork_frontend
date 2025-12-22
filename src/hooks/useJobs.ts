import { useMemo } from 'react';
import useSWR from 'swr';
import { jobsService, Job, JobListResponse, JobFilters } from '@/services/jobs';

// SWR keys
const JOBS_LIST_KEY = '/api/jobs';
const JOB_DETAIL_KEY = (id: number) => `/api/jobs/${id}`;

/**
 * Hook to fetch list of jobs with caching
 */
export function useJobs(filters?: JobFilters) {
    const key = filters
        ? `${JOBS_LIST_KEY}?${JSON.stringify(filters)}`
        : JOBS_LIST_KEY;

    const { data, error, isLoading, mutate } = useSWR<JobListResponse>(
        key,
        () => jobsService.listJobs(filters),
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    const jobs = useMemo(() => data?.items || [], [data]);

    return {
        jobs,
        meta: data?.meta,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

/**
 * Hook to fetch single job with caching
 */
export function useJob(id: number | null) {
    const { data, error, isLoading, mutate } = useSWR<Job>(
        id ? JOB_DETAIL_KEY(id) : null,
        id ? () => jobsService.getJob(id) : null,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        job: data,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}
