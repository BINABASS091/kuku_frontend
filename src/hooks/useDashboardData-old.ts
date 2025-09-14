import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../services/api';
import type { DashboardStats, RecentActivity, SystemAlert } from '../types/models';

// Additional types for dashboard
export interface TopFarm {
  id: string;
  name: string;
  location: string;
  birds: number;
  health: number;
  revenue: number;
  status: 'active' | 'inactive';
}

// Custom hook for fetching dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardAPI.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook for fetching recent activities
export const useRecentActivities = () => {
  return useQuery({
    queryKey: ['recent-activities'],
    queryFn: async (): Promise<RecentActivity[]> => {
      try {
        // For now, return empty array since we don't have a dedicated activities endpoint
        // In a real implementation, you would fetch from an activities/logs endpoint
        return [];
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        return [];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Custom hook for fetching system alerts
export const useSystemAlerts = () => {
  return useQuery({
    queryKey: ['system-alerts'],
    queryFn: async (): Promise<SystemAlert[]> => {
      try {
        // For now, return empty array since we don't have a dedicated alerts endpoint
        // In a real implementation, you would fetch from an alerts/notifications endpoint
        return [];
      } catch (error) {
        console.error('Error fetching system alerts:', error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Custom hook for fetching top farms
export const useTopFarms = () => {
  return useQuery({
    queryKey: ['top-farms'],
    queryFn: async (): Promise<TopFarm[]> => {
      try {
        const farmsRes = await api.get('farms/');
        const farms = farmsRes.data.results || farmsRes.data || [];
        
        if (!Array.isArray(farms)) {
          return [];
        }

        // Transform farms data to TopFarm format
        return farms.map((farm: any) => ({
          id: farm.id || farm.name,
          name: farm.name || 'Unnamed Farm',
          location: farm.location || 'Unknown',
          birds: farm.total_birds || 0,
          health: farm.health_score || 85,
          revenue: farm.monthly_revenue || 0,
          status: farm.is_active ? 'active' : 'inactive',
        }));
      } catch (error) {
        console.error('Error fetching top farms:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for refreshing all dashboard data
export const useRefreshDashboard = () => {
  const statsQuery = useDashboardStats();
  const activitiesQuery = useRecentActivities();
  const alertsQuery = useSystemAlerts();
  const farmsQuery = useTopFarms();

  const refreshAll = () => {
    statsQuery.refetch();
    activitiesQuery.refetch();
    alertsQuery.refetch();
    farmsQuery.refetch();
  };

  return {
    refreshAll,
    isLoading: statsQuery.isLoading || activitiesQuery.isLoading || alertsQuery.isLoading || farmsQuery.isLoading,
    isRefetching: statsQuery.isRefetching || activitiesQuery.isRefetching || alertsQuery.isRefetching || farmsQuery.isRefetching,
  };
};
