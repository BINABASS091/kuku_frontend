import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Divider,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ChevronDownIcon,
  WarningIcon,
  CheckIcon,
  CloseIcon,
  CalendarIcon,
} from '@chakra-ui/icons';
import api from '../../services/api';

interface UserData {
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
}

interface FarmerData {
  id: number;
  user?: UserData;
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface SubscriptionTypeData {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  features: string[];
}

interface Subscription {
  id: number;
  farmer?: FarmerData;
  subscription_type?: SubscriptionTypeData;
  status: string;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  payment_status: string;
  total_paid: number;
  remaining_amount: number;
  next_payment_date: string | null;
  days_remaining: number;
}

interface SubscriptionFormData {
  subscription_type_id: number;
  duration_months: number;
  auto_renew: boolean;
}

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [subscriptionTypes, setSubscriptionTypes] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const [formData, setFormData] = useState<SubscriptionFormData>({
    subscription_type_id: 0,
    duration_months: 1,
    auto_renew: true,
  });

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('farmer-subscriptions/');
      setSubscriptions(response.data.results || response.data);
      setFilteredSubscriptions(response.data.results || response.data);
    } catch (err: any) {
      console.error('Error fetching subscriptions:', err);
      setError('Failed to fetch subscriptions. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch subscriptions',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch farmers and subscription types
  const fetchRelatedData = async () => {
    try {
      const [farmersRes, typesRes] = await Promise.all([
        api.get('farmers/'),
        api.get('subscription-types/')
      ]);
      setFarmers(farmersRes.data.results || farmersRes.data);
      setSubscriptionTypes(typesRes.data.results || typesRes.data);
    } catch (err: any) {
      console.error('Error fetching related data:', err);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase();
    
    let filtered = subscriptions.filter(subscription => {
      const farmerName = subscription.farmer?.user?.first_name?.toLowerCase() || '';
      const farmerLastName = subscription.farmer?.user?.last_name?.toLowerCase() || '';
      const farmerEmail = subscription.farmer?.user?.email?.toLowerCase() || '';
      const subscriptionType = subscription.subscription_type?.name?.toLowerCase() || '';
      const status = subscription.status?.toLowerCase() || '';
      
      return (
        farmerName.includes(searchTermLower) ||
        farmerLastName.includes(searchTermLower) ||
        farmerEmail.includes(searchTermLower) ||
        subscriptionType.includes(searchTermLower) ||
        status.includes(searchTermLower)
      );
    });

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(subscription => subscription.status === statusFilter);
    }

    setFilteredSubscriptions(filtered);
  }, [searchTerm, statusFilter, subscriptions]);

  useEffect(() => {
    fetchSubscriptions();
    fetchRelatedData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        subscription_type_id: formData.subscription_type_id,
        duration_months: formData.duration_months,
      };

      if (selectedSubscription) {
        // Update existing subscription
        await api.put(`farmer-subscriptions/${selectedSubscription.id}/`, payload);
        toast({
          title: 'Success',
          description: 'Subscription updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new subscription
        await api.post('farmer-subscriptions/', payload);
        toast({
          title: 'Success',
          description: 'Subscription created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
      resetForm();
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error saving subscription:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to save subscription';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedSubscription) return;

    try {
      await api.delete(`farmer-subscriptions/${selectedSubscription.id}/`);
      toast({
        title: 'Success',
        description: 'Subscription deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      resetForm();
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error deleting subscription:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete subscription',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      subscription_type_id: 0,
      duration_months: 1,
      auto_renew: true,
    });
    setSelectedSubscription(null);
  };

  // Open form for editing
  const handleEdit = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setFormData({
      subscription_type_id: subscription.subscription_type.id,
      duration_months: 1, // Default to 1 month or calculate from dates
      auto_renew: subscription.auto_renew,
    });
    onOpen();
  };

  // Open form for creating
  const handleCreate = () => {
    resetForm();
    onOpen();
  };

  // Open delete confirmation
  const handleDeleteClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    onDeleteOpen();
  };

  // Toggle subscription status
  const toggleStatus = async (subscription: Subscription) => {
    const newStatus = subscription.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`subscriptions/${subscription.id}/`, { status: newStatus });
      toast({
        title: 'Success',
        description: `Subscription ${newStatus.toLowerCase()} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchSubscriptions();
    } catch (err: any) {
      console.error('Error toggling subscription status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update subscription status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'EXPIRED':
        return 'orange';
      case 'PENDING':
        return 'yellow';
      case 'CANCELLED':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'green';
      case 'PENDING':
        return 'yellow';
      case 'FAILED':
        return 'red';
      case 'OVERDUE':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Calculate statistics
  const stats = {
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'ACTIVE').length,
    expiredSubscriptions: subscriptions.filter(s => s.status === 'EXPIRED').length,
    totalRevenue: subscriptions.reduce((sum, s) => sum + s.total_paid, 0),
    pendingPayments: subscriptions.filter(s => s.payment_status === 'PENDING').length,
    autoRenewSubscriptions: subscriptions.filter(s => s.auto_renew).length,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">Subscription Management</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleCreate}
          >
            Add Subscription
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Subscriptions</StatLabel>
                <StatNumber>{stats.totalSubscriptions}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Active</StatLabel>
                <StatNumber color="green.500">{stats.activeSubscriptions}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Expired</StatLabel>
                <StatNumber color="red.500">{stats.expiredSubscriptions}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Revenue</StatLabel>
                <StatNumber color="green.500">{formatCurrency(stats.totalRevenue)}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Pending Payments</StatLabel>
                <StatNumber color="yellow.500">{stats.pendingPayments}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Auto Renew</StatLabel>
                <StatNumber color="blue.500">{stats.autoRenewSubscriptions}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Search and Filters */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4}>
              <InputGroup flex={1}>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search subscriptions by farmer, type, or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                w="200px"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="EXPIRED">Expired</option>
                <option value="PENDING">Pending</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </HStack>
          </CardBody>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Subscriptions Table */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">
              Subscriptions ({filteredSubscriptions.length})
            </Text>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Farmer</Th>
                  <Th>Subscription Type</Th>
                  <Th>Status</Th>
                  <Th>Payment Status</Th>
                  <Th>Duration</Th>
                  <Th>Amount</Th>
                  <Th>Auto Renew</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredSubscriptions.map((subscription) => {
                  const daysRemaining = calculateDaysRemaining(subscription.end_date);
                  return (
                    <Tr key={subscription.id}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          {subscription.farmer?.user ? (
                            <>
                              <Text fontWeight="semibold">
                                {subscription.farmer.user.first_name || ''} {subscription.farmer.user.last_name || ''}
                              </Text>
                              <Text fontSize="sm" color={textColor}>
                                {subscription.farmer.user.email || subscription.farmer.email || 'No email'}
                              </Text>
                            </>
                          ) : subscription.farmer ? (
                            <>
                              <Text fontWeight="semibold">
                                {subscription.farmer.first_name || ''} {subscription.farmer.last_name || ''}
                              </Text>
                              <Text fontSize="sm" color={textColor}>
                                {subscription.farmer.email || 'No email'}
                              </Text>
                            </>
                          ) : (
                            <Text fontSize="sm" color={textColor} fontStyle="italic">
                              No farmer data
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold">
                            {subscription.subscription_type?.name || 'No Type'}
                          </Text>
                          <Text fontSize="sm" color={textColor}>
                            {subscription.subscription_type?.duration_days ? `${subscription.subscription_type.duration_days} days` : 'N/A'}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(subscription.status)}>
                          {subscription.status}
                        </Badge>
                        {daysRemaining > 0 && daysRemaining <= 30 && (
                          <Text fontSize="xs" color="orange.500" mt={1}>
                            {daysRemaining} days left
                          </Text>
                        )}
                      </Td>
                      <Td>
                        <Badge colorScheme={getPaymentStatusColor(subscription.payment_status)}>
                          {subscription.payment_status}
                        </Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">Start: {formatDate(subscription.start_date)}</Text>
                          <Text fontSize="sm">End: {formatDate(subscription.end_date)}</Text>
                          {daysRemaining > 0 && subscription.subscription_type?.duration_days && (
                            <Progress
                              value={Math.max(0, Math.min(100, ((subscription.subscription_type.duration_days - daysRemaining) / subscription.subscription_type.duration_days) * 100))}
                              size="sm"
                              colorScheme={daysRemaining <= 7 ? 'red' : daysRemaining <= 30 ? 'yellow' : 'green'}
                              mt={1}
                            />
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold">
                            {subscription.subscription_type?.price ? formatCurrency(subscription.subscription_type.price) : 'N/A'}
                          </Text>
                          <Text fontSize="sm" color={textColor}>
                            Paid: {formatCurrency(subscription.total_paid)}
                          </Text>
                          {subscription.remaining_amount > 0 && (
                            <Text fontSize="xs" color="red.500">
                              Remaining: {formatCurrency(subscription.remaining_amount)}
                            </Text>
                          )}
                        </VStack>
                      </Td>
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
                          <IconButton
                            aria-label="Edit subscription"
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleEdit(subscription)}
                          />
                          <IconButton
                            aria-label="Toggle status"
                            icon={subscription.status === 'ACTIVE' ? <CloseIcon /> : <CheckIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme={subscription.status === 'ACTIVE' ? 'red' : 'green'}
                            onClick={() => toggleStatus(subscription)}
                          />
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="More actions"
                              icon={<ChevronDownIcon />}
                              size="sm"
                              variant="ghost"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<DeleteIcon />}
                                color="red.500"
                                onClick={() => handleDeleteClick(subscription)}
                              >
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSubscription ? 'Edit Subscription' : 'Create New Subscription'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Farmer</FormLabel>
                  <Select
                    value={formData.farmer}
                    onChange={(e) => setFormData({ ...formData, farmer: parseInt(e.target.value) })}
                    placeholder="Select farmer"
                  >
                    {farmers.map(farmer => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.user.first_name} {farmer.user.last_name} ({farmer.user.email})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Subscription Type</FormLabel>
                  <Select
                    placeholder="Select subscription type"
                    value={formData.subscription_type_id}
                    onChange={(e) =>
                      setFormData({ ...formData, subscription_type_id: Number(e.target.value) })
                    }
                  >
                    {subscriptionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} (${type.cost}/month)
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Duration (Months)</FormLabel>
                  <NumberInput
                    min={1}
                    max={12}
                    value={formData.duration_months}
                    onChange={(value) =>
                      setFormData({ ...formData, duration_months: Number(value) })
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="auto-renew" mb="0">
                    Auto Renew
                  </FormLabel>
                  <Switch
                    id="auto-renew"
                    isChecked={formData.auto_renew}
                    onChange={(e) =>
                      setFormData({ ...formData, auto_renew: e.target.checked })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>End Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Auto Renew</FormLabel>
                  <Select
                    value={formData.auto_renew ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, auto_renew: e.target.value === 'true' })}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <Box p={6} pt={0}>
              <HStack spacing={3} justify="flex-end">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                >
                  {selectedSubscription ? 'Update' : 'Create'}
                </Button>
              </HStack>
            </Box>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete this subscription for "{selectedSubscription?.farmer.user.first_name} {selectedSubscription?.farmer.user.last_name}"?
              This action cannot be undone.
            </Text>
          </ModalBody>
          <Box p={6} pt={0}>
            <HStack spacing={3} justify="flex-end">
              <Button variant="ghost" onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                leftIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </HStack>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SubscriptionManagement;
