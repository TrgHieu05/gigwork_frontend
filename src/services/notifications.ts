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
        const response = await api.get<Notification[]>('/api/notifications');
        return response.data;
    },
};
