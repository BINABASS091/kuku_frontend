import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  Card,
  CardBody,
  Badge,
  Icon,
  useDisclosure,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiTrendingUp, 
  FiDollarSign, 
  FiActivity,
  FiHome,
  FiLayers,
  FiGitBranch,
} from 'react-icons/fi';
import DataManagementModal from '../components/admin/DataManagementModal';
import api, { dashboardAPI, userAPI, farmerAPI, farmAPI, deviceAPI } from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalFarmers: number;
  activeFarms: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalDevices: number;
}

interface RecentActivity {
  id: number;
  message: string;
  timestamp: string;
  type: 'user' | 'farm' | 'device' | 'system';
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState('users');
  
  // Move all useColorModeValue calls to the top level to fix hooks order
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  // Quick Actions colors
  const usersBgColor = useColorModeValue('blue.50', 'blue.900');
  const usersBorderColor = useColorModeValue('blue.100', 'blue.700');
  const usersHoverBorderColor = useColorModeValue('blue.300', 'blue.500');
  const usersTextColor = useColorModeValue('blue.700', 'blue.200');
  
  const farmersBgColor = useColorModeValue('green.50', 'green.900');
  const farmersBorderColor = useColorModeValue('green.100', 'green.700');
  const farmersHoverBorderColor = useColorModeValue('green.300', 'green.500');
  const farmersTextColor = useColorModeValue('green.700', 'green.200');
  
  const farmsBgColor = useColorModeValue('purple.50', 'purple.900');
  const farmsBorderColor = useColorModeValue('purple.100', 'purple.700');
  const farmsHoverBorderColor = useColorModeValue('purple.300', 'purple.500');
  const farmsTextColor = useColorModeValue('purple.700', 'purple.200');
  
  const batchesBgColor = useColorModeValue('orange.50', 'orange.900');
  const batchesBorderColor = useColorModeValue('orange.100', 'orange.700');
  const batchesHoverBorderColor = useColorModeValue('orange.300', 'orange.500');
  const batchesTextColor = useColorModeValue('orange.700', 'orange.200');

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    loadDashboardStats();
    loadRecentActivity();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      console.log('Starting dashboard stats fetch using api instance...');
      
      // Use the api instance which handles authentication automatically
      const [usersResponse, farmersResponse, farmsResponse, subscriptionsResponse, devicesResponse] = await Promise.allSettled([
        userAPI.list(),
        farmerAPI.list(),
        farmAPI.list(),
        api.get('/farmer-subscriptions/'),
        deviceAPI.list()
      ]);

      let totalUsers = 0;
      let totalFarmers = 0;
      let activeFarms = 0;
      let activeSubscriptions = 0;
      let totalDevices = 0;

      // Count users
      if (usersResponse.status === 'fulfilled') {
        const userData = usersResponse.value;
        console.log('Users API Response:', userData);
        totalUsers = userData?.count || userData?.results?.length || 0;
        console.log('Total Users Count:', totalUsers);
      } else {
        console.error('Users API failed:', usersResponse.reason);
      }

      // Count farmers
      if (farmersResponse.status === 'fulfilled') {
        const farmerData = farmersResponse.value;
        console.log('Farmers API Response:', farmerData);
        totalFarmers = farmerData?.count || farmerData?.results?.length || 0;
      } else {
        console.error('Farmers API failed:', farmersResponse.reason);
      }

      // Count farms
      if (farmsResponse.status === 'fulfilled') {
        const farmData = farmsResponse.value;
        console.log('Farms API Response:', farmData);
        activeFarms = farmData?.count || farmData?.results?.length || 0;
      } else {
        console.error('Farms API failed:', farmsResponse.reason);
      }

      // Count subscriptions
      if (subscriptionsResponse.status === 'fulfilled') {
        const subData = subscriptionsResponse.value.data;
        console.log('Subscriptions API Response:', subData);
        activeSubscriptions = subData?.count || subData?.results?.length || 0;
      } else {
        console.error('Subscriptions API failed:', subscriptionsResponse.reason);
      }

      // Count devices
      if (devicesResponse.status === 'fulfilled') {
        const deviceData = devicesResponse.value;
        console.log('Devices API Response:', deviceData);
        totalDevices = deviceData?.count || deviceData?.results?.length || 0;
      } else {
        console.error('Devices API failed:', devicesResponse.reason);
      }

      // Set stats with real counts (will be 0 if no data)
      const finalStats = {
        totalUsers,
        totalFarmers,
        activeFarms,
        monthlyRevenue: 0, // Will be 0 until real revenue data is available
        activeSubscriptions,
        totalDevices,
      };
      
      console.log('Final Dashboard Stats:', finalStats);
      setStats(finalStats);

    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Set all to 0 if everything fails
      setStats({
        totalUsers: 0,
        totalFarmers: 0,
        activeFarms: 0,
        monthlyRevenue: 0,
        activeSubscriptions: 0,
        totalDevices: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      console.log('Loading recent activity using api instance...');
      const activities: RecentActivity[] = [];

      try {
        // Get recent users (last 2)
        const usersResponse = await userAPI.list({ ordering: '-date_joined', limit: 2 });
        const users = usersResponse?.results || [];
        users.forEach((user: any) => {
          activities.push({
            id: Math.random(),
            message: `New user registration: ${user.first_name} ${user.last_name}`,
            timestamp: user.date_joined,
            type: 'user'
          });
        });
      } catch (error) {
        console.log('Could not fetch recent users:', error);
      }

      try {
        // Get recent farms (last 2)
        const farmsResponse = await farmAPI.list({ limit: 2 });
        const farms = farmsResponse?.results || [];
        farms.forEach((farm: any) => {
          activities.push({
            id: Math.random(),
            message: `Farm "${farm.farmName || farm.name}" data updated`,
            timestamp: farm.updated_at || new Date().toISOString(),
            type: 'farm'
          });
        });
      } catch (error) {
        console.log('Could not fetch recent farms:', error);
      }

      // Sort activities by timestamp (most recent first)
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Take only the first 4 activities
      setRecentActivities(activities.slice(0, 4));
      console.log('Recent activities loaded:', activities.slice(0, 4));

    } catch (error) {
      console.error('Failed to load recent activity:', error);
      setRecentActivities([]);
    }
  };

  const handleDataManagement = (tab: string) => {
    setActiveTab(tab);
    onOpen();
  };

  const statsData = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      icon: FiUsers,
      color: 'blue.500',
      change: null as { value: number; isPositive: boolean } | null, // Properly typed
    },
    {
      label: 'Active Farmers',
      value: stats?.totalFarmers ?? 0,
      icon: FiActivity,
      color: 'green.500',
      change: null as { value: number; isPositive: boolean } | null,
    },
    {
      label: 'Active Farms',
      value: stats?.activeFarms ?? 0,
      icon: FiHome,
      color: 'teal.500',
      change: null as { value: number; isPositive: boolean } | null,
    },
    {
      label: 'Monthly Revenue',
      value: stats?.monthlyRevenue ? `$${stats.monthlyRevenue.toLocaleString()}` : '$0',
      icon: FiDollarSign,
      color: 'purple.500',
      change: null as { value: number; isPositive: boolean } | null,
    },
    {
      label: 'Active Subscriptions',
      value: stats?.activeSubscriptions ?? 0,
      icon: FiTrendingUp,
      color: 'orange.500',
      change: null as { value: number; isPositive: boolean } | null,
    },
    {
      label: 'Total Devices',
      value: stats?.totalDevices ?? 0,
      icon: FiLayers,
      color: 'cyan.500',
      change: null as { value: number; isPositive: boolean } | null,
    },
  ];

  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={8}>
          <Spinner size="xl" />
          <Text>Loading dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Admin Dashboard
          </Heading>
          <Text color={textColor}>
            Welcome back! Here's what's happening with your poultry management system.
          </Text>
        </Box>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {statsData.map((stat, index) => (
            <Card key={index} bg={cardBg} boxShadow="lg" borderRadius="xl">
              <CardBody p={6}>
                <Stat>
                  <Flex justify="space-between" align="start" mb={2}>
                    <StatLabel color={textColor} fontSize="sm" fontWeight="medium">
                      {stat.label}
                    </StatLabel>
                    <Icon as={stat.icon} color={stat.color} boxSize={5} />
                  </Flex>
                  <StatNumber color={stat.color} fontSize="2xl" fontWeight="bold" mb={1}>
                    {stat.value}
                  </StatNumber>
                  {stat.change && (
                    <StatHelpText fontSize="xs" mb={0}>
                      <Text as="span" color={stat.change.isPositive ? 'green.500' : 'red.500'}>
                        {stat.change.isPositive ? '↗' : '↘'} {stat.change.value}%
                      </Text>
                      <Text as="span" color={textColor} ml={1}>
                        from last month
                      </Text>
                    </StatHelpText>
                  )}
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Card bg={cardBg} boxShadow="lg" borderRadius="xl" border="1px solid" borderColor={cardBorderColor}>
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="lg" mb={2} color={headingColor}>
                  Quick Actions
                </Heading>
                <Text color={textColor} fontSize="md">
                  Streamline your workflow with instant access to data management tools. 
                  Click any action below to open the management interface.
                </Text>
              </Box>
              
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={6}>
                <VStack
                  spacing={4}
                  p={6}
                  bg={usersBgColor}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={usersBorderColor}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    borderColor: usersHoverBorderColor,
                  }}
                  onClick={() => handleDataManagement('users')}
                >
                  <Icon as={FiUsers} boxSize={8} color="blue.500" />
                  <Text fontWeight="bold" color={usersTextColor}>
                    User Management
                  </Text>
                  <Text fontSize="sm" textAlign="center" color={textColor}>
                    Add, edit, and manage system users and permissions
                  </Text>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  bg={farmersBgColor}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={farmersBorderColor}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    borderColor: farmersHoverBorderColor,
                  }}
                  onClick={() => handleDataManagement('farms')}
                >
                  <Icon as={FiHome} boxSize={8} color="green.500" />
                  <Text fontWeight="bold" color={farmersTextColor}>
                    Farm Management
                  </Text>
                  <Text fontSize="sm" textAlign="center" color={textColor}>
                    Register new farms and update existing farm details
                  </Text>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  bg={farmsBgColor}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={farmsBorderColor}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    borderColor: farmsHoverBorderColor,
                  }}
                  onClick={() => handleDataManagement('batches')}
                >
                  <Icon as={FiLayers} boxSize={8} color="purple.500" />
                  <Text fontWeight="bold" color={farmsTextColor}>
                    Batch Management
                  </Text>
                  <Text fontSize="sm" textAlign="center" color={textColor}>
                    Track and manage poultry batches across farms
                  </Text>
                </VStack>

                <VStack
                  spacing={4}
                  p={6}
                  bg={batchesBgColor}
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={batchesBorderColor}
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    borderColor: batchesHoverBorderColor,
                  }}
                  onClick={() => handleDataManagement('breeds')}
                >
                  <Icon as={FiGitBranch} boxSize={8} color="orange.500" />
                  <Text fontWeight="bold" color={batchesTextColor}>
                    Breed Management
                  </Text>
                  <Text fontSize="sm" textAlign="center" color={textColor}>
                    Manage poultry breeds and their characteristics
                  </Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card bg={cardBg} boxShadow="lg" borderRadius="xl">
          <CardBody p={6}>
            <Heading size="md" mb={4}>Recent Activity</Heading>
            {recentActivities.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {recentActivities.map((activity) => {
                  const timeAgo = getTimeAgo(activity.timestamp);
                  const colorScheme = {
                    user: 'green',
                    farm: 'blue',
                    device: 'orange',
                    system: 'purple'
                  }[activity.type];

                  return (
                    <HStack key={activity.id} justify="space-between">
                      <Text fontSize="sm">{activity.message}</Text>
                      <Badge colorScheme={colorScheme}>{timeAgo}</Badge>
                    </HStack>
                  );
                })}
              </VStack>
            ) : (
              <Text color={textColor} fontSize="sm">
                No recent activity to display. Activity will appear here as users interact with the system.
              </Text>
            )}
          </CardBody>
        </Card>

        {/* Data Management Modal */}
        <DataManagementModal
          isOpen={isOpen}
          onClose={onClose}
          activeTab={activeTab}
        />
      </VStack>
    </Container>
  );
};

export default AdminDashboard;
