import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import FarmerLayout from '../layouts/FarmerLayout';
import SubscriptionManager from '../components/farmer/SubscriptionManager';
import { useAuth } from '../context/AuthContext';

const FarmerSubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            {t('subscriptionManagement')} 💳
          </Heading>
          <Text color={textColor}>
            {t('manageSubscriptionPlan')}
          </Text>
        </Box>

        {/* Subscription Manager Component */}
        <SubscriptionManager farmerId={user?.id?.toString()} />
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerSubscriptionPage;
