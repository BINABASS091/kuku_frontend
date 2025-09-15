import React, { useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
} from '@chakra-ui/react';
import {
  SettingsIcon,
  ViewIcon,
  DownloadIcon,
  TimeIcon,
} from '@chakra-ui/icons';

// Import subpage components
import SystemSettingsPage from './system/SystemSettingsPage';
import DjangoAdminPortalPage from './system/DjangoAdminPortalPage';
import SystemLogsPage from './system/SystemLogsPage';
import BackupRecoveryPage from './system/BackupRecoveryPage';

const SystemAdministration: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const tabs = [
    {
      label: 'System Settings',
      icon: SettingsIcon,
      component: SystemSettingsPage,
      description: 'Configure system-wide settings and preferences',
      badge: '12',
      color: 'blue',
    },
    {
      label: 'Django Admin Portal',
      icon: ViewIcon,
      component: DjangoAdminPortalPage,
      description: 'Access Django admin interface with instructions',
      badge: 'Admin',
      color: 'green',
    },
    {
      label: 'System Logs',
      icon: TimeIcon,
      component: SystemLogsPage,
      description: 'View system logs, errors, and audit trails',
      badge: '45',
      color: 'orange',
    },
    {
      label: 'Backup & Recovery',
      icon: DownloadIcon,
      component: BackupRecoveryPage,
      description: 'Manage system backups and data recovery',
      badge: 'Auto',
      color: 'purple',
    },
  ];

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>System Administration</Heading>
          <Text color="gray.600" fontSize="md">
            Comprehensive system management, configuration, and administrative tools
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

export default SystemAdministration;
