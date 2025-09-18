import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  Grid,
  GridItem,
  VStack,
  HStack,
  Badge,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { 
  FiMapPin, 
  FiLayers, 
  FiUsers, 
  FiActivity, 
  FiBarChart, 
  FiSettings, 
  FiArrowLeft,
  FiCalendar,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle,
  FiDatabase
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { farmAPI } from '../services/api';
import FarmerLayout from '../layouts/FarmerLayout';

const FarmerFarmDetailsPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const { data: farm, isLoading, isError, error } = useQuery(['farmDetails', farmId], () => farmAPI.retrieve(farmId!), {
    enabled: !!farmId
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const statBg = useColorModeValue('gray.50', 'gray.700');

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'partial': return 'yellow';
      case 'inactive': return 'red';
      case 'setup required': return 'orange';
      default: return 'gray';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'purple';
      case 'MANAGER': return 'blue';
      case 'WORKER': return 'teal';
      default: return 'gray';
    }
  };

  const canManage = (farm: any) => {
    const role = farm?.myRole?.toUpperCase();
    return role === 'OWNER' || role === 'MANAGER';
  };

  if (isLoading) {
    return (
      <FarmerLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <Spinner size="lg" color="teal.500" />
        </Box>
      </FarmerLayout>
    );
  }

  if (isError) {
    return (
      <FarmerLayout>
        <Box p={8}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">Failed to load farm details</Text>
              <Text>{error instanceof Error ? error.message : 'Unknown error occurred'}</Text>
            </VStack>
          </Alert>
        </Box>
      </FarmerLayout>
    );
  }

  if (!farm) {
    return (
      <FarmerLayout>
        <Box p={8} textAlign="center">
          <Text color="gray.500">Farm not found</Text>
          <Button mt={4} onClick={() => navigate('/farmer/farms')}>
            Back to My Farms
          </Button>
        </Box>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/farmer/farms')}>
              My Farms
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{farm.farmName}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <HStack justify="space-between" align="start" mb={8} flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={2}>
            <HStack>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate('/farmer/farms')}
              >
                Back
              </Button>
              <Heading size="lg" color="gray.700">{farm.farmName}</Heading>
            </HStack>
            <HStack spacing={3}>
              <Badge 
                colorScheme={getStatusColor(farm.farm_status)} 
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {farm.farm_status || 'Unknown Status'}
              </Badge>
              {farm.myRole && (
                <Badge 
                  colorScheme={getRoleColor(farm.myRole)} 
                  variant="outline"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {farm.myRole}
                </Badge>
              )}
            </HStack>
          </VStack>
          
          {canManage(farm) && (
            <Button
              colorScheme="blue"
              leftIcon={<FiSettings />}
              onClick={() => navigate(`/farmer/farms/${farmId}/manage`)}
            >
              Manage Farm
            </Button>
          )}
        </HStack>

        {/* Farm Overview Stats */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
          <Card bg={cardBg}>
            <CardBody textAlign="center">
              <Icon as={FiDatabase} w={8} h={8} color="blue.500" mb={2} />
              <Stat>
                <StatNumber color="blue.600">{farm.active_devices || 0}/{farm.total_devices || 0}</StatNumber>
                <StatLabel>Active Devices</StatLabel>
                <StatHelpText>
                  {farm.total_devices === 0 ? 'No devices setup' : 
                   farm.active_devices === farm.total_devices ? 'All online' : 
                   'Some offline'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody textAlign="center">
              <Icon as={FiLayers} w={8} h={8} color="green.500" mb={2} />
              <Stat>
                <StatNumber color="green.600">{farm.active_batches || 0}/{farm.total_batches || 0}</StatNumber>
                <StatLabel>Active Batches</StatLabel>
                <StatHelpText>
                  {farm.total_batches === 0 ? 'No batches yet' : 
                   farm.active_batches > 0 ? 'Production active' : 
                   'No active batches'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody textAlign="center">
              <Icon as={FiActivity} w={8} h={8} color="purple.500" mb={2} />
              <Stat>
                <StatNumber color="purple.600">{farm.total_birds || 0}</StatNumber>
                <StatLabel>Total Birds</StatLabel>
                <StatHelpText>
                  {farm.total_birds === 0 ? 'No stock' : 
                   farm.total_birds > 1000 ? 'Large operation' : 
                   'Small-medium scale'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg}>
            <CardBody textAlign="center">
              <Icon as={FiUsers} w={8} h={8} color="orange.500" mb={2} />
              <Stat>
                <StatNumber color="orange.600">{farm.memberships?.length || 0}</StatNumber>
                <StatLabel>Team Members</StatLabel>
                <StatHelpText>
                  {farm.memberships?.length === 1 ? 'Solo operation' : 
                   farm.memberships?.length > 3 ? 'Large team' : 
                   'Small team'}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Detailed Information Tabs */}
        <Tabs>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Team Members</Tab>
            <Tab>Devices</Tab>
            <Tab>Recent Activity</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Farm Information</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="start" spacing={4}>
                      <HStack>
                        <Icon as={FiMapPin} color="gray.500" />
                        <Text><strong>Location:</strong> {farm.location || 'Not specified'}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiLayers} color="gray.500" />
                        <Text><strong>Size:</strong> {farm.farmSize || 'Not specified'}</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCalendar} color="gray.500" />
                        <Text><strong>Last Activity:</strong> {
                          farm.last_activity_date 
                            ? new Date(farm.last_activity_date).toLocaleDateString()
                            : 'No recent activity'
                        }</Text>
                      </HStack>
                      <HStack>
                        <Icon as={FiCheckCircle} color="gray.500" />
                        <Text><strong>Operation Status:</strong> {farm.farm_status || 'Unknown'}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg}>
                  <CardHeader>
                    <Heading size="md">Quick Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3}>
                      <Button
                        w="full"
                        leftIcon={<FiLayers />}
                        onClick={() => navigate(`/farmer/batches?farmId=${farmId}`)}
                      >
                        View Batches
                      </Button>
                      <Button
                        w="full"
                        leftIcon={<FiActivity />}
                        onClick={() => navigate(`/farmer/health?farmId=${farmId}`)}
                      >
                        Health Monitoring
                      </Button>
                      <Button
                        w="full"
                        leftIcon={<FiBarChart />}
                        onClick={() => navigate(`/farmer/analytics?farmId=${farmId}`)}
                      >
                        Analytics
                      </Button>
                      <Button
                        w="full"
                        leftIcon={<FiTrendingUp />}
                        onClick={() => navigate(`/farmer/tasks?farmId=${farmId}`)}
                      >
                        Daily Tasks
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </Grid>
            </TabPanel>

            {/* Team Members Tab */}
            <TabPanel>
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Team Members</Heading>
                </CardHeader>
                <CardBody>
                  {farm.memberships && farm.memberships.length > 0 ? (
                    <VStack spacing={4} align="stretch">
                      {farm.memberships.map((membership: any, index: number) => (
                        <Box key={index} p={4} bg={statBg} borderRadius="md">
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold">{membership.farmer?.farmerName || 'Unknown'}</Text>
                              <Text fontSize="sm" color="gray.600">{membership.farmer?.email || 'No email'}</Text>
                            </VStack>
                            <Badge colorScheme={getRoleColor(membership.role)} variant="solid">
                              {membership.role}
                            </Badge>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="gray.500">No team members found</Text>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Devices Tab */}
            <TabPanel>
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Farm Devices</Heading>
                </CardHeader>
                <CardBody>
                  {farm.devices && farm.devices.length > 0 ? (
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                      {farm.devices.map((device: any) => (
                        <Box key={device.deviceID} p={4} bg={statBg} borderRadius="md">
                          <VStack align="start" spacing={2}>
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="bold">{device.name}</Text>
                              <Badge colorScheme={device.status ? 'green' : 'red'} variant="solid">
                                {device.status ? 'Online' : 'Offline'}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">ID: {device.device_id}</Text>
                            <Text fontSize="sm" color="gray.600">Cell: {device.cell_no || 'N/A'}</Text>
                          </VStack>
                        </Box>
                      ))}
                    </Grid>
                  ) : (
                    <VStack spacing={4} py={8} textAlign="center">
                      <Icon as={FiAlertCircle} w={12} h={12} color="gray.300" />
                      <Text color="gray.500">No devices configured</Text>
                      <Button size="sm" colorScheme="blue" onClick={() => navigate(`/farmer/devices/add?farmId=${farmId}`)}>
                        Add Device
                      </Button>
                    </VStack>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Recent Activity Tab */}
            <TabPanel>
              <Card bg={cardBg}>
                <CardHeader>
                  <Heading size="md">Recent Activity</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} py={8} textAlign="center">
                    <Icon as={FiActivity} w={12} h={12} color="gray.300" />
                    <Text color="gray.500">Activity tracking coming soon</Text>
                    <Text fontSize="sm" color="gray.400">
                      View recent batch activities, feeding schedules, and health monitoring events
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </FarmerLayout>
  );
};

export default FarmerFarmDetailsPage;
