import React from 'react';
import { Box, Heading, Text, VStack, Spinner, Badge, HStack, Icon, Circle } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { activityAPI } from '../services/api';
import { FiActivity, FiHeart, FiTrendingUp, FiCheckCircle, FiClock } from 'react-icons/fi';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'feeding': return 'blue';
    case 'health': return 'red';
    case 'production': return 'green';
    case 'maintenance': return 'purple';
    default: return 'gray';
  }
};
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'feeding': return FiActivity;
    case 'health': return FiHeart;
    case 'production': return FiTrendingUp;
    case 'maintenance': return FiCheckCircle;
    default: return FiClock;
  }
};

const FarmerActivitiesPage: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery(['farmerActivities'], () => activityAPI.list({ ordering: '-created_at' }));
  const activities = data?.results || [];

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>All Activities</Heading>
      {isLoading && <Spinner />}
      {isError && (
        <Text color="red.500">{error instanceof Error ? error.message : 'Failed to load activities.'}</Text>
      )}
      <VStack align="stretch" spacing={4}>
        {activities.length > 0 ? (
          activities.map((activity: any, idx: number) => (
            <HStack key={activity.id || idx} spacing={3} p={4} borderWidth={1} borderRadius="md" bg="white">
              <Circle size="8" bg={`${getTypeColor(activity.type)}.100`}>
                <Icon as={getTypeIcon(activity.type)} size="4" color={`${getTypeColor(activity.type)}.500`} />
              </Circle>
              <VStack align="start" spacing={0} flex="1">
                <Text fontSize="sm" fontWeight="medium">
                  {activity.action || activity.activity_type || 'Activity'}
                </Text>
                <HStack spacing={2}>
                  <Text fontSize="xs" color="gray.600">
                    {activity.batchName || activity.batch || ''}
                  </Text>
                  <Text fontSize="xs" color="gray.600">•</Text>
                  <Text fontSize="xs" color="gray.600">
                    {activity.timestamp || activity.created_at || ''}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
          ))
        ) : (
          !isLoading && <Text>No activities found.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default FarmerActivitiesPage;
