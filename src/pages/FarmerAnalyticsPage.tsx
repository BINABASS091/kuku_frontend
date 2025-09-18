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
  Progress,
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { 
  FiBarChart2, 
  FiDollarSign, 
  FiTrendingUp, 
  FiPackage,
  FiActivity,
  FiCpu,
  FiTarget,
  FiCalendar,
  FiPercent
} from 'react-icons/fi';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import FarmerLayout from '../layouts/FarmerLayout';

const FarmerAnalyticsPage: React.FC = () => {
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
    { name: 'Excellent', value: 35, color: '#48BB78' },
    { name: 'Good', value: 40, color: '#38B2AC' },
    { name: 'Average', value: 20, color: '#ED8936' },
    { name: 'Poor', value: 5, color: '#E53E3E' }
  ];

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Analytics Dashboard 📊
          </Heading>
          <Text color={textColor}>
            Comprehensive analytics for production, financial, and growth performance
          </Text>
        </Box>

        {/* Analytics Tabs */}
        <Tabs colorScheme="green" variant="enclosed-colored">
          <TabList>
            <Tab>
              <HStack>
                <Icon as={FiActivity} />
                <Text>Production</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiDollarSign} />
                <Text>Financial</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiTrendingUp} />
                <Text>Growth Trends</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Production Analytics Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Production Stats Cards */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Total Eggs</StatLabel>
                        <StatNumber color="green.500">8,600</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          12.5% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Active Chickens</StatLabel>
                        <StatNumber color="blue.500">980</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          3.2% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Feed Consumed</StatLabel>
                        <StatNumber color="orange.500">2,150kg</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          5.1% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Efficiency Rate</StatLabel>
                        <StatNumber color="purple.500">87.5%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          2.3% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Production Charts */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Monthly Production Trends</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                          <BarChart data={productionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="eggs" fill="#48BB78" name="Eggs" />
                            <Bar dataKey="chickens" fill="#38B2AC" name="Chickens" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Performance Distribution</Heading>
                    </CardHeader>
                    <CardBody>
                      <Flex direction="column" h="300px">
                        <Box flex="1">
                          <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <PieChart>
                              <Pie
                                data={performanceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {performanceData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                        <VStack spacing={2} mt={4}>
                          {performanceData.map((item, index) => (
                            <HStack key={index} justify="space-between" w="full">
                              <HStack>
                                <Box w={3} h={3} bg={item.color} borderRadius="sm" />
                                <Text fontSize="sm" color={textColor}>{item.name}</Text>
                              </HStack>
                              <Text fontSize="sm" fontWeight="medium">{item.value}%</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Flex>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Production Actions */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Production Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Button leftIcon={<FiActivity />} colorScheme="green" variant="outline">
                        Record Production
                      </Button>
                      <Button leftIcon={<FiPackage />} colorScheme="blue" variant="outline">
                        Log Feed Usage
                      </Button>
                      <Button leftIcon={<FiBarChart2 />} colorScheme="purple" variant="outline">
                        View Reports
                      </Button>
                      <Button leftIcon={<FiTarget />} colorScheme="orange" variant="outline">
                        Set Targets
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Financial Analytics Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Financial Stats Cards */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Total Revenue</StatLabel>
                        <StatNumber color="green.500">$21,550</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          15.3% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Total Costs</StatLabel>
                        <StatNumber color="red.500">$13,750</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          8.7% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Net Profit</StatLabel>
                        <StatNumber color="blue.500">$7,800</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          28.6% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Profit Margin</StatLabel>
                        <StatNumber color="purple.500">36.2%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          4.1% from last month
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Financial Charts */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Revenue vs Costs Trend</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                          <LineChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#48BB78" strokeWidth={3} name="Revenue" />
                            <Line type="monotone" dataKey="costs" stroke="#E53E3E" strokeWidth={3} name="Costs" />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Profit Growth</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                          <AreaChart data={financialData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="profit" stroke="#38B2AC" fill="#38B2AC" fillOpacity={0.6} name="Profit" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Financial Breakdown */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">Financial Breakdown</Heading>
                      <Badge colorScheme="green" variant="subtle">June 2024</Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <VStack align="stretch" spacing={4}>
                        <Text fontWeight="bold" color="green.500">Revenue Sources</Text>
                        <HStack justify="space-between">
                          <Text color={textColor}>Egg Sales</Text>
                          <Text fontWeight="bold">$3,800</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Chicken Sales</Text>
                          <Text fontWeight="bold">$300</Text>
                        </HStack>
                        <HStack justify="space-between" pt={2} borderTopWidth="1px" borderColor={borderColor}>
                          <Text fontWeight="bold" color={textColor}>Total</Text>
                          <Text fontWeight="bold" color="green.500">$4,100</Text>
                        </HStack>
                      </VStack>

                      <VStack align="stretch" spacing={4}>
                        <Text fontWeight="bold" color="red.500">Cost Breakdown</Text>
                        <HStack justify="space-between">
                          <Text color={textColor}>Feed</Text>
                          <Text fontWeight="bold">$1,800</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Healthcare</Text>
                          <Text fontWeight="bold">$400</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Labor</Text>
                          <Text fontWeight="bold">$300</Text>
                        </HStack>
                        <HStack justify="space-between" pt={2} borderTopWidth="1px" borderColor={borderColor}>
                          <Text fontWeight="bold" color={textColor}>Total</Text>
                          <Text fontWeight="bold" color="red.500">$2,500</Text>
                        </HStack>
                      </VStack>

                      <VStack align="stretch" spacing={4}>
                        <Text fontWeight="bold" color="blue.500">Profitability</Text>
                        <Box>
                          <Text fontSize="sm" color={textColor} mb={2}>
                            Profit Margin: 39.0%
                          </Text>
                          <Progress
                            value={39}
                            colorScheme="blue"
                            size="lg"
                            borderRadius="md"
                          />
                        </Box>
                        <Box>
                          <Text fontSize="sm" color={textColor} mb={2}>
                            ROI: 24.5%
                          </Text>
                          <Progress
                            value={24.5}
                            colorScheme="green"
                            size="lg"
                            borderRadius="md"
                          />
                        </Box>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Financial Actions */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Financial Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Button leftIcon={<FiDollarSign />} colorScheme="green" variant="outline">
                        Record Sale
                      </Button>
                      <Button leftIcon={<FiPackage />} colorScheme="red" variant="outline">
                        Log Expense
                      </Button>
                      <Button leftIcon={<FiBarChart2 />} colorScheme="blue" variant="outline">
                        Generate Report
                      </Button>
                      <Button leftIcon={<FiPercent />} colorScheme="purple" variant="outline">
                        Set Budget
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Growth Trends Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Growth Stats Cards */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Avg Weight</StatLabel>
                        <StatNumber color="green.500">1.2kg</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          Week 6 target
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Mortality Rate</StatLabel>
                        <StatNumber color="orange.500">0.8%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="decrease" />
                          Below target (2%)
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Feed Conversion</StatLabel>
                        <StatNumber color="blue.500">2.2</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          FCR ratio
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardBody>
                      <Stat>
                        <StatLabel color={textColor}>Growth Rate</StatLabel>
                        <StatNumber color="purple.500">95.2%</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          Of expected
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Growth Charts */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Weight Growth Progression</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                          <AreaChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="weight" stroke="#48BB78" fill="#48BB78" fillOpacity={0.6} name="Weight (kg)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Mortality & FCR Trends</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                          <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="mortality" stroke="#E53E3E" strokeWidth={3} name="Mortality %" />
                            <Line type="monotone" dataKey="feed_conversion" stroke="#38B2AC" strokeWidth={3} name="Feed Conversion Ratio" />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Growth Performance Indicators */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Key Performance Indicators</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Icon as={FiTrendingUp} color="green.500" />
                          <Text fontWeight="bold" color={textColor}>Growth Metrics</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Daily Weight Gain</Text>
                          <Text fontWeight="bold" color="green.500">28.5g</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Target Achievement</Text>
                          <Text fontWeight="bold" color="green.500">95.2%</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Uniformity</Text>
                          <Text fontWeight="bold" color="blue.500">87.3%</Text>
                        </HStack>
                      </VStack>

                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Icon as={FiActivity} color="orange.500" />
                          <Text fontWeight="bold" color={textColor}>Health Metrics</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Mortality Rate</Text>
                          <Text fontWeight="bold" color="orange.500">0.8%</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Disease Incidence</Text>
                          <Text fontWeight="bold" color="green.500">0.2%</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Vaccination Coverage</Text>
                          <Text fontWeight="bold" color="green.500">100%</Text>
                        </HStack>
                      </VStack>

                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Icon as={FiCpu} color="purple.500" />
                          <Text fontWeight="bold" color={textColor}>Efficiency Metrics</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Feed Efficiency</Text>
                          <Text fontWeight="bold" color="purple.500">2.2 FCR</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Water Consumption</Text>
                          <Text fontWeight="bold" color="blue.500">4.8L/day</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Space Utilization</Text>
                          <Text fontWeight="bold" color="green.500">92.5%</Text>
                        </HStack>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Growth Actions */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Growth Management Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Button leftIcon={<FiActivity />} colorScheme="green" variant="outline">
                        Weight Check
                      </Button>
                      <Button leftIcon={<FiCpu />} colorScheme="blue" variant="outline">
                        Feed Analysis
                      </Button>
                      <Button leftIcon={<FiTarget />} colorScheme="purple" variant="outline">
                        Set Targets
                      </Button>
                      <Button leftIcon={<FiCalendar />} colorScheme="orange" variant="outline">
                        Schedule Check
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerAnalyticsPage;
