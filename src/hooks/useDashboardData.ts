"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { dashboardService, DashboardStats, ChartData, RecentActivity } from "@/lib/services/dashboard.service";

export interface DashboardData {
    totalAnalytics: number;
    activeUsers: number;
    filesUploaded: number;
    revenue: number;
    revenueGrowth: number;
    userGrowth: number;
    trafficData: ChartData[];
    revenueData: ChartData[];
    recentActivity: RecentActivity[];
}

export function useDashboardData() {
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData>({
        totalAnalytics: 0,
        activeUsers: 0,
        filesUploaded: 0,
        revenue: 0,
        revenueGrowth: 0,
        userGrowth: 0,
        trafficData: [],
        revenueData: [],
        recentActivity: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Buscar dados em paralelo para performance
                const [stats, trafficData, recentActivity] = await Promise.all([
                    dashboardService.getUserStats(session.user.id),
                    dashboardService.getTrafficData(session.user.id, 6),
                    dashboardService.getRecentActivity(session.user.id, 5)
                ]);

                // Dados de receita (podem ser calculados ou vir de outra fonte)
                const revenueData = trafficData.map(item => ({
                    month: item.month,
                    value: Math.floor(item.value * 2.5) // Simulação: receita é 2.5x o tráfego
                }));

                setData({
                    ...stats,
                    trafficData,
                    revenueData,
                    recentActivity,
                });

                setError(null);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data");

                // Fallback para dados mock em caso de erro
                setData({
                    totalAnalytics: 1234,
                    activeUsers: 573,
                    filesUploaded: 89,
                    revenue: 12489,
                    revenueGrowth: 19.2,
                    userGrowth: 18.2,
                    trafficData: [
                        { month: "Jan", value: 4000 },
                        { month: "Feb", value: 3000 },
                        { month: "Mar", value: 5000 },
                        { month: "Apr", value: 2780 },
                        { month: "May", value: 3890 },
                        { month: "Jun", value: 2390 },
                    ],
                    revenueData: [
                        { month: "Jan", value: 2400 },
                        { month: "Feb", value: 1398 },
                        { month: "Mar", value: 9800 },
                        { month: "Apr", value: 3908 },
                        { month: "May", value: 4800 },
                        { month: "Jun", value: 3800 },
                    ],
                    recentActivity: dashboardService['getMockActivities'](),
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session?.user?.id]);

    return { data, loading, error };
}