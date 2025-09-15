import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Button,
  Alert,
  AlertIcon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  useToast,
  Spinner,
  Code,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  SearchIcon,
  DownloadIcon,
  WarningIcon,
  InfoIcon,
  TimeIcon,
  ViewIcon,
  DeleteIcon,
  RepeatIcon,
} from '@chakra-ui/icons';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  module: string;
  user?: string;
  ip_address?: string;
  details?: string;
}

interface SystemMetrics {
  totalLogs: number;
  errorsToday: number;
  warningsToday: number;
  criticalIssues: number;
  diskUsage: number;
  memoryUsage: number;
}

const SystemLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalLogs: 0,
    errorsToday: 0,
    warningsToday: 0,
    criticalIssues: 0,
    diskUsage: 0,
    memoryUsage: 0,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchLogs();
    fetchMetrics();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, selectedLevel, searchTerm]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      // Mock log data - in real implementation, fetch from API
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          level: 'ERROR',
          message: 'Database connection failed',
          module: 'django.db',
          user: 'system',
          ip_address: '127.0.0.1',
          details: 'Connection to database "smartkuku" failed. Check database server status.'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          level: 'WARNING',
          message: 'High memory usage detected',
          module: 'system.monitor',
          user: 'monitor',
          ip_address: '127.0.0.1',
          details: 'Memory usage exceeded 85% threshold. Current usage: 87%'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          level: 'INFO',
          message: 'User login successful',
          module: 'accounts.auth',
          user: 'testuser',
          ip_address: '192.168.1.100',
          details: 'User testuser logged in successfully from 192.168.1.100'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          level: 'DEBUG',
          message: 'API request processed',
          module: 'api.views',
          user: 'testuser',
          ip_address: '192.168.1.100',
          details: 'GET /api/v1/farms/ - Response: 200 OK - Duration: 45ms'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          level: 'CRITICAL',
          message: 'Sensor data collection failure',
          module: 'sensors.collector',
          user: 'system',
          ip_address: '127.0.0.1',
          details: 'Failed to collect data from 3 sensors. Check sensor connectivity.'
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load system logs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Mock metrics data
      setMetrics({
        totalLogs: 1247,
        errorsToday: 12,
        warningsToday: 34,
        criticalIssues: 2,
        diskUsage: 67,
        memoryUsage: 72,
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredLogs(filtered);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'red';
      case 'ERROR': return 'red';
      case 'WARNING': return 'orange';
      case 'INFO': return 'blue';
      case 'DEBUG': return 'gray';
      default: return 'gray';
    }
  };

  const handleLogClick = (log: LogEntry) => {
    setSelectedLog(log);
    onOpen();
  };

  const handleClearLogs = async () => {
    try {
      // In real implementation, call API to clear logs
      setLogs([]);
      toast({
        title: 'Success',
        description: 'All logs have been cleared',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear logs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Module', 'Message', 'User', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        log.module,
        `"${log.message}"`,
        log.user || '',
        log.ip_address || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Logs have been exported to CSV file',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="md">System Logs</Heading>
              <Text color="gray.600" fontSize="sm">
                Monitor system activities, errors, and audit trails
              </Text>
            </VStack>
            <HStack spacing={3}>
              <Button
                variant="outline"
                onClick={fetchLogs}
                leftIcon={<RepeatIcon />}
                size="sm"
                isLoading={isLoading}
              >
                Refresh
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleExportLogs}
                leftIcon={<DownloadIcon />}
                size="sm"
              >
                Export CSV
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                onClick={handleClearLogs}
                leftIcon={<DeleteIcon />}
                size="sm"
              >
                Clear Logs
              </Button>
            </HStack>
          </HStack>
        </Box>

        {/* Core Aims Explanation */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <HStack>
              <InfoIcon color="orange.500" />
              <Heading size="sm">System Logs - Core Aims</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text fontSize="sm">
                <strong>Primary Purpose:</strong> Comprehensive logging and monitoring system for tracking all system activities, 
                errors, user actions, and security events across the Smart Kuku platform.
              </Text>
              <Divider />
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold">Key Functions & Benefits:</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="red.600">Error Tracking & Debugging</Text>
                    <Text fontSize="xs">
                      • Real-time error monitoring and alerting<br/>
                      • Stack trace analysis and error categorization<br/>
                      • Performance bottleneck identification<br/>
                      • System failure pattern analysis
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="blue.600">Security & Audit Trails</Text>
                    <Text fontSize="xs">
                      • User authentication and authorization logs<br/>
                      • Admin action tracking and accountability<br/>
                      • Suspicious activity detection<br/>
                      • Compliance reporting and data integrity
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="green.600">System Monitoring</Text>
                    <Text fontSize="xs">
                      • Database connection and query monitoring<br/>
                      • API request/response tracking<br/>
                      • Sensor data collection monitoring<br/>
                      • Resource usage and performance metrics
                    </Text>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="purple.600">Operational Intelligence</Text>
                    <Text fontSize="xs">
                      • System health status and trends<br/>
                      • User behavior pattern analysis<br/>
                      • Feature usage statistics<br/>
                      • Proactive issue prevention
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* System Metrics */}
        <SimpleGrid columns={{ base: 2, md: 6 }} spacing={4}>
          <Stat>
            <StatLabel>Total Logs</StatLabel>
            <StatNumber>{metrics.totalLogs.toLocaleString()}</StatNumber>
            <StatHelpText>All time</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Errors Today</StatLabel>
            <StatNumber color="red.500">{metrics.errorsToday}</StatNumber>
            <StatHelpText>Last 24h</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Warnings Today</StatLabel>
            <StatNumber color="orange.500">{metrics.warningsToday}</StatNumber>
            <StatHelpText>Last 24h</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Critical Issues</StatLabel>
            <StatNumber color="red.600">{metrics.criticalIssues}</StatNumber>
            <StatHelpText>Active</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Disk Usage</StatLabel>
            <StatNumber>{metrics.diskUsage}%</StatNumber>
            <StatHelpText>Storage</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Memory Usage</StatLabel>
            <StatNumber>{metrics.memoryUsage}%</StatNumber>
            <StatHelpText>RAM</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Filters */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <Flex gap={4} align="center" wrap="wrap">
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                w="200px"
              >
                <option value="ALL">All Levels</option>
                <option value="CRITICAL">Critical</option>
                <option value="ERROR">Error</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
                <option value="DEBUG">Debug</option>
              </Select>
              
              <InputGroup maxW="300px">
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              
              <Text fontSize="sm" color="gray.600">
                Showing {filteredLogs.length} of {logs.length} logs
              </Text>
            </Flex>
          </CardBody>
        </Card>

        {/* Logs Table */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardBody p={0}>
            {isLoading ? (
              <Box p={6} textAlign="center">
                <Spinner size="lg" />
                <Text mt={4}>Loading logs...</Text>
              </Box>
            ) : (
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Timestamp</Th>
                      <Th>Level</Th>
                      <Th>Module</Th>
                      <Th>Message</Th>
                      <Th>User</Th>
                      <Th>IP Address</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredLogs.map((log) => (
                      <Tr key={log.id} _hover={{ bg: useColorModeValue('gray.50', 'gray.700') }}>
                        <Td fontSize="xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </Td>
                        <Td>
                          <Badge colorScheme={getLevelColor(log.level)} size="sm">
                            {log.level}
                          </Badge>
                        </Td>
                        <Td fontSize="xs">
                          <Code>{log.module}</Code>
                        </Td>
                        <Td fontSize="sm" maxW="300px" isTruncated>
                          {log.message}
                        </Td>
                        <Td fontSize="xs">{log.user || '-'}</Td>
                        <Td fontSize="xs">{log.ip_address || '-'}</Td>
                        <Td>
                          <Button
                            size="xs"
                            variant="ghost"
                            leftIcon={<ViewIcon />}
                            onClick={() => handleLogClick(log)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>

        {/* Log Detail Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Log Entry Details</ModalHeader>
            <ModalBody>
              {selectedLog && (
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">Timestamp</Text>
                      <Text fontSize="sm">{new Date(selectedLog.timestamp).toLocaleString()}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">Level</Text>
                      <Badge colorScheme={getLevelColor(selectedLog.level)}>
                        {selectedLog.level}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">Module</Text>
                      <Code fontSize="sm">{selectedLog.module}</Code>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">User</Text>
                      <Text fontSize="sm">{selectedLog.user || 'System'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">IP Address</Text>
                      <Text fontSize="sm">{selectedLog.ip_address || 'N/A'}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold">Log ID</Text>
                      <Code fontSize="sm">{selectedLog.id}</Code>
                    </Box>
                  </SimpleGrid>
                  
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>Message</Text>
                    <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                      <Text fontSize="sm">{selectedLog.message}</Text>
                    </Box>
                  </Box>
                  
                  {selectedLog.details && (
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" mb={2}>Details</Text>
                      <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                        <Text fontSize="sm" whiteSpace="pre-wrap">{selectedLog.details}</Text>
                      </Box>
                    </Box>
                  )}
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default SystemLogsPage;
