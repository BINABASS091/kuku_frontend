import React from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  useColorModeValue,
  Select,
  HStack,
  VStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Progress,
  Flex,
  IconButton,
  Tooltip,
  Icon,
  useToast,
  Skeleton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { DownloadIcon, RepeatIcon, ViewIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';

const ReportsPage = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { user } = useAuth();
  const toast = useToast();

  // Mock data for reports
  const reports = [
    {
      id: 1,
      title: 'Monthly Farm Performance',
      description: 'Detailed analysis of farm performance metrics',
      category: 'Performance',
      lastUpdated: '2023-11-15',
      type: 'monthly',
    },
    {
      id: 2,
      title: 'Bird Health Overview',
      description: 'Summary of bird health metrics and anomalies',
      category: 'Health',
      lastUpdated: '2023-11-10',
      type: 'weekly',
    },
    {
      id: 3,
      title: 'Financial Report',
      description: 'Revenue, expenses, and profit analysis',
      category: 'Financial',
      lastUpdated: '2023-11-01',
      type: 'monthly',
    },
    {
      id: 4,
      title: 'Inventory Status',
      description: 'Current inventory levels and alerts',
      category: 'Inventory',
      lastUpdated: '2023-11-14',
      type: 'weekly',
    },
  ];

  const handleGenerateReport = (reportId: number) => {
    // In a real app, this would trigger a report generation API call
    toast({
      title: 'Report Generation Started',
      description: `Generating report #${reportId}. You will be notified when it's ready.`,
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleDownloadReport = (reportId: number) => {
    // In a real app, this would trigger a download
    toast({
      title: 'Download Started',
      description: `Downloading report #${reportId}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Reports Dashboard
            </Heading>
            <Text color={textColor}>
              Generate and download various system reports
            </Text>
          </Box>
          <HStack spacing={4}>
            <Select placeholder="Filter by category" w="200px" variant="filled">
              <option value="all">All Categories</option>
              <option value="performance">Performance</option>
              <option value="health">Health</option>
              <option value="financial">Financial</option>
              <option value="inventory">Inventory</option>
            </Select>
            <Button leftIcon={<RepeatIcon />} colorScheme="blue">
              Refresh
            </Button>
          </HStack>
        </Flex>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>All Reports</Tab>
            <Tab>Favorites</Tab>
            <Tab>Recent</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
                {reports.map((report) => (
                  <Card key={report.id} bg={cardBg} border="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">{report.title}</Heading>
                        <Badge colorScheme={report.category === 'Performance' ? 'green' : report.category === 'Health' ? 'red' : 'blue'}>
                          {report.category}
                        </Badge>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text color={textColor} mb={4}>
                        {report.description}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Last updated: {report.lastUpdated}
                      </Text>
                    </CardBody>
                    <CardFooter>
                      <HStack spacing={2} w="full">
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          leftIcon={<ViewIcon />}
                          onClick={() => handleGenerateReport(report.id)}
                          flex={1}
                        >
                          Generate
                        </Button>
                        <Tooltip label="Download">
                          <IconButton
                            aria-label="Download report"
                            icon={<DownloadIcon />}
                            size="sm"
                            onClick={() => handleDownloadReport(report.id)}
                          />
                        </Tooltip>
                      </HStack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>
            <TabPanel px={0}>
              <Text>Your favorite reports will appear here.</Text>
            </TabPanel>
            <TabPanel px={0}>
              <Text>Your recently viewed reports will appear here.</Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default ReportsPage;
