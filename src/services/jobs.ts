import api from '@/lib/api';

// Job types
export type JobStatus = 'open' | 'full' | 'ongoing' | 'completed';
export type JobType = 'physical_work' | 'fnb' | 'event' | 'retail' | 'others';

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
    location: string;
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
    location?: string;
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
    location: string;
    startDate: string;
    durationDays: number;
    workerQuota: number;
    salary?: number;
    type: JobType;
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
