import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';
import type { SystemAlertsBannerProps } from '../../dashboard/types';

export function SystemAlertsBanner({ alerts }: SystemAlertsBannerProps) {
  if (!alerts || alerts.length === 0) return null;
  return (
    <Alert status="warning" borderRadius="lg" border="1px solid" borderColor="orange.200">
      <AlertIcon />
      <Box>
        <AlertTitle fontSize="md">System Alerts!</AlertTitle>
        <AlertDescription fontSize="sm">
          You have {alerts.length} system alerts that require attention.
        </AlertDescription>
      </Box>
    </Alert>
  );
}
