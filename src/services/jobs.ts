import api from '@/lib/api';

// Job types
export type JobStatus = 'open' | 'full' | 'ongoing' | 'completed';
export type JobType = 'physical_work' | 'fnb' | 'event' | 'retail' | 'others';

// Job Location structure (matches OpenAPI JobLocation schema)
export interface JobLocation {
    jobId?: number;
    province: string;
    city: string;
    ward?: string | null;
    address: string;
}

export interface JobApplication {
    id: number;
    workerId: number;
    status: string;
    createdAt?: string;
    worker?: {
        id: number;
        name?: string;
        email?: string;
    };
}

export interface Job {
    id: number;
    title: string;
    description: string;
    locationId?: number | null;
    locationDetail?: JobLocation;
    // Keep location for backward compatibility - will be populated by formatJobLocation
    location?: string;
    startDate: string;
    durationDays: number;
    workerQuota: number;
    salary?: number;
    status: JobStatus;
    type: JobType;
    employerId?: number;
    createdAt?: string;
    updatedAt?: string;
    applications?: JobApplication[];
}

export interface JobSession {
    id?: number;
    jobId?: number;
    sessionDate: string;
    startTime: string;
    endTime: string;
}

export interface JobFilters {
    province?: string;
    city?: string;
    ward?: string;
    addressContains?: string;
    type?: JobType;
    skills?: string;
    date?: string;
    from?: string;
    to?: string;
    startDate?: string;
}

export interface JobListResponse {
    items: Job[];
    meta: {
        count: number;
        filters: Record<string, unknown>;
    };
}

export interface CreateJobData {
    title: string;
    description: string;
    location: JobLocation;
    startDate: string;
    durationDays: number;
    workerQuota: number;
    salary?: number;
    type: JobType;
}

/**
 * Format JobLocation object to a display string
 */
export function formatJobLocation(location?: JobLocation | null): string {
    if (!location) return 'Unknown Location';
    const parts = [location.address, location.ward, location.city, location.province].filter(Boolean);
    return parts.join(', ') || 'Unknown Location';
}

/**
 * Get location string from a Job object (handles both old and new format)
 */
export function getJobLocationString(job: Job): string {
    // If locationDetail exists, use it
    if (job.locationDetail) {
        return formatJobLocation(job.locationDetail);
    }
    // Fallback to location string if available (backward compatibility)
    if (job.location) {
        return job.location;
    }
    return 'Unknown Location';
}

export const jobsService = {
    /**
     * List all available jobs with optional filters
     * GET /api/jobs
     */
    async listJobs(filters?: JobFilters): Promise<JobListResponse> {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
        }
        const queryString = params.toString();
        const url = queryString ? `/api/jobs?${queryString}` : '/api/jobs';
        const response = await api.get<JobListResponse>(url);
        return response.data;
    },

    /**
     * Get job by ID
     * GET /api/jobs/{id}
     */
    async getJob(id: number): Promise<Job> {
        const response = await api.get<Job>(`/api/jobs/${id}`);
        return response.data;
    },

    /**
     * Create a new job (employer only)
     * POST /api/jobs
     */
    async createJob(data: CreateJobData): Promise<Job> {
        const response = await api.post<Job>('/api/jobs', data);
        return response.data;
    },

    /**
     * Update an existing job
     * PATCH /api/jobs/{id}
     */
    async updateJob(id: number, data: Partial<CreateJobData>): Promise<Job> {
        const response = await api.patch<Job>(`/api/jobs/${id}`, data);
        return response.data;
    },

    /**
     * Delete a job
     * DELETE /api/jobs/{id}
     */
    async deleteJob(id: number): Promise<void> {
        await api.delete(`/api/jobs/${id}`);
    },

    /**
     * Create a job session
     * POST /api/jobs/{id}/sessions
     */
    async createSession(jobId: number, data: Omit<JobSession, 'id' | 'jobId'>): Promise<void> {
        await api.post(`/api/jobs/${jobId}/sessions`, data);
    },

    /**
     * Get job sessions
     * GET /api/jobs/{id}/sessions
     */
    async getSessions(jobId: number): Promise<JobSession[]> {
        const response = await api.get<JobSession[]>(`/api/jobs/${jobId}/sessions`);
        return response.data;
    },

    /**
     * Add required skills to a job
     * POST /api/jobs/{id}/skills
     */
    async addSkills(jobId: number, skills: string[]): Promise<void> {
        await api.post(`/api/jobs/${jobId}/skills`, { skills });
    },
};
