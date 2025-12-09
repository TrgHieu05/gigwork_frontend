import api from '@/lib/api';
import { JobLocation } from './jobs';

// Employee profile types
export interface EmployeeProfile {
    bio?: string;
    skills?: Record<string, unknown>;
    dob?: string;
    gender?: string;
}

// Employer profile types  
export interface EmployerProfile {
    companyName: string;
    companyAddress?: string;
}

// Full user profile response (from GET /api/users/me or profile endpoints)
export interface UserProfile {
    id: number;
    email: string;
    phone?: string | null;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string | null;
    isVerified: boolean;
    isActive: boolean;
    bannedAt?: string | null;
    isWorker: boolean;
    isEmployer: boolean;
    workerProfile?: {
        bio?: string | null;
        skills?: Record<string, boolean> | null;
        dob?: string | null;
        gender?: string | null;
    } | null;
    employerProfile?: {
        companyName?: string;
        companyAddress?: string | null;
    } | null;
    ratingAvg: number;
    ratingCount: number;
    applicationCounts?: {
        pending: number;
        accepted: number;
        completed: number;
        cancelled: number;
    };
    jobCounts?: {
        total: number;
        open: number;
    } | null;
    unreadNotifications?: number;
    recentApplications?: {
        applicationId: number;
        jobId?: number;
        jobTitle?: string;
        status: string;
        appliedAt: string;
    }[];
    recentJobs?: {
        id: number;
        title: string;
        startDate: string;
        workerQuota: number;
        salary: number;
        locationRef?: JobLocation;
        status: string;
    }[];
    notificationsPreview?: {
        id: number;
        title: string;
        type: string;
        createdAt: string;
    }[];
}

// Image upload response
export interface ImageUploadResponse {
    id: number;
    contentType: string;
    size: number;
    isPrimary: boolean;
    role: string;
    kind: string;
}

export const profileService = {
    /**
     * Get current user profile
     * GET /api/users/me
     */
    async getCurrentUser(): Promise<UserProfile> {
        const response = await api.get<UserProfile>('/api/users/me');
        return response.data;
    },

    /**
     * Get employee profile by user ID
     * GET /api/profiles/employee/{userId}
     */
    async getEmployeeProfile(userId: number): Promise<EmployeeProfile> {
        const response = await api.get<EmployeeProfile>(`/api/profiles/employee/${userId}`);
        return response.data;
    },

    /**
     * Get employer profile by user ID
     * GET /api/profiles/employer/{userId}
     */
    async getEmployerProfile(userId: number): Promise<EmployerProfile> {
        const response = await api.get<EmployerProfile>(`/api/profiles/employer/${userId}`);
        return response.data;
    },

    /**
     * Create employee profile
     * POST /api/profiles/employee
     */
    async createEmployeeProfile(data: EmployeeProfile): Promise<void> {
        await api.post('/api/profiles/employee', data);
    },

    /**
     * Update employee profile
     * PATCH /api/profiles/employee
     */
    async updateEmployeeProfile(data: Partial<EmployeeProfile>): Promise<void> {
        await api.patch('/api/profiles/employee', data);
    },

    /**
     * Create employer profile
     * POST /api/profiles/employer
     */
    async createEmployerProfile(data: EmployerProfile): Promise<void> {
        await api.post('/api/profiles/employer', data);
    },

    /**
     * Update employer profile
     * PATCH /api/profiles/employer
     */
    async updateEmployerProfile(data: Partial<EmployerProfile>): Promise<void> {
        await api.patch('/api/profiles/employer', data);
    },

    /**
     * Upload profile image
     * POST /api/profiles/{role}/image
     */
    async uploadImage(
        role: 'employee' | 'employer',
        file: File,
        kind: 'avatar' | 'company_logo' | 'other' = 'avatar',
        setPrimary: boolean = true
    ): Promise<ImageUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('kind', kind);
        formData.append('setPrimary', String(setPrimary));

        const response = await api.post<ImageUploadResponse>(`/api/profiles/${role}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    /**
     * Get profile image URL
     * GET /api/profiles/{role}/image
     */
    getImageUrl(role: 'employee' | 'employer', kind: 'avatar' | 'company_logo' | 'other' = 'avatar'): string {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        return `${baseUrl}/api/profiles/${role}/image?kind=${kind}`;
    },

    /**
     * Delete profile image
     * DELETE /api/profiles/{role}/image/{id}
     */
    async deleteImage(role: 'employee' | 'employer', imageId: number): Promise<void> {
        await api.delete(`/api/profiles/${role}/image/${imageId}`);
    },

    /**
     * Set image as primary
     * POST /api/profiles/{role}/image/{id}/primary
     */
    async setImageAsPrimary(role: 'employee' | 'employer', imageId: number): Promise<void> {
        await api.post(`/api/profiles/${role}/image/${imageId}/primary`);
    },
};
