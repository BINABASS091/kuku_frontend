import { Tabs, TabList, TabPanels, Tab, TabPanel, Card, CardHeader, CardBody, Heading, VStack, Box, Text, HStack, Badge, useColorModeValue, Skeleton, Alert, AlertIcon, AlertTitle, AlertDescription, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Progress, SimpleGrid, Divider, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';
import type { DashboardTabsProps } from '../../dashboard/types';
import { 
  EmptyDataState, 
  EmptyActivitiesState, 
  EmptyAlertsState, 
  EmptyFarmsState 
} from '../../../../components/EmptyState';

export function DashboardTabs({ stats, activities, activitiesLoading, alerts, alertsLoading, topFarms, farmsLoading }: DashboardTabsProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <Tabs variant="enclosed" colorScheme="blue">
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Recent Activity</Tab>
        <Tab>System Alerts</Tab>
        <Tab>Top Farms</Tab>
      </TabList>
      <TabPanels>
        <TabPanel px={0}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
              <CardHeader>
                <Heading size="md">System Overview</Heading>
              </CardHeader>
              <CardBody>
                {stats ? (
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={textColor}>Total Farmers</Text>
                        <Text fontWeight="bold" fontSize="lg">{stats.totalFarmers || 0}</Text>
                      </HStack>
                      <Progress value={75} colorScheme="blue" size="sm" mt={1} />
                    </Box>
                    <Divider />
                    <Box>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={textColor}>Active Devices</Text>
                        <Text fontWeight="bold" fontSize="lg">{stats.totalDevices || 0}</Text>
                      </HStack>
                      <Progress value={85} colorScheme="green" size="sm" mt={1} />
                    </Box>
                    <Divider />
                    <Box>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={textColor}>Active Subscriptions</Text>
                        <Text fontWeight="bold" fontSize="lg">{stats.activeSubscriptions || 0}</Text>
                      </HStack>
                      <Progress value={60} colorScheme="purple" size="sm" mt={1} />
                    </Box>
                    <Divider />
                    <Box>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={textColor}>Pending Tasks</Text>
                        <Badge colorScheme="orange" variant="subtle" fontSize="sm">{stats.pendingTasks}</Badge>
                      </HStack>
                    </Box>
                  </VStack>
                ) : (
                  <EmptyDataState title="No System Data" description="System overview data is not available at the moment." />
                )}
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
              <CardHeader>
                <Heading size="md">Performance Metrics</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box textAlign="center">
                    <Text fontSize="sm" color={textColor} mb={2}>API Response Time</Text>
                    <CircularProgress value={85} color="green.500" size="60px">
                      <CircularProgressLabel>85ms</CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  <Divider />
                  <Box textAlign="center">
                    <Text fontSize="sm" color={textColor} mb={2}>Database Performance</Text>
                    <CircularProgress value={92} color="blue.500" size="60px">
                      <CircularProgressLabel>92%</CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  <Divider />
                  <Box textAlign="center">
                    <Text fontSize="sm" color={textColor} mb={2}>Uptime</Text>
                    <CircularProgress value={99.9} color="purple.500" size="60px">
                      <CircularProgressLabel>99.9%</CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </TabPanel>

        <TabPanel px={0}>
          <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
            <CardHeader>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              {activitiesLoading ? (
                <VStack spacing={3} align="stretch">
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                      <Skeleton height="20px" mb={2} />
                      <Skeleton height="16px" width="60%" />
                    </Box>
                  ))}
                </VStack>
              ) : activities && activities.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {activities.map((activity) => (
                    <Box key={activity.id} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">{activity.action}</Text>
                        <Badge 
                          colorScheme={activity.status === 'success' ? 'green' : activity.status === 'warning' ? 'orange' : 'red'}
                          variant="subtle"
                          size="sm"
                        >
                          {activity.status === 'success' ? 'Success' : activity.status === 'warning' ? 'Warning' : 'Error'}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color={textColor}>{activity.user}</Text>
                        <Text fontSize="xs" color={textColor}>{activity.time}</Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <EmptyActivitiesState />
              )}
            </CardBody>
          </Card>
        </TabPanel>

        <TabPanel px={0}>
          <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
            <CardHeader>
              <Heading size="md">System Alerts</Heading>
            </CardHeader>
            <CardBody>
              {alertsLoading ? (
                <VStack spacing={3} align="stretch">
                  {[...Array(2)].map((_, index) => (
                    <Box key={index} p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                      <Skeleton height="20px" mb={2} />
                      <Skeleton height="16px" width="80%" />
                    </Box>
                  ))}
                </VStack>
              ) : alerts && alerts.length > 0 ? (
                <VStack spacing={3} align="stretch">
                  {alerts.map((alert) => (
                    <Alert key={alert.id} status={alert.type as any} borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle fontSize="sm">{alert.message}</AlertTitle>
                        <AlertDescription fontSize="xs">
                          {alert.time} • Count: {alert.count} • Severity: {alert.severity}
                        </AlertDescription>
                      </Box>
                    </Alert>
                  ))}
                </VStack>
              ) : (
                <EmptyAlertsState />
              )}
            </CardBody>
          </Card>
        </TabPanel>

        <TabPanel px={0}>
          <Card bg={cardBg} borderColor={borderColor} boxShadow="md">
            <CardHeader>
              <Heading size="md">Top Performing Farms</Heading>
            </CardHeader>
            <CardBody>
              {farmsLoading ? (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Farm Name</Th>
                        <Th>Location</Th>
                        <Th>Birds</Th>
                        <Th>Health</Th>
                        <Th>Revenue</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {[...Array(3)].map((_, index) => (
                        <Tr key={index}>
                          <Td><Skeleton height="20px" /></Td>
                          <Td><Skeleton height="20px" /></Td>
                          <Td><Skeleton height="20px" /></Td>
                          <Td><Skeleton height="20px" /></Td>
                          <Td><Skeleton height="20px" /></Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : topFarms && topFarms.length > 0 ? (
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Farm Name</Th>
                        <Th>Location</Th>
                        <Th>Birds</Th>
                        <Th>Health</Th>
                        <Th>Revenue</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {topFarms.map((farm) => (
                        <Tr key={farm.id}>
                          <Td fontWeight="medium">{farm.name}</Td>
                          <Td>{farm.location}</Td>
                          <Td>{farm.birds.toLocaleString()}</Td>
                          <Td>
                            <HStack>
                              <Text>{farm.health}%</Text>
                              <Progress value={farm.health} colorScheme="green" size="sm" w="50px" />
                            </HStack>
                          </Td>
                          <Td>${farm.revenue.toLocaleString()}</Td>
                          <Td>
                            <Badge 
                              colorScheme={farm.status === 'active' ? 'green' : 'gray'} 
                              variant="subtle"
                              size="sm"
                            >
                              {farm.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <EmptyFarmsState />
              )}
            </CardBody>
          </Card>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
