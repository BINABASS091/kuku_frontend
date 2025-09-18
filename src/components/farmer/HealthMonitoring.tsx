import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  useColorModeValue,
  Icon,
  Button,
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Circle,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react';
import {
  FiHeart,
  FiAlertTriangle,
  FiCalendar,
  FiActivity,
  FiTrendingDown,
  FiShield,
  FiPlus,
  FiEye,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { format, addDays, subDays } from 'date-fns';
import SafeChartContainer from '../common/SafeChartContainer';

interface HealthAlert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  batchId: string;
  timestamp: string;
  status: 'active' | 'resolved';
}

interface VaccinationRecord {
  id: number;
  vaccine: string;
  date: string;
  nextDue: string;
  batch: string;
  status: 'completed' | 'scheduled' | 'overdue';
}

interface HealthMetric {
  date: string;
  mortality: number;
  morbidity: number;
  weight: number;
  temperature: number;
}

interface HealthMonitoringProps {
  farmId?: string;
  batchId?: string;
}

const HealthMonitoring: React.FC<HealthMonitoringProps> = ({ farmId, batchId }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedAlert, setSelectedAlert] = useState<HealthAlert | null>(null);

  // Mock health data - replace with real API calls
  const healthAlerts: HealthAlert[] = [
    {
      id: 1,
      type: 'critical',
      title: 'High Mortality Rate',
      description: 'Mortality rate in Batch A has exceeded 3% threshold',
      batchId: 'BATCH-A-001',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'active',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Temperature Fluctuation',
      description: 'Coop temperature has been unstable for 6 hours',
      batchId: 'BATCH-B-002',
      timestamp: '2024-01-15T08:15:00Z',
      status: 'active',
    },
    {
      id: 3,
      type: 'info',
      title: 'Vaccination Due',
      description: 'Newcastle vaccine due for Batch C in 2 days',
      batchId: 'BATCH-C-003',
      timestamp: '2024-01-15T06:00:00Z',
      status: 'active',
    },
  ];

  const vaccinationSchedule: VaccinationRecord[] = [
    {
      id: 1,
      vaccine: 'Newcastle Disease',
      date: '2024-01-10',
      nextDue: '2024-02-10',
      batch: 'BATCH-A-001',
      status: 'completed',
    },
    {
      id: 2,
      vaccine: 'Infectious Bronchitis',
      date: '2024-01-18',
      nextDue: '2024-02-18',
      batch: 'BATCH-B-002',
      status: 'scheduled',
    },
    {
      id: 3,
      vaccine: 'Avian Influenza',
      date: '2024-01-05',
      nextDue: '2024-01-15',
      batch: 'BATCH-C-003',
      status: 'overdue',
    },
  ];

  const healthMetrics: HealthMetric[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), -6 + i);
    return {
      date: format(date, 'MM/dd'),
      mortality: Math.random() * 2 + 0.5,
      morbidity: Math.random() * 5 + 2,
      weight: Math.random() * 100 + 1500,
      temperature: Math.random() * 5 + 22,
    };
  });

  const healthStats = {
    overallHealth: 87,
    mortalityRate: 1.2,
    activeAlerts: 3,
    upcomingVaccinations: 2,
    averageWeight: 1650,
    lastInspection: '2024-01-14',
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'red';
      case 'warning': return 'orange';
      case 'info': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'scheduled': return 'blue';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Health Overview Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Overall Health Score</StatLabel>
              <StatNumber color="green.500" fontSize="2xl">
                {healthStats.overallHealth}%
              </StatNumber>
              <StatHelpText>Excellent condition</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Mortality Rate</StatLabel>
              <StatNumber color="red.500" fontSize="2xl">
                {healthStats.mortalityRate}%
              </StatNumber>
              <StatHelpText>Within normal range</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Active Alerts</StatLabel>
              <StatNumber color="orange.500" fontSize="2xl">
                {healthStats.activeAlerts}
              </StatNumber>
              <StatHelpText>Requires attention</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Avg Weight</StatLabel>
              <StatNumber color="blue.500" fontSize="2xl">
                {healthStats.averageWeight}g
              </StatNumber>
              <StatHelpText>Growing well</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Tabs variant="enclosed" colorScheme="green">
        <TabList>
          <Tab>Health Alerts</Tab>
          <Tab>Vaccination Schedule</Tab>
          <Tab>Health Trends</Tab>
          <Tab>Inspection Log</Tab>
        </TabList>

        <TabPanels>
          {/* Health Alerts Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Current Health Alerts</Heading>
                <Button leftIcon={<FiPlus />} colorScheme="green" size="sm">
                  Add Alert
                </Button>
              </HStack>

              {healthAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  status={alert.type === 'critical' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}
                  borderRadius="md"
                  borderWidth="1px"
                >
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertDescription fontSize="sm">
                      {alert.description}
                      <Text as="span" color={textColor} ml={2}>
                        • {alert.batchId}
                      </Text>
                    </AlertDescription>
                    <HStack mt={2} spacing={2}>
                      <Badge colorScheme={getAlertColor(alert.type)} variant="subtle">
                        {alert.type.toUpperCase()}
                      </Badge>
                      <Text fontSize="xs" color={textColor}>
                        {format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm')}
                      </Text>
                    </HStack>
                  </Box>
                  <Button size="sm" variant="ghost" onClick={() => {
                    setSelectedAlert(alert);
                    onOpen();
                  }}>
                    <FiEye />
                  </Button>
                </Alert>
              ))}
            </VStack>
          </TabPanel>

          {/* Vaccination Schedule Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Vaccination Schedule</Heading>
                <Button leftIcon={<FiPlus />} colorScheme="blue" size="sm">
                  Schedule Vaccination
                </Button>
              </HStack>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Vaccine</Th>
                    <Th>Batch</Th>
                    <Th>Last Date</Th>
                    <Th>Next Due</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {vaccinationSchedule.map((vaccine) => (
                    <Tr key={vaccine.id}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">{vaccine.vaccine}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge variant="outline">{vaccine.batch}</Badge>
                      </Td>
                      <Td>{format(new Date(vaccine.date), 'MMM dd, yyyy')}</Td>
                      <Td>{format(new Date(vaccine.nextDue), 'MMM dd, yyyy')}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(vaccine.status)} variant="subtle">
                          {vaccine.status.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        <Button size="sm" variant="ghost">
                          Update
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>

          {/* Health Trends Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Health Trend Analysis</Heading>
              
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="sm">Mortality & Morbidity Trends</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="250px">
                      <SafeChartContainer minHeight={250}>
                        <LineChart data={healthMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
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
                    <Heading size="sm">Weight & Temperature</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="250px">
                      <SafeChartContainer minHeight={250}>
                        <AreaChart data={healthMetrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="weight"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            name="Weight (g)"
                          />
                        </AreaChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </TabPanel>

          {/* Inspection Log Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Inspection History</Heading>
                <Button leftIcon={<FiPlus />} colorScheme="purple" size="sm">
                  Record Inspection
                </Button>
              </HStack>

              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">Daily Health Check</Text>
                        <Text fontSize="sm" color={textColor}>
                          Last inspection: {format(new Date(healthStats.lastInspection), 'MMM dd, yyyy')}
                        </Text>
                      </VStack>
                      <Badge colorScheme="green">COMPLETED</Badge>
                    </HStack>
                    
                    <Text fontSize="sm">
                      Overall flock appears healthy. No signs of disease detected.
                      Feed consumption normal, water intake adequate.
                    </Text>
                    
                    <HStack spacing={4}>
                      <HStack>
                        <Circle size="8px" bg="green.500" />
                        <Text fontSize="sm">Behavior: Normal</Text>
                      </HStack>
                      <HStack>
                        <Circle size="8px" bg="green.500" />
                        <Text fontSize="sm">Appetite: Good</Text>
                      </HStack>
                      <HStack>
                        <Circle size="8px" bg="yellow.500" />
                        <Text fontSize="sm">Environment: Monitor temp</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Alert Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alert Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedAlert && (
              <VStack spacing={4} align="stretch">
                <Alert status={selectedAlert.type === 'critical' ? 'error' : 'warning'}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{selectedAlert.title}</AlertTitle>
                    <AlertDescription>{selectedAlert.description}</AlertDescription>
                  </Box>
                </Alert>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Batch ID</FormLabel>
                    <Input value={selectedAlert.batchId} readOnly />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select defaultValue={selectedAlert.status}>
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>Action Taken</FormLabel>
                  <Textarea placeholder="Describe actions taken to address this alert..." />
                </FormControl>
                
                <Button colorScheme="blue" w="full">
                  Update Alert
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default HealthMonitoring;
