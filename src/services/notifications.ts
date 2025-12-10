import api from '@/lib/api';

export interface Notification {
    id: number;
    title: string;
    type: string;
    createdAt: string;
    readAt?: string | null;
}

export const notificationsService = {
    /**
     * Get all notifications for current user
     * GET /api/notifications
     */
    async getNotifications(): Promise<Notification[]> {
        const response = await api.get<any>('/api/notifications');
        
        // Handle if response is array
        if (Array.isArray(response.data)) {
            return response.data;
        }
        
        // Handle if response is object with items (pagination)
        if (response.data && Array.isArray(response.data.items)) {
            return response.data.items;
        }

        // Default empty array
        return [];
    },
};
