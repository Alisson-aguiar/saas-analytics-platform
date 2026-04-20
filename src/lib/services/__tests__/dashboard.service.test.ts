import { dashboardService } from '../dashboard.service';

// Mock completo do Supabase
jest.mock('@/lib/supabase/client', () => ({
    supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    },
}));

describe('DashboardService', () => {
    const userId = 'test-user-id';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserStats', () => {
        it('should return user statistics structure', async () => {
            const stats = await dashboardService.getUserStats(userId);

            expect(stats).toHaveProperty('totalAnalytics');
            expect(stats).toHaveProperty('activeUsers');
            expect(stats).toHaveProperty('filesUploaded');
            expect(stats).toHaveProperty('revenue');
            expect(stats).toHaveProperty('revenueGrowth');
            expect(stats).toHaveProperty('userGrowth');
        });

        it('should return numbers for all stats', async () => {
            const stats = await dashboardService.getUserStats(userId);

            expect(typeof stats.totalAnalytics).toBe('number');
            expect(typeof stats.activeUsers).toBe('number');
            expect(typeof stats.filesUploaded).toBe('number');
            expect(typeof stats.revenue).toBe('number');
        });
    });

    describe('getTrafficData', () => {
        it('should return array of traffic data', async () => {
            const data = await dashboardService.getTrafficData(userId, 6);

            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBeGreaterThanOrEqual(0);
        });
    });
});