import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Avatar,
  Flex,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import {
  FiLayers,
  FiActivity,
  FiBarChart2,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiSearch,
  FiFilter,
  FiDownload,
  FiCalendar,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiChevronDown,
  FiMoreVertical,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, addDays, subDays } from 'date-fns';
import FarmerLayout from '../layouts/FarmerLayout';
import SafeChartContainer from '../components/common/SafeChartContainer';
import { useAuth } from '../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { batchAPI, activityAPI, farmAPI, breedAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface Batch {
  id: string;
  name: string;
  breed: string;
  startDate: string;
  currentAge: number;
  totalBirds: number;
  activeBirds: number;
  status: 'active' | 'completed' | 'planned';
  location: string;
  expectedHarvestDate: string;
  mortalityRate: number;
  feedConversion: number;
  avgWeight: number;
  health: 'excellent' | 'good' | 'fair' | 'poor';
}

interface BatchActivity {
  id: string;
  batchId: string;
  batchName: string;
  type: 'feeding' | 'health' | 'cleaning' | 'monitoring' | 'vaccination';
  description: string;
  date: string;
  time: string;
  performedBy: string;
  status: 'completed' | 'pending' | 'overdue';
  notes?: string;
}

interface PerformanceData {
  date: string;
  eggProduction: number;
  feedConsumption: number;
  mortality: number;
  weight: number;
}

const FarmerBatchesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddBatchOpen, onOpen: onAddBatchOpen, onClose: onAddBatchClose } = useDisclosure();
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add batch form state
  const [batchForm, setBatchForm] = useState({
    farmID: '',
    breedID: '',
    arriveDate: '',
    initAge: '',
    harvestAge: '',
    quanitity: '',
    initWeight: '',
  });

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Fetch batches from API
  const {
    data: batches,
    isLoading: batchesLoading,
    isError: batchesError,
  } = useQuery(['farmer-batches'], async () => {
    const response = await batchAPI.list();
    return response.results || response;
  });

  // Fetch activities from API
  const {
    data: activities,
    isLoading: activitiesLoading,
    isError: activitiesError,
  } = useQuery(['farmer-batch-activities'], async () => {
    const response = await activityAPI.list();
    return response.results || response;
  });

  // Fetch farms for batch creation
  const { data: farms } = useQuery(['farmer-farms'], async () => {
    const response = await farmAPI.list();
    return response.results || response;
  });

  // Fetch breeds for batch creation
  const { data: breeds } = useQuery(['breeds'], async () => {
    const response = await breedAPI.list();
    return response.results || response;
  });

  // Mock performance data - replace with real API
  const performanceData: PerformanceData[] = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, 'MMM dd'),
      eggProduction: Math.floor(Math.random() * 100) + 80,
      feedConsumption: Math.floor(Math.random() * 50) + 25,
      mortality: Math.floor(Math.random() * 5),
      weight: Math.floor(Math.random() * 200) + 1800,
    };
  });

  // Mock batches data if API fails
  const mockBatches: Batch[] = [
    {
      id: '1',
      name: 'Batch A-2024',
      breed: 'Rhode Island Red',
      startDate: '2024-01-15',
      currentAge: 45,
      totalBirds: 500,
      activeBirds: 485,
      status: 'active',
      location: 'Coop 1',
      expectedHarvestDate: '2024-03-15',
      mortalityRate: 3.0,
      feedConversion: 2.1,
      avgWeight: 1850,
      health: 'excellent',
    },
    {
      id: '2',
      name: 'Batch B-2024',
      breed: 'Leghorn',
      startDate: '2024-02-01',
      currentAge: 28,
      totalBirds: 300,
      activeBirds: 295,
      status: 'active',
      location: 'Coop 2',
      expectedHarvestDate: '2024-04-01',
      mortalityRate: 1.7,
      feedConversion: 1.9,
      avgWeight: 1650,
      health: 'good',
    },
    {
      id: '3',
      name: 'Batch C-2024',
      breed: 'Plymouth Rock',
      startDate: '2024-03-01',
      currentAge: 8,
      totalBirds: 400,
      activeBirds: 400,
      status: 'active',
      location: 'Coop 3',
      expectedHarvestDate: '2024-05-01',
      mortalityRate: 0.0,
      feedConversion: 2.3,
      avgWeight: 750,
      health: 'excellent',
    },
  ];

  const mockActivities: BatchActivity[] = [
    {
      id: '1',
      batchId: '1',
      batchName: 'Batch A-2024',
      type: 'feeding',
      description: 'Morning feed distribution',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '07:00',
      performedBy: 'John Doe',
      status: 'completed',
      notes: 'All birds fed properly',
    },
    {
      id: '2',
      batchId: '2',
      batchName: 'Batch B-2024',
      type: 'health',
      description: 'Weekly health inspection',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '09:30',
      performedBy: 'Jane Smith',
      status: 'pending',
    },
    {
      id: '3',
      batchId: '1',
      batchName: 'Batch A-2024',
      type: 'cleaning',
      description: 'Coop cleaning and sanitization',
      date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
      time: '14:00',
      performedBy: 'John Doe',
      status: 'completed',
      notes: 'Deep cleaning completed',
    },
  ];

  const displayBatches = batchesError ? mockBatches : (batches || []);
  const displayActivities = activitiesError ? mockActivities : (activities || []);

  // Add safety for activities with proper unique keys
  const safeActivities = displayActivities.map((activity, index) => ({
    ...activity,
    id: activity?.id || `activity-${index}`,
  }));

  // Add batch mutation
  const addBatchMutation = useMutation({
    mutationFn: async (batchData: any) => {
      return await batchAPI.create({
        farmID: batchData.farmID,
        breedID: batchData.breedID,
        arriveDate: batchData.arriveDate,
        initAge: Number(batchData.initAge),
        harvestAge: Number(batchData.harvestAge),
        quanitity: Number(batchData.quanitity),
        initWeight: Number(batchData.initWeight),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Batch created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setBatchForm({
        farmID: '',
        breedID: '',
        arriveDate: '',
        initAge: '',
        harvestAge: '',
        quanitity: '',
        initWeight: '',
      });
      queryClient.invalidateQueries(['farmer-batches']);
      onAddBatchClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create batch',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Ensure all batches have required properties with defaults
  const safeBatches = displayBatches.map(batch => ({
    id: batch?.id || '',
    name: batch?.name || 'Unnamed Batch',
    breed: batch?.breed || 'Unknown Breed',
    startDate: batch?.startDate || new Date().toISOString(),
    currentAge: batch?.currentAge || 0,
    totalBirds: batch?.totalBirds || 0,
    activeBirds: batch?.activeBirds || 0,
    status: batch?.status || 'active',
    location: batch?.location || 'Unknown Location',
    expectedHarvestDate: batch?.expectedHarvestDate || new Date().toISOString(),
    mortalityRate: batch?.mortalityRate || 0,
    feedConversion: batch?.feedConversion || 0,
    avgWeight: batch?.avgWeight || 0,
    health: batch?.health || 'good',
  }));

  // Filter functions
  const filteredBatches = safeBatches.filter(batch => {
    const matchesSearch = (batch?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (batch?.breed || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'planned': return 'orange';
      default: return 'gray';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'fair': return 'orange';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'feeding': return 'blue';
      case 'health': return 'red';
      case 'cleaning': return 'green';
      case 'monitoring': return 'purple';
      case 'vaccination': return 'orange';
      default: return 'gray';
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const handleViewBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    onOpen();
  };

  const handleEditBatch = (batchId: string) => {
    navigate(`/farmer/batches/${batchId}/edit`);
  };

  const handleDeleteBatch = (batchId: string) => {
    // Implement delete functionality
    console.log('Delete batch:', batchId);
  };

  const handleBatchFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBatchForm({ ...batchForm, [e.target.name]: e.target.value });
  };

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBatchMutation.mutate(batchForm);
  };

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Batch Management 🐔
          </Heading>
          <Text color={textColor}>
            Manage your poultry batches, track activities, and monitor performance
          </Text>
        </Box>

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Active Batches</StatLabel>
                <StatNumber color="green.500">
                  {safeBatches.filter(b => b.status === 'active').length}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  2 new this month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Total Birds</StatLabel>
                <StatNumber color="blue.500">
                  {safeBatches.reduce((sum, batch) => sum + batch.activeBirds, 0).toLocaleString()}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  5% from last week
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Avg Mortality</StatLabel>
                <StatNumber color="orange.500">
                  {safeBatches.length > 0 ? (safeBatches.reduce((sum, batch) => sum + batch.mortalityRate, 0) / safeBatches.length).toFixed(1) : '0.0'}%
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  Within target range
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={textColor}>Feed Conversion</StatLabel>
                <StatNumber color="purple.500">
                  {safeBatches.length > 0 ? (safeBatches.reduce((sum, batch) => sum + batch.feedConversion, 0) / safeBatches.length).toFixed(1) : '0.0'}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  Improving efficiency
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Main Content with Tabs */}
        <Tabs variant="enclosed" colorScheme="green">
          <TabList>
            <Tab>Active Batches</Tab>
            <Tab>Activities</Tab>
            <Tab>Performance</Tab>
          </TabList>

          <TabPanels>
            {/* Active Batches Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                {/* Controls */}
                <Flex direction={{ base: 'column', md: 'row' }} gap={4} justify="space-between">
                  <HStack spacing={4} flex="1">
                    <InputGroup maxW="300px">
                      <InputLeftElement pointerEvents="none">
                        <FiSearch color="gray.300" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search batches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                    
                    <Select
                      maxW="200px"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="planned">Planned</option>
                    </Select>
                  </HStack>

                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="green"
                    onClick={onAddBatchOpen}
                  >
                    Add New Batch
                  </Button>
                </Flex>

                {/* Batches Grid */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {filteredBatches.map((batch) => (
                    <Card
                      key={batch.id}
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                      transition="all 0.2s"
                    >
                      <CardHeader>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={1}>
                            <Heading size="md">{batch.name}</Heading>
                            <Text fontSize="sm" color={textColor}>
                              {batch.breed} • {batch.location}
                            </Text>
                          </VStack>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<FiMoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<FiEye />} onClick={() => handleViewBatch(batch)}>
                                View Details
                              </MenuItem>
                              <MenuItem icon={<FiEdit />} onClick={() => handleEditBatch(batch.id)}>
                                Edit Batch
                              </MenuItem>
                              <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => handleDeleteBatch(batch.id)}>
                                Delete Batch
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </CardHeader>
                      
                      <CardBody pt={0}>
                        <VStack spacing={4} align="stretch">
                          <SimpleGrid columns={2} spacing={4}>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="xs" color={textColor} textTransform="uppercase">
                                Age
                              </Text>
                              <Text fontSize="lg" fontWeight="bold">
                                {batch.currentAge} days
                              </Text>
                            </VStack>
                            
                            <VStack align="start" spacing={1}>
                              <Text fontSize="xs" color={textColor} textTransform="uppercase">
                                Birds
                              </Text>
                              <Text fontSize="lg" fontWeight="bold">
                                {batch.activeBirds}/{batch.totalBirds}
                              </Text>
                            </VStack>
                          </SimpleGrid>

                          <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="sm">Health Status</Text>
                              <Badge colorScheme={getHealthColor(batch.health)} variant="subtle">
                                {batch.health.toUpperCase()}
                              </Badge>
                            </HStack>
                            
                            <HStack justify="space-between">
                              <Text fontSize="sm">Mortality Rate</Text>
                              <Text fontSize="sm" fontWeight="medium">
                                {batch.mortalityRate}%
                              </Text>
                            </HStack>
                            
                            <HStack justify="space-between">
                              <Text fontSize="sm">Feed Conversion</Text>
                              <Text fontSize="sm" fontWeight="medium">
                                {batch.feedConversion}:1
                              </Text>
                            </HStack>
                          </VStack>

                          <Badge
                            colorScheme={getStatusColor(batch.status)}
                            variant="solid"
                            textAlign="center"
                            py={1}
                          >
                            {batch.status.toUpperCase()}
                          </Badge>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>

                {filteredBatches.length === 0 && (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <AlertTitle>No batches found!</AlertTitle>
                    <AlertDescription>
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by creating your first batch.'}
                    </AlertDescription>
                  </Alert>
                )}
              </VStack>
            </TabPanel>

            {/* Activities Tab */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">Recent Activities</Heading>
                  <Button
                    leftIcon={<FiPlus />}
                    colorScheme="blue"
                    onClick={() => navigate('/farmer/tasks/new')}
                  >
                    Record Activity
                  </Button>
                </HStack>

                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Batch</Th>
                      <Th>Activity</Th>
                      <Th>Date & Time</Th>
                      <Th>Performed By</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {safeActivities.map((activity) => (
                      <Tr key={activity.id}>
                        <Td>
                          <Text fontWeight="medium">{activity.batchName}</Text>
                        </Td>
                        <Td>
                          <HStack>
                            <Badge colorScheme={getActivityTypeColor(activity.type)} variant="subtle">
                              {activity.type}
                            </Badge>
                            <Text fontSize="sm">{activity.description}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm">{activity.date}</Text>
                            <Text fontSize="xs" color={textColor}>{activity.time}</Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm">{activity.performedBy}</Text>
                        </Td>
                        <Td>
                          <Badge colorScheme={getActivityStatusColor(activity.status)} variant="subtle">
                            {activity.status}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<FiEye />}
                              size="sm"
                              variant="ghost"
                              aria-label="View activity"
                            />
                            <IconButton
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                              aria-label="Edit activity"
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            </TabPanel>

            {/* Performance Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Performance Analytics</Heading>
                
                {performanceData && performanceData.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card key="chart-egg-production" bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="sm">Egg Production Trends</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="250px" w="100%" minH="250px">
                        <SafeChartContainer minHeight={250}>
                          <LineChart data={performanceData} width={400} height={250}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="eggProduction"
                              stroke="#3B82F6"
                              strokeWidth={2}
                              name="Eggs"
                            />
                          </LineChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card key="chart-feed-consumption" bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="sm">Feed Consumption</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="250px" w="100%" minH="250px">
                        <SafeChartContainer minHeight={250}>
                          <BarChart data={performanceData} width={400} height={250}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="feedConsumption" fill="#10B981" name="Feed (kg)" />
                          </BarChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card key="chart-mortality-tracking" bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="sm">Mortality Tracking</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="250px" w="100%" minH="250px">
                        <SafeChartContainer minHeight={250}>
                          <AreaChart data={performanceData} width={400} height={250}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="mortality"
                              stroke="#F59E0B"
                              fill="#F59E0B"
                              fillOpacity={0.3}
                              name="Mortality"
                            />
                          </AreaChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card key="chart-average-weight" bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="sm">Average Weight</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="250px" w="100%" minH="250px">
                        <SafeChartContainer minHeight={250}>
                          <LineChart data={performanceData} width={400} height={250}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              stroke="#8B5CF6"
                              strokeWidth={2}
                              name="Weight (g)"
                            />
                          </LineChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>
                ) : (
                  <Text>Loading performance data...</Text>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Batch Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedBatch?.name} Details
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedBatch && (
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={2} spacing={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Breed
                      </Text>
                      <Text>{selectedBatch.breed}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Location
                      </Text>
                      <Text>{selectedBatch.location}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Start Date
                      </Text>
                      <Text>{format(new Date(selectedBatch.startDate), 'MMM dd, yyyy')}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Expected Harvest
                      </Text>
                      <Text>{format(new Date(selectedBatch.expectedHarvestDate), 'MMM dd, yyyy')}</Text>
                    </VStack>
                  </SimpleGrid>
                  
                  <Divider />
                  
                  <SimpleGrid columns={2} spacing={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Current Age
                      </Text>
                      <Text>{selectedBatch.currentAge} days</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Active Birds
                      </Text>
                      <Text>{selectedBatch.activeBirds} / {selectedBatch.totalBirds}</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Average Weight
                      </Text>
                      <Text>{selectedBatch.avgWeight}g</Text>
                    </VStack>
                    
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color={textColor} fontWeight="bold">
                        Health Status
                      </Text>
                      <Badge colorScheme={getHealthColor(selectedBatch.health)} variant="subtle">
                        {selectedBatch.health.toUpperCase()}
                      </Badge>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="blue" onClick={() => selectedBatch && handleEditBatch(selectedBatch.id)}>
                Edit Batch
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add New Batch Modal */}
        <Modal isOpen={isAddBatchOpen} onClose={onAddBatchClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Batch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleAddBatchSubmit}>
                <VStack spacing={4} align="stretch">
                  <FormControl isRequired>
                    <FormLabel>Farm</FormLabel>
                    <Select
                      name="farmID"
                      value={batchForm.farmID}
                      onChange={handleBatchFormChange}
                      placeholder="Select farm"
                    >
                      {(farms || []).map((farm: any) => (
                        <option key={farm.farmID || farm.id} value={farm.farmID || farm.id}>
                          {farm.farmName || farm.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Breed</FormLabel>
                    <Select
                      name="breedID"
                      value={batchForm.breedID}
                      onChange={handleBatchFormChange}
                      placeholder="Select breed"
                    >
                      {(breeds || []).map((breed: any) => (
                        <option key={breed.breedID || breed.id} value={breed.breedID || breed.id}>
                          {breed.breedName || breed.name}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Arrive Date</FormLabel>
                    <Input
                      type="date"
                      name="arriveDate"
                      value={batchForm.arriveDate}
                      onChange={handleBatchFormChange}
                    />
                  </FormControl>

                  <SimpleGrid columns={2} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Initial Age (days)</FormLabel>
                      <Input
                        type="number"
                        name="initAge"
                        value={batchForm.initAge}
                        onChange={handleBatchFormChange}
                        placeholder="Enter initial age"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Harvest Age (days)</FormLabel>
                      <Input
                        type="number"
                        name="harvestAge"
                        value={batchForm.harvestAge}
                        onChange={handleBatchFormChange}
                        placeholder="Enter harvest age"
                      />
                    </FormControl>
                  </SimpleGrid>

                  <SimpleGrid columns={2} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Quantity</FormLabel>
                      <Input
                        type="number"
                        name="quanitity"
                        value={batchForm.quanitity}
                        onChange={handleBatchFormChange}
                        placeholder="Number of birds"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Initial Weight (g)</FormLabel>
                      <Input
                        type="number"
                        name="initWeight"
                        value={batchForm.initWeight}
                        onChange={handleBatchFormChange}
                        placeholder="Average weight in grams"
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAddBatchClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                onClick={handleAddBatchSubmit}
                isLoading={addBatchMutation.isLoading}
                loadingText="Creating..."
              >
                Create Batch
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerBatchesPage;
