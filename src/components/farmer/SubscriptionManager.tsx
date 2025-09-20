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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  // Mock data - replace with real API calls
  const currentSubscription = {
    id: 'sub_123',
    plan: t('professionalFarm'),
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
      name: t('starterFarm'),
      tier: 'INDIVIDUAL',
      price: 19,
      billingCycle: 'monthly',
      features: [
        `${t('upTo')} 500 ${t('birdsMonitoring')}`,
        t('basicHealthTracking'),
        t('dailyProductionReports'),
        t('subscriptionEmailNotifications'),
        t('mobileAppAccess'),
        `${t('standardSupport')} (${t('responseTime24h')})`,
        t('basicAnalytics'),
      ],
      maxBirds: 500,
      maxSensors: 2,
      analyticsIncluded: false,
      supportLevel: t('subscriptionEmailNotifications'),
    },
    {
      id: 'professional',
      name: t('professionalFarm'),
      tier: 'NORMAL',
      price: 49,
      billingCycle: 'monthly',
      features: [
        `${t('upTo')} 2,000 ${t('birdsMonitoring')}`,
        t('advancedHealthTracking'),
        t('subscriptionSmsNotifications'),
        t('multipleFarms'),
        t('weeklyReports'),
        t('realTimeReports'),
        t('advancedAnalytics'),
        `${t('prioritySupport')} (${t('responseTime12h')})`,
        t('apiAccess'),
        t('customReports'),
      ],
      maxBirds: 2000,
      maxSensors: 5,
      analyticsIncluded: true,
      supportLevel: `${t('prioritySupport')}`,
      popular: true,
    },
    {
      id: 'enterprise',
      name: t('enterpriseFarm'),
      tier: 'PREMIUM',
      price: 99,
      billingCycle: 'monthly',
      features: [
        `${t('unlimitedFarms')} ${t('birdsMonitoring')}`,
        t('predictiveAnalytics'),
        t('teamCollaboration'),
        t('comprehensiveHealthTracking'),
        t('integrations'),
        t('dataExport'),
        t('roleBasedAccess'),
        t('webDashboard'),
        `${t('dedicatedSupport')} (${t('responseTime2h')})`,
        t('customReports'),
        t('apiAccess'),
        t('predictiveAnalytics'),
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
                  {t(currentSubscription.tier.toLowerCase() + 'Tier')}
                </Badge>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color={textColor}>{t('subscriptionMonthly')} {t('subscriptionPrice')}</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    ${currentSubscription.price}
                  </Text>
                </VStack>
                
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color={textColor}>{t('birds')} {t('birdsMonitoring')}</Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {currentSubscription.birdsCount.toLocaleString()} / {currentSubscription.maxBirds.toLocaleString()}
                  </Text>
                </VStack>
                
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" color={textColor}>{t('subscriptionNextBilling')}</Text>
                  <Text fontSize="lg" fontWeight="medium">
                    {format(new Date(currentSubscription.nextBilling), 'MMM dd, yyyy')}
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
            
            <VStack spacing={2}>
              <Button colorScheme="blue" leftIcon={<FiArrowUp />}>
                {t('subscriptionUpgradePlan')}
              </Button>
              <Button variant="outline" leftIcon={<FiSettings />} size="sm">
                {t('manageSubscription')}
              </Button>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>
            <Icon as={FiBarChart} mr={2} />
            {t('usageOverview')}
          </Tab>
          <Tab>
            <Icon as={FiPackage} mr={2} />
            {t('subscriptionPlans')}
          </Tab>
          <Tab>
            <Icon as={FiCreditCard} mr={2} />
            {t('paymentHistory')}
          </Tab>
          <Tab>
            <Icon as={FiSettings} mr={2} />
            {t('settings')}
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
                      <StatLabel color={textColor}>{t('birds')} {t('birdsMonitoring')}</StatLabel>
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
                        {((usageStats.currentBirds / usageStats.maxBirds) * 100).toFixed(1)}% {t('capacity')}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>{t('subscriptionSensorsActive')}</StatLabel>
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
                        {t('activeMonitoringDevices')}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>{t('monthlyReports')}</StatLabel>
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
                        {t('generatedThisMonth')}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Stat>
                      <StatLabel color={textColor}>{t('dataStorage')}</StatLabel>
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
                        {t('farmDataAnalytics')}
                      </StatHelpText>
                    </Stat>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Quick Actions */}
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">{t('subscriptionQuickActions')}</Heading>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <VStack spacing={2}>
                      <Icon as={FiTrendingUp} boxSize={6} color="blue.500" />
                      <Text fontSize="sm" textAlign="center">{t('subscriptionViewAnalytics')}</Text>
                      <Button size="sm" variant="outline" colorScheme="blue">
                        {t('openDashboard')}
                      </Button>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiDownload} boxSize={6} color="green.500" />
                      <Text fontSize="sm" textAlign="center">{t('subscriptionExportData')}</Text>
                      <Button size="sm" variant="outline" colorScheme="green">
                        {t('subscriptionGenerateReport')}
                      </Button>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiActivity} boxSize={6} color="purple.500" />
                      <Text fontSize="sm" textAlign="center">{t('addSensors')}</Text>
                      <Button size="sm" variant="outline" colorScheme="purple">
                        {t('setupDevice')}
                      </Button>
                    </VStack>
                    <VStack spacing={2}>
                      <Icon as={FiCreditCard} boxSize={6} color="orange.500" />
                      <Text fontSize="sm" textAlign="center">{t('billingInfo')}</Text>
                      <Button size="sm" variant="outline" colorScheme="orange">
                        {t('updatePayment')}
                      </Button>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>
              {/* Usage Charts */}
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">{t('farmActivityTrends')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="250px">
                      <SafeChartContainer minHeight={250}>
                        <AreaChart data={usageData} width={400} height={250}>
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
                    <Heading size="md">{t('resourceDistribution')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Flex h="250px" align="center" justify="center">
                      <Box w="200px" h="200px">
                        <SafeChartContainer minHeight={200}>
                          <PieChart width={200} height={200}>
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
              <Heading size="md">{t('chooseFarmPlan')}</Heading>
              <Text color={textColor}>
                {t('selectPerfectPlan')}
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
                        {t('mostPopular')}
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
                            {t('upToBirds', { 
                              birds: plan.maxBirds === 999999 ? t('unlimited') : plan.maxBirds.toLocaleString() 
                            })}
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
                          {currentSubscription.tier === plan.tier ? t('subscriptionCurrentPlanLabel') : t('selectPlan')}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>

              {/* Plan Comparison */}
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">{t('featureComparison')}</Heading>
                </CardHeader>
                <CardBody>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>{t('feature')}</Th>
                        <Th textAlign="center">{t('starter')}</Th>
                        <Th textAlign="center">{t('professional')}</Th>
                        <Th textAlign="center">{t('enterprise')}</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>{t('birdsCapacity')}</Td>
                        <Td textAlign="center">500</Td>
                        <Td textAlign="center">2,000</Td>
                        <Td textAlign="center">{t('unlimited')}</Td>
                      </Tr>
                      <Tr>
                        <Td>{t('smartSensors')}</Td>
                        <Td textAlign="center">2</Td>
                        <Td textAlign="center">5</Td>
                        <Td textAlign="center">{t('unlimited')}</Td>
                      </Tr>
                      <Tr>
                        <Td>{t('aiAnalytics')}</Td>
                        <Td textAlign="center"><Icon as={FiX} color="red.500" /></Td>
                        <Td textAlign="center"><Icon as={FiCheck} color="green.500" /></Td>
                        <Td textAlign="center"><Icon as={FiCheck} color="green.500" /></Td>
                      </Tr>
                      <Tr>
                        <Td>{t('support247')}</Td>
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
                <Heading size="md">{t('paymentHistory')}</Heading>
                <Button leftIcon={<FiDownload />} size="sm" variant="outline">
                  {t('dataExport')}
                </Button>
              </HStack>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>{t('paymentDate')}</Th>
                    <Th>{t('amount')}</Th>
                    <Th>{t('subscriptionMethod')}</Th>
                    <Th>{t('status')}</Th>
                    <Th>{t('downloadInvoice')}</Th>
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
                          {t(`paymentStatus.${payment.status.toLowerCase()}`)}
                        </Badge>
                      </Td>
                      <Td>
                        {payment.invoiceUrl && (
                          <Button size="xs" variant="outline" leftIcon={<FiDownload />}>
                            {t('download')}
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
                  <AlertTitle>{t('automaticPaymentsEnabled')}</AlertTitle>
                  <AlertDescription>
                    {t('subscriptionAutoRenewMsg', {
                      date: format(new Date(currentSubscription.nextBilling), 'MMMM dd, yyyy')
                    })}
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <VStack spacing={6} align="stretch">
              <Heading size="md">{t('subscriptionSettings')}</Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="sm">{t('billingInformation')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Button leftIcon={<FiCreditCard />} variant="outline">
                        {t('updatePaymentMethod')}
                      </Button>
                      <Button leftIcon={<FiCalendar />} variant="outline">
                        {t('changeBillingCycle')}
                      </Button>
                      <Button leftIcon={<FiDownload />} variant="outline">
                        {t('downloadInvoices')}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="sm">{t('subscriptionControls')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Button leftIcon={<FiArrowUp />} colorScheme="blue">
                        {t('upgradePlan')}
                      </Button>
                      <Button leftIcon={<FiSettings />} variant="outline">
                        {t('manageFeatures')}
                      </Button>
                      <Button leftIcon={<FiX />} colorScheme="red" variant="outline">
                        {t('cancelSubscription')}
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>{t('needHelp')}</AlertTitle>
                  <AlertDescription>
                    {t('supportContactMessage')}
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
          <ModalHeader>{t('upgradeToPlan', { planName: selectedPlan?.name })}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPlan && (
              <VStack spacing={4} align="stretch">
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('planUpgrade')}</AlertTitle>
                    <AlertDescription>
                      {t('upgradingToPlan', {
                        planName: selectedPlan.name,
                        price: selectedPlan.price,
                        cycle: t(selectedPlan.billingCycle)
                      })}
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Box>
                  <Heading size="sm" mb={2}>{t('whatYouWillGet')}</Heading>
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
              {t('subscriptionCancel')}
            </Button>
            <Button colorScheme="blue">
              {t('subscriptionConfirmUpgrade')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default SubscriptionManager;
