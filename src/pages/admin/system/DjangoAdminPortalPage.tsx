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
  Alert,
  AlertIcon,
  Divider,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Code,
  List,
  ListItem,
  ListIcon,
  Link,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import {
  ExternalLinkIcon,
  InfoIcon,
  CheckIcon,
  WarningIcon,
  LockIcon,
  ViewIcon,
  EditIcon,
  CopyIcon,
  SettingsIcon,
  TimeIcon,
} from '@chakra-ui/icons';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  date_joined: string;
}

const DjangoAdminPortalPage: React.FC = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    totalAdminUsers: 0,
    activeSessions: 0,
    recentLogins: 0,
    systemHealth: 'good'
  });
  
  const { user } = useAuth();
  const toast = useToast();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real implementation, fetch from API
      const mockAdminUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@smartkuku.com',
          first_name: 'System',
          last_name: 'Administrator',
          is_staff: true,
          is_superuser: true,
          last_login: new Date().toISOString(),
          date_joined: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          username: 'testuser',
          email: 'test@smartkuku.com',
          first_name: 'Test',
          last_name: 'User',
          is_staff: true,
          is_superuser: true,
          last_login: new Date().toISOString(),
          date_joined: '2024-01-02T00:00:00Z'
        }
      ];
      
      setAdminUsers(mockAdminUsers);
      setAdminStats({
        totalAdminUsers: mockAdminUsers.length,
        activeSessions: mockAdminUsers.filter(u => u.last_login).length,
        recentLogins: mockAdminUsers.filter(u => 
          u.last_login && new Date(u.last_login) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length,
        systemHealth: 'good'
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openDjangoAdmin = () => {
    window.open('http://127.0.0.1:8000/admin/', '_blank');
  };

  const copyCredentials = (username: string, password: string) => {
    navigator.clipboard.writeText(`Username: ${username}\nPassword: ${password}`);
    toast({
      title: 'Copied!',
      description: 'Credentials copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const loginToDjangoAdmin = async () => {
    try {
      // This would handle automatic login to Django admin
      toast({
        title: 'Redirecting...',
        description: 'Opening Django Admin with your current session',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
      
      // Open Django admin
      openDjangoAdmin();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to access Django Admin',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="md">Django Admin Portal</Heading>
              <Text color="gray.600" fontSize="sm">
                Access Django's built-in administration interface for direct database management
              </Text>
            </VStack>
            <HStack spacing={3}>
              <Button
                colorScheme="green"
                onClick={loginToDjangoAdmin}
                leftIcon={<ViewIcon />}
                size="sm"
              >
                Access Django Admin
              </Button>
              <Button
                variant="outline"
                onClick={openDjangoAdmin}
                leftIcon={<ExternalLinkIcon />}
                size="sm"
              >
                Open in New Tab
              </Button>
            </HStack>
          </HStack>
        </Box>

        {/* Core Aims Explanation */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <HStack>
              <InfoIcon color="green.500" />
              <Heading size="sm">Django Admin Portal - Core Aims</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text fontSize="sm">
                <strong>Primary Purpose:</strong> Provides direct access to Django's powerful built-in administration interface 
                for comprehensive database and system management.
              </Text>
              <Divider />
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold">Key Functions & Capabilities:</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="blue.600">Database Management</Text>
                    <List spacing={1} fontSize="xs">
                      <ListItem>• Direct CRUD operations on all models</ListItem>
                      <ListItem>• Advanced filtering and searching</ListItem>
                      <ListItem>• Bulk operations and data export</ListItem>
                      <ListItem>• Raw SQL query execution</ListItem>
                      <ListItem>• Data validation and integrity checks</ListItem>
                    </List>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="green.600">User & Permission Management</Text>
                    <List spacing={1} fontSize="xs">
                      <ListItem>• User account creation and modification</ListItem>
                      <ListItem>• Group and permission assignment</ListItem>
                      <ListItem>• Staff and superuser designation</ListItem>
                      <ListItem>• Session management and monitoring</ListItem>
                      <ListItem>• Authentication logs and security</ListItem>
                    </List>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="purple.600">Content Management</Text>
                    <List spacing={1} fontSize="xs">
                      <ListItem>• Master data configuration</ListItem>
                      <ListItem>• System settings and parameters</ListItem>
                      <ListItem>• Content moderation and approval</ListItem>
                      <ListItem>• File and media management</ListItem>
                      <ListItem>• Automated task scheduling</ListItem>
                    </List>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="orange.600">System Administration</Text>
                    <List spacing={1} fontSize="xs">
                      <ListItem>• Log file analysis and monitoring</ListItem>
                      <ListItem>• Performance metrics and debugging</ListItem>
                      <ListItem>• Database maintenance tasks</ListItem>
                      <ListItem>• Migration management</ListItem>
                      <ListItem>• System health diagnostics</ListItem>
                    </List>
                  </VStack>
                </SimpleGrid>
              </VStack>
              
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="medium">
                    Why Use Django Admin Portal?
                  </Text>
                  <Text fontSize="xs">
                    Unlike the custom frontend interface, Django Admin provides unrestricted access to all database tables, 
                    advanced querying capabilities, and administrative tools that are essential for system maintenance, 
                    debugging, and complex data operations.
                  </Text>
                </VStack>
              </Alert>
            </VStack>
          </CardBody>
        </Card>

        {/* Admin Statistics */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <Stat>
            <StatLabel>Total Admin Users</StatLabel>
            <StatNumber>{adminStats.totalAdminUsers}</StatNumber>
            <StatHelpText>System administrators</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Active Sessions</StatLabel>
            <StatNumber>{adminStats.activeSessions}</StatNumber>
            <StatHelpText>Currently logged in</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Recent Logins</StatLabel>
            <StatNumber>{adminStats.recentLogins}</StatNumber>
            <StatHelpText>Last 24 hours</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>System Health</StatLabel>
            <StatNumber>
              <Badge colorScheme={adminStats.systemHealth === 'good' ? 'green' : 'red'}>
                {adminStats.systemHealth.toUpperCase()}
              </Badge>
            </StatNumber>
            <StatHelpText>Overall status</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Access Methods */}
        <Tabs variant="enclosed" bg={cardBg} borderRadius="lg" border="1px solid" borderColor={borderColor}>
          <TabList>
            <Tab><LockIcon mr={2} />Access Information</Tab>
            <Tab><SettingsIcon mr={2} />Available Models</Tab>
            <Tab><TimeIcon mr={2} />Recent Activity</Tab>
          </TabList>

          <TabPanels>
            {/* Access Information */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="sm" fontWeight="medium">Django Admin URL</Text>
                    <HStack>
                      <Code fontSize="sm">http://127.0.0.1:8000/admin/</Code>
                      <Tooltip label="Copy URL">
                        <IconButton
                          aria-label="Copy URL"
                          icon={<CopyIcon />}
                          size="xs"
                          onClick={() => copyCredentials('http://127.0.0.1:8000/admin/', '')}
                        />
                      </Tooltip>
                    </HStack>
                  </VStack>
                </Alert>

                <Card bg={useColorModeValue('yellow.50', 'yellow.900')} border="1px solid" borderColor="yellow.200">
                  <CardHeader>
                    <Text fontSize="sm" fontWeight="semibold">Available Admin Credentials</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <Box p={3} bg={cardBg} borderRadius="md" border="1px solid" borderColor={borderColor}>
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="medium">Primary Admin Account</Text>
                            <Text fontSize="xs">Username: <Code>testuser</Code></Text>
                            <Text fontSize="xs">Password: <Code>testpass123</Code></Text>
                          </VStack>
                          <Button
                            size="xs"
                            leftIcon={<CopyIcon />}
                            onClick={() => copyCredentials('testuser', 'testpass123')}
                          >
                            Copy
                          </Button>
                        </HStack>
                      </Box>
                      
                      <Alert status="warning" borderRadius="md">
                        <AlertIcon />
                        <Text fontSize="xs">
                          These credentials provide full superuser access to the Django admin interface. 
                          Use with caution and ensure proper security measures.
                        </Text>
                      </Alert>
                    </VStack>
                  </CardBody>
                </Card>

                <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                  <CardHeader>
                    <Text fontSize="sm" fontWeight="semibold">Quick Start Guide</Text>
                  </CardHeader>
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" fontWeight="medium">Steps to Access Django Admin:</Text>
                      <List spacing={1} fontSize="sm">
                        <ListItem>
                          <ListIcon as={CheckIcon} color="green.500" />
                          1. Click "Access Django Admin" button above
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckIcon} color="green.500" />
                          2. Login using the provided credentials
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckIcon} color="green.500" />
                          3. Navigate to desired models/tables
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckIcon} color="green.500" />
                          4. Perform CRUD operations as needed
                        </ListItem>
                      </List>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Available Models */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" fontWeight="semibold">Database Models Available in Django Admin:</Text>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                    <CardHeader>
                      <Text fontSize="sm" fontWeight="semibold" color="blue.600">User Management</Text>
                    </CardHeader>
                    <CardBody>
                      <List spacing={1} fontSize="xs">
                        <ListItem>• Users (Django Auth)</ListItem>
                        <ListItem>• Groups & Permissions</ListItem>
                        <ListItem>• User Sessions</ListItem>
                        <ListItem>• Admin Log Entries</ListItem>
                      </List>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                    <CardHeader>
                      <Text fontSize="sm" fontWeight="semibold" color="green.600">Farm Operations</Text>
                    </CardHeader>
                    <CardBody>
                      <List spacing={1} fontSize="xs">
                        <ListItem>• Farms</ListItem>
                        <ListItem>• Batches</ListItem>
                        <ListItem>• Sensors & Devices</ListItem>
                        <ListItem>• Sensor Readings</ListItem>
                        <ListItem>• Activities & Tasks</ListItem>
                      </List>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                    <CardHeader>
                      <Text fontSize="sm" fontWeight="semibold" color="purple.600">Master Data</Text>
                    </CardHeader>
                    <CardBody>
                      <List spacing={1} fontSize="xs">
                        <ListItem>• Breeds & Breed Types</ListItem>
                        <ListItem>• Food Types & Conditions</ListItem>
                        <ListItem>• Countries & Regions</ListItem>
                        <ListItem>• Categories & Classifications</ListItem>
                      </List>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
                    <CardHeader>
                      <Text fontSize="sm" fontWeight="semibold" color="orange.600">Subscriptions</Text>
                    </CardHeader>
                    <CardBody>
                      <List spacing={1} fontSize="xs">
                        <ListItem>• Subscription Types</ListItem>
                        <ListItem>• Farmer Subscriptions</ListItem>
                        <ListItem>• Payments & Billing</ListItem>
                        <ListItem>• Resources & Features</ListItem>
                      </List>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* Recent Activity */}
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" fontWeight="semibold">Admin Users & Recent Activity:</Text>
                
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Username</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Last Login</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {adminUsers.map((admin) => (
                        <Tr key={admin.id}>
                          <Td>
                            <Code fontSize="xs">{admin.username}</Code>
                          </Td>
                          <Td fontSize="sm">
                            {admin.first_name} {admin.last_name}
                          </Td>
                          <Td fontSize="sm">{admin.email}</Td>
                          <Td>
                            <HStack spacing={1}>
                              {admin.is_superuser && (
                                <Badge colorScheme="red" size="xs">Super</Badge>
                              )}
                              {admin.is_staff && (
                                <Badge colorScheme="blue" size="xs">Staff</Badge>
                              )}
                            </HStack>
                          </Td>
                          <Td fontSize="xs">
                            {admin.last_login 
                              ? new Date(admin.last_login).toLocaleString()
                              : 'Never'
                            }
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={admin.last_login ? 'green' : 'gray'}
                              size="xs"
                            >
                              {admin.last_login ? 'Active' : 'Inactive'}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>

                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Django Admin logs all administrative actions. Check the "Log entries" section 
                    in Django Admin for detailed audit trails of all database modifications.
                  </Text>
                </Alert>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default DjangoAdminPortalPage;
