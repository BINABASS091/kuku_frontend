import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

// Types for dashboard data
export interface DashboardStats {
  totalUsers: number | null;
  totalFarmers: number | null;
  activeFarms: number | null;
  totalDevices: number | null;
  activeSubscriptions: number | null;
  monthlyRevenue: number | null;
  systemHealth: number;
  pendingTasks: number;
  alerts: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
  user: string;
  details?: string;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  time: string;
  count: number;
  severity: 'low' | 'medium' | 'high';
}

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
    queryFn: async (): Promise<DashboardStats> => {
      try {
        // Fetch all data in parallel
        const [usersRes, farmersRes, farmsRes, devicesRes, subscriptionsRes, paymentsRes] = await Promise.allSettled([
          api.get('users/'),
          api.get('farmers/'),
          api.get('farms/'),
          api.get('devices/'),
          api.get('farmer-subscriptions/'),
          api.get('payments/'),
        ]);

        // Extract counts from responses
        const totalUsers = usersRes.status === 'fulfilled' 
          ? (usersRes.value.data.results || usersRes.value.data || []).length 
          : null;

        const totalFarmers = farmersRes.status === 'fulfilled' 
          ? (farmersRes.value.data.results || farmersRes.value.data || []).length 
          : null;

        const activeFarms = farmsRes.status === 'fulfilled' 
          ? (farmsRes.value.data.results || farmsRes.value.data || []).length 
          : null;

        const totalDevices = devicesRes.status === 'fulfilled' 
          ? (devicesRes.value.data.results || devicesRes.value.data || []).length 
          : null;

        const activeSubscriptions = subscriptionsRes.status === 'fulfilled' 
          ? (subscriptionsRes.value.data.results || subscriptionsRes.value.data || []).length 
          : null;

        // Calculate monthly revenue
        let monthlyRevenue = null;
        if (paymentsRes.status === 'fulfilled') {
          const payments = paymentsRes.value.data.results || paymentsRes.value.data || [];
          if (Array.isArray(payments)) {
            monthlyRevenue = payments.reduce((sum: number, payment: any) => {
              return sum + (Number(payment.amount) || 0);
            }, 0);
          }
        }

        return {
          totalUsers,
          totalFarmers,
          activeFarms,
          totalDevices,
          activeSubscriptions,
          monthlyRevenue,
          systemHealth: 95, // Static for now
          pendingTasks: 0, // Static for now
          alerts: 0, // Static for now
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
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
