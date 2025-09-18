import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Button,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';
import {
  SettingsIcon,
  CheckIcon,
  WarningIcon,
  InfoIcon,
  TimeIcon,
  LockIcon,
  BellIcon,
} from '@chakra-ui/icons';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Smart Kuku Poultry Management',
    siteDescription: 'Advanced IoT-enabled poultry farm management system',
    timezone: 'Africa/Nairobi',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
    currency: 'KES',
    
    // Security Settings
    sessionTimeout: 3600, // seconds
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowRegistration: true,
    maxLoginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    alertThresholds: {
      temperature: { min: 18, max: 35 },
      humidity: { min: 40, max: 70 },
      batteryLevel: 20,
    },
    
    // System Performance
    cacheEnabled: true,
    debugMode: false,
    logLevel: 'INFO',
    backupFrequency: 'daily',
    dataRetentionDays: 365,
    
    // Integration Settings
    apiRateLimit: 1000,
    webhookEnabled: false,
    webhookUrl: '',
    smsProvider: 'twilio',
    emailProvider: 'smtp',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      // In real implementation, fetch from API
      // const response = await api.get('/system/settings/');
      // setSettings(response.data);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLastSaved(new Date(Date.now() - 10 * 60 * 1000)); // 10 minutes ago
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load system settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      // In real implementation, save to API
      // await api.put('/system/settings/', settings);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLastSaved(new Date());
      
      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save system settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setIsLoading(true);
      // Reset to default values
      setSettings({
        siteName: 'Smart Kuku Poultry Management',
        siteDescription: 'Advanced IoT-enabled poultry farm management system',
        timezone: 'Africa/Nairobi',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        currency: 'KES',
        sessionTimeout: 3600,
        passwordMinLength: 8,
        requireTwoFactor: false,
        allowRegistration: true,
        maxLoginAttempts: 5,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        alertThresholds: {
          temperature: { min: 18, max: 35 },
          humidity: { min: 40, max: 70 },
          batteryLevel: 20,
        },
        cacheEnabled: true,
        debugMode: false,
        logLevel: 'INFO',
        backupFrequency: 'daily',
        dataRetentionDays: 365,
        apiRateLimit: 1000,
        webhookEnabled: false,
        webhookUrl: '',
        smsProvider: 'twilio',
        emailProvider: 'smtp',
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
      
      toast({
        title: 'Settings Reset',
        description: 'All settings have been reset to default values',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="md">System Settings</Heading>
              <Text color="gray.600" fontSize="sm">
                Configure system-wide settings, security, notifications, and integrations
              </Text>
            </VStack>
            <HStack spacing={3}>
              <Button
                variant="outline"
                onClick={onOpen}
                leftIcon={<WarningIcon />}
                colorScheme="orange"
                size="sm"
              >
                Reset to Defaults
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSaveSettings}
                isLoading={isLoading}
                leftIcon={<CheckIcon />}
                size="sm"
              >
                Save Changes
              </Button>
            </HStack>
          </HStack>

          {lastSaved && (
            <Alert status="info" borderRadius="md" mb={4}>
              <AlertIcon />
              <Text fontSize="sm">
                Last saved: {lastSaved.toLocaleString()}
              </Text>
            </Alert>
          )}
        </Box>

        {/* Core Aims Explanation */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <HStack>
              <InfoIcon color="blue.500" />
              <Heading size="sm">System Settings - Core Aims</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={3}>
              <Text fontSize="sm">
                <strong>Primary Purpose:</strong> Central configuration hub for all system-wide settings that affect the entire Smart Kuku platform.
              </Text>
              <Divider />
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" fontWeight="semibold">Key Functions:</Text>
                <VStack align="start" spacing={1} pl={4}>
                  <Text fontSize="sm">• <strong>General Configuration:</strong> Site identity, localization, time zones, and display preferences</Text>
                  <Text fontSize="sm">• <strong>Security Management:</strong> Password policies, session management, two-factor authentication</Text>
                  <Text fontSize="sm">• <strong>Notification Control:</strong> Email, SMS, push notifications, and alert thresholds for sensors</Text>
                  <Text fontSize="sm">• <strong>Performance Optimization:</strong> Caching, debugging, logging levels, and data retention policies</Text>
                  <Text fontSize="sm">• <strong>Integration Settings:</strong> API rate limits, webhooks, third-party service configurations</Text>
                  <Text fontSize="sm">• <strong>Backup Configuration:</strong> Automated backup schedules and recovery settings</Text>
                </VStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Settings Tabs */}
        <Tabs variant="enclosed" bg={cardBg} borderRadius="lg" border="1px solid" borderColor={borderColor}>
          <TabList>
            <Tab><SettingsIcon mr={2} />General</Tab>
            <Tab><LockIcon mr={2} />Security</Tab>
            <Tab><BellIcon mr={2} />Notifications</Tab>
            <Tab><TimeIcon mr={2} />Performance</Tab>
          </TabList>

          <TabPanels>
            {/* General Settings */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Site Name</FormLabel>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      placeholder="Enter site name"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Default Language</FormLabel>
                    <Select
                      value={settings.language}
                      onChange={(e) => setSettings({...settings, language: e.target.value})}
                    >
                      <option value="en">English</option>
                      <option value="sw">Swahili</option>
                      <option value="fr">French</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Timezone</FormLabel>
                    <Select
                      value={settings.timezone}
                      onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    >
                      <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                      <option value="UTC">UTC</option>
                      <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Currency</FormLabel>
                    <Select
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    >
                      <option value="KES">KES (Kenyan Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="NGN">NGN (Nigerian Naira)</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <FormControl>
                  <FormLabel fontSize="sm">Site Description</FormLabel>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    placeholder="Enter site description"
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </TabPanel>

            {/* Security Settings */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0">
                      Require Two-Factor Authentication
                    </FormLabel>
                    <Switch
                      isChecked={settings.requireTwoFactor}
                      onChange={(e) => setSettings({...settings, requireTwoFactor: e.target.checked})}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0">
                      Allow User Registration
                    </FormLabel>
                    <Switch
                      isChecked={settings.allowRegistration}
                      onChange={(e) => setSettings({...settings, allowRegistration: e.target.checked})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Session Timeout (seconds)</FormLabel>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Password Minimum Length</FormLabel>
                    <Input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Max Login Attempts</FormLabel>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* Notification Settings */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" fontWeight="semibold">Notification Channels</Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0">Email Notifications</FormLabel>
                    <Switch
                      isChecked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0">SMS Notifications</FormLabel>
                    <Switch
                      isChecked={settings.smsNotifications}
                      onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0">Push Notifications</FormLabel>
                    <Switch
                      isChecked={settings.pushNotifications}
                      onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                    />
                  </FormControl>
                </SimpleGrid>
                
                <Divider />
                <Text fontSize="sm" fontWeight="semibold">Alert Thresholds</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontSize="sm" mb={2}>Temperature Range (°C)</Text>
                    <HStack>
                      <Input
                        placeholder="Min"
                        type="number"
                        value={settings.alertThresholds.temperature.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            temperature: {
                              ...settings.alertThresholds.temperature,
                              min: parseInt(e.target.value)
                            }
                          }
                        })}
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={settings.alertThresholds.temperature.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            temperature: {
                              ...settings.alertThresholds.temperature,
                              max: parseInt(e.target.value)
                            }
                          }
                        })}
                      />
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontSize="sm" mb={2}>Humidity Range (%)</Text>
                    <HStack>
                      <Input
                        placeholder="Min"
                        type="number"
                        value={settings.alertThresholds.humidity.min}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            humidity: {
                              ...settings.alertThresholds.humidity,
                              min: parseInt(e.target.value)
                            }
                          }
                        })}
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={settings.alertThresholds.humidity.max}
                        onChange={(e) => setSettings({
                          ...settings,
                          alertThresholds: {
                            ...settings.alertThresholds,
                            humidity: {
                              ...settings.alertThresholds.humidity,
                              max: parseInt(e.target.value)
                            }
                          }
                        })}
                      />
                    </HStack>
                  </Box>
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* Performance Settings */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0">Enable Caching</FormLabel>
                    <Switch
                      isChecked={settings.cacheEnabled}
                      onChange={(e) => setSettings({...settings, cacheEnabled: e.target.checked})}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel fontSize="sm" mb="0">Debug Mode</FormLabel>
                    <Switch
                      isChecked={settings.debugMode}
                      onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Log Level</FormLabel>
                    <Select
                      value={settings.logLevel}
                      onChange={(e) => setSettings({...settings, logLevel: e.target.value})}
                    >
                      <option value="DEBUG">DEBUG</option>
                      <option value="INFO">INFO</option>
                      <option value="WARNING">WARNING</option>
                      <option value="ERROR">ERROR</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Backup Frequency</FormLabel>
                    <Select
                      value={settings.backupFrequency}
                      onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Data Retention (days)</FormLabel>
                    <Input
                      type="number"
                      value={settings.dataRetentionDays}
                      onChange={(e) => setSettings({...settings, dataRetentionDays: parseInt(e.target.value)})}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">API Rate Limit (requests/hour)</FormLabel>
                    <Input
                      type="number"
                      value={settings.apiRateLimit}
                      onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})}
                    />
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Reset Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Reset to Default Settings</ModalHeader>
            <ModalBody>
              <Alert status="warning" borderRadius="md" mb={4}>
                <AlertIcon />
                <Text fontSize="sm">
                  This action will reset all system settings to their default values. 
                  This cannot be undone.
                </Text>
              </Alert>
              <Text fontSize="sm">
                Are you sure you want to proceed? All current configurations will be lost.
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button
                colorScheme="orange"
                onClick={handleResetToDefaults}
                isLoading={isLoading}
              >
                Reset Settings
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default SystemSettingsPage;
