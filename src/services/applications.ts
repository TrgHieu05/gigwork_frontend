import api from '@/lib/api';
import { UserProfile } from './profile';

// Application types
export type ApplicationStatus = 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled';

export interface Application {
    id: number;
    jobId: number;
    workerId: number;
    status: ApplicationStatus;
    appliedAt: string;
    job?: {
        id: number;
        title: string;
        location?: string;
        startDate?: string;
    };
    worker?: UserProfile;
}

export interface ApplyResponse {
    application: Application;
    employee: UserProfile;
}

export const applicationsService = {
    /**
     * Apply for a job
     * POST /api/applications
     */
    async apply(jobId: number): Promise<ApplyResponse> {
        const response = await api.post<ApplyResponse>('/api/applications', { jobId });
        return response.data;
    },

    /**
     * Accept an application (employer only)
     * POST /api/applications/accept
     */
    async accept(applicationId: number): Promise<void> {
        await api.post('/api/applications/accept', { applicationId });
    },

    /**
     * Reject an application (employer only)
     * POST /api/applications/reject
     */
    async reject(applicationId: number): Promise<void> {
        await api.post('/api/applications/reject', { applicationId });
    },

    /**
     * Mark job complete for a worker (employer only)
     * POST /api/applications/complete
     */
    async complete(jobId: number, workerId: number): Promise<void> {
        await api.post('/api/applications/complete', { jobId, workerId });
    },

    /**
     * Confirm payment received (worker only)
     * POST /api/applications/complete-paid
     */
    async completePaid(applicationId: number): Promise<void> {
        await api.post('/api/applications/complete-paid', { applicationId });
    },
};
