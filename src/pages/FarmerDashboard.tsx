import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
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
  VStack,
  HStack,
  Badge,
  Icon,
  Button,
  Circle,
  useToast,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiActivity,
  FiHeart,
  FiDollarSign,
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
    isError: tasksError
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

interface Alert {
  id: number;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  farmName?: string;
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();

  // Modal state management
  const { isOpen: isBatchModalOpen, onOpen: onBatchModalOpen, onClose: onBatchModalClose } = useDisclosure();
  const { isOpen: isActivityModalOpen, onOpen: onActivityModalOpen, onClose: onActivityModalClose } = useDisclosure();
  const { isOpen: isHealthModalOpen, onOpen: onHealthModalOpen, onClose: onHealthModalClose } = useDisclosure();
  const { isOpen: isReportsModalOpen, onOpen: onReportsModalOpen, onClose: onReportsModalClose } = useDisclosure();

  // Form state
  const [batchForm, setBatchForm] = useState({
    name: '',
    breed: '',
    quantity: '',
    age: '',
    acquisition_date: '',
    notes: ''
  });

  const [activityForm, setActivityForm] = useState({
    batch: '',
    activity_type: '',
    description: '',
    quantity: '',
    cost: '',
    scheduled_date: ''
  });

  const [healthForm, setHealthForm] = useState({
    batch: '',
    check_type: '',
    symptoms: '',
    medication: '',
    notes: '',
    veterinarian: ''
  });

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Form submission handlers
  const handleBatchSubmit = async () => {
    try {
      await batchAPI.create(batchForm);
      toast({
        title: 'Batch Created',
        description: 'New batch has been successfully created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setBatchForm({ name: '', breed: '', quantity: '', age: '', acquisition_date: '', notes: '' });
      onBatchModalClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create batch. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleActivitySubmit = async () => {
    try {
      await activityAPI.create(activityForm);
      toast({
        title: 'Activity Recorded',
        description: 'Activity has been successfully recorded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setActivityForm({ batch: '', activity_type: '', description: '', quantity: '', cost: '', scheduled_date: '' });
      onActivityModalClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record activity. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleHealthSubmit = async () => {
    try {
      // Assuming you have a health check API endpoint
      await activityAPI.create({ ...healthForm, activity_type: 'health_check' });
      toast({
        title: 'Health Check Recorded',
        description: 'Health check has been successfully recorded.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setHealthForm({ batch: '', check_type: '', symptoms: '', medication: '', notes: '', veterinarian: '' });
      onHealthModalClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record health check. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch farm stats from API
  const {
    data: farmStats,
    isLoading: statsLoading,
    isError: statsError
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
      isError: alertsError
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
      isError: activitiesError
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
          <Heading size="md">{t('recentActivities')}</Heading>
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
              <Text color="gray.500">{t('noActivitiesYet')}</Text>
            )}
            <Button
              leftIcon={<FiEye />}
              variant="ghost"
              size="sm"
              onClick={() => navigate('/farmer/activities')}
            >
              {t('viewAllActivities')}
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
            {t('welcome')}, {user?.name || 'Farmer'}! 👋
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
            Failed to load stats
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
                onClick={onBatchModalOpen}
              >
                Add New Batch
              </Button>
              <Button
                leftIcon={<FiActivity />}
                colorScheme="blue"
                variant="outline"
                onClick={onActivityModalOpen}
              >
                Record Activity
              </Button>
              <Button
                leftIcon={<FiHeart />}
                colorScheme="red"
                variant="outline"
                onClick={onHealthModalOpen}
              >
                Health Check
              </Button>
              <Button
                leftIcon={<FiTrendingUp />}
                colorScheme="purple"
                variant="outline"
                onClick={onReportsModalOpen}
              >
                View Reports
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>

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
      </VStack>

      {/* Add New Batch Modal */}
      <Modal isOpen={isBatchModalOpen} onClose={onBatchModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Batch</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Batch Name</FormLabel>
                <Input
                  value={batchForm.name}
                  onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                  placeholder="Enter batch name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Breed</FormLabel>
                <Select
                  value={batchForm.breed}
                  onChange={(e) => setBatchForm({ ...batchForm, breed: e.target.value })}
                  placeholder="Select breed"
                >
                  <option value="broiler">Broiler</option>
                  <option value="layer">Layer</option>
                  <option value="kienyeji">Kienyeji</option>
                  <option value="improved-kienyeji">Improved Kienyeji</option>
                </Select>
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Quantity</FormLabel>
                  <NumberInput
                    value={batchForm.quantity}
                    onChange={(value) => setBatchForm({ ...batchForm, quantity: value })}
                    min={1}
                  >
                    <NumberInputField placeholder="Number of birds" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Age (weeks)</FormLabel>
                  <NumberInput
                    value={batchForm.age}
                    onChange={(value) => setBatchForm({ ...batchForm, age: value })}
                    min={0}
                  >
                    <NumberInputField placeholder="Age in weeks" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Acquisition Date</FormLabel>
                <Input
                  type="date"
                  value={batchForm.acquisition_date}
                  onChange={(e) => setBatchForm({ ...batchForm, acquisition_date: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={batchForm.notes}
                  onChange={(e) => setBatchForm({ ...batchForm, notes: e.target.value })}
                  placeholder="Additional notes about this batch"
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBatchModalClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleBatchSubmit}>
              Create Batch
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Record Activity Modal */}
      <Modal isOpen={isActivityModalOpen} onClose={onActivityModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Batch</FormLabel>
                <Select
                  value={activityForm.batch}
                  onChange={(e) => setActivityForm({ ...activityForm, batch: e.target.value })}
                  placeholder="Select batch"
                >
                  <option value="batch-1">Batch 1 - Broilers (Week 6)</option>
                  <option value="batch-2">Batch 2 - Layers (Week 12)</option>
                  <option value="batch-3">Batch 3 - Kienyeji (Week 8)</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Activity Type</FormLabel>
                <Select
                  value={activityForm.activity_type}
                  onChange={(e) => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                  placeholder="Select activity type"
                >
                  <option value="feeding">Feeding</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="egg_collection">Egg Collection</option>
                  <option value="health_check">Health Check</option>
                  <option value="medication">Medication</option>
                  <option value="maintenance">Maintenance</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder="Describe the activity performed"
                  rows={3}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>Quantity/Amount</FormLabel>
                  <Input
                    value={activityForm.quantity}
                    onChange={(e) => setActivityForm({ ...activityForm, quantity: e.target.value })}
                    placeholder="e.g., 50kg feed, 100 eggs"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cost (KSH)</FormLabel>
                  <NumberInput
                    value={activityForm.cost}
                    onChange={(value) => setActivityForm({ ...activityForm, cost: value })}
                    min={0}
                  >
                    <NumberInputField placeholder="Cost if applicable" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Date & Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={activityForm.scheduled_date}
                  onChange={(e) => setActivityForm({ ...activityForm, scheduled_date: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onActivityModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleActivitySubmit}>
              Record Activity
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Health Check Modal */}
      <Modal isOpen={isHealthModalOpen} onClose={onHealthModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Health Check</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Batch</FormLabel>
                <Select
                  value={healthForm.batch}
                  onChange={(e) => setHealthForm({ ...healthForm, batch: e.target.value })}
                  placeholder="Select batch"
                >
                  <option value="batch-1">Batch 1 - Broilers (Week 6)</option>
                  <option value="batch-2">Batch 2 - Layers (Week 12)</option>
                  <option value="batch-3">Batch 3 - Kienyeji (Week 8)</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Check Type</FormLabel>
                <Select
                  value={healthForm.check_type}
                  onChange={(e) => setHealthForm({ ...healthForm, check_type: e.target.value })}
                  placeholder="Select check type"
                >
                  <option value="routine">Routine Health Check</option>
                  <option value="symptom_investigation">Symptom Investigation</option>
                  <option value="post_medication">Post-Medication Check</option>
                  <option value="vaccination_followup">Vaccination Follow-up</option>
                  <option value="emergency">Emergency Check</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Symptoms Observed</FormLabel>
                <Textarea
                  value={healthForm.symptoms}
                  onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
                  placeholder="Describe any symptoms or observations"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Medication/Treatment</FormLabel>
                <Input
                  value={healthForm.medication}
                  onChange={(e) => setHealthForm({ ...healthForm, medication: e.target.value })}
                  placeholder="Medication given or treatment applied"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Veterinarian</FormLabel>
                <Input
                  value={healthForm.veterinarian}
                  onChange={(e) => setHealthForm({ ...healthForm, veterinarian: e.target.value })}
                  placeholder="Veterinarian name (if consulted)"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Additional Notes</FormLabel>
                <Textarea
                  value={healthForm.notes}
                  onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
                  placeholder="Additional notes or recommendations"
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onHealthModalClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleHealthSubmit}>
              Save Health Check
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Reports Modal */}
      <Modal isOpen={isReportsModalOpen} onClose={onReportsModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quick Reports</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text color={textColor} textAlign="center">
                Select a report to view or navigate to the full analytics page for detailed insights.
              </Text>
              
              <Divider />
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <Button
                  leftIcon={<FiActivity />}
                  variant="outline"
                  h="80px"
                  onClick={() => {
                    navigate('/farmer/analytics');
                    onReportsModalClose();
                  }}
                >
                  <VStack spacing={1}>
                    <Text fontWeight="bold">Production Report</Text>
                    <Text fontSize="sm" color={textColor}>Eggs, feed consumption, growth</Text>
                  </VStack>
                </Button>

                <Button
                  leftIcon={<FiDollarSign />}
                  variant="outline"
                  h="80px"
                  onClick={() => {
                    navigate('/farmer/analytics');
                    onReportsModalClose();
                  }}
                >
                  <VStack spacing={1}>
                    <Text fontWeight="bold">Financial Report</Text>
                    <Text fontSize="sm" color={textColor}>Revenue, costs, profit analysis</Text>
                  </VStack>
                </Button>

                <Button
                  leftIcon={<FiHeart />}
                  variant="outline"
                  h="80px"
                  onClick={() => {
                    navigate('/farmer/health');
                    onReportsModalClose();
                  }}
                >
                  <VStack spacing={1}>
                    <Text fontWeight="bold">Health Report</Text>
                    <Text fontSize="sm" color={textColor}>Mortality, treatments, vaccines</Text>
                  </VStack>
                </Button>

                <Button
                  leftIcon={<FiTrendingUp />}
                  variant="outline"
                  h="80px"
                  onClick={() => {
                    navigate('/farmer/analytics');
                    onReportsModalClose();
                  }}
                >
                  <VStack spacing={1}>
                    <Text fontWeight="bold">Performance Report</Text>
                    <Text fontSize="sm" color={textColor}>KPIs, trends, comparisons</Text>
                  </VStack>
                </Button>
              </SimpleGrid>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onReportsModalClose}>
              Close
            </Button>
            <Button 
              colorScheme="purple" 
              onClick={() => {
                navigate('/farmer/analytics');
                onReportsModalClose();
              }}
            >
              View Full Analytics
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FarmerLayout>
  );
};

export default FarmerDashboard;
