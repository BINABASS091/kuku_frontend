import { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Alert, 
  AlertIcon, 
  VStack,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Button,
  Select,
  HStack,
  Flex,
  useToast,
  Spinner,
  Center
} from '@chakra-ui/react';
import { RepeatIcon, DownloadIcon } from '@chakra-ui/icons';

interface FarmPerformanceData {
  total_farms: number;
  avg_productivity: number;
  health_score: number;
  efficiency: number;
  total_birds: number;
  active_devices: number;
  total_devices: number;
}

export default function FarmPerformancePage() {
  const [data, setData] = useState<FarmPerformanceData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30_days');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch real data from the backend
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/reports/farm-performance/?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        // If no real data available, keep it empty
        setData(null);
        if (response.status === 404) {
          setError('No farm performance data available');
        } else {
          setError('Unable to fetch farm performance data');
        }
      }
    } catch (error) {
      console.error('Error fetching farm performance data:', error);
      setData(null);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleExport = () => {
    toast({
      title: 'Export Started',
      description: 'Farm performance report is being generated...',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={2}>Farm Performance Analytics</Heading>
            <Text color="gray.600">
              Comprehensive performance metrics and analytics for all farms
            </Text>
          </Box>
          <HStack spacing={4} wrap="wrap">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              w="200px"
              variant="filled"
            >
              <option value="7_days">Last 7 Days</option>
              <option value="30_days">Last 30 Days</option>
              <option value="90_days">Last 3 Months</option>
              <option value="1_year">Last Year</option>
            </Select>
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="blue"
              variant="outline"
              onClick={handleRefresh}
              isLoading={isLoading}
            >
              Refresh
            </Button>
            <Button
              leftIcon={<DownloadIcon />}
              colorScheme="green"
              onClick={handleExport}
              isDisabled={!data}
            >
              Export Report
            </Button>
          </HStack>
        </Flex>

        {/* Loading State */}
        {isLoading && (
          <Center py={10}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" />
              <Text>Loading farm performance data...</Text>
            </VStack>
          </Center>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Alert status="warning">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        )}

        {/* Data Display */}
        {!isLoading && !error && data && (
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Farms</StatLabel>
                  <StatNumber>{data.total_farms}</StatNumber>
                  <StatHelpText>Active operations</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Avg Productivity</StatLabel>
                  <StatNumber>{data.avg_productivity?.toFixed(1)}%</StatNumber>
                  <StatHelpText>Farm efficiency</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Health Score</StatLabel>
                  <StatNumber>{data.health_score?.toFixed(1)}%</StatNumber>
                  <StatHelpText>Overall health</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Efficiency</StatLabel>
                  <StatNumber>{data.efficiency?.toFixed(1)}%</StatNumber>
                  <StatHelpText>Operational efficiency</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Birds</StatLabel>
                  <StatNumber>{data.total_birds?.toLocaleString()}</StatNumber>
                  <StatHelpText>Active population</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Device Status</StatLabel>
                  <StatNumber>{data.active_devices}/{data.total_devices}</StatNumber>
                  <StatHelpText>
                    <Badge colorScheme={data.active_devices === data.total_devices ? "green" : "orange"}>
                      {data.total_devices > 0 ? Math.round((data.active_devices / data.total_devices) * 100) : 0}% online
                    </Badge>
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Empty State */}
        {!isLoading && !error && !data && (
          <Alert status="info">
            <AlertIcon />
            <Text>No farm performance data available at this time.</Text>
          </Alert>
        )}
      </VStack>
    </Box>
  );
}
