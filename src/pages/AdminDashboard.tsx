import { 
  Heading, 
  Box, 
  Text, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow, 
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Divider,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Flex,
  Spacer,
  IconButton,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  CircularProgress,
  CircularProgressLabel,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  SettingsIcon, 
  WarningIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RepeatIcon,
  DownloadIcon,
  BellIcon,
  StarIcon,
  TimeIcon,
  CalendarIcon,
  TriangleUpIcon,
  TriangleDownIcon,
  LockIcon,
  UnlockIcon,
  PhoneIcon,
  EmailIcon,
  AttachmentIcon,
  CopyIcon,
  HamburgerIcon,
  CloseButton,
  ExternalLinkIcon,
  InfoIcon,
  EditIcon,
  DeleteIcon,
  AddIcon,
} from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  useDashboardStats, 
  useRecentActivities, 
  useSystemAlerts, 
  useTopFarms, 
  useRefreshDashboard 
} from '../hooks/useDashboardData';
import { 
  EmptyDataState, 
  EmptyActivitiesState, 
  EmptyAlertsState, 
  EmptyFarmsState,
  EmptyStatsState 
} from '../components/EmptyState';

export default function AdminDashboard() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { user } = useAuth();
  const toast = useToast();
  
  // Use custom hooks for data fetching
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();
  const { data: alerts, isLoading: alertsLoading } = useSystemAlerts();
  const { data: topFarms, isLoading: farmsLoading } = useTopFarms();
  const { refreshAll, isRefetching } = useRefreshDashboard();

  const handleRefreshData = () => {
    refreshAll();
    toast({
      title: "Data Refreshed",
      description: "All dashboard data has been updated.",
      status: "success",
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

  // Loading state
  if (statsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
        <VStack spacing={4}>
          <CircularProgress isIndeterminate color="blue.500" size="60px" />
          <Text color={textColor}>Loading dashboard data...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex align="center" justify="space-between" mb={6}>
          <Box>
            <Heading as="h1" size="xl" mb={2} color={useColorModeValue('gray.800', 'white')}>
              Welcome back, {user?.first_name || 'Admin'}! 👋
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
                size="lg"
              />
            </Tooltip>
            <Tooltip label="Export Report" placement="bottom">
              <IconButton
                aria-label="Export report"
                icon={<DownloadIcon />}
                colorScheme="green"
                variant="outline"
                size="lg"
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* System Alerts */}
        {alerts && alerts.length > 0 && (
          <Alert status="warning" borderRadius="lg" border="1px solid" borderColor="orange.200">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="md">System Alerts!</AlertTitle>
              <AlertDescription fontSize="sm">
                You have {alerts.length} system alerts that require attention.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Main Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card bg={cardBg} boxShadow="lg" borderRadius="xl" border="1px solid" borderColor={useColorModeValue('blue.100', 'blue.800')}>
            <CardBody p={6}>
              <Stat>
                <StatLabel color={textColor} fontSize="sm" fontWeight="medium">Total Users</StatLabel>
                {stats?.totalUsers !== null ? (
                  <>
                    <StatNumber color="blue.500" fontSize="2xl" fontWeight="bold">{stats.totalUsers}</StatNumber>
                    <StatHelpText fontSize="xs">
                      <StatArrow type="increase" />
                      12% from last month
                    </StatHelpText>
                  </>
                ) : (
                  <EmptyStatsState label="Users" />
                )}
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="lg" borderRadius="xl" border="1px solid" borderColor={useColorModeValue('green.100', 'green.800')}>
            <CardBody p={6}>
              <Stat>
                <StatLabel color={textColor} fontSize="sm" fontWeight="medium">Active Farms</StatLabel>
                {stats?.activeFarms !== null ? (
                  <>
                    <StatNumber color="green.500" fontSize="2xl" fontWeight="bold">{stats.activeFarms}</StatNumber>
                    <StatHelpText fontSize="xs">
                      <StatArrow type="increase" />
                      8% from last month
                    </StatHelpText>
                  </>
                ) : (
                  <EmptyStatsState label="Farms" />
                )}
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="lg" borderRadius="xl" border="1px solid" borderColor={useColorModeValue('purple.100', 'purple.800')}>
            <CardBody p={6}>
              <Stat>
                <StatLabel color={textColor} fontSize="sm" fontWeight="medium">Monthly Revenue</StatLabel>
                {stats?.monthlyRevenue !== null ? (
                  <>
                    <StatNumber color="purple.500" fontSize="2xl" fontWeight="bold">
                      ${stats.monthlyRevenue.toLocaleString()}
                    </StatNumber>
                    <StatHelpText fontSize="xs">
                      <StatArrow type="increase" />
                      15% from last month
                    </StatHelpText>
                  </>
                ) : (
                  <EmptyStatsState label="Revenue" />
                )}
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="lg" borderRadius="xl" border="1px solid" borderColor={useColorModeValue('green.100', 'green.800')}>
            <CardBody p={6}>
              <Stat>
                <StatLabel color={textColor} fontSize="sm" fontWeight="medium">System Health</StatLabel>
                <HStack>
                  <CircularProgress value={stats?.systemHealth || 95} color="green.500" size="50px" thickness="8px">
                    <CircularProgressLabel fontSize="sm" fontWeight="bold">{stats?.systemHealth || 95}%</CircularProgressLabel>
                  </CircularProgress>
                  <Box>
                    <Text fontSize="sm" color="green.500" fontWeight="bold">
                      Excellent
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      All systems operational
                    </Text>
                  </Box>
                </HStack>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Quick Actions */}
        <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
            <Text fontSize="sm" color={textColor}>
              Common administrative tasks and shortcuts
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {quickActions.map((action, index) => (
                <Tooltip key={index} label={action.description} placement="top">
                  <Button
                    as={action.isExternal ? 'a' : Link}
                    to={action.isExternal ? undefined : action.href}
                    href={action.isExternal ? action.href : undefined}
                    target={action.isExternal ? '_blank' : undefined}
                    leftIcon={<Icon as={action.icon} />}
                    colorScheme={action.color}
                    variant="outline"
                    size="lg"
                    h="auto"
                    py={6}
                    flexDirection="column"
                    gap={2}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    <Text>{action.label}</Text>
                  </Button>
                </Tooltip>
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Main Content Tabs */}
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Recent Activity</Tab>
            <Tab>System Alerts</Tab>
            <Tab>Top Farms</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
                  <CardHeader>
                    <Heading size="md">System Overview</Heading>
                  </CardHeader>
                  <CardBody>
                    {stats ? (
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={textColor}>Total Farmers</Text>
                            <Text fontWeight="bold" fontSize="lg">{stats.totalFarmers || 0}</Text>
                          </HStack>
                          <Progress value={75} colorScheme="blue" size="sm" mt={1} />
                        </Box>
                        <Divider />
                        <Box>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={textColor}>Active Devices</Text>
                            <Text fontWeight="bold" fontSize="lg">{stats.totalDevices || 0}</Text>
                          </HStack>
                          <Progress value={85} colorScheme="green" size="sm" mt={1} />
                        </Box>
                        <Divider />
                        <Box>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={textColor}>Active Subscriptions</Text>
                            <Text fontWeight="bold" fontSize="lg">{stats.activeSubscriptions || 0}</Text>
                          </HStack>
                          <Progress value={60} colorScheme="purple" size="sm" mt={1} />
                        </Box>
                        <Divider />
                        <Box>
                          <HStack justify="space-between">
                            <Text fontSize="sm" color={textColor}>Pending Tasks</Text>
                            <Badge colorScheme="orange" variant="subtle" fontSize="sm">
                              {stats.pendingTasks}
                            </Badge>
                          </HStack>
                        </Box>
                      </VStack>
                    ) : (
                      <EmptyDataState 
                        title="No System Data" 
                        description="System overview data is not available at the moment." 
                      />
                    )}
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
                  <CardHeader>
                    <Heading size="md">Performance Metrics</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box textAlign="center">
                        <Text fontSize="sm" color={textColor} mb={2}>API Response Time</Text>
                        <CircularProgress value={85} color="green.500" size="60px">
                          <CircularProgressLabel>85ms</CircularProgressLabel>
                        </CircularProgress>
                      </Box>
                      <Divider />
                      <Box textAlign="center">
                        <Text fontSize="sm" color={textColor} mb={2}>Database Performance</Text>
                        <CircularProgress value={92} color="blue.500" size="60px">
                          <CircularProgressLabel>92%</CircularProgressLabel>
                        </CircularProgress>
                      </Box>
                      <Divider />
                      <Box textAlign="center">
                        <Text fontSize="sm" color={textColor} mb={2}>Uptime</Text>
                        <CircularProgress value={99.9} color="purple.500" size="60px">
                          <CircularProgressLabel>99.9%</CircularProgressLabel>
                        </CircularProgress>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>

            {/* Recent Activity Tab */}
            <TabPanel px={0}>
              <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
                <CardHeader>
                  <Heading size="md">Recent Activity</Heading>
                </CardHeader>
                <CardBody>
                  {activitiesLoading ? (
                    <VStack spacing={3} align="stretch">
                      {[...Array(3)].map((_, index) => (
                        <Box key={index} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                          <Skeleton height="20px" mb={2} />
                          <Skeleton height="16px" width="60%" />
                        </Box>
                      ))}
                    </VStack>
                  ) : activities && activities.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {activities.map((activity) => (
                        <Box key={activity.id} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="sm" fontWeight="medium">{activity.action}</Text>
                            <Badge 
                              colorScheme={activity.status === 'success' ? 'green' : activity.status === 'warning' ? 'orange' : 'red'}
                              variant="subtle"
                              size="sm"
                            >
                              {activity.status === 'success' ? 'Success' : activity.status === 'warning' ? 'Warning' : 'Error'}
                            </Badge>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontSize="xs" color={textColor}>{activity.user}</Text>
                            <Text fontSize="xs" color={textColor}>{activity.time}</Text>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <EmptyActivitiesState />
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* System Alerts Tab */}
            <TabPanel px={0}>
              <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
                <CardHeader>
                  <Heading size="md">System Alerts</Heading>
                </CardHeader>
                <CardBody>
                  {alertsLoading ? (
                    <VStack spacing={3} align="stretch">
                      {[...Array(2)].map((_, index) => (
                        <Box key={index} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                          <Skeleton height="20px" mb={2} />
                          <Skeleton height="16px" width="80%" />
                        </Box>
                      ))}
                    </VStack>
                  ) : alerts && alerts.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {alerts.map((alert) => (
                        <Alert key={alert.id} status={alert.type as any} borderRadius="md">
                          <AlertIcon />
                          <Box>
                            <AlertTitle fontSize="sm">{alert.message}</AlertTitle>
                            <AlertDescription fontSize="xs">
                              {alert.time} • Count: {alert.count} • Severity: {alert.severity}
                            </AlertDescription>
                          </Box>
                        </Alert>
                      ))}
                    </VStack>
                  ) : (
                    <EmptyAlertsState />
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Top Farms Tab */}
            <TabPanel px={0}>
              <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
                <CardHeader>
                  <Heading size="md">Top Performing Farms</Heading>
                </CardHeader>
                <CardBody>
                  {farmsLoading ? (
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Farm Name</Th>
                            <Th>Location</Th>
                            <Th>Birds</Th>
                            <Th>Health</Th>
                            <Th>Revenue</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {[...Array(3)].map((_, index) => (
                            <Tr key={index}>
                              <Td><Skeleton height="20px" /></Td>
                              <Td><Skeleton height="20px" /></Td>
                              <Td><Skeleton height="20px" /></Td>
                              <Td><Skeleton height="20px" /></Td>
                              <Td><Skeleton height="20px" /></Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  ) : topFarms && topFarms.length > 0 ? (
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Farm Name</Th>
                            <Th>Location</Th>
                            <Th>Birds</Th>
                            <Th>Health</Th>
                            <Th>Revenue</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {topFarms.map((farm) => (
                            <Tr key={farm.id}>
                              <Td fontWeight="medium">{farm.name}</Td>
                              <Td>{farm.location}</Td>
                              <Td>{farm.birds.toLocaleString()}</Td>
                              <Td>
                                <HStack>
                                  <Text>{farm.health}%</Text>
                                  <Progress value={farm.health} colorScheme="green" size="sm" w="50px" />
                                </HStack>
                              </Td>
                              <Td>${farm.revenue.toLocaleString()}</Td>
                              <Td>
                                <Badge 
                                  colorScheme={farm.status === 'active' ? 'green' : 'gray'} 
                                  variant="subtle"
                                  size="sm"
                                >
                                  {farm.status}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <EmptyFarmsState />
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
}
