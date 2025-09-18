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
  Divider,
} from '@chakra-ui/react';
import {
  FiCheck,
  FiX,
  FiTrendingUp,
  FiDollarSign,
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiDownload,
  FiArrowUp,
  FiSettings,
} from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { format, addMonths, subMonths } from 'date-fns';

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'INDIVIDUAL' | 'NORMAL' | 'PREMIUM';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxHardware: number;
  maxSoftware: number;
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
  hardware: number;
  software: number;
  apiCalls: number;
  storage: number;
}

interface SubscriptionManagerProps {
  farmerId?: string;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ farmerId }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Mock data - replace with real API calls
  const currentSubscription = {
    id: 'sub_123',
    plan: 'Normal Plan',
    tier: 'NORMAL' as const,
    status: 'active',
    nextBilling: '2024-02-15',
    price: 49,
    billingCycle: 'monthly' as const,
    startDate: '2024-01-15',
    autoRenew: true,
  };

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'individual',
      name: 'Individual',
      tier: 'INDIVIDUAL',
      price: 29,
      billingCycle: 'monthly',
      features: [
        'Up to 2 hardware nodes',
        'Basic monitoring',
        'Email support',
        'Mobile app access',
        'Basic reporting',
      ],
      maxHardware: 2,
      maxSoftware: 3,
      analyticsIncluded: false,
      supportLevel: 'Email',
    },
    {
      id: 'normal',
      name: 'Normal',
      tier: 'NORMAL',
      price: 49,
      billingCycle: 'monthly',
      features: [
        'Up to 5 hardware nodes',
        'Advanced monitoring',
        'Priority support',
        'API access',
        'Advanced analytics',
        'Custom reports',
      ],
      maxHardware: 5,
      maxSoftware: 8,
      analyticsIncluded: true,
      supportLevel: 'Phone & Email',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      tier: 'PREMIUM',
      price: 99,
      billingCycle: 'monthly',
      features: [
        'Unlimited hardware nodes',
        'Real-time monitoring',
        '24/7 dedicated support',
        'Full API access',
        'AI-powered insights',
        'White-label options',
        'Custom integrations',
      ],
      maxHardware: 999,
      maxSoftware: 999,
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
      hardware: Math.floor(Math.random() * 5) + 1,
      software: Math.floor(Math.random() * 8) + 2,
      apiCalls: Math.floor(Math.random() * 10000) + 5000,
      storage: Math.floor(Math.random() * 50) + 20,
    };
  });

  const usageStats = {
    currentHardware: 3,
    maxHardware: 5,
    currentSoftware: 5,
    maxSoftware: 8,
    apiCallsThisMonth: 8500,
    apiCallsLimit: 50000,
    storageUsed: 35,
    storageLimit: 100,
  };

  const pieData = [
    { name: 'Hardware', value: usageStats.currentHardware, color: '#3B82F6' },
    { name: 'Software', value: usageStats.currentSoftware, color: '#10B981' },
    { name: 'Available', value: usageStats.maxHardware - usageStats.currentHardware + usageStats.maxSoftware - usageStats.currentSoftware, color: '#E5E7EB' },
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
                  <Text fontSize="sm" color={textColor}>Next Billing</Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {format(new Date(currentSubscription.nextBilling), 'MMM dd, yyyy')}
                  </Text>
                </VStack>
                
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color={textColor}>Status</Text>
                  <Badge colorScheme="green" variant="subtle" fontSize="md" px={3} py={1}>
                    ACTIVE
                  </Badge>
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
          <Tab>Usage & Limits</Tab>
          <Tab>Available Plans</Tab>
          <Tab>Payment History</Tab>
          <Tab>Settings</Tab>
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
                      <StatLabel color={textColor}>Hardware Nodes</StatLabel>
                      <StatNumber color="blue.500">
                        {usageStats.currentHardware} / {usageStats.maxHardware}
                      </StatNumber>
                      <Progress
                        value={(usageStats.currentHardware / usageStats.maxHardware) * 100}
                        colorScheme="blue"
                        size="sm"
                        mt={2}
                      />
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>Software Services</StatLabel>
                      <StatNumber color="green.500">
                        {usageStats.currentSoftware} / {usageStats.maxSoftware}
                      </StatNumber>
                      <Progress
                        value={(usageStats.currentSoftware / usageStats.maxSoftware) * 100}
                        colorScheme="green"
                        size="sm"
                        mt={2}
                      />
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>API Calls</StatLabel>
                      <StatNumber color="purple.500">
                        {usageStats.apiCallsThisMonth.toLocaleString()}
                      </StatNumber>
                      <Progress
                        value={(usageStats.apiCallsThisMonth / usageStats.apiCallsLimit) * 100}
                        colorScheme="purple"
                        size="sm"
                        mt={2}
                      />
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>Storage</StatLabel>
                      <StatNumber color="orange.500">
                        {usageStats.storageUsed} GB
                      </StatNumber>
                      <Progress
                        value={(usageStats.storageUsed / usageStats.storageLimit) * 100}
                        colorScheme="orange"
                        size="sm"
                        mt={2}
                      />
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Usage Charts */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Usage Trends</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="250px">
                      <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                        <AreaChart data={usageData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="hardware"
                            stackId="1"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            name="Hardware"
                          />
                          <Area
                            type="monotone"
                            dataKey="software"
                            stackId="1"
                            stroke="#10B981"
                            fill="#10B981"
                            name="Software"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
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
                        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
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
                        </ResponsiveContainer>
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
              <Heading size="md">Choose Your Plan</Heading>
              
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
                        </VStack>

                        <List spacing={3}>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index}>
                              <ListIcon as={FiCheck} color="green.500" />
                              {feature}
                            </ListItem>
                          ))}
                        </List>

                        <Button
                          colorScheme={plan.popular ? 'blue' : 'gray'}
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
                          <Button size="sm" variant="ghost" leftIcon={<FiDownload />}>
                            Download
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Subscription Settings</Heading>

              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">Auto-renewal</Text>
                        <Text fontSize="sm" color={textColor}>
                          Automatically renew your subscription
                        </Text>
                      </VStack>
                      <Badge colorScheme="green">ENABLED</Badge>
                    </HStack>
                    
                    <Divider />
                    
                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">Payment Method</Text>
                        <Text fontSize="sm" color={textColor}>
                          **** **** **** 1234 (Visa)
                        </Text>
                      </VStack>
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    </HStack>
                    
                    <Divider />
                    
                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">Billing Address</Text>
                        <Text fontSize="sm" color={textColor}>
                          123 Farm Road, Agriculture City
                        </Text>
                      </VStack>
                      <Button size="sm" variant="outline">
                        Update
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Need help choosing a plan?</AlertTitle>
                  <AlertDescription>
                    Contact our sales team for personalized recommendations based on your farm size and requirements.
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Plan Upgrade Modal */}
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
                      You'll be charged ${selectedPlan.price} immediately and your next billing cycle will adjust accordingly.
                    </AlertDescription>
                  </Box>
                </Alert>

                <VStack spacing={2} align="start">
                  <Text fontWeight="bold">What's included:</Text>
                  <List spacing={2}>
                    {selectedPlan.features.map((feature, index) => (
                      <ListItem key={index}>
                        <ListIcon as={FiCheck} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                </VStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<FiCreditCard />}>
              Upgrade Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default SubscriptionManager;
