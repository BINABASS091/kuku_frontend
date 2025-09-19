import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Icon,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import {
  FiTrendingUp,
  FiDollarSign,
  FiPieChart,
  FiBarChart,
  FiActivity,
  FiTarget,
  FiPercent
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import FarmerLayout from '../layouts/FarmerLayout';
import SafeChartContainer from '../components/common/SafeChartContainer';

const FarmerAnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock data for production analytics
  const productionData = [
    { month: 'Jan', eggs: 1250, chickens: 850, feed: 320 },
    { month: 'Feb', eggs: 1380, chickens: 890, feed: 340 },
    { month: 'Mar', eggs: 1420, chickens: 920, feed: 360 },
    { month: 'Apr', eggs: 1380, chickens: 880, feed: 350 },
    { month: 'May', eggs: 1520, chickens: 950, feed: 380 },
    { month: 'Jun', eggs: 1650, chickens: 980, feed: 400 }
  ];

  // Mock data for financial analytics
  const financialData = [
    { month: 'Jan', revenue: 3200, costs: 2100, profit: 1100 },
    { month: 'Feb', revenue: 3450, costs: 2200, profit: 1250 },
    { month: 'Mar', revenue: 3580, costs: 2300, profit: 1280 },
    { month: 'Apr', revenue: 3420, costs: 2250, profit: 1170 },
    { month: 'May', revenue: 3800, costs: 2400, profit: 1400 },
    { month: 'Jun', revenue: 4100, costs: 2500, profit: 1600 }
  ];

  // Mock data for growth trends
  const growthData = [
    { week: 'Week 1', weight: 0.05, mortality: 2.1, feed_conversion: 1.2 },
    { week: 'Week 2', weight: 0.12, mortality: 1.8, feed_conversion: 1.4 },
    { week: 'Week 3', weight: 0.25, mortality: 1.5, feed_conversion: 1.6 },
    { week: 'Week 4', weight: 0.45, mortality: 1.2, feed_conversion: 1.8 },
    { week: 'Week 5', weight: 0.75, mortality: 1.0, feed_conversion: 2.0 },
    { week: 'Week 6', weight: 1.2, mortality: 0.8, feed_conversion: 2.2 }
  ];

  const performanceData = [
    { name: t('excellent'), value: 35, color: '#48BB78' },
    { name: t('good'), value: 40, color: '#38B2AC' },
    { name: t('average'), value: 20, color: '#ED8936' },
    { name: t('poor'), value: 5, color: '#E53E3E' }
  ];

  const profitTrendData = [
    { month: 'Jan', profit: 1100, target: 1200 },
    { month: 'Feb', profit: 1250, target: 1200 },
    { month: 'Mar', profit: 1280, target: 1300 },
    { month: 'Apr', profit: 1170, target: 1250 },
    { month: 'May', profit: 1400, target: 1400 },
    { month: 'Jun', profit: 1600, target: 1500 }
  ];

  const weightProgressData = [
    { week: 'Week 1', actual: 0.05, target: 0.06 },
    { week: 'Week 2', actual: 0.12, target: 0.13 },
    { week: 'Week 3', actual: 0.25, target: 0.26 },
    { week: 'Week 4', actual: 0.45, target: 0.44 },
    { week: 'Week 5', actual: 0.75, target: 0.72 },
    { week: 'Week 6', actual: 1.2, target: 1.1 }
  ];

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>{t('analyticsDashboard')}</Heading>
          <Text color={textColor}>
            {t('comprehensiveInsights')}
          </Text>
        </Box>

        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>
              <Icon as={FiBarChart} mr={2} />
              {t('analyticsProductionTab')}
            </Tab>
            <Tab>
              <Icon as={FiDollarSign} mr={2} />
              {t('analyticsFinancialTab')}
            </Tab>
            <Tab>
              <Icon as={FiTrendingUp} mr={2} />
              {t('analyticsGrowthTrends')}
            </Tab>
          </TabList>

          <TabPanels>
            {/* Production Analytics Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Key Metrics Cards */}
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('totalEggsThisMonth')}</StatLabel>
                        <StatNumber color="green.500">1,650</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('increaseFromLastMonth', { percentage: 8.5 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('activeChickens')}</StatLabel>
                        <StatNumber color="blue.500">980</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('increaseFromLastMonth', { percentage: 3.2 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('feedConsumptionKg')}</StatLabel>
                        <StatNumber color="orange.500">400</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('increaseFromLastMonth', { percentage: 5.3 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('productionEfficiency')}</StatLabel>
                        <StatNumber color="purple.500">94.2%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('increaseFromLastMonth', { percentage: 2.1 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Production Chart */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Heading size="md">{t('monthlyProductionOverview')}</Heading>
                        <Text color={textColor} mt={1}>
                          {t('trackFarmProductionMetrics')}
                        </Text>
                      </Box>
                      <Badge colorScheme="green" variant="subtle">
                        <Icon as={FiBarChart} mr={1} />
                        {t('sixMonths')}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="400px">
                      <SafeChartContainer minHeight={400}>
                        <BarChart data={productionData} width={400} height={400}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="eggs" fill="#48BB78" name={t('analyticsEggs')} />
                          <Bar dataKey="chickens" fill="#38B2AC" name={t('analyticsChickens')} />
                          <Bar dataKey="feed" fill="#ED8936" name={t('analyticsFeedKg')} />
                        </BarChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Performance Distribution */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Heading size="md">{t('performanceDistribution')}</Heading>
                        <Text color={textColor} mt={1}>
                          {t('breakdownFlockPerformance')}
                        </Text>
                      </Box>
                      <Badge colorScheme="blue" variant="subtle">
                        <Icon as={FiPieChart} mr={1} />
                        {t('currentMonth')}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="350px">
                      <SafeChartContainer minHeight={350}>
                        <PieChart width={350} height={350}>
                          <Pie
                            data={performanceData}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {performanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Production Alerts */}
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('productionInsight')}</AlertTitle>
                    <AlertDescription>
                      {t('eggProductionIncreasedOptimizeFeed')}
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </TabPanel>

            {/* Financial Analytics Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Financial Metrics */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('analyticsMonthlyRevenue')}</StatLabel>
                        <StatNumber color="green.500">$4,100</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('increaseFromLastMonth', { percentage: 7.9 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('operatingCosts')}</StatLabel>
                        <StatNumber color="red.500">$2,500</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('increaseFromLastMonth', { percentage: 4.2 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('netProfit')}</StatLabel>
                        <StatNumber color="blue.500">$1,600</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('increaseFromLastMonth', { percentage: 14.3 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Financial Trends Chart */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Heading size="md">{t('financialTrends')}</Heading>
                        <Text color={textColor} mt={1}>
                          {t('revenueCostsProfitAnalysis')}
                        </Text>
                      </Box>
                      <Badge colorScheme="purple" variant="subtle">
                        <Icon as={FiDollarSign} mr={1} />
                        {t('sixMonths')}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="350px">
                      <SafeChartContainer minHeight={350}>
                        <LineChart data={financialData} width={400} height={350}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#48BB78" strokeWidth={3} name={t('analyticsRevenue')} />
                          <Line type="monotone" dataKey="costs" stroke="#E53E3E" strokeWidth={3} name={t('analyticsCosts')} />
                          <Line type="monotone" dataKey="profit" stroke="#3182CE" strokeWidth={3} name={t('analyticsProfit')} />
                        </LineChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Profit vs Target */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Heading size="md">{t('profitVsTarget')}</Heading>
                        <Text color={textColor} mt={1}>
                          {t('compareActualProfitTargets')}
                        </Text>
                      </Box>
                      <Badge colorScheme="green" variant="subtle">
                        <Icon as={FiTarget} mr={1} />
                        {t('performance')}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <SafeChartContainer minHeight={300}>
                        <AreaChart data={profitTrendData} width={400} height={300}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="target" stackId="1" stroke="#CBD5E0" fill="#CBD5E0" name={t('target')} />
                          <Area type="monotone" dataKey="profit" stackId="2" stroke="#48BB78" fill="#48BB78" name={t('actualProfit')} />
                        </AreaChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Financial Alert */}
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('excellentFinancialPerformance')}</AlertTitle>
                    <AlertDescription>
                      {t('exceededProfitTargetROI')}
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </TabPanel>

            {/* Growth Trends Tab */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                {/* Growth Metrics */}
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('avgWeightKg')}</StatLabel>
                        <StatNumber color="purple.500">1.2</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('weekPerformance', { week: 6 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('mortalityRate')}</StatLabel>
                        <StatNumber color="red.500">0.8%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="decrease" />
                          {t('improvedBy', { percentage: 1.3 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('feedConversion')}</StatLabel>
                        <StatNumber color="orange.500">2.2</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('withinTargetRange')}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('growthRate')}</StatLabel>
                        <StatNumber color="green.500">108.6%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {t('aboveTargetBy', { percentage: 8.6 })}
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Growth Chart */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Heading size="md">{t('weightProgressTracking')}</Heading>
                        <Text color={textColor} mt={1}>
                          {t('monitorWeeklyWeightGain')}
                        </Text>
                      </Box>
                      <Badge colorScheme="green" variant="subtle">
                        <Icon as={FiActivity} mr={1} />
                        {t('sixWeeks')}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="350px">
                      <SafeChartContainer minHeight={350}>
                        <AreaChart data={weightProgressData} width={400} height={350}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="target" stackId="1" stroke="#E2E8F0" fill="#E2E8F0" name={t('targetWeight')} />
                          <Area type="monotone" dataKey="actual" stackId="2" stroke="#38B2AC" fill="#38B2AC" name={t('actualWeight')} />
                        </AreaChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Performance Indicators */}
                <Card bg={cardBg} borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between" align="center">
                      <Box>
                        <Heading size="md">{t('keyPerformanceIndicators')}</Heading>
                        <Text color={textColor} mt={1}>
                          {t('trackMortalityFeedConversion')}
                        </Text>
                      </Box>
                      <Badge colorScheme="blue" variant="subtle">
                        <Icon as={FiPercent} mr={1} />
                        {t('weeklyTrends')}
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <Box h="300px">
                      <SafeChartContainer minHeight={300}>
                        <LineChart data={growthData} width={400} height={300}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="mortality" stroke="#E53E3E" strokeWidth={3} name={t('mortalityPercent')} />
                          <Line type="monotone" dataKey="feed_conversion" stroke="#38B2AC" strokeWidth={3} name={t('feedConversionRatio')} />
                        </LineChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Growth Alert */}
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('growthMonitoringAlert')}</AlertTitle>
                    <AlertDescription>
                      {t('flockExceedingWeightTargets')}
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerAnalyticsPage;
