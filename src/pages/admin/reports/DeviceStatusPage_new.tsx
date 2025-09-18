import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  IconButton,
  Tooltip,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon } from '@chakra-ui/icons';

interface DeviceMetrics {
  total_devices: number;
  active_devices: number;
  offline_devices: number;
  maintenance_devices: number;
  avg_uptime: number;
  total_readings_today: number;
  critical_alerts: number;
}

interface DeviceAlert {
  id: number;
  device_id: string;
  device_name: string;
  farm_name: string;
  alert_type: string;
  message: string;
  timestamp: string;
  status: string;
}

export default function DeviceStatusPage() {
  const [deviceMetrics, setDeviceMetrics] = useState<DeviceMetrics | null>(null);
  const [deviceAlerts, setDeviceAlerts] = useState<DeviceAlert[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('24_hours');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    fetchDeviceData();
  }, [selectedPeriod]);

  const fetchDeviceData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data from the backend
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/reports/device-status/?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDeviceMetrics(result.device_metrics || null);
        setDeviceAlerts(result.device_alerts || []);
      } else {
        // If no real data available, keep it empty
        setDeviceMetrics(null);
        setDeviceAlerts([]);
        if (response.status === 404) {
          setError('No device status data available');
        } else {
          setError('Unable to fetch device status data');
        }
      }
    } catch (error) {
      console.error('Error fetching device data:', error);
      setDeviceMetrics(null);
      setDeviceAlerts([]);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDeviceData();
  };

  const handleExportReport = () => {
    toast({
      title: 'Export Started',
      description: 'Device status report is being generated...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (error) {
    return (
      <Box p={6}>
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>No Device Data Available</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p={6}>
        <Center py={10}>
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading device status...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header with Controls */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading as="h2" size="lg" color={headingColor} mb={2}>
              Device Status & Monitoring
            </Heading>
            <Text color={textColor}>
              Real-time IoT device status and health monitoring
            </Text>
          </Box>
          <HStack spacing={4} wrap="wrap">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              w="200px"
              variant="filled"
              bg={cardBg}
            >
              <option value="24_hours">Last 24 Hours</option>
              <option value="7_days">Last 7 Days</option>
              <option value="30_days">Last 30 Days</option>
            </Select>
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="blue"
              variant="outline"
              onClick={handleRefresh}
              isLoading={isLoading}
            >
              Refresh
            </Button>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={handleExportReport}
              isDisabled={!deviceMetrics}
            >
              Export Report
            </Button>
          </HStack>
        </Flex>

        {/* Device Statistics */}
        {deviceMetrics ? (
          <SimpleGrid columns={{ base: 2, md: 4, lg: 7 }} spacing={4}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Devices</StatLabel>
                  <StatNumber fontSize="lg">{deviceMetrics.total_devices}</StatNumber>
                  <StatHelpText>
                    ↗ All registered
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Devices</StatLabel>
                  <StatNumber fontSize="lg" color="green.500">
                    {deviceMetrics.active_devices}
                  </StatNumber>
                  <StatHelpText>
                    Online and reporting
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Offline Devices</StatLabel>
                  <StatNumber fontSize="lg" color="red.500">
                    {deviceMetrics.offline_devices}
                  </StatNumber>
                  <StatHelpText>
                    ↘ Need attention
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Maintenance</StatLabel>
                  <StatNumber fontSize="lg" color="orange.500">
                    {deviceMetrics.maintenance_devices || 0}
                  </StatNumber>
                  <StatHelpText>
                    Under maintenance
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Avg Uptime</StatLabel>
                  <StatNumber fontSize="lg">{deviceMetrics.avg_uptime?.toFixed(1) || '0'}%</StatNumber>
                  <StatHelpText>
                    ↗ System reliability
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Readings Today</StatLabel>
                  <StatNumber fontSize="lg">{deviceMetrics.total_readings_today?.toLocaleString() || '0'}</StatNumber>
                  <StatHelpText>
                    ↗ Data points
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Critical Alerts</StatLabel>
                  <StatNumber fontSize="lg" color={deviceMetrics.critical_alerts > 0 ? "red.500" : "green.500"}>
                    {deviceMetrics.critical_alerts || 0}
                  </StatNumber>
                  <StatHelpText>
                    <Badge colorScheme={deviceMetrics.critical_alerts > 0 ? "red" : "green"}>
                      {deviceMetrics.critical_alerts > 0 ? "Action needed" : "All clear"}
                    </Badge>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>No device metrics available for the selected period.</Text>
          </Alert>
        )}

        {/* Device Alerts */}
        {deviceAlerts.length > 0 ? (
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">Recent Device Alerts</Heading>
                  <Text fontSize="sm" color={textColor}>
                    Latest alerts and notifications from devices
                  </Text>
                </Box>
                <Badge colorScheme="red" px={3} py={1}>
                  {deviceAlerts.filter(alert => alert.status === 'ACTIVE').length} Active
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Device</Th>
                      <Th>Farm</Th>
                      <Th>Type</Th>
                      <Th>Message</Th>
                      <Th>Time</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {deviceAlerts.map((alert) => (
                      <Tr key={alert.id}>
                        <Td fontWeight="medium">{alert.device_name}</Td>
                        <Td>{alert.farm_name}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              alert.alert_type === 'CRITICAL' ? 'red' :
                              alert.alert_type === 'WARNING' ? 'orange' : 'blue'
                            }
                          >
                            {alert.alert_type}
                          </Badge>
                        </Td>
                        <Td>{alert.message}</Td>
                        <Td fontSize="sm">{new Date(alert.timestamp).toLocaleString()}</Td>
                        <Td>
                          <Badge
                            colorScheme={alert.status === 'ACTIVE' ? 'red' : 'green'}
                          >
                            {alert.status}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>No device alerts for the selected period.</Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
}
