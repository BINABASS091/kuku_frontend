import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Badge,
  Card,
  CardBody,
  useColorModeValue,
  useToast,
  Spinner,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import MasterDataManager from '../../components/MasterDataManager';
import api from '../../services/api';

type FarmerSubscription = {
  id: number;
  farmerSubscriptionID: number;
  farmerID?: {
    id: number;
    user?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      username?: string;
    };
  };
  subscription_typeID?: {
    id: number;
    subscriptionTypeID: number;
    name: string;
    tier: string;
    farm_size: string;
    cost: number;
    max_hardware_nodes: number;
    max_software_services: number;
  };
  start_date: string;
  end_date?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  status_display?: string;
  auto_renew: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  utilization?: {
    hardware: {
      used: number;
      limit: number;
      available: number;
    };
    software: {
      used: number;
      limit: number;
      available: number;
    };
  };
};

type SubscriptionStats = {
  total_subscriptions: number;
  active_subscriptions: number;
  pending_subscriptions: number;
  expired_subscriptions: number;
  total_revenue: number;
  monthly_revenue: number;
  hardware_utilization: number;
  software_utilization: number;
};

export default function SubscriptionManagement() {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [subscriptionTypes, setSubscriptionTypes] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchStats();
    fetchSubscriptionTypes();
    fetchFarmers();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await api.get('/subscriptions/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription statistics',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchSubscriptionTypes = async () => {
    try {
      const response = await api.get('/subscription-types/');
      const types = response.data.results || response.data || [];
      setSubscriptionTypes(Array.isArray(types) ? types : []);
    } catch (error) {
      console.error('Error fetching subscription types:', error);
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await api.get('/farmers/');
      const farmersData = response.data.results || response.data || [];
      setFarmers(Array.isArray(farmersData) ? farmersData : []);
    } catch (error) {
      console.error('Error fetching farmers:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'yellow';
      case 'SUSPENDED': return 'orange';
      case 'CANCELLED': return 'red';
      case 'EXPIRED': return 'gray';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFarmerName = (farmer: any) => {
    if (!farmer) return 'Unknown Farmer';
    if (farmer.user) {
      const firstName = farmer.user.first_name || '';
      const lastName = farmer.user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      return fullName || farmer.user.username || farmer.user.email || 'Unknown Farmer';
    }
    return `Farmer #${farmer.id}`;
  };

  if (isLoadingStats) {
    return (
      <Box p={6} bg={bgColor} minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading subscription management...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        <Heading size="lg" mb={4}>All Subscriptions Management</Heading>

        {/* Statistics Cards */}
        {stats && (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Total Subscriptions</StatLabel>
                  <StatNumber>{stats.total_subscriptions}</StatNumber>
                  <StatHelpText>All time subscriptions</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Active Subscriptions</StatLabel>
                  <StatNumber color="green.500">{stats.active_subscriptions}</StatNumber>
                  <StatHelpText>Currently active</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Pending Subscriptions</StatLabel>
                  <StatNumber color="yellow.500">{stats.pending_subscriptions}</StatNumber>
                  <StatHelpText>Awaiting payment</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg}>
              <CardBody>
                <Stat>
                  <StatLabel>Monthly Revenue</StatLabel>
                  <StatNumber color="green.500">{formatCurrency(stats.monthly_revenue || 0)}</StatNumber>
                  <StatHelpText>This month</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Subscription Management Interface */}
        <Card bg={cardBg}>
          <CardBody>
            <MasterDataManager<FarmerSubscription>
              title="Farmer Subscriptions"
              endpoint="farmer-subscriptions/"
              columns={[
                { 
                  key: 'farmerID', 
                  header: 'Farmer', 
                  render: (r) => getFarmerName(r.farmerID)
                },
                { 
                  key: 'subscription_typeID', 
                  header: 'Subscription Plan', 
                  render: (r) => r.subscription_typeID?.name || 'No Plan'
                },
                { 
                  key: 'subscription_typeID', 
                  header: 'Tier', 
                  render: (r) => r.subscription_typeID?.tier || '-'
                },
                { 
                  key: 'subscription_typeID', 
                  header: 'Cost', 
                  render: (r) => r.subscription_typeID ? formatCurrency(r.subscription_typeID.cost) : '-'
                },
                { 
                  key: 'status', 
                  header: 'Status', 
                  render: (r) => (
                    <Badge colorScheme={getStatusColor(r.status)}>
                      {r.status}
                    </Badge>
                  )
                },
                { 
                  key: 'start_date', 
                  header: 'Start Date', 
                  render: (r) => formatDate(r.start_date)
                },
                { 
                  key: 'end_date', 
                  header: 'End Date', 
                  render: (r) => r.end_date ? formatDate(r.end_date) : '-'
                },
                { 
                  key: 'auto_renew', 
                  header: 'Auto Renew', 
                  render: (r) => r.auto_renew ? 'Yes' : 'No'
                },
                { 
                  key: 'utilization', 
                  header: 'Resource Usage', 
                  render: (r) => r.utilization ? 
                    `HW: ${r.utilization.hardware.used}/${r.utilization.hardware.limit}, SW: ${r.utilization.software.used}/${r.utilization.software.limit}` 
                    : '-'
                },
              ]}
              fields={[
                { 
                  type: 'select', 
                  name: 'farmerID', 
                  label: 'Farmer', 
                  required: true,
                  options: farmers.map(farmer => ({
                    label: getFarmerName(farmer),
                    value: farmer.id || farmer.farmerID
                  }))
                },
                { 
                  type: 'select', 
                  name: 'subscription_typeID', 
                  label: 'Subscription Type', 
                  required: true,
                  options: subscriptionTypes.map(type => ({
                    label: `${type.name} (${type.tier}) - ${formatCurrency(type.cost)}`,
                    value: type.id || type.subscriptionTypeID
                  }))
                },
                { 
                  type: 'select', 
                  name: 'status', 
                  label: 'Status',
                  options: [
                    { label: 'Active', value: 'ACTIVE' },
                    { label: 'Pending', value: 'PENDING' },
                    { label: 'Suspended', value: 'SUSPENDED' },
                    { label: 'Cancelled', value: 'CANCELLED' },
                    { label: 'Expired', value: 'EXPIRED' }
                  ]
                },
                { type: 'text', name: 'start_date', label: 'Start Date (YYYY-MM-DD)', required: true, placeholder: 'e.g., 2024-01-01' },
                { type: 'text', name: 'end_date', label: 'End Date (YYYY-MM-DD, optional)', placeholder: 'e.g., 2024-12-31' },
                { 
                  type: 'select', 
                  name: 'auto_renew', 
                  label: 'Auto Renew',
                  options: [
                    { label: 'Yes', value: 'true' },
                    { label: 'No', value: 'false' }
                  ]
                },
                { type: 'textarea', name: 'notes', label: 'Notes (optional)', placeholder: 'Additional notes about this subscription' },
              ]}
              normalizeIn={(v) => ({
                ...v,
                farmerID: Number(v.farmerID),
                subscription_typeID: Number(v.subscription_typeID),
                auto_renew: v.auto_renew === 'true' || v.auto_renew === true
              })}
            />
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
