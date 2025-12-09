import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (only on client side)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle 401 - redirect to login
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Redirect to login if not already there
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;

// Helper types for API responses
export interface ApiError {
    type?: string;
    title: string;
    status: number;
    detail: string;
    instance?: string;
    errorCode?: string;
    hint?: string;
}

export interface AuthPayload {
    token: string;
    user: {
        id: number;
        email: string;
        isWorker: boolean;
        isEmployer: boolean;
        isVerified: boolean;
    };
}
