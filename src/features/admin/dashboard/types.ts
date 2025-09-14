import type { SystemAlert, RecentActivity } from '../../../types/models';
import type { DashboardStats, TopFarm } from '../../../hooks/useDashboardData';

export interface StatsCardsProps { 
  stats?: DashboardStats | null; 
  isLoading?: boolean;
}
export interface SystemAlertsBannerProps { alerts?: SystemAlert[]; }
export interface QuickAction {
  label: string;
  href: string;
  icon: any;
  color: string;
  description: string;
  isExternal?: boolean;
}
export interface QuickActionsProps { actions: QuickAction[]; }

export interface DashboardTabsProps {
  stats?: DashboardStats | null;
  activities?: RecentActivity[];
  activitiesLoading: boolean;
  alerts?: SystemAlert[];
  alertsLoading: boolean;
  topFarms?: TopFarm[];
  farmsLoading: boolean;
}
