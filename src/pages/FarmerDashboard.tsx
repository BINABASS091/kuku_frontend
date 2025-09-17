import React, { useState, useEffect } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Circle,
  useToast,
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
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';

interface FarmStats {
  totalBirds: number;
  activeBatches: number;
  eggsToday: number;
  feedRemaining: number;
  healthAlerts: number;
  dailyProduction: number;
  weeklyGrowth: number;
  monthlyRevenue: number;
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

  // Mock data - in real app, fetch from API
  const [farmStats, setFarmStats] = useState<FarmStats>({
    totalBirds: 1250,
    activeBatches: 4,
    eggsToday: 1150,
    feedRemaining: 85,
    healthAlerts: 2,
    dailyProduction: 92,
    weeklyGrowth: 8.5,
    monthlyRevenue: 45000,
  });

  const [todayTasks, setTodayTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Morning Feeding - Batch A',
      time: '07:00 AM',
      type: 'feeding',
      priority: 'high',
      completed: true,
      batchName: 'Batch A',
    },
    {
      id: 2,
      title: 'Health Check - Batch B',
      time: '09:00 AM',
      type: 'health',
      priority: 'medium',
      completed: false,
      batchName: 'Batch B',
    },
    {
      id: 3,
      title: 'Egg Collection',
      time: '11:00 AM',
      type: 'monitoring',
      priority: 'high',
      completed: false,
    },
    {
      id: 4,
      title: 'Coop Cleaning - Section C',
      time: '02:00 PM',
      type: 'cleaning',
      priority: 'medium',
      completed: false,
    },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: 'warning',
      title: 'Temperature Alert',
      message: 'Coop temperature is above optimal range in Farm A',
      timestamp: '2 hours ago',
      farmName: 'Farm A',
    },
    {
      id: 2,
      type: 'error',
      title: 'Feed Level Low',
      message: 'Feed level below 20% in storage tank 2',
      timestamp: '4 hours ago',
    },
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: 1,
      action: 'Fed 50kg of starter feed',
      timestamp: '1 hour ago',
      batchName: 'Batch A',
      type: 'feeding',
    },
    {
      id: 2,
      action: 'Collected 280 eggs',
      timestamp: '2 hours ago',
      batchName: 'Batch B',
      type: 'production',
    },
    {
      id: 3,
      action: 'Administered vitamins',
      timestamp: '3 hours ago',
      batchName: 'Batch C',
      type: 'health',
    },
  ]);

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

  const handleTaskComplete = (taskId: number) => {
    setTodayTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    toast({
      title: 'Task updated',
      status: 'success',
      duration: 2000,
    });
  };

  const completedTasks = todayTasks.filter(task => task.completed).length;
  const taskCompletion = (completedTasks / todayTasks.length) * 100;

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Welcome Section */}
        <Box>
          <Heading size="lg" mb={2}>
            Welcome back, {user?.first_name || user?.username}! 👋
          </Heading>
          <Text color={textColor}>
            Here's what's happening with your farm today
          </Text>
        </Box>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Total Birds</StatLabel>
                <StatNumber color="blue.500">{farmStats.totalBirds.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Eggs Today</StatLabel>
                <StatNumber color="green.500">{farmStats.eggsToday.toLocaleString()}</StatNumber>
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
                  3 days remaining
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Monthly Revenue</StatLabel>
                <StatNumber color="purple.500">₹{farmStats.monthlyRevenue.toLocaleString()}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {farmStats.weeklyGrowth}% this week
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Recent Alerts</Heading>
                <Badge colorScheme="red" variant="subtle">
                  {alerts.length} active
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {alerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    status={alert.type === 'error' ? 'error' : 'warning'}
                    borderRadius="md"
                  >
                    <AlertIcon />
                    <Box flex="1">
                      <AlertTitle fontSize="sm">{alert.title}</AlertTitle>
                      <AlertDescription fontSize="sm">
                        {alert.message}
                        {alert.farmName && (
                          <Text as="span" fontWeight="medium" ml={2}>
                            ({alert.farmName})
                          </Text>
                        )}
                      </AlertDescription>
                      <Text fontSize="xs" color={textColor} mt={1}>
                        {alert.timestamp}
                      </Text>
                    </Box>
                  </Alert>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* Today's Tasks */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Heading size="md">Today's Tasks</Heading>
                  <Text fontSize="sm" color={textColor}>
                    {completedTasks} of {todayTasks.length} completed
                  </Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="xs" color={textColor}>Progress</Text>
                  <Circle size="50px" position="relative">
                    <Progress
                      value={taskCompletion}
                      size="lg"
                      colorScheme="green"
                      isIndeterminate={false}
                      borderRadius="full"
                    />
                    <Text
                      position="absolute"
                      fontSize="xs"
                      fontWeight="bold"
                      color="green.500"
                    >
                      {Math.round(taskCompletion)}%
                    </Text>
                  </Circle>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {todayTasks.map((task) => (
                  <HStack
                    key={task.id}
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
                          {task.title}
                        </Text>
                        <HStack spacing={2}>
                          <Text fontSize="xs" color={textColor}>
                            {task.time}
                          </Text>
                          <Badge
                            size="sm"
                            colorScheme={getPriorityColor(task.priority)}
                            variant="subtle"
                          >
                            {task.priority}
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                    <Button
                      size="sm"
                      colorScheme={task.completed ? 'gray' : 'green'}
                      variant={task.completed ? 'ghost' : 'solid'}
                      onClick={() => handleTaskComplete(task.id)}
                    >
                      {task.completed ? 'Undo' : 'Complete'}
                    </Button>
                  </HStack>
                ))}
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

          {/* Recent Activities */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Recent Activities</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {recentActivities.map((activity) => (
                  <HStack key={activity.id} spacing={3}>
                    <Circle size="8" bg={`${getTaskTypeColor(activity.type)}.100`}>
                      <Icon
                        as={getTaskTypeIcon(activity.type)}
                        size="4"
                        color={`${getTaskTypeColor(activity.type)}.500`}
                      />
                    </Circle>
                    <VStack align="start" spacing={0} flex="1">
                      <Text fontSize="sm" fontWeight="medium">
                        {activity.action}
                      </Text>
                      <HStack spacing={2}>
                        <Text fontSize="xs" color={textColor}>
                          {activity.batchName}
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          •
                        </Text>
                        <Text fontSize="xs" color={textColor}>
                          {activity.timestamp}
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                ))}
                <Button
                  leftIcon={<FiEye />}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/farmer/activities')}
                >
                  View All Activities
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Grid>

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
