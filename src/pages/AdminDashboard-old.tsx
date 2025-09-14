import { 
  Heading, 
  Box, 
  Text, 
  Card, 
  CardHeader, 
  CardBody, 
  VStack, 
  HStack, 
  IconButton, 
  Tooltip, 
  useToast, 
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { ViewIcon, SettingsIcon, RepeatIcon, DownloadIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { useDashboardStats, useRecentActivities, useSystemAlerts, useTopFarms, useRefreshDashboard } from '../hooks/useDashboardData';
import { StatsCards, QuickActions, SystemAlertsBanner, DashboardTabs, DataManagement } from '../features/admin/dashboard/components';t { Heading, Box, Text, Card, CardHeader, CardBody, VStack, HStack, IconButton, Tooltip, useToast, useColorModeValue } from '@chakra-ui/react';
import { ViewIcon, SettingsIcon, RepeatIcon, DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { useDashboardStats, useRecentActivities, useSystemAlerts, useTopFarms, useRefreshDashboard } from '../hooks/useDashboardData';
import { StatsCards, QuickActions, SystemAlertsBanner, DashboardTabs } from '../features/admin/dashboard/components';

// Clean modular Admin Dashboard (legacy monolithic implementation removed)
export default function AdminDashboard() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { user } = useAuth();
  const toast = useToast();

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();
  const { data: alerts, isLoading: alertsLoading } = useSystemAlerts();
  const { data: topFarms, isLoading: farmsLoading } = useTopFarms();
  const { refreshAll } = useRefreshDashboard();

  const handleRefreshData = () => {
    refreshAll();
    toast({
      title: 'Data Refreshed',
      description: 'All dashboard data has been updated.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const quickActions = [
    { label: 'Manage Users', href: '/admin/users', icon: ViewIcon, color: 'blue', description: 'View and manage all system users' },
    { label: 'Farm Operations', href: '/admin/farms', icon: SettingsIcon, color: 'green', description: 'Monitor farms and devices' },
    { label: 'Subscriptions', href: '/admin/subscriptions', icon: ViewIcon, color: 'purple', description: 'Manage farmer subscriptions' },
    { label: 'System Settings', href: '/admin/settings', icon: SettingsIcon, color: 'orange', description: 'Configure system settings' },
    { label: 'Reports', href: '/admin/reports', icon: ViewIcon, color: 'teal', description: 'View analytics and reports' },
    { label: 'Django Admin', href: 'http://localhost:8000/admin/', icon: ExternalLinkIcon, color: 'gray', description: 'Access Django admin', isExternal: true },
  ];

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="flex-start" mb={2} flexWrap="wrap" gap={4}>
          <Box>
            <Heading as="h1" size="xl" mb={2} color={useColorModeValue('gray.800', 'white')}>
              Welcome back, {(user?.name || 'Admin')}! 👋
            </Heading>
            <Text color={textColor} fontSize="lg">
              Here's what's happening with your Smart Kuku Poultry Management System.
            </Text>
          </Box>
          <HStack spacing={3}>
            <Tooltip label="Refresh Data" placement="bottom">
              <IconButton
                aria-label="Refresh data"
                icon={<RepeatIcon />}
                onClick={handleRefreshData}
                colorScheme="blue"
                variant="outline"
                size="md"
              />
            </Tooltip>
            <Tooltip label="Export Report" placement="bottom">
              <IconButton
                aria-label="Export report"
                icon={<DownloadIcon />}
                colorScheme="green"
                variant="outline"
                size="md"
              />
            </Tooltip>
          </HStack>
        </HStack>

        <SystemAlertsBanner alerts={alerts} />

        <StatsCards stats={stats} isLoading={statsLoading} />

        <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
            <Text fontSize="sm" color={textColor}>
              Common administrative tasks and shortcuts
            </Text>
          </CardHeader>
          <CardBody>
            <QuickActions actions={quickActions} />
          </CardBody>
        </Card>

        <DashboardTabs
          stats={stats}
          activities={activities}
          activitiesLoading={activitiesLoading}
          alerts={alerts}
          alertsLoading={alertsLoading}
          topFarms={topFarms}
          farmsLoading={farmsLoading}
        />
      </VStack>
    </Box>
  );
}
