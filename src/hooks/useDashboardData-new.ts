import { useQuery, useQueryClient } from '@tanstack/react-query';
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
        // For now, return mock data since we don't have a dedicated activities endpoint
        // In a real implementation, you would fetch from an activities/logs endpoint
        return [
          {
            id: '1',
            action: 'New farmer registered',
            time: '2 minutes ago',
            status: 'success',
            user: 'John Doe',
            details: 'Created account and farm profile'
          },
          {
            id: '2',
            action: 'Device offline detected',
            time: '15 minutes ago',
            status: 'warning',
            user: 'System',
            details: 'Farm sensors not responding'
          },
          {
            id: '3',
            action: 'Batch harvest completed',
            time: '1 hour ago',
            status: 'success',
            user: 'Jane Smith',
            details: '450 birds processed successfully'
          },
        ];
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
        // For now, return mock data since we don't have a dedicated alerts endpoint
        // In a real implementation, you would fetch from an alerts/notifications endpoint
        return [
          {
            id: '1',
            type: 'warning',
            message: 'Temperature sensors offline in Farm B',
            time: '10 minutes ago',
            count: 3,
            severity: 'medium'
          },
          {
            id: '2',
            type: 'info',
            message: 'Monthly subscription renewals due',
            time: '2 hours ago',
            count: 5,
            severity: 'low'
          },
        ];
      } catch (error) {
        console.error('Error fetching system alerts:', error);
        return [];
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Custom hook for fetching top performing farms
export const useTopFarms = () => {
  return useQuery({
    queryKey: ['top-farms'],
    queryFn: async (): Promise<TopFarm[]> => {
      try {
        // Mock data for top farms
        // In a real implementation, you would calculate this from actual farm data
        return [
          {
            id: '1',
            name: 'Green Valley Farm',
            location: 'Nairobi, Kenya',
            birds: 1250,
            health: 98,
            revenue: 45000,
            status: 'active'
          },
          {
            id: '2',
            name: 'Sunshine Poultry',
            location: 'Mombasa, Kenya',
            birds: 980,
            health: 95,
            revenue: 38500,
            status: 'active'
          },
          {
            id: '3',
            name: 'Mountain View Ranch',
            location: 'Eldoret, Kenya',
            birds: 750,
            health: 92,
            revenue: 28750,
            status: 'active'
          },
        ];
      } catch (error) {
        console.error('Error fetching top farms:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for refreshing all dashboard data
export const useRefreshDashboard = () => {
  const queryClient = useQueryClient();

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    queryClient.invalidateQueries({ queryKey: ['recent-activities'] });
    queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
    queryClient.invalidateQueries({ queryKey: ['top-farms'] });
  };

  return { refreshAll };
};
