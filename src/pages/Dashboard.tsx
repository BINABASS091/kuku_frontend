import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, Text, useToast } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

interface DashboardStats {
  farms: number;
  batches: number;
  active_batches: number;
  total_birds: number;
}

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: stats, isLoading, error } = useQuery<DashboardStats>(
    ['dashboard-stats'],
    async () => {
      try {
        const response = await api.get('/api/dashboard/stats/');
        return response.data;
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        throw new Error('Failed to load dashboard data');
      }
    },
    {
      initialData: { farms: 0, batches: 0, active_batches: 0, total_birds: 0 },
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <Box p={4}>
      <Box mb={8}>
        <Heading size="lg" mb={2}>
          Welcome back, {user?.name || 'User'}!
        </Heading>
        <Text color="gray.500">Here's what's happening with your farm today</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          _dark={{ bg: 'gray.700' }}
        >
          <StatLabel>Total Farms</StatLabel>
          <StatNumber fontSize="2xl" color="brand.500">
            {isLoading ? '...' : stats.farms}
          </StatNumber>
        </Stat>

        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          _dark={{ bg: 'gray.700' }}
        >
          <StatLabel>Total Batches</StatLabel>
          <StatNumber fontSize="2xl" color="brand.500">
            {isLoading ? '...' : stats.batches}
          </StatNumber>
        </Stat>

        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          _dark={{ bg: 'gray.700' }}
        >
          <StatLabel>Active Batches</StatLabel>
          <StatNumber fontSize="2xl" color="brand.500">
            {isLoading ? '...' : stats.active_batches}
          </StatNumber>
        </Stat>

        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          _dark={{ bg: 'gray.700' }}
        >
          <StatLabel>Total Birds</StatLabel>
          <StatNumber fontSize="2xl" color="brand.500">
            {isLoading ? '...' : stats.total_birds}
          </StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
