import { renderHook, waitFor } from '@testing-library/react';
import { useNotifications } from '../useNotifications';
import { useSession } from 'next-auth/react';

// Mock do useSession
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

// Mock completo do Supabase
jest.mock('@/lib/supabase/client', () => ({
    supabase: {
        channel: jest.fn().mockReturnValue({
            on: jest.fn().mockReturnThis(),
            subscribe: jest.fn().mockReturnValue({
                unsubscribe: jest.fn(),
            }),
        }),
        removeChannel: jest.fn().mockResolvedValue(undefined),
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
    },
    supabaseAdmin: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
    },
}));

// Mock do notificationService
jest.mock('@/lib/services/notification.service', () => ({
    notificationService: {
        getUserNotifications: jest.fn().mockResolvedValue([]),
        getUnreadCount: jest.fn().mockResolvedValue(0),
        markAsRead: jest.fn().mockResolvedValue(true),
        markAllAsRead: jest.fn().mockResolvedValue(true),
        deleteNotification: jest.fn().mockResolvedValue(true),
    },
}));

describe('useNotifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { id: '123' } },
            status: 'authenticated',
        });
    });

    it('should initialize with default values', async () => {
        const { result } = renderHook(() => useNotifications());

        await waitFor(() => {
            expect(result.current.notifications).toBeDefined();
            expect(result.current.unreadCount).toBeDefined();
            expect(result.current.loading).toBeDefined();
        });
    });

    it('should have markAsRead function', () => {
        const { result } = renderHook(() => useNotifications());
        expect(typeof result.current.markAsRead).toBe('function');
    });

    it('should have markAllAsRead function', () => {
        const { result } = renderHook(() => useNotifications());
        expect(typeof result.current.markAllAsRead).toBe('function');
    });

    it('should have deleteNotification function', () => {
        const { result } = renderHook(() => useNotifications());
        expect(typeof result.current.deleteNotification).toBe('function');
    });

    it('should have refresh function', () => {
        const { result } = renderHook(() => useNotifications());
        expect(typeof result.current.refresh).toBe('function');
    });
});