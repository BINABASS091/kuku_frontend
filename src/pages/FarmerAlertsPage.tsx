import React from 'react';
import { Box, Heading, Text, VStack, Spinner, Alert, AlertIcon, Badge } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { alertAPI } from '../services/api';

const severityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'yellow';
    default: return 'gray';
  }
};

const FarmerAlertsPage: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery(['farmerAlerts'], () => alertAPI.list());
  const alerts = data?.results || [];

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Recent Alerts</Heading>
      {isLoading && <Spinner />}
      {isError && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error instanceof Error ? error.message : 'Failed to load alerts.'}
        </Alert>
      )}
      <VStack align="stretch" spacing={4}>
        {alerts.length > 0 ? (
          alerts.map((alert: any) => (
            <Box key={alert.alertID} p={4} borderWidth={1} borderRadius="md" bg="white">
              <Heading size="md" mb={1}>{alert.title}</Heading>
              <Text mb={1}>{alert.message}</Text>
              <Badge colorScheme={severityColor(alert.severity)} mr={2}>{alert.severity}</Badge>
              <Text fontSize="sm" color="gray.500">{new Date(alert.timestamp).toLocaleString()}</Text>
              <Text fontSize="sm" color="gray.600">Farm: {alert.farm_details?.name || 'N/A'}</Text>
              {alert.device_details && <Text fontSize="sm" color="gray.600">Device: {alert.device_details.name}</Text>}
              {alert.batch_details && <Text fontSize="sm" color="gray.600">Batch: {alert.batch_details.batch_name}</Text>}
              <Badge colorScheme={alert.is_read ? 'green' : 'red'}>{alert.is_read ? 'Read' : 'Unread'}</Badge>
            </Box>
          ))
        ) : (
          !isLoading && <Text>No alerts found.</Text>
        )}
      </VStack>
    </Box>
  );
};

export default FarmerAlertsPage;
