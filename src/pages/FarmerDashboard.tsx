import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  VStack,
  HStack,
  Badge,
  Icon,
  Button,
  Flex,
  Circle,
  useToast,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiHeart,
  FiDollarSign,
  FiCalendar,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiPlus,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { farmAPI, batchAPI, activityAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';

function TasksSection({ cardBg, borderColor, textColor, navigate }: any) {
  // Fetch today's tasks (batch activities) from API
  const {
    data: todayTasks,
    isLoading: tasksLoading,
    isError: tasksError,
    error: tasksErrorObj
  } = useQuery(['farmer-today-tasks'], async () => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const params = { date: today };
    const res = await batchAPI.list(params);
    return res.results || res;
  });

  // Helper functions for tasks UI
  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case 'feeding': return FiActivity;
      case 'health': return FiHeart;
      case 'cleaning': return FiCheckCircle;
      case 'monitoring': return FiEye;
      default: return FiClock;
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'feeding': return 'blue';
      case 'health': return 'red';
      case 'cleaning': return 'green';
      case 'monitoring': return 'purple';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
      <CardHeader>
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
            <Heading size="md">Today's Tasks</Heading>
            {tasksLoading ? (
              <Text fontSize="sm" color={textColor}>Loading tasks...</Text>
            ) : tasksError ? (
              <Text fontSize="sm" color="red.500">Failed to load tasks</Text>
            ) : (
              <Text fontSize="sm" color={textColor}>
                {todayTasks?.filter((task: any) => task.completed).length || 0} of {todayTasks?.length || 0} completed
              </Text>
            )}
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={3} align="stretch">
          {tasksLoading ? (
            <Text>Loading...</Text>
          ) : tasksError ? (
            <Text color="red.500">Error loading tasks</Text>
          ) : todayTasks && todayTasks.length > 0 ? (
            todayTasks.map((task: any, idx: number) => (
              <HStack
                key={task.id || idx}
                p={3}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                justify="space-between"
                opacity={task.completed ? 0.6 : 1}
              >
                <HStack spacing={3}>
                  <Icon
                    as={getTaskTypeIcon(task.type)}
                    color={`${getTaskTypeColor(task.type)}.500`}
                  />
                  <VStack align="start" spacing={0}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      textDecoration={task.completed ? 'line-through' : 'none'}
                    >
                      {task.title || task.name || task.activity_type || 'Task'}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="xs" color={textColor}>
                        {task.time || task.scheduled_time || ''}
                      </Text>
                      <Badge
                        size="sm"
                        colorScheme={getPriorityColor(task.priority || 'medium')}
                        variant="subtle"
                      >
                        {task.priority || 'medium'}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>
            ))
          ) : (
            <Text color="gray.500">No tasks for today.</Text>
          )}
          <Button
            leftIcon={<FiPlus />}
            variant="ghost"
            size="sm"
            onClick={() => navigate('/farmer/tasks')}
          >
            View All Tasks
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

interface Task {
  id: number;
  title: string;
  time: string;
  type: 'feeding' | 'health' | 'cleaning' | 'monitoring';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  batchName?: string;
}

interface Alert {
  id: number;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  farmName?: string;
}

interface RecentActivity {
  id: number;
  action: string;
  timestamp: string;
  batchName: string;
  type: 'feeding' | 'health' | 'production' | 'maintenance';
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Fetch farm stats from API
  const {
    data: farmStats,
    isLoading: statsLoading,
    isError: statsError,
    error: statsErrorObj
  } = useQuery(['farmer-farm-stats'], async () => {
    const farms = await farmAPI.list();
    const farm = farms.results?.[0] || farms[0];
    if (!farm) throw new Error('No farm found');
    return {
      totalBirds: farm.total_birds || 0,
      activeBatches: farm.active_batches || 0,
      eggsToday: farm.eggs_today || 0,
      feedRemaining: farm.feed_remaining || 0,
      healthAlerts: farm.health_alerts || 0,
      dailyProduction: farm.daily_production || 0,
      weeklyGrowth: farm.weekly_growth || 0,
      monthlyRevenue: farm.monthly_revenue || 0,
    };
  });

  // Alerts Section
  function AlertsSection({ cardBg, borderColor, textColor }: any) {
    // Fetch alerts from API (replace with your actual alerts API if different)
    const {
      data: alerts,
      isLoading: alertsLoading,
      isError: alertsError,
      error: alertsErrorObj
    } = useQuery(['farmer-alerts'], async () => {
      // Use your real alerts API here; fallback to activityAPI.list for demo
      // If you have a dedicated alertsAPI, use that instead
      const res = await activityAPI.list();
      // Map backend data to dashboard Alert shape if needed
      return res.results || res;
    });

    return (
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">Recent Alerts</Heading>
            {alertsLoading ? null : (
              <Badge colorScheme="red" variant="subtle">
                {alerts?.length || 0} active
              </Badge>
            )}
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={3} align="stretch">
            {alertsLoading ? (
              <Text>Loading...</Text>
            ) : alertsError ? (
              <Text color="red.500">Error loading alerts</Text>
            ) : alerts && alerts.length > 0 ? (
              alerts.map((alert: any, idx: number) => (
                <Alert
                  key={alert.id || idx}
                  status={alert.type === 'error' ? 'error' : 'warning'}
                  borderRadius="md"
                >
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle fontSize="sm">{alert.title || alert.activity_type || 'Alert'}</AlertTitle>
                    <AlertDescription fontSize="sm">
                      {alert.message || alert.description || ''}
                      {alert.farmName && (
                        <Text as="span" fontWeight="medium" ml={2}>
                          ({alert.farmName})
                        </Text>
                      )}
                    </AlertDescription>
                    <Text fontSize="xs" color={textColor} mt={1}>
                      {alert.timestamp || alert.created_at || ''}
                    </Text>
                  </Box>
                </Alert>
              ))
            ) : (
              <Text color="gray.500">No recent alerts.</Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Recent Activities Section
  function RecentActivitiesSection({ cardBg, borderColor, textColor }: any) {
    // Fetch recent activities from API (replace with your actual activities API if different)
    const {
      data: activities,
      isLoading: activitiesLoading,
      isError: activitiesError,
      error: activitiesErrorObj
    } = useQuery(['farmer-recent-activities'], async () => {
      // Only fetch the latest 5 activities for dashboard preview
      const res = await activityAPI.list({ ordering: '-created_at', limit: 5 });
      return res.results ? res.results.slice(0, 5) : (Array.isArray(res) ? res.slice(0, 5) : []);
    });

    // Helper for activity type color/icon
    const getTypeColor = (type: string) => {
      switch (type) {
        case 'feeding': return 'blue';
        case 'health': return 'red';
        case 'production': return 'green';
        case 'maintenance': return 'purple';
        default: return 'gray';
      }
    };
    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'feeding': return FiActivity;
        case 'health': return FiHeart;
        case 'production': return FiTrendingUp;
        case 'maintenance': return FiCheckCircle;
        default: return FiClock;
      }
    };

    return (
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Recent Activities</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={3} align="stretch">
            {activitiesLoading ? (
              <Text>Loading...</Text>
            ) : activitiesError ? (
              <Text color="red.500">Error loading activities</Text>
            ) : activities && activities.length > 0 ? (
              activities.map((activity: any, idx: number) => (
                <HStack key={activity.id || idx} spacing={3}>
                  <Circle size="8" bg={`${getTypeColor(activity.type)}.100`}>
                    <Icon
                      as={getTypeIcon(activity.type)}
                      size="4"
                      color={`${getTypeColor(activity.type)}.500`}
                    />
                  </Circle>
                  <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="sm" fontWeight="medium">
                      {activity.action || activity.activity_type || 'Activity'}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="xs" color={textColor}>
                        {activity.batchName || activity.batch || ''}
                      </Text>
                      <Text fontSize="xs" color={textColor}>
                        •
                      </Text>
                      <Text fontSize="xs" color={textColor}>
                        {activity.timestamp || activity.created_at || ''}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              ))
            ) : (
              <Text color="gray.500">No recent activities.</Text>
            )}
            <Button
              leftIcon={<FiEye />}
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/farmer/activities'}
            >
              View All Activities
            </Button>
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Render
  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Welcome Section */}
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {user?.first_name || user?.username || 'Farmer'}! 👋
          </Heading>
          <Text color={textColor}>
            Here's what's happening with your farm today
          </Text>
        </Box>

        {/* Key Metrics */}
        {statsLoading ? (
          <Box>Loading farm stats...</Box>
        ) : statsError ? (
          <Alert status="error">
            <AlertIcon />
            {statsErrorObj?.message || 'Failed to load stats'}
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Total Birds</StatLabel>
                  <StatNumber color="blue.500">{farmStats.totalBirds?.toLocaleString?.() ?? farmStats.totalBirds}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {/* TODO: Replace with real data if available */}
                    12% from last month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Eggs Today</StatLabel>
                  <StatNumber color="green.500">{farmStats.eggsToday?.toLocaleString?.() ?? farmStats.eggsToday}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {farmStats.dailyProduction}% efficiency
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Feed Remaining</StatLabel>
                  <StatNumber color="orange.500">{farmStats.feedRemaining}%</StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    {/* TODO: Replace with real data if available */}
                    3 days remaining
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>Monthly Revenue</StatLabel>
                  <StatNumber color="purple.500">₹{farmStats.monthlyRevenue?.toLocaleString?.() ?? farmStats.monthlyRevenue}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {farmStats.weeklyGrowth}% this week
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

  {/* Tasks Section - Live API Data */}
  <TasksSection cardBg={cardBg} borderColor={borderColor} textColor={textColor} navigate={navigate} />


  {/* Alerts Section - Live API Data */}
  <AlertsSection cardBg={cardBg} borderColor={borderColor} textColor={textColor} />

  {/* Recent Activities Section - Live API Data */}
  <RecentActivitiesSection cardBg={cardBg} borderColor={borderColor} textColor={textColor} />



        {/* Tasks & Activities Section - TODO: Wire up to API */}
        {/*
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          ...existing code for tasks and activities...
        </Grid>
        */}

        {/* Quick Actions */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="green"
                onClick={() => navigate('/farmer/batches/new')}
              >
                Add New Batch
              </Button>
              <Button
                leftIcon={<FiActivity />}
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate('/farmer/tasks/new')}
              >
                Record Activity
              </Button>
              <Button
                leftIcon={<FiHeart />}
                colorScheme="red"
                variant="outline"
                onClick={() => navigate('/farmer/health')}
              >
                Health Check
              </Button>
              <Button
                leftIcon={<FiTrendingUp />}
                colorScheme="purple"
                variant="outline"
                onClick={() => navigate('/farmer/analytics')}
              >
                View Reports
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerDashboard;
