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
  Flex,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  FiCheck,
  FiX,
  FiTrendingUp,
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiDownload,
  FiArrowUp,
  FiSettings,
  FiActivity,
  FiBarChart,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subMonths } from 'date-fns';
import SafeChartContainer from '../common/SafeChartContainer';

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxBirds: number;
  maxSensors: number;
  analyticsIncluded: boolean;
  supportLevel: string;
  popular?: boolean;
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  method: string;
  invoiceUrl?: string;
}

interface UsageData {
  month: string;
  birds: number;
  sensors: number;
  reports: number;
  alerts: number;
}

interface SubscriptionManagerProps {
  farmerId?: string;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Mock data - replace with real API calls
  const currentSubscription = {
    id: 'sub_123',
    plan: 'Professional Farm',
    tier: 'NORMAL' as const,
    status: 'active',
    nextBilling: '2024-02-15',
    price: 49,
    billingCycle: 'monthly' as const,
    startDate: '2024-01-15',
    autoRenew: true,
    birdsCount: 1450,
    maxBirds: 2000,
    farmsManaged: 1,
    maxFarms: 1,
  };

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter Farm',
      tier: 'INDIVIDUAL',
      price: 19,
      billingCycle: 'monthly',
      features: [
        'Up to 500 birds monitoring',
        'Basic health tracking',
        'Daily production reports',
        'Email notifications',
        'Mobile app access',
        'Standard support (24h response)',
        'Basic analytics dashboard',
      ],
      maxBirds: 500,
      maxSensors: 2,
      analyticsIncluded: false,
      supportLevel: 'Email Support',
    },
    {
      id: 'professional',
      name: 'Professional Farm',
      tier: 'NORMAL',
      price: 49,
      billingCycle: 'monthly',
      features: [
        'Up to 2,000 birds monitoring',
        'Advanced health analytics',
        'Automated alerts & notifications',
        'Batch management tools',
        'Financial tracking & reports',
        'Vaccination scheduling',
        'Feed optimization insights',
        'Priority support (12h response)',
        'API access for integrations',
        'Custom report generation',
      ],
      maxBirds: 2000,
      maxSensors: 5,
      analyticsIncluded: true,
      supportLevel: 'Phone & Email',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise Farm',
      tier: 'PREMIUM',
      price: 99,
      billingCycle: 'monthly',
      features: [
        'Unlimited birds monitoring',
        'AI-powered health predictions',
        'Multi-farm management',
        'Real-time environmental monitoring',
        'Advanced breeding guidance',
        'Automated feed dispensing control',
        'Marketplace integration',
        'White-label mobile app',
        '24/7 dedicated support (2h response)',
        'On-site technical visits',
        'Custom integrations & training',
        'Advanced analytics & forecasting',
      ],
      maxBirds: 999999,
      maxSensors: 999,
      analyticsIncluded: true,
      supportLevel: '24/7 Dedicated',
    },
  ];

  const paymentHistory: PaymentRecord[] = [
    {
      id: 'pay_001',
      date: '2024-01-15',
      amount: 49,
      status: 'paid',
      method: 'Credit Card',
      invoiceUrl: '/invoices/001.pdf',
    },
    {
      id: 'pay_002',
      date: '2023-12-15',
      amount: 49,
      status: 'paid',
      method: 'Credit Card',
      invoiceUrl: '/invoices/002.pdf',
    },
    {
      id: 'pay_003',
      date: '2023-11-15',
      amount: 49,
      status: 'paid',
      method: 'Bank Transfer',
      invoiceUrl: '/invoices/003.pdf',
    },
  ];

  const usageData: UsageData[] = Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), 5 - i);
    return {
      month: format(date, 'MMM'),
      birds: Math.floor(Math.random() * 400) + 1000,
      sensors: Math.floor(Math.random() * 3) + 2,
      reports: Math.floor(Math.random() * 20) + 15,
      alerts: Math.floor(Math.random() * 8) + 2,
    };
  });

  const usageStats = {
    currentBirds: 1450,
    maxBirds: 2000,
    currentSensors: 4,
    maxSensors: 5,
    monthlyReports: 28,
    reportsLimit: 50,
    storageUsed: 32,
    storageLimit: 100,
    alertsThisMonth: 15,
    apiCallsThisMonth: 12500,
    apiCallsLimit: 50000,
  };

  const pieData = [
    { name: 'Birds Monitored', value: usageStats.currentBirds, color: '#3B82F6' },
    { name: 'Sensors Active', value: usageStats.currentSensors * 100, color: '#10B981' },
    { name: 'Available Capacity', value: (usageStats.maxBirds - usageStats.currentBirds) / 10, color: '#E5E7EB' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'INDIVIDUAL': return 'blue';
      case 'NORMAL': return 'green';
      case 'PREMIUM': return 'purple';
      default: return 'gray';
    }
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    onOpen();
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Current Subscription Overview */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardBody>
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={3}>
              <HStack>
                <Heading size="lg">{currentSubscription.plan}</Heading>
                <Badge colorScheme={getTierColor(currentSubscription.tier)} variant="solid">
                  {currentSubscription.tier}
                </Badge>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color={textColor}>Monthly Cost</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    ${currentSubscription.price}
                  </Text>
                </VStack>
                
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color={textColor}>Birds Monitored</Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {currentSubscription.birdsCount.toLocaleString()} / {currentSubscription.maxBirds.toLocaleString()}
                  </Text>
                </VStack>
                
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color={textColor}>Next Billing</Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {format(new Date(currentSubscription.nextBilling), 'MMM dd, yyyy')}
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
            
            <VStack spacing={2}>
              <Button colorScheme="blue" leftIcon={<FiArrowUp />}>
                Upgrade Plan
              </Button>
              <Button variant="outline" leftIcon={<FiSettings />} size="sm">
                Manage
              </Button>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>
            <Icon as={FiBarChart} mr={2} />
            Usage & Limits
          </Tab>
          <Tab>
            <Icon as={FiPackage} mr={2} />
            Available Plans
          </Tab>
          <Tab>
            <Icon as={FiCreditCard} mr={2} />
            Payment History
          </Tab>
          <Tab>
            <Icon as={FiSettings} mr={2} />
            Settings
          </Tab>
        </TabList>

        <TabPanels>
          {/* Usage & Limits Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              {/* Usage Stats */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>Birds Monitored</StatLabel>
                      <StatNumber color="blue.500">
                        {usageStats.currentBirds.toLocaleString()} / {usageStats.maxBirds.toLocaleString()}
                      </StatNumber>
                      <Progress
                        value={(usageStats.currentBirds / usageStats.maxBirds) * 100}
                        colorScheme="blue"
                        size="sm"
                        mt={2}
                      />
                      <StatHelpText>
                        {((usageStats.currentBirds / usageStats.maxBirds) * 100).toFixed(1)}% capacity
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>Smart Sensors</StatLabel>
                      <StatNumber color="green.500">
                        {usageStats.currentSensors} / {usageStats.maxSensors}
                      </StatNumber>
                      <Progress
                        value={(usageStats.currentSensors / usageStats.maxSensors) * 100}
                        colorScheme="green"
                        size="sm"
                        mt={2}
                      />
                      <StatHelpText>
                        Active monitoring devices
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>Monthly Reports</StatLabel>
                      <StatNumber color="purple.500">
                        {usageStats.monthlyReports} / {usageStats.reportsLimit}
                      </StatNumber>
                      <Progress
                        value={(usageStats.monthlyReports / usageStats.reportsLimit) * 100}
                        colorScheme="purple"
                        size="sm"
                        mt={2}
                      />
                      <StatHelpText>
                        Generated this month
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>Data Storage</StatLabel>
                      <StatNumber color="orange.500">
                        {usageStats.storageUsed}GB / {usageStats.storageLimit}GB
                      </StatNumber>
                      <Progress
                        value={(usageStats.storageUsed / usageStats.storageLimit) * 100}
                        colorScheme="orange"
                        size="sm"
                        mt={2}
                      />
                      <StatHelpText>
                        Farm data & analytics
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Quick Actions */}
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Quick Actions</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <VStack spacing={2}>
                      <Icon as={FiTrendingUp} boxSize={6} color="blue.500" />
                      <Text fontSize="sm" textAlign="center">View Analytics</Text>
                      <Button size="sm" variant="outline" colorScheme="blue">
                        Open Dashboard
                      </Button>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiDownload} boxSize={6} color="green.500" />
                      <Text fontSize="sm" textAlign="center">Export Data</Text>
                      <Button size="sm" variant="outline" colorScheme="green">
                        Generate Report
                      </Button>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiActivity} boxSize={6} color="purple.500" />
                      <Text fontSize="sm" textAlign="center">Add Sensors</Text>
                      <Button size="sm" variant="outline" colorScheme="purple">
                        Setup Device
                      </Button>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiCreditCard} boxSize={6} color="orange.500" />
                      <Text fontSize="sm" textAlign="center">Billing Info</Text>
                      <Button size="sm" variant="outline" colorScheme="orange">
                        Update Payment
                      </Button>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>
              {/* Usage Charts */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Farm Activity Trends</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="250px">
                      <SafeChartContainer minHeight={250}>
                        <AreaChart data={usageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="birds"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            name="Birds Monitored"
                          />
                          <Area
                            type="monotone"
                            dataKey="sensors"
                            stackId="2"
                            stroke="#10B981"
                            fill="#10B981"
                            name="Sensors Active"
                          />
                          <Area
                            type="monotone"
                            dataKey="reports"
                            stackId="3"
                            stroke="#F59E0B"
                            fill="#F59E0B"
                            name="Reports Generated"
                          />
                        </AreaChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Resource Distribution</Heading>
                  </CardHeader>
                  <CardBody>
                    <Flex h="250px" align="center" justify="center">
                      <Box w="200px" h="200px">
                        <SafeChartContainer minHeight={200}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </SafeChartContainer>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </TabPanel>

          {/* Available Plans Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <Heading size="md">Choose Your Farm Plan</Heading>
              <Text color={textColor}>
                Select the perfect plan for your farm size and requirements. All plans include mobile app access and basic support.
              </Text>
              
              <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    bg={cardBg}
                    borderWidth="2px"
                    borderColor={plan.popular ? 'blue.300' : borderColor}
                    position="relative"
                    _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    {plan.popular && (
                      <Badge
                        position="absolute"
                        top="-8px"
                        left="50%"
                        transform="translateX(-50%)"
                        colorScheme="blue"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        MOST POPULAR
                      </Badge>
                    )}
                    
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <VStack spacing={2}>
                          <Heading size="lg">{plan.name}</Heading>
                          <HStack>
                            <Text fontSize="3xl" fontWeight="bold" color={getTierColor(plan.tier) + '.500'}>
                              ${plan.price}
                            </Text>
                            <Text color={textColor}>/{plan.billingCycle}</Text>
                          </HStack>
                          <Text fontSize="sm" color={textColor}>
                            Up to {plan.maxBirds === 999999 ? 'Unlimited' : plan.maxBirds.toLocaleString()} birds
                          </Text>
                        </VStack>

                        <List spacing={3}>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiCheck} color="green.500" />
                              <Text fontSize="sm">{feature}</Text>
                            </ListItem>
                          ))}
                        </List>

                        <Button
                          colorScheme={plan.popular ? 'green' : 'gray'}
                          variant={currentSubscription.tier === plan.tier ? 'outline' : 'solid'}
                          w="full"
                          onClick={() => handleUpgrade(plan)}
                          disabled={currentSubscription.tier === plan.tier}
                        >
                          {currentSubscription.tier === plan.tier ? 'Current Plan' : 'Select Plan'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Plan Comparison */}
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Feature Comparison</Heading>
                </CardHeader>
                <CardBody>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Feature</Th>
                        <Th textAlign="center">Starter</Th>
                        <Th textAlign="center">Professional</Th>
                        <Th textAlign="center">Enterprise</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Birds Capacity</Td>
                        <Td textAlign="center">500</Td>
                        <Td textAlign="center">2,000</Td>
                        <Td textAlign="center">Unlimited</Td>
                      </Tr>
                      <Tr>
                        <Td>Smart Sensors</Td>
                        <Td textAlign="center">2</Td>
                        <Td textAlign="center">5</Td>
                        <Td textAlign="center">Unlimited</Td>
                      </Tr>
                      <Tr>
                        <Td>AI Analytics</Td>
                        <Td textAlign="center"><Icon as={FiX} color="red.500" /></Td>
                        <Td textAlign="center"><Icon as={FiCheck} color="green.500" /></Td>
                        <Td textAlign="center"><Icon as={FiCheck} color="green.500" /></Td>
                      </Tr>
                      <Tr>
                        <Td>24/7 Support</Td>
                        <Td textAlign="center"><Icon as={FiX} color="red.500" /></Td>
                        <Td textAlign="center"><Icon as={FiX} color="red.500" /></Td>
                        <Td textAlign="center"><Icon as={FiCheck} color="green.500" /></Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </CardBody>
              </Card>
            </VStack>
          </TabPanel>

          {/* Payment History Tab */}
          <TabPanel>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Heading size="md">Payment History</Heading>
                <Button leftIcon={<FiDownload />} size="sm" variant="outline">
                  Export
                </Button>
              </HStack>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Amount</Th>
                    <Th>Method</Th>
                    <Th>Status</Th>
                    <Th>Invoice</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paymentHistory.map((payment) => (
                    <Tr key={payment.id}>
                      <Td>{format(new Date(payment.date), 'MMM dd, yyyy')}</Td>
                      <Td>
                        <Text fontWeight="medium">${payment.amount}</Text>
                      </Td>
                      <Td>{payment.method}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(payment.status)} variant="subtle">
                          {payment.status.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        {payment.invoiceUrl && (
                          <Button size="xs" variant="outline" leftIcon={<FiDownload />}>
                            Download
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Automatic Payments Enabled</AlertTitle>
                  <AlertDescription>
                    Your subscription will automatically renew on {format(new Date(currentSubscription.nextBilling), 'MMMM dd, yyyy')}.
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Subscription Settings</Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="sm">Billing Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Button leftIcon={<FiCreditCard />} variant="outline">
                        Update Payment Method
                      </Button>
                      <Button leftIcon={<FiCalendar />} variant="outline">
                        Change Billing Cycle
                      </Button>
                      <Button leftIcon={<FiDownload />} variant="outline">
                        Download Invoices
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="sm">Subscription Controls</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Button leftIcon={<FiArrowUp />} colorScheme="blue">
                        Upgrade Plan
                      </Button>
                      <Button leftIcon={<FiSettings />} variant="outline">
                        Manage Features
                      </Button>
                      <Button leftIcon={<FiX />} colorScheme="red" variant="outline">
                        Cancel Subscription
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Need Help?</AlertTitle>
                  <AlertDescription>
                    Contact our support team for assistance with billing, upgrades, or technical issues. We're here to help your farm succeed!
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Upgrade Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upgrade to {selectedPlan?.name} Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPlan && (
              <VStack spacing={4} align="stretch">
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Plan Upgrade</AlertTitle>
                    <AlertDescription>
                      You're upgrading to the {selectedPlan.name} plan for ${selectedPlan.price}/{selectedPlan.billingCycle}.
                      Your new features will be available immediately.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Box>
                  <Heading size="sm" mb={2}>What you'll get:</Heading>
                  <List spacing={2}>
                    {selectedPlan.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListIcon as={FiCheck} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">
              Confirm Upgrade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default SubscriptionManager;
