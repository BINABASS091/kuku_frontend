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

function TasksSection({ cardBg, borderColor, textColor, navigate, t }: any) {
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
            <Heading size="md">{t('todaysTasks')}</Heading>
            {tasksLoading ? (
              <Text fontSize="sm" color={textColor}>{t('loadingTasks')}</Text>
            ) : tasksError ? (
              <Text fontSize="sm" color="red.500">{t('failedToLoadTasks')}</Text>
            ) : (
              <Text fontSize="sm" color={textColor}>
                {todayTasks?.filter((task: any) => task.completed).length || 0} {t('of')} {todayTasks?.length || 0} {t('completed')}
              </Text>
            )}
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={3} align="stretch">
          {tasksLoading ? (
            <Text>{t('loading')}</Text>
          ) : tasksError ? (
            <Text color="red.500">{t('errorLoadingTasks')}</Text>
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
                      {task.title || task.name || task.activity_type || t('task')}
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
                        {t(task.priority || 'medium')}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>
              </HStack>
            ))
          ) : (
            <Text color="gray.500">{t('noTasksForToday')}</Text>
          )}
          <Button
            leftIcon={<FiPlus />}
            variant="ghost"
            size="sm"
            onClick={() => navigate('/farmer/tasks')}
          >
            {t('viewAllTasks')}
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
        title: t('batchCreated'),
        description: t('batchCreatedSuccessfully'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setBatchForm({ name: '', breed: '', quantity: '', age: '', acquisition_date: '', notes: '' });
      onBatchModalClose();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToCreateBatch'),
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
        title: t('activityRecorded'),
        description: t('activityRecordedSuccessfully'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setActivityForm({ batch: '', activity_type: '', description: '', quantity: '', cost: '', scheduled_date: '' });
      onActivityModalClose();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToRecordActivity'),
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
        title: t('healthCheckRecorded'),
        description: t('healthCheckRecordedSuccessfully'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setHealthForm({ batch: '', check_type: '', symptoms: '', medication: '', notes: '', veterinarian: '' });
      onHealthModalClose();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToRecordHealthCheck'),
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
  function AlertsSection({ cardBg, borderColor, textColor, t }: any) {
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
            <Heading size="md">{t('recentAlerts')}</Heading>
            {alertsLoading ? null : (
              <Badge colorScheme="red" variant="subtle">
                {alerts?.length || 0} {t('active')}
              </Badge>
            )}
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={3} align="stretch">
            {alertsLoading ? (
              <Text>{t('loading')}</Text>
            ) : alertsError ? (
              <Text color="red.500">{t('errorLoadingAlerts')}</Text>
            ) : alerts && alerts.length > 0 ? (
              alerts.map((alert: any, idx: number) => (
                <Alert
                  key={alert.id || idx}
                  status={alert.type === 'error' ? 'error' : 'warning'}
                  borderRadius="md"
                >
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle fontSize="sm">{alert.title || alert.activity_type || t('alert')}</AlertTitle>
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
              <Text color="gray.500">{t('noRecentAlerts')}</Text>
            )}
          </VStack>
        </CardBody>
      </Card>
    );
  }

  // Recent Activities Section
  function RecentActivitiesSection({ cardBg, borderColor, textColor, t }: any) {
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
              <Text>{t('loading')}</Text>
            ) : activitiesError ? (
              <Text color="red.500">{t('errorLoadingActivities')}</Text>
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
                      {activity.action || activity.activity_type || t('activity')}
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
            {t('quickOverview')}
          </Text>
        </Box>

        {/* Key Metrics */}
        {statsLoading ? (
          <Box>{t('loadingYourProfile')}</Box>
        ) : statsError ? (
          <Alert status="error">
            <AlertIcon />
            {t('failedToLoadProfileData')}
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>{t('totalBirds')}</StatLabel>
                  <StatNumber color="blue.500">{farmStats.totalBirds?.toLocaleString?.() ?? farmStats.totalBirds}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {/* TODO: Replace with real data if available */}
                    {t('increaseFromLastMonth', { percentage: 12 })}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>{t('eggsToday')}</StatLabel>
                  <StatNumber color="green.500">{farmStats.eggsToday?.toLocaleString?.() ?? farmStats.eggsToday}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {farmStats.dailyProduction}% {t('efficiency')}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>{t('feedRemaining')}</StatLabel>
                  <StatNumber color="orange.500">{farmStats.feedRemaining}%</StatNumber>
                  <StatHelpText>
                    <StatArrow type="decrease" />
                    {/* TODO: Replace with real data if available */}
                    {t('daysRemaining', { days: 3 })}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel color={textColor}>{t('monthlyRevenue')}</StatLabel>
                  <StatNumber color="purple.500">₹{farmStats.monthlyRevenue?.toLocaleString?.() ?? farmStats.monthlyRevenue}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {farmStats.weeklyGrowth}% {t('weeklyGrowth')}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Quick Actions */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">{t('quickActions')}</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="green"
                onClick={onBatchModalOpen}
              >
                {t('addNewBatch')}
              </Button>
              <Button
                leftIcon={<FiActivity />}
                colorScheme="blue"
                variant="outline"
                onClick={onActivityModalOpen}
              >
                {t('recordActivity')}
              </Button>
              <Button
                leftIcon={<FiHeart />}
                colorScheme="red"
                variant="outline"
                onClick={onHealthModalOpen}
              >
                {t('healthCheck')}
              </Button>
              <Button
                leftIcon={<FiTrendingUp />}
                colorScheme="purple"
                variant="outline"
                onClick={onReportsModalOpen}
              >
                {t('generateReport')}
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Tasks Section - Live API Data */}
        <TasksSection t={t} cardBg={cardBg} borderColor={borderColor} textColor={textColor} navigate={navigate} />

        {/* Alerts Section - Live API Data */}
        <AlertsSection t={t} cardBg={cardBg} borderColor={borderColor} textColor={textColor} />

        {/* Recent Activities Section - Live API Data */}
        <RecentActivitiesSection t={t} cardBg={cardBg} borderColor={borderColor} textColor={textColor} />

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
          <ModalHeader>{t('addNewBatch')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('batchName')}</FormLabel>
                <Input
                  value={batchForm.name}
                  onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
                  placeholder={t('enterBatchName')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('breed')}</FormLabel>
                <Select
                  value={batchForm.breed}
                  onChange={(e) => setBatchForm({ ...batchForm, breed: e.target.value })}
                  placeholder={t('selectBreed')}
                >
                  <option value="broiler">{t('broiler')}</option>
                  <option value="layer">{t('layer')}</option>
                  <option value="kienyeji">{t('kienyeji')}</option>
                  <option value="improved-kienyeji">{t('improvedKienyeji')}</option>
                </Select>
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>{t('quantity')}</FormLabel>
                  <NumberInput
                    value={batchForm.quantity}
                    onChange={(value) => setBatchForm({ ...batchForm, quantity: value })}
                    min={1}
                  >
                    <NumberInputField placeholder={t('numberOfBirds')} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>{t('ageWeeks')}</FormLabel>
                  <NumberInput
                    value={batchForm.age}
                    onChange={(value) => setBatchForm({ ...batchForm, age: value })}
                    min={0}
                  >
                    <NumberInputField placeholder={t('ageInWeeks')} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>{t('acquisitionDate')}</FormLabel>
                <Input
                  type="date"
                  value={batchForm.acquisition_date}
                  onChange={(e) => setBatchForm({ ...batchForm, acquisition_date: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('notes')}</FormLabel>
                <Textarea
                  value={batchForm.notes}
                  onChange={(e) => setBatchForm({ ...batchForm, notes: e.target.value })}
                  placeholder={t('additionalNotes')}
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBatchModalClose}>
              {t('cancel')}
            </Button>
            <Button colorScheme="green" onClick={handleBatchSubmit}>
              {t('createBatch')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Record Activity Modal */}
      <Modal isOpen={isActivityModalOpen} onClose={onActivityModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('recordActivity')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('batch')}</FormLabel>
                <Select
                  value={activityForm.batch}
                  onChange={(e) => setActivityForm({ ...activityForm, batch: e.target.value })}
                  placeholder={t('selectBatch')}
                >
                  <option value="batch-1">{t('batch')} 1 - {t('broilers')} ({t('week')} 6)</option>
                  <option value="batch-2">{t('batch')} 2 - {t('layers')} ({t('week')} 12)</option>
                  <option value="batch-3">{t('batch')} 3 - {t('kienyeji')} ({t('week')} 8)</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('activityType')}</FormLabel>
                <Select
                  value={activityForm.activity_type}
                  onChange={(e) => setActivityForm({ ...activityForm, activity_type: e.target.value })}
                  placeholder={t('selectActivityType')}
                >
                  <option value="feeding">{t('feeding')}</option>
                  <option value="vaccination">{t('vaccination')}</option>
                  <option value="cleaning">{t('cleaning')}</option>
                  <option value="egg_collection">{t('eggCollection')}</option>
                  <option value="health_check">{t('healthCheck')}</option>
                  <option value="medication">{t('medication')}</option>
                  <option value="maintenance">{t('maintenance')}</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('description')}</FormLabel>
                <Textarea
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                  placeholder={t('describeActivity')}
                  rows={3}
                />
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>{t('quantityAmount')}</FormLabel>
                  <Input
                    value={activityForm.quantity}
                    onChange={(e) => setActivityForm({ ...activityForm, quantity: e.target.value })}
                    placeholder={t('quantityExample')}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>{t('costTzs')}</FormLabel>
                  <NumberInput
                    value={activityForm.cost}
                    onChange={(value) => setActivityForm({ ...activityForm, cost: value })}
                    min={0}
                  >
                    <NumberInputField placeholder={t('costIfApplicable')} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>{t('dateTime')}</FormLabel>
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
              {t('cancel')}
            </Button>
            <Button colorScheme="blue" onClick={handleActivitySubmit}>
              {t('recordActivity')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Health Check Modal */}
      <Modal isOpen={isHealthModalOpen} onClose={onHealthModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('healthCheck')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('batch')}</FormLabel>
                <Select
                  value={healthForm.batch}
                  onChange={(e) => setHealthForm({ ...healthForm, batch: e.target.value })}
                  placeholder={t('selectBatch')}
                >
                  <option value="batch-1">{t('batch')} 1 - {t('broilers')} ({t('week')} 6)</option>
                  <option value="batch-2">{t('batch')} 2 - {t('layers')} ({t('week')} 12)</option>
                  <option value="batch-3">{t('batch')} 3 - {t('kienyeji')} ({t('week')} 8)</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('checkType')}</FormLabel>
                <Select
                  value={healthForm.check_type}
                  onChange={(e) => setHealthForm({ ...healthForm, check_type: e.target.value })}
                  placeholder={t('selectCheckType')}
                >
                  <option value="routine">{t('routineHealthCheck')}</option>
                  <option value="symptom_investigation">{t('symptomInvestigation')}</option>
                  <option value="post_medication">{t('postMedicationCheck')}</option>
                  <option value="vaccination_followup">{t('vaccinationFollowup')}</option>
                  <option value="emergency">{t('emergencyCheck')}</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>{t('symptomsObserved')}</FormLabel>
                <Textarea
                  value={healthForm.symptoms}
                  onChange={(e) => setHealthForm({ ...healthForm, symptoms: e.target.value })}
                  placeholder={t('describeSymptomsObservations')}
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('medicationTreatment')}</FormLabel>
                <Input
                  value={healthForm.medication}
                  onChange={(e) => setHealthForm({ ...healthForm, medication: e.target.value })}
                  placeholder={t('medicationGivenTreatment')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('veterinarian')}</FormLabel>
                <Input
                  value={healthForm.veterinarian}
                  onChange={(e) => setHealthForm({ ...healthForm, veterinarian: e.target.value })}
                  placeholder={t('veterinarianNameConsulted')}
                />
              </FormControl>

              <FormControl>
                <FormLabel>{t('additionalNotes')}</FormLabel>
                <Textarea
                  value={healthForm.notes}
                  onChange={(e) => setHealthForm({ ...healthForm, notes: e.target.value })}
                  placeholder={t('additionalNotesRecommendations')}
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onHealthModalClose}>
              {t('cancel')}
            </Button>
            <Button colorScheme="red" onClick={handleHealthSubmit}>
              {t('saveHealthCheck')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Reports Modal */}
      <Modal isOpen={isReportsModalOpen} onClose={onReportsModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('quickReports')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text color={textColor} textAlign="center">
                {t('selectReportDescription')}
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
                    <Text fontWeight="bold">{t('productionReport')}</Text>
                    <Text fontSize="sm" color={textColor}>{t('productionReportDesc')}</Text>
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
                    <Text fontWeight="bold">{t('financialReport')}</Text>
                    <Text fontSize="sm" color={textColor}>{t('financialReportDesc')}</Text>
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
                    <Text fontWeight="bold">{t('healthReport')}</Text>
                    <Text fontSize="sm" color={textColor}>{t('healthReportDesc')}</Text>
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
                    <Text fontWeight="bold">{t('performanceReport')}</Text>
                    <Text fontSize="sm" color={textColor}>{t('performanceReportDesc')}</Text>
                  </VStack>
                </Button>
              </SimpleGrid>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onReportsModalClose}>
              {t('close')}
            </Button>
            <Button 
              colorScheme="purple" 
              onClick={() => {
                navigate('/farmer/analytics');
                onReportsModalClose();
              }}
            >
              {t('viewFullAnalytics')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FarmerLayout>
  );
};

export default FarmerDashboard;
