
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Badge,
  Button,
  Flex,
  Stack,
  useColorModeValue,
  Icon,
  Grid,
  GridItem,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FiMapPin, FiLayers, FiCheckCircle, FiUsers, FiActivity, FiSettings, FiEye, FiPlus, FiBarChart, FiTrendingUp, FiAlertTriangle, FiClock, FiDatabase, FiTarget } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { farmAPI } from '../services/api';
import FarmerLayout from '../layouts/FarmerLayout';
import { useNavigate } from 'react-router-dom';


const MyFarmsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Fetch only farms for the logged-in farmer
  const { data, isLoading, isError, error } = useQuery(['myFarms'], () => farmAPI.list());
  const farms = data?.results || data || [];

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const statBg = useColorModeValue('gray.50', 'gray.700');

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'partial': return 'yellow';
      case 'inactive': return 'red';
      case 'setup required': return 'orange';
      default: return 'gray';
    }
  };

  // Helper function to get role color
  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'purple';
      case 'MANAGER': return 'blue';
      case 'WORKER': return 'teal';
      default: return 'gray';
    }
  };

  // Check if user can manage farm (Owner or Manager)
  const canManage = (farm: any) => {
    const role = farm.myRole?.toUpperCase();
    return role === 'OWNER' || role === 'MANAGER';
  };

  // Check if user can perform operations (not just a Worker)
  const canOperate = (farm: any) => {
    const role = farm.myRole?.toUpperCase();
    return role === 'OWNER' || role === 'MANAGER' || role === 'WORKER';
  };

  // Quick action handlers
  const handleQuickAction = (action: string, farm: any) => {
    if (!canOperate(farm)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    switch (action) {
      case 'batches':
        navigate(`/farmer/batches?farmId=${farm.farmID}`);
        break;
      case 'addBatch':
        navigate(`/farmer/batches/add?farmId=${farm.farmID}`);
        break;
      case 'tasks':
        navigate(`/farmer/tasks?farmId=${farm.farmID}`);
        break;
      case 'analytics':
        navigate(`/farmer/analytics?farmId=${farm.farmID}`);
        break;
      case 'health':
        navigate(`/farmer/health?farmId=${farm.farmID}`);
        break;
      default:
        break;
    }
  };

  const EmptyState = () => (
    <Box textAlign="center" py={10}>
      <Icon as={FiPlus} w={16} h={16} color="gray.300" mb={4} />
      <Heading size="md" color="gray.500" mb={2}>No Farms Yet</Heading>
      <Text color="gray.400" mb={6}>Start your poultry journey by adding your first farm.</Text>
      <Button 
        colorScheme="teal" 
        leftIcon={<FiPlus />} 
        onClick={() => navigate('/farmer/farms/add')}
      >
        Add Your First Farm
      </Button>
    </Box>
  );

  return (
    <FarmerLayout>
      <Box px={{ base: 4, md: 8 }} py={8}>
        <Flex align="center" justify="space-between" mb={8} flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.700">My Farms</Heading>
            <Text color="gray.500">Manage and monitor your poultry operations</Text>
          </VStack>
          <Button 
            colorScheme="teal" 
            variant="solid" 
            size="md" 
            leftIcon={<FiPlus />}
            onClick={() => navigate('/farmer/farms/add')}
            shadow="md"
          >
            Add New Farm
          </Button>
        </Flex>

        {isLoading && (
          <Flex justify="center" py={10}>
            <Spinner size="lg" color="teal.500" />
          </Flex>
        )}

        {isError && (
          <Alert status="error" mb={6} borderRadius="lg">
            <AlertIcon />
            {error instanceof Error ? error.message : 'Failed to load farms.'}
          </Alert>
        )}

        {!isLoading && farms.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Farm Summary Stats */}
            {farms.length > 0 && (
              <Box mb={6} p={4} bg={cardBg} borderRadius="lg" shadow="sm">
                <Text fontSize="sm" color="gray.600" mb={2}>Your Operation Overview</Text>
                <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={4}>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                      {farms.length}
                    </Text>
                    <Text fontSize="xs" color="gray.500">Total Farms</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      {farms.reduce((sum, farm) => sum + (farm.total_devices || 0), 0)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">Total Devices</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                      {farms.reduce((sum, farm) => sum + (farm.active_batches || 0), 0)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">Active Batches</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      {farms.reduce((sum, farm) => sum + (farm.total_birds || 0), 0)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">Total Birds</Text>
                  </Box>
                </Grid>
              </Box>
            )}

            {/* Farm Cards Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
            {farms.map((farm: any) => (
              <Box
                key={farm.farmID}
                bg={cardBg}
                boxShadow={cardShadow}
                borderRadius="xl"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
                borderWidth={1}
                borderColor="gray.200"
              >
                {/* Header */}
                <Box p={6} pb={4}>
                  <HStack justify="space-between" align="start" mb={3}>
                    <VStack align="start" spacing={1} flex={1}>
                      <Heading size="md" color="gray.700" noOfLines={1}>
                        {farm.farmName}
                      </Heading>
                      <HStack spacing={2}>
                        <Badge 
                          colorScheme={getStatusColor(farm.farm_status)} 
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {farm.farm_status || 'Unknown'}
                        </Badge>
                        {farm.myRole && (
                          <Badge 
                            colorScheme={getRoleColor(farm.myRole)} 
                            variant="outline"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {farm.myRole}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>

                  {/* Farm Info */}
                  <VStack align="start" spacing={2} mb={4}>
                    <HStack color="gray.600" fontSize="sm">
                      <Icon as={FiMapPin} />
                      <Text noOfLines={1}>{farm.location || 'Location not set'}</Text>
                    </HStack>
                    <HStack color="gray.600" fontSize="sm">
                      <Icon as={FiLayers} />
                      <Text>Size: {farm.farmSize || 'Not specified'}</Text>
                    </HStack>
                  </VStack>

                  {/* Stats Grid */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3} mb={4}>
                    <GridItem>
                      <Tooltip label={`${farm.active_devices || 0} active out of ${farm.total_devices || 0} total devices`} hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => handleQuickAction('health', farm)}
                          _hover={{ bg: useColorModeValue('blue.50', 'blue.900') }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>DEVICES</Text>
                          <Text fontSize="lg" fontWeight="bold" color="blue.600">
                            {farm.active_devices || 0}/{farm.total_devices || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.total_devices === 0 ? 'Setup needed' : 
                             farm.active_devices === farm.total_devices ? 'All online' : 
                             'Some offline'}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                    <GridItem>
                      <Tooltip label={`${farm.active_batches || 0} active out of ${farm.total_batches || 0} total batches`} hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => handleQuickAction('batches', farm)}
                          _hover={{ bg: useColorModeValue('green.50', 'green.900') }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>BATCHES</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            {farm.active_batches || 0}/{farm.total_batches || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.total_batches === 0 ? 'No batches' : 
                             farm.active_batches > 0 ? 'Production active' : 
                             'All completed'}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                    <GridItem>
                      <Tooltip label="Total birds across all active batches" hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => handleQuickAction('analytics', farm)}
                          _hover={{ bg: useColorModeValue('purple.50', 'purple.900') }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>TOTAL BIRDS</Text>
                          <Text fontSize="lg" fontWeight="bold" color="purple.600">
                            {farm.total_birds || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.total_birds === 0 ? 'No stock' : 
                             farm.total_birds > 1000 ? 'Large operation' : 
                             'Small-medium'}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                    <GridItem>
                      <Tooltip label="Farm team members and their roles" hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => navigate(`/farmer/farms/${farm.farmID}/team`)}
                          _hover={{ bg: useColorModeValue('orange.50', 'orange.900') }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>TEAM</Text>
                          <Text fontSize="lg" fontWeight="bold" color="orange.600">
                            {farm.memberships?.length || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.memberships?.length === 1 ? 'Solo operation' : 
                             farm.memberships?.length > 3 ? 'Large team' : 
                             'Small team'}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                  </Grid>
                </Box>

                {/* Actions */}
                <Box p={4} pt={0}>
                  {/* Primary Actions */}
                  <HStack spacing={2} mb={3}>
                    <Button 
                      size="sm" 
                      colorScheme="teal" 
                      variant="outline" 
                      leftIcon={<FiEye />}
                      onClick={() => navigate(`/farmer/farms/${farm.farmID}`)}
                      flex={1}
                    >
                      View Details
                    </Button>
                    <Tooltip 
                      label={!canManage(farm) ? "Only owners and managers can edit farms" : ""} 
                      hasArrow
                    >
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        variant={canManage(farm) ? "solid" : "outline"}
                        leftIcon={<FiSettings />}
                        onClick={() => {
                          if (canManage(farm)) {
                            navigate(`/farmer/farms/${farm.farmID}/manage`);
                          } else {
                            toast({
                              title: "Access Denied",
                              description: "Only farm owners and managers can edit farm settings.",
                              status: "warning",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                        }}
                        isDisabled={!canManage(farm)}
                        flex={1}
                      >
                        Manage
                      </Button>
                    </Tooltip>
                  </HStack>

                  {/* Quick Actions Grid */}
                  <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                    <Tooltip label="View and manage batches" hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiLayers />}
                        onClick={() => handleQuickAction('batches', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        Batches
                      </Button>
                    </Tooltip>
                    <Tooltip label="Daily tasks and activities" hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiClock />}
                        onClick={() => handleQuickAction('tasks', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        Tasks
                      </Button>
                    </Tooltip>
                    <Tooltip label="Health monitoring" hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiActivity />}
                        onClick={() => handleQuickAction('health', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        Health
                      </Button>
                    </Tooltip>
                    <Tooltip label="Farm analytics" hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiBarChart />}
                        onClick={() => handleQuickAction('analytics', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        Analytics
                      </Button>
                    </Tooltip>
                    <Tooltip label="Add new batch" hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiPlus />}
                        onClick={() => handleQuickAction('addBatch', farm)}
                        isDisabled={!canManage(farm)}
                        fontSize="xs"
                        p={2}
                        colorScheme="green"
                      >
                        Add Batch
                      </Button>
                    </Tooltip>
                    <Tooltip label="Performance tracking" hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiTrendingUp />}
                        onClick={() => navigate(`/farmer/performance?farmId=${farm.farmID}`)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        Track
                      </Button>
                    </Tooltip>
                  </Grid>

                  {/* Status Indicator */}
                  {farm.farm_status === 'Setup Required' && (
                    <Box mt={3} p={2} bg="orange.50" borderRadius="md" borderLeft="3px solid" borderColor="orange.400">
                      <HStack>
                        <Icon as={FiAlertTriangle} color="orange.500" />
                        <Text fontSize="xs" color="orange.700">
                          Complete farm setup to start operations
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          </>
        )}
      </Box>
    </FarmerLayout>
  );
};

export default MyFarmsPage;
