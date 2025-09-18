import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import FarmerLayout from '../layouts/FarmerLayout';
import ProductionTracker from '../components/farmer/ProductionTracker';
import { useAuth } from '../context/AuthContext';

const FarmerProductionPage: React.FC = () => {
  const { user } = useAuth();
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Production Analytics 📊
          </Heading>
          <Text color={textColor}>
            Track your farm's production performance, trends, and financial metrics
          </Text>
        </Box>

        {/* Production Tracker Component */}
        <ProductionTracker farmId={user?.id?.toString()} />
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerProductionPage;
