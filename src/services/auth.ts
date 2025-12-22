import api, { AuthPayload, ApiError } from '@/lib/api';
import { AxiosError } from 'axios';

// Request types
export interface RegisterRequest {
    email: string;
    password: string;
    isWorker: boolean;
    isEmployer: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Cookie helper functions
function setCookie(name: string, value: string, days: number = 7): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

function removeCookie(name: string): void {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

// Auth service functions
export const authService = {
    /**
     * Register a new user
     * POST /api/auth/register
     */
    async register(data: RegisterRequest): Promise<AuthPayload> {
        const response = await api.post<AuthPayload>('/api/auth/register', data);

        // Store token and user info in both localStorage and cookies
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setCookie('token', response.data.token, 7); // 7 days
        }

        return response.data;
    },

    /**
     * Login user
     * POST /api/auth/login
     */
    async login(data: LoginRequest): Promise<AuthPayload> {
        const response = await api.post<AuthPayload>('/api/auth/login', data);

        // Store token and user info in both localStorage and cookies
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setCookie('token', response.data.token, 7); // 7 days
        }

        return response.data;
    },

    /**
     * Logout user - clear stored data
     */
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('selectedRole');
        removeCookie('token');
    },

    /**
     * Send verification email
     * POST /api/auth/send-verification
     */
    async sendVerification(): Promise<{ success: boolean; link?: string }> {
        console.log('Sending verification email...');
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found when trying to send verification email');
            throw new Error('Not authenticated');
        }
        try {
            const response = await api.post('/api/auth/send-verification');
            console.log('Verification email sent successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending verification email API call:', error);
            throw error;
        }
    },

    /**
     * Verify email with token
     * GET /api/auth/verify-email
     */
    async verifyEmail(token: string): Promise<void> {
        await api.get(`/api/auth/verify-email?token=${token}`);
    },

    /**
     * Get current user from localStorage
     */
    getCurrentUser(): AuthPayload['user'] | null {
        if (typeof window === 'undefined') return null;

        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('token');
    },

    /**
     * Get stored token
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('token');
    },
};

// Helper to extract error message from API error
export function getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError | undefined;
        
        // Handle raw Prisma errors leaking to frontend
        const detail = apiError?.detail || '';
        if (typeof detail === 'string') {
            if (detail.includes('Unique constraint failed') && detail.includes('email')) {
                 return 'This email address is already registered. Please sign in or use a different email.';
            }
        }

        if (apiError?.detail) {
            return apiError.detail;
        }
        if (apiError?.title) {
            return apiError.title;
        }
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}
