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
  useToast,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Input,
  Switch,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Flex,
  Alert,
  AlertIcon,
  Textarea,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, ViewIcon, SettingsIcon, SearchIcon } from '@chakra-ui/icons';
import { masterDataAPI } from '../../../services/api';

type FarmerSubscription = {
  id: number;
  farmerSubscriptionID: number;
  farmer?: {
    id: number;
    farmerID: number;
    farmerName: string;
    email: string;
    phone: string;
  };
  subscription_type?: {
    id: number;
    subscriptionTypeID: number;
    name: string;
    tier: string;
    cost: string;
    max_hardware_nodes: number;
    max_software_services: number;
  };
  start_date: string;
  end_date?: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  status_display?: string;
  auto_renew: boolean;
  notes?: string;
  utilization?: {
    hardware: { used: number; limit: number; available: number };
    software: { used: number; limit: number; available: number };
  };
  resources?: any[];
  created_at: string;
  updated_at: string;
};

type SubscriptionType = {
  id: number;
  subscriptionTypeID: number;
  name: string;
  tier: string;
  cost: string;
};

type Farmer = {
  id: number;
  farmerID: number;
  farmerName: string;
  email: string;
};

export default function FarmerSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<FarmerSubscription[]>([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState<SubscriptionType[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<FarmerSubscription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    farmerID: '',
    subscription_type_id: '',
    duration_months: 1,
    auto_renew: true,
    notes: ''
  });

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  
  const toast = useToast();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionsRes, typesRes, farmersRes] = await Promise.all([
        masterDataAPI.farmerSubscriptions.list(),
        masterDataAPI.subscriptionTypes.list(),
        masterDataAPI.farmers.list()
      ]);

      console.log('API Response - Subscriptions:', subscriptionsRes);
      console.log('API Response - Types:', typesRes);
      console.log('API Response - Farmers:', farmersRes);

      setSubscriptions(subscriptionsRes.results || subscriptionsRes || []);
      setSubscriptionTypes(typesRes.results || typesRes || []);
      setFarmers(farmersRes.results || farmersRes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedSubscription(null);
    setFormData({
      farmerID: '',
      subscription_type_id: '',
      duration_months: 1,
      auto_renew: true,
      notes: ''
    });
    onModalOpen();
  };

  const handleEdit = async (subscription: FarmerSubscription) => {
    try {
      // For now, just use the data we already have since we have all the farmer and subscription type info
      setSelectedSubscription(subscription);
      onViewOpen();
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        subscription_type_id: parseInt(formData.subscription_type_id),
        duration_months: formData.duration_months,
        auto_renew: formData.auto_renew
      };

      await masterDataAPI.farmerSubscriptions.create(payload);
      
      toast({
        title: 'Success',
        description: 'Subscription created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onModalClose();
      fetchData();
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to create subscription',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'PENDING': return 'yellow';
      case 'SUSPENDED': return 'orange';
      case 'CANCELLED': return 'red';
      case 'EXPIRED': return 'gray';
      default: return 'gray';
    }
  };

  const formatCurrency = (amount: string | number) => {
    return `KES ${Number(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.farmer?.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subscription_type?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box p={6} bg={bgColor} minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading farmer subscriptions...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Farmer Subscriptions</Heading>
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement>
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg={cardBg}
              />
            </InputGroup>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={handleCreate}
            >
              Create Subscription
            </Button>
          </HStack>
        </Flex>

        <Card bg={cardBg}>
          <CardHeader>
            <Heading size="md">Active Subscriptions ({filteredSubscriptions.length})</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Farmer</Th>
                    <Th>Subscription Plan</Th>
                    <Th>Status</Th>
                    <Th>Start Date</Th>
                    <Th>End Date</Th>
                    <Th>Cost</Th>
                    <Th>Auto Renew</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSubscriptions.map((subscription) => (
                    <Tr key={subscription.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="semibold">
                            {subscription.farmer?.farmerName || 'Unknown Farmer'}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {subscription.farmer?.email}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="semibold">
                            {subscription.subscription_type?.name || 'Unknown Plan'}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {subscription.subscription_type?.tier}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </Td>
                      <Td>{formatDate(subscription.start_date)}</Td>
                      <Td>{subscription.end_date ? formatDate(subscription.end_date) : '-'}</Td>
                      <Td>{formatCurrency(subscription.subscription_type?.cost || 0)}</Td>
                      <Td>
                        <Badge colorScheme={subscription.auto_renew ? 'green' : 'gray'}>
                          {subscription.auto_renew ? 'Yes' : 'No'}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="View subscription"
                            icon={<ViewIcon />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(subscription)}
                          />
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="More actions"
                              icon={<SettingsIcon />}
                              size="sm"
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem icon={<EditIcon />}>
                                Upgrade Subscription
                              </MenuItem>
                              <MenuItem color="red.500">
                                Cancel Subscription
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            
            {filteredSubscriptions.length === 0 && (
              <Alert status="info">
                <AlertIcon />
                No subscriptions found. {searchTerm ? 'Try adjusting your search.' : 'Create the first subscription to get started.'}
              </Alert>
            )}
          </CardBody>
        </Card>

        {/* Create/Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={onModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedSubscription ? 'Edit Subscription' : 'Create New Subscription'}
            </ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody pb={6}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Subscription Type</FormLabel>
                    <Select
                      value={formData.subscription_type_id}
                      onChange={(e) => setFormData({ ...formData, subscription_type_id: e.target.value })}
                      placeholder="Select subscription type"
                    >
                      {subscriptionTypes.map(type => (
                        <option key={type.id} value={type.subscriptionTypeID}>
                          {type.name} - {formatCurrency(type.cost)} ({type.tier})
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Duration (Months)</FormLabel>
                    <Select
                      value={formData.duration_months}
                      onChange={(e) => setFormData({ ...formData, duration_months: parseInt(e.target.value) })}
                    >
                      <option value={1}>1 Month</option>
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months</option>
                    </Select>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Auto Renew</FormLabel>
                    <Switch
                      isChecked={formData.auto_renew}
                      onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Optional notes about this subscription"
                    />
                  </FormControl>

                  <HStack spacing={4} w="full" pt={4}>
                    <Button variant="outline" onClick={onModalClose} flex={1}>
                      Cancel
                    </Button>
                    <Button type="submit" colorScheme="blue" flex={1}>
                      {selectedSubscription ? 'Update' : 'Create'} Subscription
                    </Button>
                  </HStack>
                </VStack>
              </ModalBody>
            </form>
          </ModalContent>
        </Modal>

        {/* View Details Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Subscription Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedSubscription && (
                <VStack spacing={6} align="stretch">
                  <Card>
                    <CardHeader>
                      <Heading size="sm">Subscription Information</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between">
                          <Text fontWeight="semibold">Farmer:</Text>
                          <Text>{selectedSubscription.farmer?.farmerName}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold">Plan:</Text>
                          <Text>{selectedSubscription.subscription_type?.name}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold">Status:</Text>
                          <Badge colorScheme={getStatusColor(selectedSubscription.status)}>
                            {selectedSubscription.status}
                          </Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold">Start Date:</Text>
                          <Text>{formatDate(selectedSubscription.start_date)}</Text>
                        </HStack>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold">End Date:</Text>
                          <Text>{selectedSubscription.end_date ? formatDate(selectedSubscription.end_date) : 'N/A'}</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {selectedSubscription.utilization && (
                    <Card>
                      <CardHeader>
                        <Heading size="sm">Resource Utilization</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4}>
                          <Box w="full">
                            <Text fontWeight="semibold" mb={2}>Hardware Nodes</Text>
                            <HStack justify="space-between">
                              <Text>Used: {selectedSubscription.utilization.hardware.used}</Text>
                              <Text>Limit: {selectedSubscription.utilization.hardware.limit}</Text>
                              <Text>Available: {selectedSubscription.utilization.hardware.available}</Text>
                            </HStack>
                          </Box>
                          <Box w="full">
                            <Text fontWeight="semibold" mb={2}>Software Services</Text>
                            <HStack justify="space-between">
                              <Text>Used: {selectedSubscription.utilization.software.used}</Text>
                              <Text>Limit: {selectedSubscription.utilization.software.limit}</Text>
                              <Text>Available: {selectedSubscription.utilization.software.available}</Text>
                            </HStack>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
