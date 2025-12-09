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
        const response = await api.post('/api/auth/send-verification');
        return response.data;
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
