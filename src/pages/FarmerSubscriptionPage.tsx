import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import FarmerLayout from '../layouts/FarmerLayout';
import SubscriptionManager from '../components/farmer/SubscriptionManager';
import { useAuth } from '../context/AuthContext';

const FarmerSubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Subscription Management 💳
          </Heading>
          <Text color={textColor}>
            Manage your subscription plan, track usage, and handle billing
          </Text>
        </Box>

        {/* Subscription Manager Component */}
        <SubscriptionManager farmerId={user?.id?.toString()} />
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerSubscriptionPage;
