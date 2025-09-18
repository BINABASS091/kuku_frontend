import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import FarmerLayout from '../layouts/FarmerLayout';
import HealthMonitoring from '../components/farmer/HealthMonitoring';
import { useAuth } from '../context/AuthContext';

const FarmerHealthPage: React.FC = () => {
  const { user } = useAuth();
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Health Monitoring 🏥
          </Heading>
          <Text color={textColor}>
            Monitor your flock's health, manage vaccination schedules, and track health trends
          </Text>
        </Box>

        {/* Health Monitoring Component */}
        <HealthMonitoring farmId={user?.id?.toString()} />
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerHealthPage;
