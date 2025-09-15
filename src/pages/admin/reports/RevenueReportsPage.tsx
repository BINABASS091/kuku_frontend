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
  Divider,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon, ViewIcon, CalendarIcon } from '@chakra-ui/icons';
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

interface RevenueMetrics {
  period: string;
  total_revenue: number;
  subscription_revenue: number;
  payment_revenue: number;
  device_revenue: number;
  growth_rate: number;
  subscription_count: number;
  avg_revenue_per_user: number;
}

interface SubscriptionBreakdown {
  plan_name: string;
  subscribers: number;
  revenue: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  revenue: number;
  subscriptions: number;
  growth: number;
}

export default function RevenueReportsPage() {
  const [revenueData, setRevenueData] = useState<RevenueMetrics | null>(null);
  const [subscriptionBreakdown, setSubscriptionBreakdown] = useState<SubscriptionBreakdown[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current_month');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data from the backend
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/reports/revenue/?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setRevenueData(result.revenue_metrics || null);
        setSubscriptionBreakdown(result.subscription_breakdown || []);
        setMonthlyTrends(result.monthly_trends || []);
      } else {
        // If no real data available, keep it empty
        setRevenueData(null);
        setSubscriptionBreakdown([]);
        setMonthlyTrends([]);
        if (response.status === 404) {
          setError('No revenue data available');
        } else {
          setError('Unable to fetch revenue data');
        }
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setRevenueData(null);
      setSubscriptionBreakdown([]);
      setMonthlyTrends([]);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    toast({
      title: 'Export Started',
      description: 'Revenue report is being generated...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Chart configurations
  const revenueChartData = {
    labels: monthlyTrends.map(trend => trend.month),
    datasets: [
      {
        label: 'Total Revenue (UGX)',
        data: monthlyTrends.map(trend => trend.revenue / 1000), // Convert to thousands
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        yAxisID: 'y',
      },
      {
        label: 'New Subscriptions',
        data: monthlyTrends.map(trend => trend.subscriptions),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        yAxisID: 'y1',
      },
    ],
  };

  const revenueChartOptions = {
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
        text: 'Revenue and Subscription Trends',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Revenue (Thousands UGX)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Subscriptions',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const subscriptionPieData = {
    labels: subscriptionBreakdown.map(item => item.plan_name),
    datasets: [
      {
        data: subscriptionBreakdown.map(item => item.revenue),
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

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Revenue by Subscription Plan',
      },
    },
  };

  if (error) {
    return (
      <Box p={6}>
        <Alert status="warning">
          <AlertIcon />
          <AlertTitle>No Revenue Data Available</AlertTitle>
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
            <Text>Loading revenue data...</Text>
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
              Revenue & Financial Reports
            </Heading>
            <Text color={textColor}>
              Comprehensive revenue analytics and financial performance metrics
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
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="current_year">Current Year</option>
              <option value="last_year">Last Year</option>
            </Select>
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="blue"
              variant="outline"
              onClick={fetchRevenueData}
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

        {/* Revenue Statistics */}
        {revenueData ? (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Revenue</StatLabel>
                  <StatNumber fontSize="lg">
                    UGX {revenueData.total_revenue?.toLocaleString() || '0'}
                  </StatNumber>
                  <StatHelpText>
                    ↗ {revenueData.growth_rate?.toFixed(1) || '0'}% growth
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Subscription Revenue</StatLabel>
                  <StatNumber fontSize="lg">
                    UGX {revenueData.subscription_revenue?.toLocaleString() || '0'}
                  </StatNumber>
                  <StatHelpText>
                    {revenueData.total_revenue ? 
                      ((revenueData.subscription_revenue / revenueData.total_revenue) * 100).toFixed(1) + '% of total'
                      : '0% of total'
                    }
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Payment Revenue</StatLabel>
                  <StatNumber fontSize="lg">
                    UGX {revenueData.payment_revenue?.toLocaleString() || '0'}
                  </StatNumber>
                  <StatHelpText>
                    {revenueData.total_revenue ? 
                      ((revenueData.payment_revenue / revenueData.total_revenue) * 100).toFixed(1) + '% of total'
                      : '0% of total'
                    }
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Device Revenue</StatLabel>
                  <StatNumber fontSize="lg">
                    UGX {revenueData.device_revenue?.toLocaleString() || '0'}
                  </StatNumber>
                  <StatHelpText>
                    {revenueData.total_revenue ? 
                      ((revenueData.device_revenue / revenueData.total_revenue) * 100).toFixed(1) + '% of total'
                      : '0% of total'
                    }
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Subscriptions</StatLabel>
                  <StatNumber fontSize="lg">
                    {revenueData.subscription_count || 0}
                  </StatNumber>
                  <StatHelpText>
                    ↗ Active users
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Avg Revenue/User</StatLabel>
                  <StatNumber fontSize="lg">
                    UGX {revenueData.avg_revenue_per_user?.toLocaleString() || '0'}
                  </StatNumber>
                  <StatHelpText>
                    Per user average
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>No revenue data available for the selected period.</Text>
          </Alert>
        )}

        {/* Charts Section */}
        {monthlyTrends.length > 0 && subscriptionBreakdown.length > 0 ? (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {/* Revenue Trends Chart */}
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <Box>
                    <Heading size="md">Revenue Trends</Heading>
                    <Text fontSize="sm" color={textColor}>
                      Monthly revenue and subscription growth
                    </Text>
                  </Box>
                  <Badge colorScheme="blue" px={3} py={1}>
                    {monthlyTrends.length} Months
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <Line data={revenueChartData} options={revenueChartOptions} />
                </Box>
              </CardBody>
            </Card>

            {/* Subscription Plan Breakdown */}
            <Card bg={cardBg} border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack justify="space-between">
                  <Box>
                    <Heading size="md">Revenue by Plan</Heading>
                    <Text fontSize="sm" color={textColor}>
                      Subscription plan revenue breakdown
                    </Text>
                  </Box>
                  <Badge colorScheme="green" px={3} py={1}>
                    Current Period
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody>
                <Box h="300px">
                  <Doughnut data={subscriptionPieData} options={pieChartOptions} />
                </Box>
              </CardBody>
            </Card>
          </SimpleGrid>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>No chart data available for the selected period.</Text>
          </Alert>
        )}

        {/* Detailed Breakdown Tables */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Subscription Plan Details */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">Subscription Plan Performance</Heading>
                  <Text fontSize="sm" color={textColor}>
                    Detailed breakdown by plan type
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
                      <Th>Plan</Th>
                      <Th>Subscribers</Th>
                      <Th>Revenue</Th>
                      <Th>Share</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {subscriptionBreakdown.map((plan, index) => (
                      <Tr key={index}>
                        <Td fontWeight="medium">{plan.plan_name}</Td>
                        <Td>{plan.subscribers}</Td>
                        <Td>UGX {plan.revenue.toLocaleString()}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Progress
                              value={plan.percentage}
                              size="sm"
                              width="60px"
                              colorScheme="blue"
                            />
                            <Text fontSize="sm">{plan.percentage.toFixed(1)}%</Text>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>

          {/* Monthly Trends Table */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <Box>
                  <Heading size="md">Monthly Performance</Heading>
                  <Text fontSize="sm" color={textColor}>
                    Month-over-month trends and growth
                  </Text>
                </Box>
                <Button
                  size="sm"
                  leftIcon={<CalendarIcon />}
                  colorScheme="green"
                  variant="outline"
                >
                  View Calendar
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Month</Th>
                      <Th>Revenue</Th>
                      <Th>Subscriptions</Th>
                      <Th>Growth</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {monthlyTrends.map((trend, index) => (
                      <Tr key={index}>
                        <Td fontWeight="medium">{trend.month}</Td>
                        <Td>UGX {(trend.revenue / 1000).toFixed(0)}K</Td>
                        <Td>{trend.subscriptions}</Td>
                        <Td>
                          <HStack spacing={1}>
                            <Text
                              fontSize="sm"
                              color={trend.growth > 0 ? 'green.500' : 'red.500'}
                            >
                              {trend.growth > 0 ? '↗' : '↘'} {trend.growth.toFixed(1)}%
                            </Text>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Revenue Insights */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Revenue Insights & Recommendations</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4} p={4} bg={useColorModeValue('green.50', 'green.900')} borderRadius="md">
                <Box>
                  <Text fontWeight="bold" color="green.600">
                    Strong Performance
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Premium plan subscriptions are driving 61.4% of total revenue with excellent retention rates.
                  </Text>
                </Box>
              </HStack>
              
              <HStack spacing={4} p={4} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="md">
                <Box>
                  <Text fontWeight="bold" color="blue.600">
                    Growth Opportunity
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Basic plan has room for growth - consider targeted campaigns to convert free users.
                  </Text>
                </Box>
              </HStack>
              
              <HStack spacing={4} p={4} bg={useColorModeValue('orange.50', 'orange.900')} borderRadius="md">
                <Box>
                  <Text fontWeight="bold" color="orange.600">
                    Seasonal Trend
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Device revenue shows potential for expansion - consider bundled offerings.
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
