import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  useColorModeValue,
  Icon,
  Button,
  Flex,
} from '@chakra-ui/react';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiDollarSign,
  FiPackage,
  FiBarChart2,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays } from 'date-fns';
import SafeChartContainer from '../common/SafeChartContainer';

interface ProductionData {
  date: string;
  eggs: number;
  feed: number;
  weight: number;
  mortality: number;
}

interface ProductionTrackerProps {
  farmId?: string;
  batchId?: string;
}

const ProductionTracker: React.FC<ProductionTrackerProps> = ({ farmId, batchId }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Mock production data - replace with real API calls
  const productionData: ProductionData[] = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return {
        date: format(date, 'MM/dd'),
        eggs: Math.floor(Math.random() * 50) + 200,
        feed: Math.floor(Math.random() * 20) + 80,
        weight: Math.floor(Math.random() * 100) + 1500,
        mortality: Math.floor(Math.random() * 3),
      };
    });
  }, []);

  const currentStats = {
    totalEggs: 1750,
    dailyAverage: 250,
    feedEfficiency: 87,
    mortalityRate: 1.2,
    avgWeight: 1650,
    revenue: 8750,
    feedCost: 1200,
    profit: 7550,
  };

  const performanceData = [
    { name: 'Excellent', value: 65, color: '#10B981' },
    { name: 'Good', value: 25, color: '#F59E0B' },
    { name: 'Average', value: 8, color: '#EF4444' },
    { name: 'Poor', value: 2, color: '#6B7280' },
  ];

  const feedData = productionData.map(item => ({
    date: item.date,
    consumed: item.feed,
    planned: 90,
  }));

  return (
    <VStack spacing={6} align="stretch">
      {/* Key Production Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Total Eggs (7 days)</StatLabel>
              <StatNumber color="green.500" fontSize="2xl">
                {currentStats.totalEggs.toLocaleString()}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% from last week
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Daily Average</StatLabel>
              <StatNumber color="blue.500" fontSize="2xl">
                {currentStats.dailyAverage}
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                8% improvement
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Feed Efficiency</StatLabel>
              <StatNumber color="purple.500" fontSize="2xl">
                {currentStats.feedEfficiency}%
              </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5% better
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color={textColor}>Mortality Rate</StatLabel>
              <StatNumber color="red.500" fontSize="2xl">
                {currentStats.mortalityRate}%
              </StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                2% lower
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Production Charts */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Egg Production Trend</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <SafeChartContainer minHeight={300}>
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="eggs"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </SafeChartContainer>
            </Box>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Feed Consumption</Heading>
          </CardHeader>
          <CardBody>
            <Box h="300px">
              <SafeChartContainer minHeight={300}>
                <BarChart data={feedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="consumed" fill="#3B82F6" name="Consumed" />
                  <Bar dataKey="planned" fill="#E5E7EB" name="Planned" />
                </BarChart>
              </SafeChartContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Financial & Performance Summary */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Financial Performance</Heading>
              <Badge colorScheme="green" variant="subtle">
                This Week
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FiDollarSign} color="green.500" />
                  <Text color={textColor}>Revenue</Text>
                </HStack>
                <Text fontWeight="bold" color="green.500">
                  ${currentStats.revenue.toLocaleString()}
                </Text>
              </HStack>
              
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FiPackage} color="orange.500" />
                  <Text color={textColor}>Feed Cost</Text>
                </HStack>
                <Text fontWeight="bold" color="orange.500">
                  ${currentStats.feedCost.toLocaleString()}
                </Text>
              </HStack>
              
              <HStack justify="space-between" py={2} borderTopWidth="1px" borderColor={borderColor}>
                <HStack>
                  <Icon as={FiTrendingUp} color="blue.500" />
                  <Text fontWeight="bold" color={textColor}>Net Profit</Text>
                </HStack>
                <Text fontWeight="bold" fontSize="lg" color="blue.500">
                  ${currentStats.profit.toLocaleString()}
                </Text>
              </HStack>

              <Box>
                <Text fontSize="sm" color={textColor} mb={2}>
                  Profit Margin: {((currentStats.profit / currentStats.revenue) * 100).toFixed(1)}%
                </Text>
                <Progress
                  value={(currentStats.profit / currentStats.revenue) * 100}
                  colorScheme="blue"
                  size="lg"
                  borderRadius="md"
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Batch Performance</Heading>
          </CardHeader>
          <CardBody>
            <Flex direction="column" h="200px">
              <Box flex="1">
                <SafeChartContainer minHeight={200}>
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
                </SafeChartContainer>
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

      {/* Quick Actions */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
        <CardHeader>
          <Heading size="md">Quick Actions</Heading>
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
            <Button leftIcon={<FiDollarSign />} colorScheme="orange" variant="outline">
              Financial Report
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ProductionTracker;
