import { Heading, Box, Text, SimpleGrid } from '@chakra-ui/react';

export default function FarmerDashboard() {
  // This would typically come from an API call
  const farmStats = [
    { name: 'Total Chickens', value: '1,250' },
    { name: 'Eggs Today', value: '1,150' },
    { name: 'Feed Remaining', value: '85%' },
    { name: 'Health Alerts', value: '2' },
  ];

  return (
    <Box p={6}>
      <Box display="flex" flexDirection="column" gap={6} w="100%">
        <Heading as="h1" size="xl">Farmer Dashboard</Heading>
        <Text>Welcome to your farm management dashboard. Monitor and manage your poultry farm efficiently.</Text>
        
        {/* Farm Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          {farmStats.map((stat, index) => (
            <Box 
              key={index}
              p={6} 
              borderWidth="1px" 
              borderRadius="lg"
              boxShadow="md"
              bg="white"
              _dark={{ bg: 'gray.700' }}
              textAlign="center"
            >
              <Text fontSize="lg" fontWeight="bold">{stat.value}</Text>
              <Text fontSize="sm" color="gray.500">{stat.name}</Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Box 
          p={6} 
          borderWidth="1px" 
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          _dark={{ bg: 'gray.700' }}
        >
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <Text>Record daily production, check health status, or order supplies.</Text>
        </Box>
      </Box>
    </Box>
  );
}
