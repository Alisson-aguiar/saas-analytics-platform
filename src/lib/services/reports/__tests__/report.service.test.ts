import { reportService } from '../report.service';

jest.mock('@/lib/supabase/client', () => ({
    supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
        maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    },
    supabaseAdmin: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockImplementation((data) => {
            return {
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: { id: 'new-report-id', ...data },
                    error: null
                }),
            };
        }),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: '1', title: 'Test' }, error: null }),
    },
}));

describe('ReportService', () => {
    const userId = 'test-user-id';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserReports', () => {
        it('should return empty array when no reports', async () => {
            const reports = await reportService.getUserReports(userId);
            expect(Array.isArray(reports)).toBe(true);
        });
    });

    describe('createReport', () => {
        it('should attempt to create a report and return report object', async () => {
            const result = await reportService.createReport(userId, {
                title: 'New Report',
                description: 'New Description',
                config: { charts: ['line'] },
                isPublic: false,
            });

            // Verifica que o resultado é um objeto com as propriedades esperadas
            expect(result).toBeTruthy();
            if (result) {
                expect(result).toHaveProperty('id');
                expect(result).toHaveProperty('title');
                expect(result.title).toBe('New Report');
            }
        });
    });

    describe('getReportById', () => {
        it('should return null for non-existent report', async () => {
            const { supabase } = require('@/lib/supabase/client');
            supabase.maybeSingle.mockResolvedValue({ data: null, error: null });

            const result = await reportService.getReportById('non-existent-id');
            expect(result).toBeNull();
        });
    });

    describe('updateReport', () => {
        it('should return boolean success status', async () => {
            const result = await reportService.updateReport('report-id', { title: 'Updated Title' });
            expect(typeof result).toBe('boolean');
        });
    });

    describe('deleteReport', () => {
        it('should return boolean success status', async () => {
            const result = await reportService.deleteReport('report-id');
            expect(typeof result).toBe('boolean');
        });
    });
});