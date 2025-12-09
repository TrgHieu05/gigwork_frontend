import useSWR from 'swr';
import { profileService, UserProfile } from '@/services/profile';

// SWR keys
const CURRENT_USER_KEY = '/api/users/me';
const EMPLOYEE_PROFILE_KEY = (userId: number) => `/api/profiles/employee/${userId}`;
const EMPLOYER_PROFILE_KEY = (userId: number) => `/api/profiles/employer/${userId}`;

/**
 * Hook to fetch current user profile with caching
 */
export function useCurrentUser() {
    const { data, error, isLoading, mutate } = useSWR<UserProfile>(
        CURRENT_USER_KEY,
        () => profileService.getCurrentUser(),
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000, // 10 seconds
        }
    );

    return {
        profile: data,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

/**
 * Hook to fetch employee profile by user ID
 */
export function useEmployeeProfile(userId: number | null) {
    const { data, error, isLoading, mutate } = useSWR(
        userId ? EMPLOYEE_PROFILE_KEY(userId) : null,
        () => (userId ? profileService.getEmployeeProfile(userId) : null),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        profile: data,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

/**
 * Hook to fetch employer profile by user ID
 */
export function useEmployerProfile(userId: number | null) {
    const { data, error, isLoading, mutate } = useSWR(
        userId ? EMPLOYER_PROFILE_KEY(userId) : null,
        () => (userId ? profileService.getEmployerProfile(userId) : null),
        {
            revalidateOnFocus: false,
        }
    );

    return {
        profile: data,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}
