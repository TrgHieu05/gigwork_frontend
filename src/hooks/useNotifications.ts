import useSWR from 'swr';
import { notificationsService, Notification } from '@/services/notifications';

// SWR keys
const NOTIFICATIONS_KEY = '/api/notifications';

/**
 * Hook to fetch notifications with caching
 */
export function useNotifications() {
    const { data, error, isLoading, mutate } = useSWR<Notification[]>(
        NOTIFICATIONS_KEY,
        () => notificationsService.getNotifications(),
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000, // 10 seconds
            refreshInterval: 60000, // Auto refresh every minute
        }
    );

    return {
        notifications: data || [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}
