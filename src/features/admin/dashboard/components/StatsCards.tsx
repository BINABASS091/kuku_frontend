import { 
  SimpleGrid, 
  Card, 
  CardBody, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  StatArrow, 
  useColorModeValue, 
  CircularProgress, 
  CircularProgressLabel, 
  HStack, 
  Text, 
  Icon,
  Skeleton,
  SkeletonText,
  VStack,
  Flex,
  Badge
} from '@chakra-ui/react';
import { 
  ViewIcon, 
  SettingsIcon, 
  StarIcon,
  CheckCircleIcon,
  InfoIcon,
  AddIcon
} from '@chakra-ui/icons';
import type { StatsCardsProps } from '../types';

// Enhanced stat card interface
interface StatCardData {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  borderColor: string;
  change?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  status?: 'excellent' | 'good' | 'warning' | 'critical';
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Format stats data with proper fallbacks
  const statsData: StatCardData[] = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: ViewIcon,
      color: 'blue.500',
      borderColor: useColorModeValue('blue.100', 'blue.800'),
      change: {
        value: 12,
        isPositive: true,
        period: 'from last month'
      }
    },
    {
      label: 'Active Farmers',
      value: stats?.totalFarmers ?? 0,
      icon: AddIcon,
      color: 'green.500',
      borderColor: useColorModeValue('green.100', 'green.800'),
      change: {
        value: 8,
        isPositive: true,
        period: 'from last month'
      }
    },
    {
      label: 'Active Farms',
      value: stats?.activeFarms ?? 0,
      icon: SettingsIcon,
      color: 'teal.500',
      borderColor: useColorModeValue('teal.100', 'teal.800'),
      change: {
        value: 5,
        isPositive: true,
        period: 'from last month'
      }
    },
    {
      label: 'Monthly Revenue',
      value: stats?.monthlyRevenue ? `$${stats.monthlyRevenue.toLocaleString()}` : '$0',
      icon: StarIcon,
      color: 'purple.500',
      borderColor: useColorModeValue('purple.100', 'purple.800'),
      change: {
        value: 15,
        isPositive: true,
        period: 'from last month'
      }
    },
    {
      label: 'Active Subscriptions',
      value: stats?.activeSubscriptions ?? 0,
      icon: CheckCircleIcon,
      color: 'orange.500',
      borderColor: useColorModeValue('orange.100', 'orange.800'),
      change: {
        value: 10,
        isPositive: true,
        period: 'from last month'
      }
    },
    {
      label: 'Total Devices',
      value: stats?.totalDevices ?? 0,
      icon: InfoIcon,
      color: 'cyan.500',
      borderColor: useColorModeValue('cyan.100', 'cyan.800'),
      change: {
        value: 3,
        isPositive: true,
        period: 'from last month'
      }
    },
    {
      label: 'Batches',
      value: stats?.batches ?? 0,
      icon: SettingsIcon,
      color: 'blue.500',
      borderColor: useColorModeValue('blue.100', 'blue.800'),
    },
    {
      label: 'Activities',
      value: stats?.activities ?? 0,
      icon: SettingsIcon,
      color: 'green.500',
      borderColor: useColorModeValue('green.100', 'green.800'),
    },
    {
      label: 'Sensor Readings',
      value: stats?.sensorReadings ?? 0,
      icon: SettingsIcon,
      color: 'orange.500',
      borderColor: useColorModeValue('orange.100', 'orange.800'),
    },
    {
      label: 'Alerts',
      value: stats?.alerts ?? 0,
      icon: SettingsIcon,
      color: 'red.500',
      borderColor: useColorModeValue('red.100', 'red.800'),
    },
  ];

  // System health card is separate due to special formatting
  const getSystemHealthStatus = (health: number) => {
    if (health >= 95) return { status: 'Excellent', color: 'green.500', bg: 'green.50' };
    if (health >= 85) return { status: 'Good', color: 'yellow.500', bg: 'yellow.50' };
    if (health >= 70) return { status: 'Warning', color: 'orange.500', bg: 'orange.50' };
    return { status: 'Critical', color: 'red.500', bg: 'red.50' };
  };

  const systemHealth = stats?.systemHealth || 95;
  const healthStatus = getSystemHealthStatus(systemHealth);

  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} bg={cardBg} boxShadow="lg" borderRadius="xl" border="1px solid" borderColor={borderColor}>
            <CardBody p={6}>
              <VStack align="start" spacing={3}>
                <Skeleton height="20px" width="100px" />
                <Skeleton height="32px" width="80px" />
                <SkeletonText noOfLines={1} spacing="4" width="120px" />
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {/* Regular stat cards */}
      {statsData.map((stat, index) => (
        <Card 
          key={index}
          bg={cardBg} 
          boxShadow="lg" 
          borderRadius="xl" 
          border="1px solid" 
          borderColor={stat.borderColor}
          _hover={{ 
            transform: 'translateY(-2px)', 
            boxShadow: 'xl',
            transition: 'all 0.2s'
          }}
        >
          <CardBody p={6}>
            <Stat>
              <Flex justify="space-between" align="start" mb={2}>
                <StatLabel color={textColor} fontSize="sm" fontWeight="medium">
                  {stat.label}
                </StatLabel>
                <Icon 
                  as={stat.icon} 
                  boxSize={5} 
                  color={stat.color}
                />
              </Flex>
              <StatNumber color={stat.color} fontSize="2xl" fontWeight="bold" mb={1}>
                {stat.value}
              </StatNumber>
              {stat.change && (
                <StatHelpText fontSize="xs" mb={0}>
                  <StatArrow type={stat.change.isPositive ? "increase" : "decrease"} />
                  {stat.change.value}% {stat.change.period}
                </StatHelpText>
              )}
            </Stat>
          </CardBody>
        </Card>
      ))}

      {/* System Health Card - Special formatting */}
      <Card 
        bg={cardBg} 
        boxShadow="lg" 
        borderRadius="xl" 
        border="1px solid" 
        borderColor={useColorModeValue('green.100', 'green.800')}
        _hover={{ 
          transform: 'translateY(-2px)', 
          boxShadow: 'xl',
          transition: 'all 0.2s'
        }}
      >
        <CardBody p={6}>
          <Stat>
            <Flex justify="space-between" align="start" mb={3}>
              <StatLabel color={textColor} fontSize="sm" fontWeight="medium">
                System Health
              </StatLabel>
              <Icon 
                as={CheckCircleIcon} 
                boxSize={5} 
                color="green.500"
              />
            </Flex>
            <HStack spacing={4}>
              <CircularProgress 
                value={systemHealth} 
                color={healthStatus.color} 
                size="60px" 
                thickness="8px"
                capIsRound
              >
                <CircularProgressLabel fontSize="sm" fontWeight="bold" color={healthStatus.color}>
                  {systemHealth}%
                </CircularProgressLabel>
              </CircularProgress>
              <VStack align="start" spacing={1}>
                <Badge 
                  colorScheme={healthStatus.color.split('.')[0]} 
                  variant="subtle" 
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {healthStatus.status}
                </Badge>
                <Text fontSize="xs" color={textColor}>
                  All systems operational
                </Text>
              </VStack>
            </HStack>
          </Stat>
        </CardBody>
      </Card>

      {/* Pending Tasks Card */}
      <Card 
        bg={cardBg} 
        boxShadow="lg" 
        borderRadius="xl" 
        border="1px solid" 
        borderColor={useColorModeValue('red.100', 'red.800')}
        _hover={{ 
          transform: 'translateY(-2px)', 
          boxShadow: 'xl',
          transition: 'all 0.2s'
        }}
      >
        <CardBody p={6}>
          <Stat>
            <Flex justify="space-between" align="start" mb={2}>
              <StatLabel color={textColor} fontSize="sm" fontWeight="medium">
                Pending Tasks
              </StatLabel>
              <Badge 
                colorScheme={stats?.pendingTasks && stats.pendingTasks > 0 ? 'red' : 'green'} 
                variant="solid"
                borderRadius="full"
                fontSize="xs"
              >
                {stats?.pendingTasks || 0}
              </Badge>
            </Flex>
            <StatNumber color="red.500" fontSize="2xl" fontWeight="bold" mb={1}>
              {stats?.pendingTasks || 0}
            </StatNumber>
            <StatHelpText fontSize="xs" mb={0}>
              Tasks require attention
            </StatHelpText>
          </Stat>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
}
