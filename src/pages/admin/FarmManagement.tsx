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
  Image,
  Link,
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
  PhoneIcon,
  EmailIcon,
} from '@chakra-ui/icons';
import api from '../../services/api';

interface Farm {
  id: number;
  farmer: number | {
    id: number;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  size_acres?: number;
  established_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  total_batches?: number;
  active_batches?: number;
  total_devices?: number;
  active_devices?: number;
  total_birds?: number;
  average_temperature?: number;
  average_humidity?: number;
  last_reading_date?: string | null;
  // Additional fields from actual API
  location?: string;
  size?: string;
}

interface FarmFormData {
  farmer: number;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  size_acres: number;
  established_date: string;
  status: string;
}

const FarmManagement = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const [formData, setFormData] = useState<FarmFormData>({
    farmer: 0,
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zip_code: '',
    latitude: 0,
    longitude: 0,
    size_acres: 0,
    established_date: '',
    status: 'ACTIVE',
  });

  // Fetch farms
  const fetchFarms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('farms/');
      setFarms(response.data.results || response.data);
      setFilteredFarms(response.data.results || response.data);
    } catch (err: any) {
      console.error('Error fetching farms:', err);
      setError('Failed to fetch farms. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch farms',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch farmers
  const fetchFarmers = async () => {
    try {
      const response = await api.get('farmers/');
      setFarmers(response.data.results || response.data);
    } catch (err: any) {
      console.error('Error fetching farmers:', err);
    }
  };

  // Search and filter functionality
  useEffect(() => {
    let filtered = farms.filter(farm => {
      const searchLower = searchTerm.toLowerCase();
      const farmerName = typeof farm.farmer === 'object' 
        ? `${farm.farmer.user.first_name} ${farm.farmer.user.last_name}`.toLowerCase()
        : '';
      
      return (
        farm.name.toLowerCase().includes(searchLower) ||
        farmerName.includes(searchLower) ||
        (farm.location && farm.location.toLowerCase().includes(searchLower)) ||
        (farm.city && farm.city.toLowerCase().includes(searchLower)) ||
        (farm.state && farm.state.toLowerCase().includes(searchLower)) ||
        (farm.country && farm.country.toLowerCase().includes(searchLower))
      );
    });

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(farm => farm.status === statusFilter);
    }

    setFilteredFarms(filtered);
  }, [searchTerm, statusFilter, farms]);

  useEffect(() => {
    fetchFarms();
    fetchFarmers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedFarm) {
        // Update existing farm
        await api.put(`farms/${selectedFarm.id}/`, formData);
        toast({
          title: 'Success',
          description: 'Farm updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new farm
        await api.post('farms/', formData);
        toast({
          title: 'Success',
          description: 'Farm created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
      resetForm();
      fetchFarms();
    } catch (err: any) {
      console.error('Error saving farm:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to save farm';
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
    if (!selectedFarm) return;

    try {
      await api.delete(`farms/${selectedFarm.id}/`);
      toast({
        title: 'Success',
        description: 'Farm deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      resetForm();
      fetchFarms();
    } catch (err: any) {
      console.error('Error deleting farm:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete farm',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      farmer: 0,
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zip_code: '',
      latitude: 0,
      longitude: 0,
      size_acres: 0,
      established_date: '',
      status: 'ACTIVE',
    });
    setSelectedFarm(null);
  };

  // Open form for editing
  const handleEdit = (farm: Farm) => {
    setSelectedFarm(farm);
    setFormData({
      farmer: farm.farmer.id,
      name: farm.name,
      description: farm.description,
      address: farm.address,
      city: farm.city,
      state: farm.state,
      country: farm.country,
      zip_code: farm.zip_code,
      latitude: farm.latitude,
      longitude: farm.longitude,
      size_acres: farm.size_acres,
      established_date: farm.established_date,
      status: farm.status,
    });
    onOpen();
  };

  // Open form for creating
  const handleCreate = () => {
    resetForm();
    onOpen();
  };

  // Open delete confirmation
  const handleDeleteClick = (farm: Farm) => {
    setSelectedFarm(farm);
    onDeleteOpen();
  };

  // Toggle farm status
  const toggleStatus = async (farm: Farm) => {
    const newStatus = farm.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`farms/${farm.id}/`, { status: newStatus });
      toast({
        title: 'Success',
        description: `Farm ${newStatus.toLowerCase()} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchFarms();
    } catch (err: any) {
      console.error('Error toggling farm status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update farm status',
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
      case 'MAINTENANCE':
        return 'yellow';
      case 'SUSPENDED':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // Calculate statistics
  const stats = {
    totalFarms: farms.length,
    activeFarms: farms.filter(f => f.status === 'ACTIVE').length,
    totalBatches: farms.reduce((sum, f) => sum + (f.total_batches || 0), 0),
    activeBatches: farms.reduce((sum, f) => sum + (f.active_batches || 0), 0),
    totalDevices: farms.reduce((sum, f) => sum + (f.total_devices || 0), 0),
    activeDevices: farms.reduce((sum, f) => sum + (f.active_devices || 0), 0),
    totalBirds: farms.reduce((sum, f) => sum + (f.total_birds || 0), 0),
    totalAcres: farms.reduce((sum, f) => sum + (f.size_acres || 0), 0),
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGoogleMapsUrl = (latitude: number, longitude: number) => {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
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
          <Heading as="h1" size="lg">Farm Management</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleCreate}
          >
            Add Farm
          </Button>
        </Flex>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 2, md: 4, lg: 8 }} spacing={4}>
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
                <StatLabel>Active Farms</StatLabel>
                <StatNumber color="green.500">{stats.activeFarms}</StatNumber>
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
                <StatLabel>Active Batches</StatLabel>
                <StatNumber color="green.500">{stats.activeBatches}</StatNumber>
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
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Active Devices</StatLabel>
                <StatNumber color="green.500">{stats.activeDevices}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Birds</StatLabel>
                <StatNumber>{stats.totalBirds}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Acres</StatLabel>
                <StatNumber>{stats.totalAcres}</StatNumber>
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
                  placeholder="Search farms by name, farmer, or location..."
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
                <option value="MAINTENANCE">Maintenance</option>
                <option value="SUSPENDED">Suspended</option>
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

        {/* Farms Table */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">
              Farms ({filteredFarms.length})
            </Text>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Farm Details</Th>
                  <Th>Farmer</Th>
                  <Th>Location</Th>
                  <Th>Size & Status</Th>
                  <Th>Operations</Th>
                  <Th>Environment</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredFarms.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} textAlign="center" py={8}>
                      <VStack spacing={2}>
                        <Text color={textColor}>No farms found</Text>
                        <Text fontSize="sm" color={textColor}>
                          {searchTerm ? 'Try adjusting your search criteria' : 'Create your first farm to get started'}
                        </Text>
                      </VStack>
                    </Td>
                  </Tr>
                ) : (
                  filteredFarms.map((farm) => (
                    <Tr key={farm.id}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold">{farm.name}</Text>
                          <Text fontSize="sm" color={textColor} noOfLines={2}>
                            {farm.description || farm.location || 'No description available'}
                          </Text>
                          {farm.established_date && (
                            <Text fontSize="xs" color={textColor}>
                              Est: {formatDate(farm.established_date)}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          {typeof farm.farmer === 'object' ? (
                            <>
                              <Text fontWeight="semibold">
                                {farm.farmer.user.first_name} {farm.farmer.user.last_name}
                              </Text>
                              <Text fontSize="sm" color={textColor}>
                                {farm.farmer.user.email}
                              </Text>
                            </>
                          ) : (
                            <Text fontSize="sm" color={textColor}>
                              Farmer ID: {farm.farmer}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">
                            {farm.city && farm.state ? `${farm.city}, ${farm.state}` : farm.location || 'Location not specified'}
                          </Text>
                          <Text fontSize="xs" color={textColor}>
                            {farm.country || 'Country not specified'}
                          </Text>
                          {farm.latitude && farm.longitude && (
                            <Link
                              href={getGoogleMapsUrl(farm.latitude, farm.longitude)}
                              isExternal
                              fontSize="xs"
                              color="blue.500"
                            >
                              <HStack spacing={1}>
                                <ViewIcon boxSize={3} />
                                <Text>View on Map</Text>
                              </HStack>
                            </Link>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm">
                            {farm.size_acres ? `${farm.size_acres} acres` : farm.size || 'Size not specified'}
                          </Text>
                          <Badge colorScheme={getStatusColor(farm.status || 'UNKNOWN')}>
                            {farm.status || 'UNKNOWN'}
                          </Badge>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">
                            <Text as="span" fontWeight="semibold">{farm.active_batches || 0}</Text>/{farm.total_batches || 0} batches
                          </Text>
                          <Text fontSize="sm">
                            <Text as="span" fontWeight="semibold">{farm.active_devices || 0}</Text>/{farm.total_devices || 0} devices
                          </Text>
                          <Text fontSize="xs" color={textColor}>
                            {farm.total_birds || 0} birds
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          {farm.average_temperature !== undefined ? (
                            <Text fontSize="sm">
                              Temp: {farm.average_temperature}°C
                            </Text>
                          ) : (
                            <Text fontSize="sm" color={textColor}>
                              No temperature data
                            </Text>
                          )}
                          {farm.average_humidity !== undefined ? (
                            <Text fontSize="sm">
                              Humidity: {farm.average_humidity}%
                            </Text>
                          ) : (
                            <Text fontSize="sm" color={textColor}>
                              No humidity data
                            </Text>
                          )}
                          {farm.last_reading_date && (
                            <Text fontSize="xs" color={textColor}>
                              Last: {formatDate(farm.last_reading_date)}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="View farm"
                            icon={<ViewIcon />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(farm)}
                          />
                          <IconButton
                            aria-label="Edit farm"
                            icon={<EditIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleEdit(farm)}
                          />
                          <IconButton
                            aria-label="Toggle status"
                            icon={(farm.status || 'UNKNOWN') === 'ACTIVE' ? <CloseIcon /> : <CheckIcon />}
                            size="sm"
                            variant="ghost"
                            colorScheme={(farm.status || 'UNKNOWN') === 'ACTIVE' ? 'red' : 'green'}
                            onClick={() => toggleStatus(farm)}
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
                                onClick={() => handleDeleteClick(farm)}
                              >
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedFarm ? 'Edit Farm' : 'Create New Farm'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Tabs>
                <TabList>
                  <Tab>Basic Info</Tab>
                  <Tab>Location</Tab>
                  <Tab>Details</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
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
                        <FormLabel>Farm Name</FormLabel>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter farm name"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Enter farm description"
                        />
                      </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>Size (acres)</FormLabel>
                          <Input
                            type="number"
                            value={formData.size_acres}
                            onChange={(e) => setFormData({ ...formData, size_acres: parseFloat(e.target.value) || 0 })}
                            placeholder="Enter farm size in acres"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Established Date</FormLabel>
                          <Input
                            type="date"
                            value={formData.established_date}
                            onChange={(e) => setFormData({ ...formData, established_date: e.target.value })}
                          />
                        </FormControl>
                      </HStack>

                      <FormControl isRequired>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="SUSPENDED">Suspended</option>
                        </Select>
                      </FormControl>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Address</FormLabel>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Enter full address"
                        />
                      </FormControl>

                      <HStack spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>City</FormLabel>
                          <Input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Enter city"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>State</FormLabel>
                          <Input
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            placeholder="Enter state"
                          />
                        </FormControl>
                      </HStack>

                      <HStack spacing={4} w="full">
                        <FormControl isRequired>
                          <FormLabel>Country</FormLabel>
                          <Input
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="Enter country"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>ZIP Code</FormLabel>
                          <Input
                            value={formData.zip_code}
                            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                            placeholder="Enter ZIP code"
                          />
                        </FormControl>
                      </HStack>

                      <HStack spacing={4} w="full">
                        <FormControl>
                          <FormLabel>Latitude</FormLabel>
                          <Input
                            type="number"
                            step="any"
                            value={formData.latitude}
                            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                            placeholder="Enter latitude"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Longitude</FormLabel>
                          <Input
                            type="number"
                            step="any"
                            value={formData.longitude}
                            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                            placeholder="Enter longitude"
                          />
                        </FormControl>
                      </HStack>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4}>
                      <Text fontSize="sm" color={textColor}>
                        Additional farm details and monitoring information will be displayed here.
                        This could include environmental sensors, equipment status, and performance metrics.
                      </Text>
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
                  {selectedFarm ? 'Update' : 'Create'}
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
          <ModalHeader>Delete Farm</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete farm "{selectedFarm?.name}"?
              This action cannot be undone and will also delete all associated batches, devices, and data.
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

export default FarmManagement;
