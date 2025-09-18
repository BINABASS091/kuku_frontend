import { useState, useEffect } from 'react';
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
  useToast,
  Spinner,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Progress,
  Divider,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { DownloadIcon, SearchIcon, CalendarIcon } from '@chakra-ui/icons';
import api from '../../../services/api';

type BillingReport = {
  period: string;
  total_revenue: number;
  subscription_revenue: number;
  payment_revenue: number;
  active_subscriptions: number;
  new_subscriptions: number;
  cancelled_subscriptions: number;
  average_subscription_value: number;
  payment_success_rate: number;
  top_subscription_types: Array<{
    name: string;
    count: number;
    revenue: number;
  }>;
};

type PaymentReport = {
  id: number;
  paymentID: number;
  farmer_name: string;
  subscription_plan: string;
  amount: number;
  status: string;
  payment_date: string;
  transaction_id?: string;
};

export default function BillingReportsPage() {
  const [reports, setReports] = useState<BillingReport[]>([]);
  const [payments, setPayments] = useState<PaymentReport[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current_month');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchReports();
    fetchPayments();
  }, [selectedPeriod]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/billing-reports/?period=${selectedPeriod}`);
      setReports([response.data]); // Backend returns single object, wrap in array
      setError(null);
    } catch (error) {
      console.error('Error fetching billing reports:', error);
      setError('Failed to load billing reports');
      // Mock data for demonstration
      setReports([{
        period: 'Current Month',
        total_revenue: 2500000,
        subscription_revenue: 2200000,
        payment_revenue: 300000,
        active_subscriptions: 125,
        new_subscriptions: 15,
        cancelled_subscriptions: 3,
        average_subscription_value: 20000,
        payment_success_rate: 92.5,
        top_subscription_types: [
          { name: 'Premium Plan', count: 45, revenue: 1350000 },
          { name: 'Normal Plan', count: 50, revenue: 750000 },
          { name: 'Individual Plan', count: 30, revenue: 300000 }
        ]
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/');
      const paymentsData = response.data.results || response.data || [];
      setPayments(paymentsData.map((payment: any) => ({
        id: payment.id,
        paymentID: payment.paymentID,
        farmer_name: payment.farmerSubscriptionID?.farmerID?.user 
          ? `${payment.farmerSubscriptionID.farmerID.user.first_name} ${payment.farmerSubscriptionID.farmerID.user.last_name}`.trim()
          : `Farmer #${payment.farmerSubscriptionID?.farmerID?.id || 'Unknown'}`,
        subscription_plan: payment.farmerSubscriptionID?.subscription_typeID?.name || 'Unknown Plan',
        amount: payment.amount,
        status: payment.status,
        payment_date: payment.payment_date,
        transaction_id: payment.transaction_id
      })));
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'green';
      case 'PENDING': return 'yellow';
      case 'FAILED': return 'red';
      case 'REFUNDED': return 'gray';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredPayments = payments.filter(payment =>
    payment.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.subscription_plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportReport = () => {
    toast({
      title: 'Export Started',
      description: 'Your billing report is being prepared for download.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) {
    return (
      <Box p={6} bg={bgColor} minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading billing reports...</Text>
        </VStack>
      </Box>
    );
  }

  const currentReport = reports[0];

  if (!currentReport) {
    return (
      <Box p={6} bg={bgColor} minH="100vh">
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Billing Reports</Heading>
          <Alert status="info">
            <AlertIcon />
            No billing data available for the selected period.
          </Alert>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Billing Reports</Heading>
          <HStack spacing={4}>
            <Select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              w="200px"
            >
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="current_quarter">Current Quarter</option>
              <option value="last_quarter">Last Quarter</option>
              <option value="current_year">Current Year</option>
              <option value="last_year">Last Year</option>
            </Select>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="blue"
              onClick={exportReport}
            >
              Export Report
            </Button>
          </HStack>
        </Flex>

        {error && (
          <Alert status="warning">
            <AlertIcon />
            {error} - Showing sample data for demonstration
          </Alert>
        )}

        {/* Revenue Overview */}
        {currentReport && (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Revenue</StatLabel>
                    <StatNumber color="green.500">{formatCurrency(currentReport.total_revenue)}</StatNumber>
                    <StatHelpText>{currentReport.period}</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Active Subscriptions</StatLabel>
                    <StatNumber>{currentReport.active_subscriptions}</StatNumber>
                    <StatHelpText>
                      <Text color="green.500">+{currentReport.new_subscriptions} new</Text>
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Average Subscription Value</StatLabel>
                    <StatNumber>{formatCurrency(currentReport.average_subscription_value)}</StatNumber>
                    <StatHelpText>Per subscription</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card bg={cardBg}>
                <CardBody>
                  <Stat>
                    <StatLabel>Payment Success Rate</StatLabel>
                    <StatNumber>{currentReport.payment_success_rate || 0}%</StatNumber>
                    <Progress 
                      value={currentReport.payment_success_rate || 0} 
                      colorScheme="green" 
                      size="sm" 
                      mt={2}
                    />
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Top Subscription Types */}
            <Card bg={cardBg}>
              <CardHeader>
                <Heading size="md">Top Subscription Types</Heading>
              </CardHeader>
              <CardBody>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Subscription Type</Th>
                        <Th isNumeric>Active Count</Th>
                        <Th isNumeric>Revenue</Th>
                        <Th isNumeric>% of Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {(currentReport.top_subscription_types || []).map((type, index) => (
                        <Tr key={index}>
                          <Td>{type.name}</Td>
                          <Td isNumeric>{type.count}</Td>
                          <Td isNumeric>{formatCurrency(type.revenue)}</Td>
                          <Td isNumeric>
                            {currentReport.total_revenue > 0 
                              ? ((type.revenue / currentReport.total_revenue) * 100).toFixed(1)
                              : '0.0'
                            }%
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </>
        )}

        {/* Recent Payments */}
        <Card bg={cardBg}>
          <CardHeader>
            <Flex justify="space-between" align="center">
              <Heading size="md">Recent Payments</Heading>
              <InputGroup maxW="300px">
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Flex>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Farmer</Th>
                    <Th>Subscription Plan</Th>
                    <Th isNumeric>Amount</Th>
                    <Th>Status</Th>
                    <Th>Payment Date</Th>
                    <Th>Transaction ID</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPayments.slice(0, 20).map((payment) => (
                    <Tr key={payment.id}>
                      <Td>{payment.farmer_name}</Td>
                      <Td>{payment.subscription_plan}</Td>
                      <Td isNumeric>{formatCurrency(payment.amount)}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </Td>
                      <Td>{formatDate(payment.payment_date)}</Td>
                      <Td>{payment.transaction_id || '-'}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {filteredPayments.length === 0 && (
              <Text textAlign="center" py={4} color="gray.500">
                No payments found matching your search.
              </Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
