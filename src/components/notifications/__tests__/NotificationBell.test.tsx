import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NotificationBell } from '../NotificationBell';
import { useNotifications } from '@/hooks/useNotifications';

// Mock do hook useNotifications
jest.mock('@/hooks/useNotifications', () => ({
    useNotifications: jest.fn(),
}));

// Mock do date-fns
jest.mock('date-fns', () => ({
    formatDistanceToNow: jest.fn(() => 'há 2 minutos'),
}));

// Mock do popover
jest.mock('@/components/ui/popover', () => ({
    Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock do scroll-area
jest.mock('@/components/ui/scroll-area', () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('NotificationBell', () => {
    const mockMarkAsRead = jest.fn();
    const mockMarkAllAsRead = jest.fn();
    const mockDeleteNotification = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render bell button', () => {
        (useNotifications as jest.Mock).mockReturnValue({
            notifications: [],
            unreadCount: 0,
            loading: false,
            markAsRead: mockMarkAsRead,
            markAllAsRead: mockMarkAllAsRead,
            deleteNotification: mockDeleteNotification,
        });

        render(<NotificationBell />);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show unread count badge when there are unread notifications', () => {
        (useNotifications as jest.Mock).mockReturnValue({
            notifications: [
                { id: '1', title: 'Test', read: false },
                { id: '2', title: 'Test 2', read: false },
            ],
            unreadCount: 2,
            loading: false,
            markAsRead: mockMarkAsRead,
            markAllAsRead: mockMarkAllAsRead,
            deleteNotification: mockDeleteNotification,
        });

        render(<NotificationBell />);

        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should not show badge when there are no unread notifications', () => {
        (useNotifications as jest.Mock).mockReturnValue({
            notifications: [],
            unreadCount: 0,
            loading: false,
            markAsRead: mockMarkAsRead,
            markAllAsRead: mockMarkAllAsRead,
            deleteNotification: mockDeleteNotification,
        });

        render(<NotificationBell />);

        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
});