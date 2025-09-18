import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link,
  Badge,
  Divider,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { ExternalLinkIcon, SettingsIcon, ViewIcon, CheckCircleIcon, LockIcon } from '@chakra-ui/icons';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const DjangoAdmin: React.FC = () => {
  const { user } = useAuth();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [adminUrl] = useState('http://127.0.0.1:8000/admin/');
  const toast = useToast();
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    checkAdminLoginStatus();
  }, []);

  const checkAdminLoginStatus = async () => {
    setIsCheckingSession(true);
    try {
      const isLoggedIn = await authAPI.checkDjangoAdminSession();
      setIsAdminLoggedIn(isLoggedIn);
    } catch (error) {
      console.error('Error checking admin login status:', error);
      setIsAdminLoggedIn(false);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleDjangoAdminLogin = async () => {
    if (!adminCredentials.username || !adminCredentials.password) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both username and password",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      const success = await authAPI.loginToDjangoAdmin(adminCredentials.username, adminCredentials.password);
      
      if (success) {
        setIsAdminLoggedIn(true);
        setAdminCredentials({ username: '', password: '' });
        toast({
          title: "Login Successful",
          description: "You are now logged into Django Admin",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or session error",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Django admin login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred while logging in",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const openDjangoAdmin = () => {
    window.open(adminUrl, '_blank', 'noopener,noreferrer');
  };

  const openInCurrentTab = () => {
    window.location.href = adminUrl;
  };

  return (
    <Box p={8} maxW="6xl" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2} color="blue.600">
            <HStack>
              <SettingsIcon />
              <Text>Django Admin Interface</Text>
            </HStack>
          </Heading>
          <Text color="gray.600">
            Access the Django administration interface for advanced system management and database operations.
          </Text>
        </Box>

        <Divider />

        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Admin Access</Tab>
            <Tab>Features & Capabilities</Tab>
            <Tab>Quick Links</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={bg} borderColor={borderColor} borderWidth="1px">
                  <CardHeader>
                    <HStack justify="space-between">
                      <Heading size="md">Django Admin Portal</Heading>
                      <HStack spacing={2}>
                        <Badge colorScheme={user?.role === 'admin' ? 'green' : 'orange'}>
                          {user?.role === 'admin' ? 'Admin User' : 'Staff User'}
                        </Badge>
                        {isCheckingSession ? (
                          <Badge colorScheme="gray">
                            <Spinner size="xs" mr={2} />
                            Checking...
                          </Badge>
                        ) : (
                          <Badge colorScheme={isAdminLoggedIn ? 'green' : 'red'}>
                            {isAdminLoggedIn ? 'Connected' : 'Not Connected'}
                          </Badge>
                        )}
                      </HStack>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {user?.role === 'admin' ? (
                        <>
                          {!isAdminLoggedIn && (
                            <Alert status="info">
                              <AlertIcon />
                              <Box>
                                <AlertTitle>Django Session Required</AlertTitle>
                                <AlertDescription>
                                  You need to log in to Django Admin with your Django credentials.
                                  This is separate from your JWT authentication.
                                </AlertDescription>
                              </Box>
                            </Alert>
                          )}

                          {!isAdminLoggedIn && (
                            <Box p={4} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                              <VStack spacing={4}>
                                <Text fontWeight="medium" fontSize="sm">
                                  Login to Django Admin
                                </Text>
                                <HStack spacing={4} w="full">
                                  <FormControl>
                                    <FormLabel fontSize="sm">Username</FormLabel>
                                    <Input
                                      size="sm"
                                      value={adminCredentials.username}
                                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                                      placeholder="Django admin username"
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="sm">Password</FormLabel>
                                    <Input
                                      size="sm"
                                      type="password"
                                      value={adminCredentials.password}
                                      onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                                      placeholder="Django admin password"
                                      onKeyPress={(e) => e.key === 'Enter' && handleDjangoAdminLogin()}
                                    />
                                  </FormControl>
                                </HStack>
                                <Button
                                  colorScheme="blue"
                                  size="sm"
                                  isLoading={isLoggingIn}
                                  loadingText="Logging in..."
                                  onClick={handleDjangoAdminLogin}
                                  leftIcon={<LockIcon />}
                                >
                                  Login to Django Admin
                                </Button>
                              </VStack>
                            </Box>
                          )}

                          <VStack spacing={4}>
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                              {isAdminLoggedIn 
                                ? "You are connected to Django Admin. Choose how to access it:"
                                : "Once logged in, you can access the Django admin interface:"
                              }
                            </Text>
                            
                            <HStack spacing={4} justify="center">
                              <Button
                                leftIcon={<ExternalLinkIcon />}
                                colorScheme="blue"
                                variant="solid"
                                onClick={openDjangoAdmin}
                                isDisabled={!isAdminLoggedIn}
                              >
                                Open in New Tab
                              </Button>
                              
                              <Button
                                leftIcon={<ViewIcon />}
                                colorScheme="teal"
                                variant="outline"
                                onClick={openInCurrentTab}
                                isDisabled={!isAdminLoggedIn}
                              >
                                Open in Current Tab
                              </Button>

                              <Button
                                leftIcon={<SettingsIcon />}
                                variant="outline"
                                onClick={checkAdminLoginStatus}
                                isLoading={isCheckingSession}
                                loadingText="Checking..."
                              >
                                Check Status
                              </Button>
                            </HStack>

                            <Box p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="blue.400">
                              <Text fontSize="sm" fontWeight="medium" mb={2}>
                                Direct Admin URL:
                              </Text>
                              <Link
                                href={adminUrl}
                                isExternal
                                color="blue.600"
                                fontSize="sm"
                                fontFamily="mono"
                              >
                                {adminUrl} <ExternalLinkIcon mx="2px" />
                              </Link>
                            </Box>
                          </VStack>
                        </>
                      ) : (
                        <Alert status="warning">
                          <AlertIcon />
                          <Box>
                            <AlertTitle>Access Restricted</AlertTitle>
                            <AlertDescription>
                              You need staff privileges to access the Django admin interface.
                              Please contact your system administrator.
                            </AlertDescription>
                          </Box>
                        </Alert>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={bg} borderColor={borderColor} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Available Admin Features</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="medium" mb={2}>User & Account Management</Text>
                        <List spacing={2} fontSize="sm" color="gray.600">
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Create, edit, and manage user accounts and permissions
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Manage farmer profiles and associated data
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Configure user roles and access levels
                          </ListItem>
                        </List>
                      </Box>
                      
                      <Box>
                        <Text fontWeight="medium" mb={2}>Database Model Administration</Text>
                        <List spacing={2} fontSize="sm" color="gray.600">
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Direct access to all database models (Farms, Batches, Breeds, etc.)
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Bulk operations and data management tools
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Advanced filtering, searching, and sorting capabilities
                          </ListItem>
                        </List>
                      </Box>

                      <Box>
                        <Text fontWeight="medium" mb={2}>Master Data Management</Text>
                        <List spacing={2} fontSize="sm" color="gray.600">
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Manage breed types, activity types, condition types
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Configure sensor types and measurement units
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Set up subscription types and resources
                          </ListItem>
                        </List>
                      </Box>

                      <Box>
                        <Text fontWeight="medium" mb={2}>System Configuration</Text>
                        <List spacing={2} fontSize="sm" color="gray.600">
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Configure system settings and application parameters
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Manage API endpoints and permissions
                          </ListItem>
                          <ListItem>
                            <ListIcon as={CheckCircleIcon} color="green.500" />
                            Monitor system logs and debug information
                          </ListItem>
                        </List>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={6} align="stretch">
                <Card bg={bg} borderColor={borderColor} borderWidth="1px">
                  <CardHeader>
                    <Heading size="md">Quick Access Links</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between" p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">User Management</Text>
                          <Text fontSize="sm" color="gray.600">Manage all system users</Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${adminUrl}auth/user/`, '_blank')}
                          isDisabled={!isAdminLoggedIn}
                        >
                          Open
                        </Button>
                      </HStack>

                      <HStack justify="space-between" p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Farmer Profiles</Text>
                          <Text fontSize="sm" color="gray.600">Manage farmer accounts</Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${adminUrl}accounts/farmer/`, '_blank')}
                          isDisabled={!isAdminLoggedIn}
                        >
                          Open
                        </Button>
                      </HStack>

                      <HStack justify="space-between" p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Farm Management</Text>
                          <Text fontSize="sm" color="gray.600">Manage farms and devices</Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${adminUrl}farms/farm/`, '_blank')}
                          isDisabled={!isAdminLoggedIn}
                        >
                          Open
                        </Button>
                      </HStack>

                      <HStack justify="space-between" p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Batch Operations</Text>
                          <Text fontSize="sm" color="gray.600">Manage batches and activities</Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${adminUrl}batches/batch/`, '_blank')}
                          isDisabled={!isAdminLoggedIn}
                        >
                          Open
                        </Button>
                      </HStack>

                      <HStack justify="space-between" p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Breed Management</Text>
                          <Text fontSize="sm" color="gray.600">Manage breeds and types</Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${adminUrl}breeds/breed/`, '_blank')}
                          isDisabled={!isAdminLoggedIn}
                        >
                          Open
                        </Button>
                      </HStack>

                      <HStack justify="space-between" p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">Subscription Management</Text>
                          <Text fontSize="sm" color="gray.600">Manage subscriptions and payments</Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${adminUrl}subscriptions/farmersubscription/`, '_blank')}
                          isDisabled={!isAdminLoggedIn}
                        >
                          Open
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Alert status="info">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    <strong>Pro Tip:</strong> Use the Django admin interface for bulk operations, 
                    data imports/exports, and advanced database queries that aren't available in the main interface.
                  </AlertDescription>
                </Alert>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default DjangoAdmin;
