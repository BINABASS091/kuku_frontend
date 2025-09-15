import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const SystemReportsPage: React.FC = () => {
  return (
    <Box p={6}>
      <Heading size="md" mb={4}>System Reports</Heading>
      <Text>View and export system-level reports, including audit logs, admin actions, and system health summaries. Integrate with backend endpoints for real data.</Text>
      {/* TODO: Connect to backend API and display reports */}
    </Box>
  );
};

export default SystemReportsPage;
