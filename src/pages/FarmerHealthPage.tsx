import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Icon,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Progress,
  Circle,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
} from '@chakra-ui/react';
import {
  FiHeart,
  FiActivity,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiThermometer,
  FiDroplet,
  FiEye,
  FiPlus,
  FiSettings,
  FiCalendar,
  FiDownload,
  FiFilter,
  FiSearch,
  FiBell,
  FiEdit,
  FiTrash2,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';
import SafeChartContainer from '../components/common/SafeChartContainer';
import { useAuth } from '../context/AuthContext';

// Mock data - in real app, this would come from API
const healthData = [
  { date: '2024-01-01', mortality: 0.5, morbidity: 2.1, weight: 1850, temperature: 39.2, vaccination: 85 },
  { date: '2024-01-02', mortality: 0.3, morbidity: 1.8, weight: 1870, temperature: 39.1, vaccination: 87 },
  { date: '2024-01-03', mortality: 0.7, morbidity: 2.4, weight: 1860, temperature: 39.4, vaccination: 89 },
  { date: '2024-01-04', mortality: 0.2, morbidity: 1.5, weight: 1880, temperature: 39.0, vaccination: 92 },
  { date: '2024-01-05', mortality: 0.4, morbidity: 1.9, weight: 1890, temperature: 39.2, vaccination: 94 },
  { date: '2024-01-06', mortality: 0.1, morbidity: 1.2, weight: 1900, temperature: 39.1, vaccination: 96 },
  { date: '2024-01-07', mortality: 0.3, morbidity: 1.6, weight: 1910, temperature: 39.0, vaccination: 98 },
];

const alertsData = [
  {
    id: 1,
    type: 'critical',
    title: 'High Mortality Rate - Batch B001',
    description: 'Mortality rate has exceeded 1% threshold in the past 24 hours',
    timestamp: '2024-01-07 14:30',
    batch: 'B001',
    status: 'active',
    priority: 'high',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Vaccination Due - Batch B003',
    description: 'Newcastle disease vaccination is due within 3 days',
    timestamp: '2024-01-07 09:15',
    batch: 'B003',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 3,
    type: 'info',
    title: 'Temperature Fluctuation - House H2',
    description: 'Temperature readings showing minor fluctuations',
    timestamp: '2024-01-07 07:45',
    batch: 'B002',
    status: 'monitoring',
    priority: 'low',
  },
  {
    id: 4,
    type: 'success',
    title: 'Health Check Completed - Batch B004',
    description: 'Weekly health assessment completed with excellent results',
    timestamp: '2024-01-06 16:20',
    batch: 'B004',
    status: 'resolved',
    priority: 'info',
  },
];

const reportsData = [
  {
    id: 1,
    title: 'Weekly Health Summary',
    period: 'Jan 1-7, 2024',
    type: 'summary',
    status: 'completed',
    createdAt: '2024-01-07',
    metrics: {
      averageMortality: 0.35,
      averageMorbidity: 1.78,
      averageWeight: 1880,
      vaccinationRate: 92,
    },
  },
  {
    id: 2,
    title: 'Vaccination Schedule Report',
    period: 'January 2024',
    type: 'vaccination',
    status: 'completed',
    createdAt: '2024-01-05',
    metrics: {
      scheduledVaccinations: 15,
      completedVaccinations: 13,
      pendingVaccinations: 2,
      complianceRate: 87,
    },
  },
  {
    id: 3,
    title: 'Mortality Analysis',
    period: 'Q4 2023',
    type: 'mortality',
    status: 'draft',
    createdAt: '2024-01-03',
    metrics: {
      totalDeaths: 45,
      averageRate: 0.42,
      mainCauses: ['Respiratory', 'Digestive', 'Other'],
      trend: 'decreasing',
    },
  },
];

const vaccinationSchedule = [
  {
    id: 1,
    vaccine: 'Newcastle Disease',
    batch: 'B001',
    dueDate: '2024-01-10',
    status: 'pending',
    type: 'primary',
    ageWeeks: 8,
  },
  {
    id: 2,
    vaccine: 'Infectious Bronchitis',
    batch: 'B002',
    dueDate: '2024-01-12',
    status: 'scheduled',
    type: 'booster',
    ageWeeks: 10,
  },
  {
    id: 3,
    vaccine: 'Avian Influenza',
    batch: 'B003',
    dueDate: '2024-01-15',
    status: 'pending',
    type: 'primary',
    ageWeeks: 12,
  },
  {
    id: 4,
    vaccine: 'Fowl Pox',
    batch: 'B001',
    dueDate: '2024-01-18',
    status: 'completed',
    type: 'primary',
    ageWeeks: 14,
  },
];

const FarmerHealthPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen: isAlertModalOpen, onOpen: onAlertModalOpen, onClose: onAlertModalClose } = useDisclosure();
  const { isOpen: isReportModalOpen, onOpen: onReportModalOpen, onClose: onReportModalClose } = useDisclosure();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Determine active tab based on URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/alerts')) return 1;
    if (path.includes('/reports')) return 2;
    return 0; // Default to overview
  };

  const handleTabChange = (index: number) => {
    const routes = ['/farmer/health', '/farmer/health/alerts', '/farmer/health/reports'];
    navigate(routes[index]);
  };

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert);
    onAlertModalOpen();
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'red';
      case 'warning': return 'orange';
      case 'info': return 'blue';
      case 'success': return 'green';
      default: return 'gray';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return FiAlertTriangle;
      case 'warning': return FiClock;
      case 'info': return FiBell;
      case 'success': return FiCheckCircle;
      default: return FiBell;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'red';
      case 'pending': return 'orange';
      case 'monitoring': return 'blue';
      case 'resolved': return 'green';
      default: return 'gray';
    }
  };

  const filteredAlerts = alertsData.filter(alert => {
    const statusMatch = filterStatus === 'all' || alert.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || alert.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Health Monitoring 🏥
          </Heading>
          <Text color={textColor}>
            Monitor your flock's health, manage vaccination schedules, and track health trends
          </Text>
        </Box>

        {/* Tabs */}
        <Tabs index={getActiveTab()} onChange={handleTabChange} variant="enclosed">
          <TabList>
            <Tab>
              <HStack>
                <Icon as={FiHeart} />
                <Text>Overview</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiAlertTriangle} />
                <Text>Alerts</Text>
                <Badge colorScheme="red" borderRadius="full">
                  {alertsData.filter(a => a.status === 'active').length}
                </Badge>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiTrendingUp} />
                <Text>Reports</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                {/* Health Summary Cards */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>
                          <HStack>
                            <Icon as={FiActivity} color="red.500" />
                            <Text>Mortality Rate</Text>
                          </HStack>
                        </StatLabel>
                        <StatNumber color="red.500">0.35%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="decrease" />
                          12% from last week
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>
                          <HStack>
                            <Icon as={FiThermometer} color="orange.500" />
                            <Text>Avg Temperature</Text>
                          </HStack>
                        </StatLabel>
                        <StatNumber color="orange.500">39.1°C</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          Normal range
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>
                          <HStack>
                            <Icon as={FiDroplet} color="blue.500" />
                            <Text>Vaccination Rate</Text>
                          </HStack>
                        </StatLabel>
                        <StatNumber color="blue.500">92%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          8% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>
                          <HStack>
                            <Icon as={FiCheckCircle} color="green.500" />
                            <Text>Avg Weight</Text>
                          </HStack>
                        </StatLabel>
                        <StatNumber color="green.500">1,880g</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          Target: 1,900g
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Health Trends Charts */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Mortality & Morbidity Trends</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <LineChart data={healthData} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="mortality" 
                              stroke="#EF4444" 
                              strokeWidth={2}
                              name="Mortality %" 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="morbidity" 
                              stroke="#F59E0B" 
                              strokeWidth={2}
                              name="Morbidity %" 
                            />
                          </LineChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Weight & Temperature</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <AreaChart data={healthData} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <RechartsTooltip />
                            <Legend />
                            <Area 
                              yAxisId="left"
                              type="monotone" 
                              dataKey="weight" 
                              stroke="#3B82F6" 
                              fill="#3B82F6"
                              fillOpacity={0.3}
                              name="Weight (g)" 
                            />
                            <Line 
                              yAxisId="right"
                              type="monotone" 
                              dataKey="temperature" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              name="Temperature (°C)" 
                            />
                          </AreaChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Vaccination Schedule */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Upcoming Vaccinations</Heading>
                      <Button leftIcon={<FiPlus />} colorScheme="blue" size="sm">
                        Schedule Vaccination
                      </Button>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Vaccine</Th>
                          <Th>Batch</Th>
                          <Th>Due Date</Th>
                          <Th>Age (Weeks)</Th>
                          <Th>Status</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {vaccinationSchedule.slice(0, 5).map((vaccination) => (
                          <Tr key={vaccination.id}>
                            <Td>
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">{vaccination.vaccine}</Text>
                                <Badge 
                                  size="sm" 
                                  colorScheme={vaccination.type === 'primary' ? 'blue' : 'green'}
                                >
                                  {vaccination.type}
                                </Badge>
                              </VStack>
                            </Td>
                            <Td>{vaccination.batch}</Td>
                            <Td>{vaccination.dueDate}</Td>
                            <Td>{vaccination.ageWeeks}</Td>
                            <Td>
                              <Badge colorScheme={getStatusColor(vaccination.status)}>
                                {vaccination.status}
                              </Badge>
                            </Td>
                            <Td>
                              <Menu>
                                <MenuButton as={Button} size="sm" variant="ghost">
                                  <Icon as={FiSettings} />
                                </MenuButton>
                                <MenuList>
                                  <MenuItem icon={<FiEye />}>View Details</MenuItem>
                                  <MenuItem icon={<FiEdit />}>Edit Schedule</MenuItem>
                                  <MenuItem icon={<FiCheckCircle />}>Mark Complete</MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Alerts Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                {/* Alert Filters */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <HStack spacing={4}>
                      <FormControl maxW="200px">
                        <FormLabel>Status</FormLabel>
                        <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="monitoring">Monitoring</option>
                          <option value="resolved">Resolved</option>
                        </Select>
                      </FormControl>
                      <FormControl maxW="200px">
                        <FormLabel>Priority</FormLabel>
                        <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                          <option value="all">All Priorities</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                          <option value="info">Info</option>
                        </Select>
                      </FormControl>
                      <Button leftIcon={<FiPlus />} colorScheme="blue">
                        Create Alert
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>

                {/* Alerts List */}
                <VStack spacing={4} align="stretch">
                  {filteredAlerts.map((alert) => (
                    <Card 
                      key={alert.id} 
                      bg={cardBg} 
                      borderWidth="1px" 
                      borderColor={borderColor}
                      cursor="pointer"
                      _hover={{ shadow: 'md' }}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <CardBody>
                        <HStack justify="space-between" align="start">
                          <HStack align="start" spacing={4}>
                            <Circle size="40px" bg={`${getAlertColor(alert.type)}.100`}>
                              <Icon as={getAlertIcon(alert.type)} color={`${getAlertColor(alert.type)}.500`} />
                            </Circle>
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Text fontWeight="bold">{alert.title}</Text>
                                <Badge colorScheme={getAlertColor(alert.priority)}>
                                  {alert.priority}
                                </Badge>
                              </HStack>
                              <Text color={textColor} fontSize="sm">
                                {alert.description}
                              </Text>
                              <HStack spacing={4} fontSize="xs" color={textColor}>
                                <Text>Batch: {alert.batch}</Text>
                                <Text>•</Text>
                                <Text>{alert.timestamp}</Text>
                              </HStack>
                            </VStack>
                          </HStack>
                          <Badge colorScheme={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </VStack>
            </TabPanel>

            {/* Reports Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                {/* Report Actions */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <HStack justify="space-between">
                      <Heading size="md">Health Reports</Heading>
                      <HStack>
                        <Button leftIcon={<FiDownload />} variant="outline">
                          Export All
                        </Button>
                        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onReportModalOpen}>
                          Generate Report
                        </Button>
                      </HStack>
                    </HStack>
                  </CardBody>
                </Card>

                {/* Reports List */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  {reportsData.map((report) => (
                    <Card key={report.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">{report.title}</Text>
                            <Text fontSize="sm" color={textColor}>{report.period}</Text>
                          </VStack>
                          <Badge colorScheme={report.status === 'completed' ? 'green' : 'orange'}>
                            {report.status}
                          </Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          {report.type === 'summary' && (
                            <SimpleGrid columns={2} spacing={3} w="full">
                              <Text fontSize="sm">Mortality: {report.metrics.averageMortality}%</Text>
                              <Text fontSize="sm">Morbidity: {report.metrics.averageMorbidity}%</Text>
                              <Text fontSize="sm">Weight: {report.metrics.averageWeight}g</Text>
                              <Text fontSize="sm">Vaccination: {report.metrics.vaccinationRate}%</Text>
                            </SimpleGrid>
                          )}
                          {report.type === 'vaccination' && (
                            <SimpleGrid columns={2} spacing={3} w="full">
                              <Text fontSize="sm">Scheduled: {report.metrics.scheduledVaccinations}</Text>
                              <Text fontSize="sm">Completed: {report.metrics.completedVaccinations}</Text>
                              <Text fontSize="sm">Pending: {report.metrics.pendingVaccinations}</Text>
                              <Text fontSize="sm">Compliance: {report.metrics.complianceRate}%</Text>
                            </SimpleGrid>
                          )}
                          {report.type === 'mortality' && (
                            <VStack align="start" spacing={2} w="full">
                              <Text fontSize="sm">Total Deaths: {report.metrics.totalDeaths}</Text>
                              <Text fontSize="sm">Average Rate: {report.metrics.averageRate}%</Text>
                              <Text fontSize="sm">Trend: {report.metrics.trend}</Text>
                            </VStack>
                          )}
                          <HStack justify="space-between" w="full" pt={2}>
                            <Text fontSize="xs" color={textColor}>
                              Created: {report.createdAt}
                            </Text>
                            <HStack>
                              <Button size="sm" variant="ghost" leftIcon={<FiEye />}>
                                View
                              </Button>
                              <Button size="sm" variant="ghost" leftIcon={<FiDownload />}>
                                Download
                              </Button>
                            </HStack>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Alert Detail Modal */}
        <Modal isOpen={isAlertModalOpen} onClose={onAlertModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <HStack>
                <Icon as={getAlertIcon(selectedAlert?.type)} color={`${getAlertColor(selectedAlert?.type)}.500`} />
                <Text>Alert Details</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedAlert && (
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>{selectedAlert.title}</Text>
                    <Text color={textColor}>{selectedAlert.description}</Text>
                  </Box>
                  <SimpleGrid columns={2} spacing={4} w="full">
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Batch</Text>
                      <Text>{selectedAlert.batch}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Priority</Text>
                      <Badge colorScheme={getAlertColor(selectedAlert.priority)}>
                        {selectedAlert.priority}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Status</Text>
                      <Badge colorScheme={getStatusColor(selectedAlert.status)}>
                        {selectedAlert.status}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Timestamp</Text>
                      <Text>{selectedAlert.timestamp}</Text>
                    </Box>
                  </SimpleGrid>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAlertModalClose}>
                Close
              </Button>
              <Button colorScheme="blue">
                Take Action
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Generate Report Modal */}
        <Modal isOpen={isReportModalOpen} onClose={onReportModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Generate Health Report</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Report Type</FormLabel>
                  <Select placeholder="Select report type">
                    <option value="summary">Health Summary</option>
                    <option value="vaccination">Vaccination Report</option>
                    <option value="mortality">Mortality Analysis</option>
                    <option value="custom">Custom Report</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Time Period</FormLabel>
                  <Select placeholder="Select time period">
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="custom">Custom Range</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Batches</FormLabel>
                  <Select placeholder="Select batches">
                    <option value="all">All Batches</option>
                    <option value="B001">Batch B001</option>
                    <option value="B002">Batch B002</option>
                    <option value="B003">Batch B003</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onReportModalClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">
                Generate Report
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerHealthPage;
