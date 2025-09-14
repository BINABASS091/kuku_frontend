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
  Input as ChakraInput,
  Textarea,
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
  PhoneIcon,
  EmailIcon,
  CalendarIcon,
} from '@chakra-ui/icons';
import api, { farmerAPI, userAPI } from '../../services/api';

interface Farmer {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    date_joined: string;
  };
  full_name: string;
  address: string;
  email: string;
  phone: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  date_of_birth: string;
  gender: string;
  experience_years: number;
  farm_size: number;
  is_verified: boolean;
  subscription_status: string;
  total_farms: number;
  total_batches: number;
  created_date: string;
}

interface FarmerFormData {
  user: number;
  phone_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  date_of_birth: string;
  gender: string;
  experience_years: number;
  farm_size: number;
  is_verified: boolean;
}

const FarmerManagement = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarmers, setFilteredFarmers] = useState<Farmer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const [formData, setFormData] = useState<FarmerFormData>({
    user: 0,
    phone_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    date_of_birth: '',
    gender: 'M',
    experience_years: 0,
    farm_size: 0,
    is_verified: false,
  });

  // Fetch farmers
  const fetchFarmers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await farmerAPI.list();
      setFarmers(response.results || response);
      setFilteredFarmers(response.results || response);
    } catch (err: any) {
      console.error('Error fetching farmers:', err);
      setError('Failed to fetch farmers. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch farmers',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      const response = await userAPI.list();
      setUsers(response.results || response);
    } catch (err: any) {
      console.error('Error fetching users:', err);
    }
  };

  // Search functionality
  useEffect(() => {
    const filtered = farmers.filter(farmer => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (farmer.user.first_name || '').toLowerCase().includes(searchTermLower) ||
        (farmer.user.last_name || '').toLowerCase().includes(searchTermLower) ||
        (farmer.full_name || '').toLowerCase().includes(searchTermLower) ||
        (farmer.user.username || '').toLowerCase().includes(searchTermLower) ||
        (farmer.user.email || '').toLowerCase().includes(searchTermLower) ||
        (farmer.email || '').toLowerCase().includes(searchTermLower) ||
        (farmer.phone_number || '').toLowerCase().includes(searchTermLower) ||
        (farmer.phone || '').toLowerCase().includes(searchTermLower) ||
        (farmer.city || '').toLowerCase().includes(searchTermLower) ||
        (farmer.state || '').toLowerCase().includes(searchTermLower) ||
        (farmer.country || '').toLowerCase().includes(searchTermLower)
      );
    });
    setFilteredFarmers(filtered);
  }, [searchTerm, farmers]);

  useEffect(() => {
    fetchFarmers();
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build payload: coerce numbers, remove empty strings
      // Find the selected user to enrich payload if backend requires denormalized fields
      const selectedUserRecord = users.find((u: any) => u.id === Number(formData.user));
      const payload: any = {
        ...formData,
        user: Number(formData.user) || undefined,
        experience_years: Number(formData.experience_years) || 0,
        farm_size: Number(formData.farm_size) || 0,
        // Backend expects these fields in some endpoints
        full_name: selectedUserRecord ? `${selectedUserRecord.first_name || ''} ${selectedUserRecord.last_name || ''}`.trim() : undefined,
        email: selectedUserRecord?.email || undefined,
        phone: formData.phone_number || undefined,
      };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '') payload[k] = null;
      });

      if (selectedFarmer) {
        // Update existing farmer
        await farmerAPI.update(selectedFarmer.id, payload);
        toast({
          title: 'Success',
          description: 'Farmer updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new farmer
        await farmerAPI.create(payload);
        toast({
          title: 'Success',
          description: 'Farmer created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
      resetForm();
      fetchFarmers();
    } catch (err: any) {
      console.error('Error saving farmer:', err);
      let errorMessage = 'Failed to save farmer';
      if (err?.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') errorMessage = data;
        else if (data.detail) errorMessage = data.detail;
        else {
          // Join field errors
          errorMessage = Object.entries(data)
            .map(([field, msgs]) => `${field}: ${(Array.isArray(msgs) ? msgs.join(', ') : String(msgs))}`)
            .join(' | ');
        }
      }
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
    if (!selectedFarmer) return;

    try {
      await farmerAPI.delete(selectedFarmer.id);
      toast({
        title: 'Success',
        description: 'Farmer deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      resetForm();
      fetchFarmers();
    } catch (err: any) {
      console.error('Error deleting farmer:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete farmer',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      user: 0,
      phone_number: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      date_of_birth: '',
      gender: 'M',
      experience_years: 0,
      farm_size: 0,
      is_verified: false,
    });
    setSelectedFarmer(null);
  };

  // Open form for editing
  const handleEdit = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setFormData({
      user: farmer.user.id,
      phone_number: farmer.phone_number,
      address: farmer.address,
      city: farmer.city,
      state: farmer.state,
      country: farmer.country,
      zip_code: farmer.zip_code,
      date_of_birth: farmer.date_of_birth,
      gender: farmer.gender,
      experience_years: farmer.experience_years,
      farm_size: farmer.farm_size,
      is_verified: farmer.is_verified,
    });
    onOpen();
  };

  // Open form for creating
  const handleCreate = () => {
    resetForm();
    onOpen();
  };

  // Open delete confirmation
  const handleDeleteClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    onDeleteOpen();
  };

  // Toggle farmer verification status
  const toggleVerification = async (farmer: Farmer) => {
    try {
      await farmerAPI.update(farmer.id, { is_verified: !farmer.is_verified });
      toast({
        title: 'Success',
        description: `Farmer ${farmer.is_verified ? 'unverified' : 'verified'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchFarmers();
    } catch (err: any) {
      console.error('Error toggling farmer verification:', err);
      toast({
        title: 'Error',
        description: 'Failed to update farmer verification',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getSubscriptionColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'BASIC':
        return 'blue';
      case 'PREMIUM':
        return 'green';
      case 'ACTIVE':
        return 'green';
      case 'EXPIRED':
        return 'red';
      case 'PENDING':
        return 'yellow';
      case 'CANCELLED':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // Calculate statistics
  const stats = {
    totalFarmers: farmers.length,
    verifiedFarmers: farmers.filter(f => f.is_verified).length,
    activeFarmers: farmers.filter(f => f.user.is_active).length,
    totalFarms: farmers.reduce((sum, f) => sum + f.total_farms, 0),
    totalBatches: farmers.reduce((sum, f) => sum + f.total_batches, 0),
    totalDevices: farmers.reduce((sum, f) => sum + f.total_devices, 0),
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
          <Heading as="h1" size="lg">Farmer Management</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleCreate}
          >
            Add Farmer
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Farmers</StatLabel>
                <StatNumber>{stats.totalFarmers}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Verified</StatLabel>
                <StatNumber>{stats.verifiedFarmers}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Active</StatLabel>
                <StatNumber>{stats.activeFarmers}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Farms</StatLabel>
                <StatNumber>{stats.totalFarms}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Batches</StatLabel>
                <StatNumber>{stats.totalBatches}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Devices</StatLabel>
                <StatNumber>{stats.totalDevices}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Search */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search farmers by name, email, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </CardBody>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Farmers Table */}
        <Card bg={cardBg} borderColor={borderColor} overflow="hidden">
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">
              Farmers ({filteredFarmers.length})
            </Text>
          </CardHeader>
          <CardBody p={0}>
            <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Farmer</Th>
                  <Th>Contact</Th>
                  <Th>Location</Th>
                  <Th>Experience</Th>
                  <Th>Status</Th>
                  <Th>Farms/Batches</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFarmers.map((farmer) => (
                  <Tr key={farmer.id}>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">
                          {farmer.user.first_name && farmer.user.last_name 
                            ? `${farmer.user.first_name} ${farmer.user.last_name}`
                            : farmer.full_name || farmer.user.username
                          }
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          @{farmer.user.username}
                        </Text>
                        <HStack spacing={2}>
                          <Badge colorScheme={farmer.is_verified ? 'green' : 'gray'} size="sm">
                            {farmer.is_verified ? 'Verified' : 'Unverified'}
                          </Badge>
                          <Badge colorScheme={farmer.user.is_active ? 'green' : 'red'} size="sm">
                            {farmer.user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <HStack spacing={1}>
                          <EmailIcon boxSize={3} />
                          <Text fontSize="sm">{farmer.user.email || farmer.email || 'No email'}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <PhoneIcon boxSize={3} />
                          <Text fontSize="sm">{farmer.phone_number || farmer.phone || 'No phone'}</Text>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">{farmer.city}, {farmer.state}</Text>
                        <Text fontSize="xs" color={textColor}>{farmer.country}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">{farmer.experience_years} years</Text>
                        <Text fontSize="xs" color={textColor}>{farmer.farm_size} acres</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={getSubscriptionColor(farmer.subscription_status)}>
                        {farmer.subscription_status || 'N/A'}
                      </Badge>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">{farmer.total_farms} farms</Text>
                        <Text fontSize="xs" color={textColor}>{farmer.total_batches} batches</Text>
                      </VStack>
                    </Td>
                    <Td whiteSpace="nowrap">
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="View farmer"
                          icon={<ViewIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(farmer)}
                        />
                        <IconButton
                          aria-label="Edit farmer"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleEdit(farmer)}
                        />
                        <IconButton
                          aria-label="Toggle verification"
                          icon={farmer.is_verified ? <CloseIcon /> : <CheckIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme={farmer.is_verified ? 'red' : 'green'}
                          onClick={() => toggleVerification(farmer)}
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
                              onClick={() => handleDeleteClick(farmer)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            </Box>
          </CardBody>
        </Card>
      </VStack>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedFarmer ? 'Edit Farmer' : 'Create New Farmer'}
          </ModalHeader>
          <ModalCloseButton />
          {/* Disable native HTML validation to avoid non-focusable required errors across tabs */}
          <form onSubmit={handleSubmit} noValidate>
            <ModalBody>
              <Tabs>
                <TabList>
                  <Tab>Basic Info</Tab>
                  <Tab>Contact & Location</Tab>
                  <Tab>Experience</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>User Account</FormLabel>
                        <Select
                          value={formData.user}
                          onChange={(e) => setFormData({ ...formData, user: parseInt(e.target.value) })}
                          placeholder="Select user account"
                        >
                          {users
                            .filter(user => user.role === 'FARMER')
                            .map(user => (
                              <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name} ({user.email})
                              </option>
                            ))}
                        </Select>
                      </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Date of Birth</FormLabel>
                          <ChakraInput
                            type="date"
                            value={formData.date_of_birth}
                            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Verification Status</FormLabel>
                        <Select
                          value={formData.is_verified ? 'true' : 'false'}
                          onChange={(e) => setFormData({ ...formData, is_verified: e.target.value === 'true' })}
                        >
                          <option value="false">Unverified</option>
                          <option value="true">Verified</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl>
                        <FormLabel>Phone Number</FormLabel>
                        <ChakraInput
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          placeholder="Enter phone number"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Address</FormLabel>
                        <Textarea
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Enter full address"
                        />
                      </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel>City</FormLabel>
                          <ChakraInput
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Enter city"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>State</FormLabel>
                          <ChakraInput
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="Enter state"
                          />
                        </FormControl>
                      </HStack>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel>Country</FormLabel>
                          <ChakraInput
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="Enter country"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>ZIP Code</FormLabel>
                          <ChakraInput
                            value={formData.zip_code}
                            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                            placeholder="Enter ZIP code"
                          />
                        </FormControl>
                      </HStack>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Years of Experience</FormLabel>
                        <ChakraInput
                          type="number"
                          value={formData.experience_years}
                          onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                          placeholder="Enter years of experience"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Farm Size (acres)</FormLabel>
                        <ChakraInput
                          type="number"
                          value={formData.farm_size}
                          onChange={(e) => setFormData({ ...formData, farm_size: parseInt(e.target.value) || 0 })}
                          placeholder="Enter farm size in acres"
                        />
                      </FormControl>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
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
                  {selectedFarmer ? 'Update' : 'Create'}
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
          <ModalHeader>Delete Farmer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete farmer "{selectedFarmer?.user.first_name} {selectedFarmer?.user.last_name}"?
              This action cannot be undone and will also delete all associated farms and data.
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

export default FarmerManagement;
