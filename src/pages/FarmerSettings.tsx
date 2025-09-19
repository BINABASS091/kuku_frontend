import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  CardHeader,
  Switch,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Divider,
  useColorModeValue,
  useToast,
  SimpleGrid,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  FiBell,
  FiLock,
  FiGlobe,
  FiMail,
  FiSmartphone,
  FiSave,
} from 'react-icons/fi';
import FarmerLayout from '../layouts/FarmerLayout';
import { useAuth } from '../context/AuthContext';

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  healthAlerts: boolean;
  productionAlerts: boolean;
  feedingReminders: boolean;
  vaccinationReminders: boolean;
}

interface ProfileSettings {
  language: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  temperatureUnit: string;
}

const FarmerSettings: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    healthAlerts: true,
    productionAlerts: true,
    feedingReminders: true,
    vaccinationReminders: true,
  });

  // Profile settings state
  const [profile, setProfile] = useState<ProfileSettings>({
    language: 'en',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    dateFormat: 'DD/MM/YYYY',
    temperatureUnit: 'celsius',
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: user?.email || '',
    phone: '',
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileChange = (key: keyof ProfileSettings, value: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveNotifications = () => {
    // TODO: Save to API
    toast({
      title: 'Notification settings updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveProfile = () => {
    // TODO: Save to API
    toast({
      title: 'Profile settings updated',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleChangePassword = () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // TODO: Save to API
    toast({
      title: 'Password updated successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    setAccountSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Settings</Heading>
          <Text color="gray.600">
            Manage your account preferences and farm settings
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Notification Settings */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <HStack>
                <Icon as={FiBell} color="blue.500" />
                <Heading size="md">Notifications</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="email-notifications" mb="0">
                    Email Notifications
                  </FormLabel>
                  <Switch
                    id="email-notifications"
                    isChecked={notifications.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="sms-notifications" mb="0">
                    SMS Notifications
                  </FormLabel>
                  <Switch
                    id="sms-notifications"
                    isChecked={notifications.smsNotifications}
                    onChange={() => handleNotificationChange('smsNotifications')}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="push-notifications" mb="0">
                    Push Notifications
                  </FormLabel>
                  <Switch
                    id="push-notifications"
                    isChecked={notifications.pushNotifications}
                    onChange={() => handleNotificationChange('pushNotifications')}
                  />
                </FormControl>

                <Divider />

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="weekly-reports" mb="0">
                    Weekly Reports
                  </FormLabel>
                  <Switch
                    id="weekly-reports"
                    isChecked={notifications.weeklyReports}
                    onChange={() => handleNotificationChange('weeklyReports')}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="health-alerts" mb="0">
                    Health Alerts
                  </FormLabel>
                  <Switch
                    id="health-alerts"
                    isChecked={notifications.healthAlerts}
                    onChange={() => handleNotificationChange('healthAlerts')}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="production-alerts" mb="0">
                    Production Alerts
                  </FormLabel>
                  <Switch
                    id="production-alerts"
                    isChecked={notifications.productionAlerts}
                    onChange={() => handleNotificationChange('productionAlerts')}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="feeding-reminders" mb="0">
                    Feeding Reminders
                  </FormLabel>
                  <Switch
                    id="feeding-reminders"
                    isChecked={notifications.feedingReminders}
                    onChange={() => handleNotificationChange('feedingReminders')}
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="vaccination-reminders" mb="0">
                    Vaccination Reminders
                  </FormLabel>
                  <Switch
                    id="vaccination-reminders"
                    isChecked={notifications.vaccinationReminders}
                    onChange={() => handleNotificationChange('vaccinationReminders')}
                  />
                </FormControl>

                <Button
                  leftIcon={<Icon as={FiSave} />}
                  colorScheme="blue"
                  onClick={handleSaveNotifications}
                >
                  Save Notification Settings
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Profile Settings */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
            <CardHeader>
              <HStack>
                <Icon as={FiGlobe} color="green.500" />
                <Heading size="md">Preferences</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Language</FormLabel>
                  <Select
                    value={profile.language}
                    onChange={(e) => handleProfileChange('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="sw">Kiswahili</option>
                    <option value="fr">Français</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    value={profile.timezone}
                    onChange={(e) => handleProfileChange('timezone', e.target.value)}
                  >
                    <option value="Africa/Nairobi">East Africa Time (UTC+3)</option>
                    <option value="Africa/Lagos">West Africa Time (UTC+1)</option>
                    <option value="Africa/Cairo">Central Africa Time (UTC+2)</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    value={profile.currency}
                    onChange={(e) => handleProfileChange('currency', e.target.value)}
                  >
                    <option value="KES">Kenyan Shilling (KES)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="TZS">Tanzanian Shilling (TZS)</option>
                    <option value="UGX">Ugandan Shilling (UGX)</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Date Format</FormLabel>
                  <Select
                    value={profile.dateFormat}
                    onChange={(e) => handleProfileChange('dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Temperature Unit</FormLabel>
                  <Select
                    value={profile.temperatureUnit}
                    onChange={(e) => handleProfileChange('temperatureUnit', e.target.value)}
                  >
                    <option value="celsius">Celsius (°C)</option>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                  </Select>
                </FormControl>

                <Button
                  leftIcon={<Icon as={FiSave} />}
                  colorScheme="green"
                  onClick={handleSaveProfile}
                >
                  Save Preferences
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Account Security */}
        <Card bg={cardBg} borderColor={borderColor} borderWidth="1px">
          <CardHeader>
            <HStack>
              <Icon as={FiLock} color="red.500" />
              <Heading size="md">Account Security</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack spacing={4} align="stretch">
                <Heading size="sm">Contact Information</Heading>
                
                <FormControl>
                  <FormLabel>Email Address</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiMail} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                      pl="2.5rem"
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftElement>
                      <Icon as={FiSmartphone} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      type="tel"
                      value={accountSettings.phone}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254 700 000 000"
                      pl="2.5rem"
                    />
                  </InputGroup>
                </FormControl>
              </VStack>

              <VStack spacing={4} align="stretch">
                <Heading size="sm">Change Password</Heading>
                
                <FormControl>
                  <FormLabel>Current Password</FormLabel>
                  <Input
                    type="password"
                    value={accountSettings.currentPassword}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    type="password"
                    value={accountSettings.newPassword}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    type="password"
                    value={accountSettings.confirmPassword}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </FormControl>

                <Button
                  leftIcon={<Icon as={FiLock} />}
                  colorScheme="red"
                  variant="outline"
                  onClick={handleChangePassword}
                >
                  Change Password
                </Button>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Information Alert */}
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Settings Auto-Save</AlertTitle>
            <AlertDescription>
              Some settings are saved automatically. For security changes, you'll need to click the save button.
            </AlertDescription>
          </Box>
        </Alert>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerSettings;
