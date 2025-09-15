import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  HStack,
  Badge,
  Button,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

// Import subpage components
import FarmPerformancePage from './reports/FarmPerformancePage';
import RevenueReportsPage from './reports/RevenueReportsPage';
import UserAnalyticsPage from './reports/UserAnalyticsPage';
import DeviceStatusPage from './reports/DeviceStatusPage';
import ExportDataPage from './reports/ExportDataPage';

const ReportsAnalyticsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  const tabs = [
    {
      label: 'Farm Performance',
      component: FarmPerformancePage,
      description: 'Comprehensive farm analytics and performance metrics',
      badge: 'Analytics',
      badgeColor: 'green',
    },
    {
      label: 'Revenue Reports',
      component: RevenueReportsPage,
      description: 'Financial reports and revenue analysis',
      badge: 'Financial',
      badgeColor: 'blue',
    },
    {
      label: 'User Analytics',
      component: UserAnalyticsPage,
      description: 'User behavior and system usage analytics',
      badge: 'Users',
      badgeColor: 'purple',
    },
    {
      label: 'Device Status',
      component: DeviceStatusPage,
      description: 'Device health monitoring and status reports',
      badge: 'IoT',
      badgeColor: 'orange',
    },
    {
      label: 'Export Data',
      component: ExportDataPage,
      description: 'Data export and backup management',
      badge: 'Export',
      badgeColor: 'cyan',
    },
  ];

  const ActiveTabComponent = tabs[tabIndex]?.component || FarmPerformancePage;

  return (
    <Box p={6}>
      {/* Header */}
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading as="h1" size="xl" mb={2} color={headingColor}>
              Reports & Analytics
            </Heading>
            <Text color={textColor} fontSize="lg">
              Comprehensive system analytics and reporting dashboard
            </Text>
          </Box>
          <HStack spacing={4}>
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
              Last Updated: {new Date().toLocaleDateString()}
            </Badge>
            <Button
              leftIcon={<RepeatIcon />}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              Refresh All
            </Button>
          </HStack>
        </Flex>

        {/* Unified Tabbed Interface */}
        <Box
          bg={cardBg}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Tabs
            index={tabIndex}
            onChange={setTabIndex}
            variant="enclosed"
            colorScheme="blue"
          >
            <TabList borderBottom="1px" borderColor={borderColor} bg={useColorModeValue('gray.50', 'gray.700')}>
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  _selected={{
                    color: useColorModeValue('blue.600', 'blue.300'),
                    borderColor: useColorModeValue('blue.500', 'blue.300'),
                    borderBottomColor: cardBg,
                    bg: cardBg,
                  }}
                  _hover={{
                    bg: useColorModeValue('gray.100', 'gray.600'),
                  }}
                  py={4}
                  px={6}
                >
                  <VStack spacing={1} align="center">
                    <HStack spacing={2}>
                      <Text fontWeight="medium">{tab.label}</Text>
                      <Badge
                        colorScheme={tab.badgeColor}
                        variant="subtle"
                        size="sm"
                      >
                        {tab.badge}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color={textColor} textAlign="center">
                      {tab.description}
                    </Text>
                  </VStack>
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {tabs.map((tab, index) => (
                <TabPanel key={index} p={0}>
                  <ActiveTabComponent />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>
    </Box>
  );
};

export default ReportsAnalyticsPage;
