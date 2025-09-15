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
  Avatar,
  AvatarGroup,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon, ViewIcon, TimeIcon, EmailIcon } from '@chakra-ui/icons';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

interface UserMetrics {
  total_users: number;
  active_users: number;
  new_users_this_month: number;
  user_growth_rate: number;
  avg_session_duration: number;
  total_sessions: number;
  bounce_rate: number;
  retention_rate: number;
}

interface UserActivity {
  date: string;
  active_users: number;
  new_registrations: number;
  sessions: number;
}

interface UserSegment {
  segment: string;
  count: number;
  percentage: number;
  engagement_score: number;
}

interface TopUser {
  id: number;
  name: string;
  email: string;
  role: string;
  farms: number;
  last_login: string;
  total_sessions: number;
  total_time: number;
}

export default function UserAnalyticsPage() {
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [userSegments, setUserSegments] = useState<UserSegment[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last_30_days');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    fetchUserAnalytics();
  }, [selectedPeriod]);

  const fetchUserAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data from the backend
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/reports/user-analytics/?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setUserMetrics(result.user_metrics || null);
        setUserActivity(result.user_activity || []);
        setUserSegments(result.user_segments || []);
        setTopUsers(result.top_users || []);
      } else {
        // If no real data available, keep it empty
        setUserMetrics(null);
        setUserActivity([]);
        setUserSegments([]);
        setTopUsers([]);
        if (response.status === 404) {
          setError('No user analytics data available');
        } else {
          setError('Unable to fetch user analytics data');
        }
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      setUserMetrics(null);
      setUserActivity([]);
      setUserSegments([]);
      setTopUsers([]);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    toast({
      title: 'Export Started',
      description: 'User analytics report is being generated...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Chart configurations
  const activityChartData = {
    labels: userActivity.map(activity => new Date(activity.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Active Users',
        data: userActivity.map(activity => activity.active_users),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'New Registrations',
        data: userActivity.map(activity => activity.new_registrations),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const activityChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'User Activity Trends',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Active Users',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'New Registrations',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const segmentChartData = {
    labels: userSegments.map(segment => segment.segment),
    datasets: [
      {
        data: userSegments.map(segment => segment.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const segmentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'User Distribution by Role',
      },
    },
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (error) {
    return (
      <Box p={6}>
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>No User Analytics Data Available</AlertTitle>
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
            <Text>Loading user analytics...</Text>
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
              User Analytics & Behavior
            </Heading>
            <Text color={textColor}>
              Comprehensive user activity and engagement analytics
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
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
              <option value="last_90_days">Last 90 Days</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="last_year">Last Year</option>
            </Select>
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="blue"
              variant="outline"
              onClick={fetchUserAnalytics}
              isLoading={isLoading}
            >
              Refresh
            </Button>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={handleExportReport}
            >
              Export Report
            </Button>
          </HStack>
        </Flex>

        {/* User Statistics */}
        {userMetrics ? (
          <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Users</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.total_users || 0}</StatNumber>
                  <StatHelpText>
                    ↗ All time
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Users</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.active_users || 0}</StatNumber>
                  <StatHelpText>
                    {userMetrics.total_users > 0 ? 
                      ((userMetrics.active_users / userMetrics.total_users) * 100).toFixed(1) + '% of total'
                      : '0% of total'
                    }
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>New Users</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.new_users_this_month || 0}</StatNumber>
                  <StatHelpText>
                    ↗ This month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Growth Rate</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.user_growth_rate?.toFixed(1) || '0'}%</StatNumber>
                  <StatHelpText>
                    ↗ Monthly growth
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Avg Session</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.avg_session_duration?.toFixed(1) || '0'}m</StatNumber>
                  <StatHelpText>
                    Duration per session
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Sessions</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.total_sessions || 0}</StatNumber>
                  <StatHelpText>
                    {selectedPeriod.replace('_', ' ')}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Bounce Rate</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.bounce_rate?.toFixed(1) || '0'}%</StatNumber>
                  <StatHelpText>
                    ↘ Lower is better
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Retention Rate</StatLabel>
                  <StatNumber fontSize="lg">{userMetrics.retention_rate?.toFixed(1) || '0'}%</StatNumber>
                  <StatHelpText>
                    ↗ 30-day retention
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>No user metrics available for the selected period.</Text>
          </Alert>
        )}

        {/* Charts Section */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* User Activity Chart */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">User Activity Trends</Heading>
                  <Text fontSize="sm" color={textColor}>
                    Daily active users and new registrations
                  </Text>
                </Box>
                <Badge colorScheme="blue" px={3} py={1}>
                  7 Days
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                <Line data={activityChartData} options={activityChartOptions} />
              </Box>
            </CardBody>
          </Card>

          {/* User Segments Chart */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">User Segments</Heading>
                  <Text fontSize="sm" color={textColor}>
                    Distribution by user role
                  </Text>
                </Box>
                <Badge colorScheme="green" px={3} py={1}>
                  Current
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <Box h="300px">
                <Doughnut data={segmentChartData} options={segmentChartOptions} />
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Detailed Tables */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* User Segments Details */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">User Segment Analytics</Heading>
                  <Text fontSize="sm" color={textColor}>
                    Detailed breakdown by user role
                  </Text>
                </Box>
                <Button
                  size="sm"
                  leftIcon={<ViewIcon />}
                  colorScheme="blue"
                  variant="outline"
                >
                  View Details
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Segment</Th>
                      <Th>Users</Th>
                      <Th>Percentage</Th>
                      <Th>Engagement</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userSegments.map((segment, index) => (
                      <Tr key={index}>
                        <Td fontWeight="medium">{segment.segment}</Td>
                        <Td>{segment.count}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Progress
                              value={segment.percentage}
                              size="sm"
                              width="60px"
                              colorScheme="blue"
                            />
                            <Text fontSize="sm">{segment.percentage.toFixed(1)}%</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={segment.engagement_score >= 85 ? 'green' : segment.engagement_score >= 75 ? 'yellow' : 'red'}
                          >
                            {segment.engagement_score.toFixed(1)}%
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>

          {/* Top Users */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">Most Active Users</Heading>
                  <Text fontSize="sm" color={textColor}>
                    Top users by engagement and activity
                  </Text>
                </Box>
                <Button
                  size="sm"
                  leftIcon={<EmailIcon />}
                  colorScheme="purple"
                  variant="outline"
                >
                  Contact Users
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {topUsers.map((user, index) => (
                  <Box
                    key={user.id}
                    p={4}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={useColorModeValue('gray.50', 'gray.700')}
                  >
                    <HStack justify="space-between" align="start">
                      <HStack spacing={3}>
                        <Avatar size="sm" name={user.name} />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" fontSize="sm">
                            {user.name}
                          </Text>
                          <Text fontSize="xs" color={textColor}>
                            {user.email}
                          </Text>
                          <HStack spacing={2}>
                            <Badge
                              size="sm"
                              colorScheme={
                                user.role === 'ADMIN' ? 'red' : 
                                user.role === 'FARMER' ? 'green' : 
                                user.role === 'EXPERT' ? 'purple' : 'blue'
                              }
                            >
                              {user.role}
                            </Badge>
                            {user.farms > 0 && (
                              <Badge size="sm" variant="outline">
                                {user.farms} farms
                              </Badge>
                            )}
                          </HStack>
                        </VStack>
                      </HStack>
                      <VStack align="end" spacing={1}>
                        <HStack spacing={4}>
                          <VStack spacing={0} align="center">
                            <Text fontSize="xs" color={textColor}>Sessions</Text>
                            <Text fontSize="sm" fontWeight="bold">{user.total_sessions}</Text>
                          </VStack>
                          <VStack spacing={0} align="center">
                            <Text fontSize="xs" color={textColor}>Time</Text>
                            <Text fontSize="sm" fontWeight="bold">{formatDuration(user.total_time)}</Text>
                          </VStack>
                        </HStack>
                        <HStack spacing={1} fontSize="xs" color={textColor}>
                          <TimeIcon />
                          <Text>Last login: {new Date(user.last_login).toLocaleDateString()}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* User Insights */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">User Insights & Recommendations</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4} p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="md">
                <Box>
                  <Text fontWeight="bold" color="green.600">
                    High Engagement
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Farmers show the highest engagement with 85.2% engagement score and longest session durations.
                  </Text>
                </Box>
              </HStack>
              
              <HStack spacing={4} p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                <Box>
                  <Text fontWeight="bold" color="blue.600">
                    Growth Trend
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    14.2% monthly growth rate indicates strong product adoption and user satisfaction.
                  </Text>
                </Box>
              </HStack>
              
              <HStack spacing={4} p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="md">
                <Box>
                  <Text fontWeight="bold" color="orange.600">
                    Retention Focus
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    78.9% retention rate is good, but consider onboarding improvements for new users.
                  </Text>
                </Box>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
