import api from '@/lib/api';

export interface Review {
    id: number;
    jobId: number;
    reviewerId: number;
    revieweeId: number;
    comment?: string;
    createdAt: string;
    reviewer?: {
        id: number;
        email: string;
    };
    job?: {
        id: number;
        title: string;
    };
}

export interface CreateReviewData {
    applicationId: number;
    revieweeId: number;
    comment?: string;
}

export const reviewsService = {
    /**
     * Create a review
     * POST /api/reviews
     */
    async createReview(data: CreateReviewData): Promise<void> {
        await api.post('/api/reviews', data);
    },

    /**
     * Get reviews for a user
     * GET /api/reviews/{userId}
     */
    async getReviews(userId: number): Promise<Review[]> {
        const response = await api.get<Review[]>(`/api/reviews/${userId}`);
        return response.data;
    },
};
