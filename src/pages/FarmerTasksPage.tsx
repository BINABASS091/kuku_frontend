import React from 'react';
import { Box, Heading, Text, VStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchFarmerTasks } from '../services/farmerTasks';

const FarmerTasksPage: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery(['farmerTasks'], fetchFarmerTasks);

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>All Tasks</Heading>
      {isLoading && <Spinner />}
      {isError && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error instanceof Error ? error.message : 'Failed to load tasks.'}
        </Alert>
      )}
      <VStack align="stretch" spacing={4}>
        {data && data.length > 0 ? (
          data.map((task: any) => (
            <Box key={task.batchActivityID || task.id} p={4} borderWidth={1} borderRadius="md" bg="white">
              <Heading size="md">{task.batchActivityName || 'Task'}</Heading>
              <Text>Date: {task.batchActivityDate ? new Date(task.batchActivityDate).toLocaleDateString() : 'N/A'}</Text>
              <Text>Details: {task.batchActivityDetails || 'No details'}</Text>
              <Text>Cost: {task.batchAcitivtyCost ? `₦${task.batchAcitivtyCost}` : 'N/A'}</Text>
              <Text>Batch: {task.batchID || 'N/A'}</Text>
            </Box>
          ))
        ) : (
          !isLoading && <Text>No tasks found.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default FarmerTasksPage;
