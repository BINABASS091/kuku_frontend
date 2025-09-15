import React, { useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ChevronUpIcon,
  ViewIcon,
  CalendarIcon,
  StarIcon,
  DownloadIcon,
} from '@chakra-ui/icons';
// Placeholder subpages
import FarmPerformancePage from './reports/FarmPerformancePage';
import RevenueReportsPage from './reports/RevenueReportsPage';
import UserAnalyticsPage from './reports/UserAnalyticsPage';
import DeviceStatusPage from './reports/DeviceStatusPage';
import ExportDataPage from './reports/ExportDataPage';

const tabs = [
  {
    label: 'Farm Performance',
    icon: ChevronUpIcon,
    component: FarmPerformancePage,
    description: 'Analytics on farm productivity, efficiency, and trends',
    badge: 'Live',
    color: 'green',
  },
  {
    label: 'Revenue Reports',
    icon: ViewIcon,
    component: RevenueReportsPage,
    description: 'Financial analytics, revenue breakdowns, and growth',
    badge: 'KES',
    color: 'blue',
  },
  {
    label: 'User Analytics',
    icon: StarIcon,
    component: UserAnalyticsPage,
    description: 'User engagement, activity, and retention metrics',
    badge: 'Users',
    color: 'orange',
  },
  {
    label: 'Device Status',
    icon: CalendarIcon,
    component: DeviceStatusPage,
    description: 'Device health, uptime, and sensor analytics',
    badge: 'IoT',
    color: 'purple',
  },
  {
    label: 'Export Data',
    icon: DownloadIcon,
    component: ExportDataPage,
    description: 'Export system data for external analysis',
    badge: 'CSV',
    color: 'gray',
  },
];

const ReportsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Reports & Analytics</Heading>
          <Text color="gray.600" fontSize="md">
            Unified dashboard for all system analytics, performance, and reporting tools
          </Text>
        </Box>
        <Tabs
          index={activeTab}
          onChange={setActiveTab}
          variant="enclosed"
          bg={cardBg}
          borderRadius="lg"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          <TabList bg={useColorModeValue('gray.100', 'gray.700')} p={4}>
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                mr={2}
                border="1px solid"
                borderColor={borderColor}
                borderRadius="md"
                _selected={{
                  bg: cardBg,
                  borderColor: `${tab.color}.500`,
                  color: `${tab.color}.600`,
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                _hover={{
                  bg: useColorModeValue('gray.50', 'gray.600'),
                  transform: 'translateY(-1px)',
                }}
                transition="all 0.2s"
                position="relative"
              >
                <HStack spacing={2}>
                  <Icon as={tab.icon} />
                  <VStack align="start" spacing={0}>
                    <HStack>
                      <Text fontSize="sm" fontWeight="medium">
                        {tab.label}
                      </Text>
                      <Badge
                        colorScheme={tab.color}
                        variant="subtle"
                        fontSize="xs"
                        borderRadius="full"
                      >
                        {tab.badge}
                      </Badge>
                    </HStack>
                    <Text fontSize="xs" color="gray.500" textAlign="left">
                      {tab.description}
                    </Text>
                  </VStack>
                </HStack>
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabs.map((tab, index) => (
              <TabPanel key={index} p={0}>
                <tab.component />
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default ReportsAnalytics;
