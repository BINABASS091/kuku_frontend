import React, { useState, useEffect } from 'react';
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
  Grid,
  Card,
  CardBody,
  Text,
  Badge,
  Button,
  IconButton,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import {
  AddIcon,
  SearchIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  SettingsIcon,
} from '@chakra-ui/icons';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { farmAPI, farmerAPI, deviceAPI, batchAPI, breedAPI } from '../../services/api';

// TypeScript Interfaces
interface Farm {
  farmID: number;
  name: string;
  location: string;
  size: string;
  farmerID: number;
  farmer_details: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    username: string;
  };
  devices: Device[];
  total_devices: number;
  active_devices: number;
  total_batches: number;
  active_batches: number;
  total_birds: number;
  last_activity_date: string | null;
  farm_status: string;
}

interface Device {
  deviceID: number;
  device_id: string;
  name: string;
  cell_no: string;
  picture: string;
  status: boolean;
  farmID?: number;
  farm_details?: {
    farmID: number;
    name: string;
    location: string;
    farmer_name: string;
  };
  last_reading?: {
    timestamp: string;
    value: number;
    unit: string;
  } | null;
  readings_count?: number;
}

interface Farmer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  user: {
    username: string;
  };
}

const FarmOperations = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);
  
  const { isOpen: isFarmModalOpen, onOpen: onFarmModalOpen, onClose: onFarmModalClose } = useDisclosure();
  const { isOpen: isDeviceModalOpen, onOpen: onDeviceModalOpen, onClose: onDeviceModalClose } = useDisclosure();
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Form states
  const [farmFormData, setFarmFormData] = useState({
    farmer: 0,
    name: '',
    location: '',
    size: '',
  });

  const [deviceFormData, setDeviceFormData] = useState({
    farm: 0,
    device_id: '',
    name: '',
    cell_no: '',
    picture: 'device_default.png',
    status: true,
  });

  const [batchFormData, setBatchFormData] = useState({
    farm: '',
    breed: '',
    batch_name: '',
    quantity: 0,
    start_date: '',
    expected_end_date: '',
    batch_status: 'Active',
    notes: '',
  });

  // Fetch data functions
  const fetchFarms = async () => {
    try {
      setIsLoading(true);
      const response = await farmAPI.list();
      setFarms(response.results || response);
      setFilteredFarms(response.results || response);
    } catch (error) {
      console.error('Error fetching farms:', error);
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

  const fetchDevices = async () => {
    try {
      const response = await deviceAPI.list();
      setDevices(response.results || response);
      setFilteredDevices(response.results || response);
    } catch (error) {
      console.error('Error fetching devices:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch devices',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchFarmers = async () => {
    try {
      const response = await farmerAPI.list();
      setFarmers(response.results || response);
    } catch (error) {
      console.error('Error fetching farmers:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await batchAPI.list();
      setBatches(response.results || response);
      setFilteredBatches(response.results || response);
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch batches',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchBreeds = async () => {
    try {
      const response = await breedAPI.list();
      setBreeds(response.results || response);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  // Search functionality
  useEffect(() => {
    if (activeTab === 0) { // Farms tab
      const filtered = farms.filter(farm =>
        farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.farmer_details?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.farm_status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFarms(filtered);
    } else if (activeTab === 1) { // Devices tab
      const filtered = devices.filter(device =>
        device.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.farm_details?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDevices(filtered);
    } else if (activeTab === 2) { // Batches tab
      const filtered = batches.filter(batch =>
        batch.batch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.farm_details?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.breed_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBatches(filtered);
    }
  }, [searchTerm, farms, devices, batches, activeTab]);

  useEffect(() => {
    fetchFarms();
    fetchDevices();
    fetchBatches();
    fetchBreeds();
    fetchFarmers();
  }, []);

  // Calculate statistics
  const stats = {
    totalFarms: farms.length,
    activeFarms: farms.filter(f => f.farm_status === 'Active').length,
    totalDevices: devices.length,
    activeDevices: devices.filter(d => d.status).length,
    totalBatches: batches.length,
    activeBatches: batches.filter(b => b.batch_status === 'Active').length,
    totalBirds: farms.reduce((sum, farm) => sum + farm.total_birds, 0),
  };

  // Status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'green';
      case 'Partial': return 'yellow';
      case 'Inactive': return 'red';
      case 'Setup Required': return 'gray';
      default: return 'gray';
    }
  };

  // Handle farm operations
  const handleCreateFarm = () => {
    setSelectedFarm(null);
    setFarmFormData({ farmer: 0, name: '', location: '', size: '' });
    onFarmModalOpen();
  };

  const handleEditFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setFarmFormData({
      farmer: farm.farmerID,
      name: farm.name,
      location: farm.location,
      size: farm.size,
    });
    onFarmModalOpen();
  };

  const handleSubmitFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map frontend payload to backend expected format
    const payload = {
      farmerID: farmFormData.farmer,
      name: farmFormData.name,
      location: farmFormData.location,
      size: parseInt(farmFormData.size) || 0,
    };
    
    console.log('Payload being sent:', payload);
    try {
      if (selectedFarm) {
        await farmAPI.update(selectedFarm.farmID, payload);
        toast({
          title: 'Success',
          description: 'Farm updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await farmAPI.create(payload);
        toast({
          title: 'Success',
          description: 'Farm created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onFarmModalClose();
      fetchFarms();
    } catch (error) {
      console.error('Error saving farm:', error);
      toast({
        title: 'Error',
        description: 'Failed to save farm',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteFarm = async (farm: Farm) => {
    if (window.confirm(`Are you sure you want to delete ${farm.name}?`)) {
      try {
        await farmAPI.delete(farm.farmID);
        toast({
          title: 'Success',
          description: 'Farm deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchFarms();
      } catch (error) {
        console.error('Error deleting farm:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete farm',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Device handlers
  const handleCreateDevice = () => {
    setSelectedDevice(null);
    setDeviceFormData({ 
      farm: 0, 
      device_id: '', 
      name: '', 
      cell_no: '', 
      picture: 'device_default.png', 
      status: true 
    });
    onDeviceModalOpen();
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setDeviceFormData({
      farm: device.farmID || 0,
      device_id: device.device_id,
      name: device.name,
      cell_no: device.cell_no,
      picture: device.picture,
      status: device.status,
    });
    onDeviceModalOpen();
  };

  const handleSubmitDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      farmID: deviceFormData.farm,
      device_id: deviceFormData.device_id,
      name: deviceFormData.name,
      cell_no: deviceFormData.cell_no,
      picture: deviceFormData.picture,
      status: deviceFormData.status,
    };
    
    console.log('Device payload being sent:', payload);
    
    try {
      if (selectedDevice) {
        await deviceAPI.update(selectedDevice.deviceID, payload);
        toast({
          title: 'Success',
          description: 'Device updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await deviceAPI.create(payload);
        toast({
          title: 'Success',
          description: 'Device created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      onDeviceModalClose();
      fetchDevices();
    } catch (error) {
      console.error('Error saving device:', error);
      toast({
        title: 'Error',
        description: 'Failed to save device',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteDevice = async (device: Device) => {
    if (window.confirm(`Are you sure you want to delete ${device.name}?`)) {
      try {
        await deviceAPI.delete(device.deviceID);
        toast({
          title: 'Success',
          description: 'Device deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchDevices();
      } catch (error) {
        console.error('Error deleting device:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete device',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Batch handlers
  const handleCreateBatch = () => {
    setBatchFormData({
      farm: '',
      breed: '',
      batch_name: '',
      quantity: 0,
      start_date: '',
      expected_end_date: '',
      batch_status: 'Active',
      notes: ''
    });
    setSelectedBatch(null);
    setIsBatchModalOpen(true);
  };

  const handleEditBatch = (batch: any) => {
    setBatchFormData({
      farm: batch.farm?.toString() || '',
      breed: batch.breed?.toString() || '',
      batch_name: batch.batch_name || '',
      quantity: batch.quantity || 0,
      start_date: batch.start_date || '',
      expected_end_date: batch.expected_end_date || '',
      batch_status: batch.batch_status || 'Active',
      notes: batch.notes || ''
    });
    setSelectedBatch(batch);
    setIsBatchModalOpen(true);
  };

  const handleSubmitBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert form data to proper types for API
      const payload = {
        farm: parseInt(batchFormData.farm),
        breed: parseInt(batchFormData.breed),
        batch_name: batchFormData.batch_name,
        quantity: batchFormData.quantity,
        start_date: batchFormData.start_date,
        expected_end_date: batchFormData.expected_end_date || null,
        batch_status: batchFormData.batch_status,
        notes: batchFormData.notes,
      };
      
      console.log('Batch payload being sent:', payload);
      
      if (selectedBatch) {
        await batchAPI.update(selectedBatch.batchID, payload);
        toast({
          title: 'Success',
          description: 'Batch updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await batchAPI.create(payload);
        toast({
          title: 'Success',
          description: 'Batch created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      setIsBatchModalOpen(false);
      fetchBatches();
    } catch (error) {
      console.error('Error submitting batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to save batch',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteBatch = async (batch: any) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await batchAPI.delete(batch.batchID);
        toast({
          title: 'Success',
          description: 'Batch deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchBatches();
      } catch (error) {
        console.error('Error deleting batch:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete batch',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg" color="blue.600">Farm Operations Management</Heading>
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search farms, devices, etc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </HStack>
        </Flex>

        {/* Statistics Cards */}
        <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Farms</StatLabel>
                <StatNumber>{stats.totalFarms}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {stats.activeFarms} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Devices</StatLabel>
                <StatNumber>{stats.totalDevices}</StatNumber>
                <StatHelpText>
                  <StatArrow type={stats.activeDevices === stats.totalDevices ? "increase" : "decrease"} />
                  {stats.activeDevices} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Batches</StatLabel>
                <StatNumber>{stats.totalBatches}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {stats.activeBatches} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel>Total Birds</StatLabel>
                <StatNumber>{stats.totalBirds}</StatNumber>
                <StatHelpText>Across all farms</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Main Content Tabs */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardBody>
            <Tabs onChange={(index) => setActiveTab(index)}>
              <TabList>
                <Tab>Farms ({filteredFarms.length})</Tab>
                <Tab>Devices ({filteredDevices.length})</Tab>
                <Tab>Batches</Tab>
                <Tab>Activities</Tab>
                <Tab>Sensor Readings</Tab>
                <Tab>Alerts</Tab>
              </TabList>

              <TabPanels>
                {/* Farms Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Text fontSize="lg" fontWeight="semibold">Farm Management</Text>
                      <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleCreateFarm}>
                        Add New Farm
                      </Button>
                    </Flex>

                    <Box overflowX="auto">
                      <Table variant="simple" size="md">
                        <Thead>
                          <Tr>
                            <Th>Farm Details</Th>
                            <Th>Farmer</Th>
                            <Th>Devices</Th>
                            <Th>Batches</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredFarms.map((farm) => (
                            <Tr key={farm.farmID}>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="semibold">{farm.name}</Text>
                                  <Text fontSize="sm" color={textColor}>{farm.location}</Text>
                                  <Text fontSize="xs" color={textColor}>{farm.size}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="sm">{farm.farmer_details?.full_name}</Text>
                                  <Text fontSize="xs" color={textColor}>@{farm.farmer_details?.username}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="sm">{farm.active_devices}/{farm.total_devices} active</Text>
                                  <Text fontSize="xs" color={textColor}>
                                    {farm.devices.length > 0 ? farm.devices.map(d => d.name).join(', ') : 'No devices'}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="sm">{farm.active_batches}/{farm.total_batches} active</Text>
                                  <Text fontSize="xs" color={textColor}>{farm.total_birds} birds total</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Badge colorScheme={getStatusColor(farm.farm_status)}>
                                  {farm.farm_status}
                                </Badge>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="View farm"
                                    icon={<ViewIcon />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditFarm(farm)}
                                  />
                                  <IconButton
                                    aria-label="Edit farm"
                                    icon={<EditIcon />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => handleEditFarm(farm)}
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
                                      <MenuItem icon={<DeleteIcon />} color="red.500" onClick={() => handleDeleteFarm(farm)}>
                                        Delete Farm
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

                    {filteredFarms.length === 0 && (
                      <Alert status="info">
                        <AlertIcon />
                        No farms found. {searchTerm ? 'Try adjusting your search.' : 'Create your first farm to get started.'}
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>

                {/* Devices Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Text fontSize="lg" fontWeight="semibold">Device Management</Text>
                      <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleCreateDevice}>
                        Add New Device
                      </Button>
                    </Flex>

                    <Box overflowX="auto">
                      <Table variant="simple" size="md">
                        <Thead>
                          <Tr>
                            <Th>Device Details</Th>
                            <Th>Farm</Th>
                            <Th>Status</Th>
                            <Th>Cell Number</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredDevices.map((device) => (
                            <Tr key={device.deviceID}>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="semibold">{device.name}</Text>
                                  <Text fontSize="sm" color={textColor}>ID: {device.device_id}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="sm">{device.farm_details?.name || 'Unknown Farm'}</Text>
                                  <Text fontSize="xs" color={textColor}>{device.farm_details?.location || ''}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Badge colorScheme={device.status ? 'green' : 'red'}>
                                  {device.status ? 'Active' : 'Inactive'}
                                </Badge>
                              </Td>
                              <Td>
                                <Text fontSize="sm">{device.cell_no || 'N/A'}</Text>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="Edit device"
                                    icon={<EditIcon />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => handleEditDevice(device)}
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
                                      <MenuItem icon={<DeleteIcon />} color="red.500" onClick={() => handleDeleteDevice(device)}>
                                        Delete Device
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

                    {filteredDevices.length === 0 && (
                      <Alert status="info">
                        <AlertIcon />
                        No devices found. {searchTerm ? 'Try adjusting your search.' : 'Create your first device to get started.'}
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>

                {/* Batches Tab */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Heading size="md">Batch Management</Heading>
                      <Button 
                        leftIcon={<FaPlus />} 
                        colorScheme="blue" 
                        size="sm"
                        onClick={handleCreateBatch}
                      >
                        Add Batch
                      </Button>
                    </Flex>

                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Batch Name</Th>
                            <Th>Farm</Th>
                            <Th>Breed</Th>
                            <Th>Quantity</Th>
                            <Th>Start Date</Th>
                            <Th>Expected End</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredBatches.length === 0 ? (
                            <Tr>
                              <Td colSpan={8} textAlign="center" color="gray.500">
                                No batches found
                              </Td>
                            </Tr>
                          ) : (
                            filteredBatches.map((batch) => (
                              <Tr key={batch.batchID}>
                                <Td fontWeight="medium">{batch.batch_name}</Td>
                                <Td>{batch.farm_details?.name || 'N/A'}</Td>
                                <Td>{batch.breed_details?.name || 'N/A'}</Td>
                                <Td>{batch.quantity}</Td>
                                <Td>{batch.start_date ? new Date(batch.start_date).toLocaleDateString() : 'N/A'}</Td>
                                <Td>{batch.expected_end_date ? new Date(batch.expected_end_date).toLocaleDateString() : 'N/A'}</Td>
                                <Td>
                                  <Badge colorScheme={getStatusColor(batch.batch_status)}>
                                    {batch.batch_status}
                                  </Badge>
                                </Td>
                                <Td>
                                  <HStack spacing={1}>
                                    <IconButton
                                      icon={<FaEdit />}
                                      size="sm"
                                      variant="ghost"
                                      colorScheme="blue"
                                      aria-label="Edit batch"
                                      onClick={() => handleEditBatch(batch)}
                                    />
                                    <IconButton
                                      icon={<FaTrash />}
                                      size="sm"
                                      variant="ghost"
                                      colorScheme="red"
                                      aria-label="Delete batch"
                                      onClick={() => handleDeleteBatch(batch)}
                                    />
                                  </HStack>
                                </Td>
                              </Tr>
                            ))
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <Alert status="info">
                    <AlertIcon />
                    Activity tracking functionality will be implemented here.
                  </Alert>
                </TabPanel>

                <TabPanel>
                  <Alert status="info">
                    <AlertIcon />
                    Sensor readings and analytics will be implemented here.
                  </Alert>
                </TabPanel>

                <TabPanel>
                  <Alert status="info">
                    <AlertIcon />
                    Alerts and notifications management will be implemented here.
                  </Alert>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>

      {/* Farm Modal */}
      <Modal isOpen={isFarmModalOpen} onClose={onFarmModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedFarm ? 'Edit Farm' : 'Create New Farm'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmitFarm}>
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Farmer</FormLabel>
                  <Select
                    value={farmFormData.farmer}
                    onChange={(e) => setFarmFormData({ ...farmFormData, farmer: parseInt(e.target.value) })}
                    placeholder="Select farmer"
                  >
                    {farmers.map(farmer => (
                      <option key={farmer.id} value={farmer.id}>
                        {farmer.full_name} (@{farmer.user?.username})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Farm Name</FormLabel>
                  <Input
                    value={farmFormData.name}
                    onChange={(e) => setFarmFormData({ ...farmFormData, name: e.target.value })}
                    placeholder="Enter farm name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={farmFormData.location}
                    onChange={(e) => setFarmFormData({ ...farmFormData, location: e.target.value })}
                    placeholder="Enter farm location"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Size</FormLabel>
                  <Input
                    value={farmFormData.size}
                    onChange={(e) => setFarmFormData({ ...farmFormData, size: e.target.value })}
                    placeholder="Enter farm size (e.g., 50 acres)"
                  />
                </FormControl>

                <HStack spacing={4} w="full" pt={4}>
                  <Button variant="outline" onClick={onFarmModalClose} flex={1}>
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="blue" flex={1}>
                    {selectedFarm ? 'Update Farm' : 'Create Farm'}
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>

      {/* Device Modal */}
      <Modal isOpen={isDeviceModalOpen} onClose={onDeviceModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDevice ? 'Edit Device' : 'Create New Device'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmitDevice}>
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Farm</FormLabel>
                  <Select
                    value={deviceFormData.farm}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, farm: parseInt(e.target.value) })}
                    placeholder="Select farm"
                  >
                    {farms.map(farm => (
                      <option key={farm.farmID} value={farm.farmID}>
                        {farm.name} - {farm.location}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Device ID</FormLabel>
                  <Input
                    value={deviceFormData.device_id}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, device_id: e.target.value })}
                    placeholder="Enter unique device ID"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Device Name</FormLabel>
                  <Input
                    value={deviceFormData.name}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, name: e.target.value })}
                    placeholder="Enter device name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Cell Number</FormLabel>
                  <Input
                    value={deviceFormData.cell_no}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, cell_no: e.target.value })}
                    placeholder="Enter cell number (optional)"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Picture</FormLabel>
                  <Input
                    value={deviceFormData.picture}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, picture: e.target.value })}
                    placeholder="Enter picture filename"
                  />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="device-status" mb="0">
                    Device Status
                  </FormLabel>
                  <Switch
                    id="device-status"
                    isChecked={deviceFormData.status}
                    onChange={(e) => setDeviceFormData({ ...deviceFormData, status: e.target.checked })}
                  />
                  <Text ml={2} fontSize="sm" color={textColor}>
                    {deviceFormData.status ? 'Active' : 'Inactive'}
                  </Text>
                </FormControl>

                <HStack spacing={4} w="full" pt={4}>
                  <Button variant="outline" onClick={onDeviceModalClose} flex={1}>
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="green" flex={1}>
                    {selectedDevice ? 'Update Device' : 'Create Device'}
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>

      {/* Batch Modal */}
      <Modal isOpen={isBatchModalOpen} onClose={() => setIsBatchModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmitBatch}>
            <ModalHeader>
              {selectedBatch ? 'Edit Batch' : 'Create New Batch'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Farm</FormLabel>
                  <Select 
                    value={batchFormData.farm} 
                    onChange={(e) => setBatchFormData({...batchFormData, farm: e.target.value})}
                    placeholder="Select farm"
                  >
                    {farms.map((farm) => (
                      <option key={farm.farmID} value={farm.farmID}>
                        {farm.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Breed</FormLabel>
                  <Select 
                    value={batchFormData.breed} 
                    onChange={(e) => setBatchFormData({...batchFormData, breed: e.target.value})}
                    placeholder="Select breed"
                  >
                    {breeds.map((breed) => (
                      <option key={breed.breedID} value={breed.breedID}>
                        {breed.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Batch Name</FormLabel>
                  <Input 
                    value={batchFormData.batch_name}
                    onChange={(e) => setBatchFormData({...batchFormData, batch_name: e.target.value})}
                    placeholder="Enter batch name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Quantity</FormLabel>
                  <NumberInput 
                    value={batchFormData.quantity}
                    onChange={(valueString) => setBatchFormData({...batchFormData, quantity: parseInt(valueString) || 0})}
                    min={0}
                  >
                    <NumberInputField placeholder="Enter quantity" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <HStack spacing={4} width="100%">
                  <FormControl isRequired>
                    <FormLabel>Start Date</FormLabel>
                    <Input 
                      type="date"
                      value={batchFormData.start_date}
                      onChange={(e) => setBatchFormData({...batchFormData, start_date: e.target.value})}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Expected End Date</FormLabel>
                    <Input 
                      type="date"
                      value={batchFormData.expected_end_date}
                      onChange={(e) => setBatchFormData({...batchFormData, expected_end_date: e.target.value})}
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    value={batchFormData.batch_status} 
                    onChange={(e) => setBatchFormData({...batchFormData, batch_status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Terminated">Terminated</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea 
                    value={batchFormData.notes}
                    onChange={(e) => setBatchFormData({...batchFormData, notes: e.target.value})}
                    placeholder="Enter any additional notes..."
                    rows={3}
                  />
                </FormControl>

                <HStack spacing={4} width="100%" justify="flex-end">
                  <Button variant="ghost" onClick={() => setIsBatchModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="blue">
                    {selectedBatch ? 'Update' : 'Create'} Batch
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FarmOperations;