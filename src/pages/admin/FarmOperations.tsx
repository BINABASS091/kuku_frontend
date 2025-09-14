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
import { farmAPI, farmerAPI, deviceAPI, batchAPI, breedAPI, activityAPI, activityTypeAPI, sensorReadingAPI, sensorTypeAPI, alertAPI } from '../../services/api';

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

  const [activityFormData, setActivityFormData] = useState({
    breedID: '',
    activityTypeID: '',
    age: 0,
    breed_activity_status: 1,
  });

  // Activities state
  const [activities, setActivities] = useState<any[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Sensor readings state
  const [sensorReadings, setSensorReadings] = useState<any[]>([]);
  const [sensorTypes, setSensorTypes] = useState<any[]>([]);
  const [filteredSensorReadings, setFilteredSensorReadings] = useState<any[]>([]);
  const [selectedSensorReading, setSelectedSensorReading] = useState<any>(null);
  const [isSensorReadingModalOpen, setIsSensorReadingModalOpen] = useState(false);

  const [sensorReadingFormData, setSensorReadingFormData] = useState({
    deviceID: '',
    sensor_typeID: '',
    value: 0,
  });

  // Alerts state
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const [alertFormData, setAlertFormData] = useState({
    title: '',
    message: '',
    severity: 'medium',
    alert_type: '',
    farm_id: '',
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

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.list();
      setActivities(response.results || response);
      setFilteredActivities(response.results || response);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch activities',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchActivityTypes = async () => {
    try {
      const response = await activityTypeAPI.list();
      setActivityTypes(response.results || response);
    } catch (error) {
      console.error('Error fetching activity types:', error);
    }
  };

  const fetchSensorReadings = async () => {
    try {
      const response = await sensorReadingAPI.list();
      setSensorReadings(response.results || response);
      setFilteredSensorReadings(response.results || response);
    } catch (error) {
      console.error('Error fetching sensor readings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch sensor readings',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchSensorTypes = async () => {
    try {
      const response = await sensorTypeAPI.list();
      setSensorTypes(response.results || response);
    } catch (error) {
      console.error('Error fetching sensor types:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await alertAPI.list();
      setAlerts(response.results || response);
      setFilteredAlerts(response.results || response);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch alerts',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
    } else if (activeTab === 3) { // Activities tab
      const filtered = activities.filter(activity =>
        activity.breed_detail?.breedName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.activity_type_detail?.activityType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.age?.toString().includes(searchTerm.toLowerCase())
      );
      setFilteredActivities(filtered);
    } else if (activeTab === 4) { // Sensor Readings tab
      const filtered = sensorReadings.filter(reading =>
        reading.device_detail?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.sensor_type_detail?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reading.value?.toString().includes(searchTerm.toLowerCase())
      );
      setFilteredSensorReadings(filtered);
    } else if (activeTab === 5) { // Alerts tab
      const filtered = alerts.filter(alert =>
        alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.alert_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.farm_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAlerts(filtered);
    }
  }, [searchTerm, farms, devices, batches, activities, sensorReadings, alerts, activeTab]);

  useEffect(() => {
    fetchFarms();
    fetchDevices();
    fetchBatches();
    fetchBreeds();
    fetchActivities();
    fetchActivityTypes();
    fetchSensorReadings();
    fetchSensorTypes();
    fetchAlerts();
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
    totalActivities: activities.length,
    activeActivities: activities.filter(a => a.breed_activity_status === 1).length,
    totalSensorReadings: sensorReadings.length,
    recentReadings: sensorReadings.filter(r => {
      const readingDate = new Date(r.timestamp);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return readingDate > yesterday;
    }).length,
    totalAlerts: alerts.length,
    unreadAlerts: alerts.filter(a => !a.is_read).length,
    highPriorityAlerts: alerts.filter(a => a.severity === 'high').length,
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

  // Activity handlers
  const handleCreateActivity = () => {
    setActivityFormData({
      breedID: '',
      activityTypeID: '',
      age: 0,
      breed_activity_status: 1,
    });
    setSelectedActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (activity: any) => {
    setActivityFormData({
      breedID: activity.breedID?.toString() || '',
      activityTypeID: activity.activityTypeID?.toString() || '',
      age: activity.age || 0,
      breed_activity_status: activity.breed_activity_status || 1,
    });
    setSelectedActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Activity payload being sent:', activityFormData);
      
      if (selectedActivity) {
        await activityAPI.update(selectedActivity.breedActivityID, activityFormData);
        toast({
          title: 'Success',
          description: 'Activity updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await activityAPI.create(activityFormData);
        toast({
          title: 'Success',
          description: 'Activity created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      setIsActivityModalOpen(false);
      fetchActivities();
    } catch (error) {
      console.error('Error submitting activity:', error);
      toast({
        title: 'Error',
        description: 'Failed to save activity',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteActivity = async (activity: any) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityAPI.delete(activity.breedActivityID);
        toast({
          title: 'Success',
          description: 'Activity deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete activity',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Sensor reading handlers
  const handleCreateSensorReading = () => {
    setSensorReadingFormData({
      deviceID: '',
      sensor_typeID: '',
      value: 0,
    });
    setSelectedSensorReading(null);
    setIsSensorReadingModalOpen(true);
  };

  const handleEditSensorReading = (reading: any) => {
    setSensorReadingFormData({
      deviceID: reading.deviceID?.toString() || '',
      sensor_typeID: reading.sensor_typeID?.toString() || '',
      value: reading.value || 0,
    });
    setSelectedSensorReading(reading);
    setIsSensorReadingModalOpen(true);
  };

  const handleSubmitSensorReading = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Sensor reading payload being sent:', sensorReadingFormData);
      
      if (selectedSensorReading) {
        await sensorReadingAPI.update(selectedSensorReading.readingID, sensorReadingFormData);
        toast({
          title: 'Success',
          description: 'Sensor reading updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await sensorReadingAPI.create(sensorReadingFormData);
        toast({
          title: 'Success',
          description: 'Sensor reading created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      setIsSensorReadingModalOpen(false);
      fetchSensorReadings();
    } catch (error) {
      console.error('Error submitting sensor reading:', error);
      toast({
        title: 'Error',
        description: 'Failed to save sensor reading',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSensorReading = async (reading: any) => {
    if (window.confirm('Are you sure you want to delete this sensor reading?')) {
      try {
        await sensorReadingAPI.delete(reading.readingID);
        toast({
          title: 'Success',
          description: 'Sensor reading deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchSensorReadings();
      } catch (error) {
        console.error('Error deleting sensor reading:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete sensor reading',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Alert handlers
  const handleCreateAlert = () => {
    setAlertFormData({
      title: '',
      message: '',
      severity: 'medium',
      alert_type: '',
      farm_id: '',
    });
    setSelectedAlert(null);
    setIsAlertModalOpen(true);
  };

  const handleEditAlert = (alert: any) => {
    setAlertFormData({
      title: alert.title || '',
      message: alert.message || '',
      severity: alert.severity || 'medium',
      alert_type: alert.alert_type || '',
      farm_id: alert.farm_id?.toString() || '',
    });
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };

  const handleSubmitAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Alert payload being sent:', alertFormData);
      
      if (selectedAlert) {
        await alertAPI.update(selectedAlert.alertID, alertFormData);
        toast({
          title: 'Success',
          description: 'Alert updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await alertAPI.create(alertFormData);
        toast({
          title: 'Success',
          description: 'Alert created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      setIsAlertModalOpen(false);
      fetchAlerts();
    } catch (error) {
      console.error('Error submitting alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to save alert',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAlert = async (alert: any) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await alertAPI.delete(alert.alertID);
        toast({
          title: 'Success',
          description: 'Alert deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete alert',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleMarkAsRead = async (alert: any) => {
    try {
      await alertAPI.markAsRead(alert.alertID);
      toast({
        title: 'Success',
        description: 'Alert marked as read',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark alert as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
        <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={3}>
          <Card bg={cardBg} borderColor={borderColor} size="sm">
            <CardBody p={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Total Farms</StatLabel>
                <StatNumber fontSize="lg">{stats.totalFarms}</StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type="increase" />
                  {stats.activeFarms} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} borderColor={borderColor} size="sm">
            <CardBody p={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Devices</StatLabel>
                <StatNumber fontSize="lg">{stats.totalDevices}</StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type={stats.activeDevices === stats.totalDevices ? "increase" : "decrease"} />
                  {stats.activeDevices} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} size="sm">
            <CardBody p={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Batches</StatLabel>
                <StatNumber fontSize="lg">{stats.totalBatches}</StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type="increase" />
                  {stats.activeBatches} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} size="sm">
            <CardBody p={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Activities</StatLabel>
                <StatNumber fontSize="lg">{stats.totalActivities}</StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type="increase" />
                  {stats.activeActivities} active
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} size="sm">
            <CardBody p={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Sensor Readings</StatLabel>
                <StatNumber fontSize="lg">{stats.totalSensorReadings}</StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type="increase" />
                  {stats.recentReadings} recent
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} size="sm">
            <CardBody p={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Alerts</StatLabel>
                <StatNumber fontSize="lg">{stats.totalAlerts}</StatNumber>
                <StatHelpText fontSize="xs">
                  <StatArrow type={stats.highPriorityAlerts > 0 ? "decrease" : "increase"} />
                  {stats.unreadAlerts} unread
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor} size="sm">
            <CardBody p={3}>
              <Stat size="sm">
                <StatLabel fontSize="xs">Total Birds</StatLabel>
                <StatNumber fontSize="lg">{stats.totalBirds}</StatNumber>
                <StatHelpText fontSize="xs">Across all farms</StatHelpText>
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
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Heading size="md">Activities Management</Heading>
                      <Button
                        colorScheme="blue"
                        leftIcon={<FaPlus />}
                        onClick={handleCreateActivity}
                      >
                        Add Activity
                      </Button>
                    </HStack>

                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Breed</Th>
                            <Th>Activity Type</Th>
                            <Th>Age (days)</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredActivities.map((activity) => (
                            <Tr key={activity.breedActivityID}>
                              <Td>{activity.breedActivityID}</Td>
                              <Td>{activity.breed_detail?.breedName || 'N/A'}</Td>
                              <Td>{activity.activity_type_detail?.activityType || 'N/A'}</Td>
                              <Td>{activity.age}</Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    activity.breed_activity_status === 1 ? 'green' : 'red'
                                  }
                                >
                                  {activity.breed_activity_status === 1 ? 'Active' : 'Inactive'}
                                </Badge>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="Edit activity"
                                    icon={<FaEdit />}
                                    size="sm"
                                    colorScheme="yellow"
                                    onClick={() => handleEditActivity(activity)}
                                  />
                                  <IconButton
                                    aria-label="Delete activity"
                                    icon={<FaTrash />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => handleDeleteActivity(activity)}
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Heading size="md">Sensor Readings Management</Heading>
                      <Button
                        colorScheme="blue"
                        leftIcon={<FaPlus />}
                        onClick={handleCreateSensorReading}
                      >
                        Add Reading
                      </Button>
                    </HStack>

                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>ID</Th>
                            <Th>Device</Th>
                            <Th>Sensor Type</Th>
                            <Th>Value</Th>
                            <Th>Timestamp</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredSensorReadings.map((reading) => (
                            <Tr key={reading.readingID}>
                              <Td>{reading.readingID}</Td>
                              <Td>{reading.device_detail?.name || 'N/A'}</Td>
                              <Td>
                                {reading.sensor_type_detail?.name || 'N/A'}
                                {reading.sensor_type_detail?.unit && (
                                  <Text fontSize="sm" color="gray.500">
                                    ({reading.sensor_type_detail.unit})
                                  </Text>
                                )}
                              </Td>
                              <Td>
                                <Badge colorScheme="blue">
                                  {reading.value}
                                  {reading.sensor_type_detail?.unit && (
                                    <> {reading.sensor_type_detail.unit}</>
                                  )}
                                </Badge>
                              </Td>
                              <Td>
                                <Text fontSize="sm">
                                  {new Date(reading.timestamp).toLocaleString()}
                                </Text>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  <IconButton
                                    aria-label="Edit reading"
                                    icon={<FaEdit />}
                                    size="sm"
                                    colorScheme="yellow"
                                    onClick={() => handleEditSensorReading(reading)}
                                  />
                                  <IconButton
                                    aria-label="Delete reading"
                                    icon={<FaTrash />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => handleDeleteSensorReading(reading)}
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Heading size="md">Alerts & Notifications Management</Heading>
                      <Button
                        colorScheme="blue"
                        leftIcon={<FaPlus />}
                        onClick={handleCreateAlert}
                      >
                        Add Alert
                      </Button>
                    </HStack>

                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Status</Th>
                            <Th>Title</Th>
                            <Th>Type</Th>
                            <Th>Severity</Th>
                            <Th>Farm</Th>
                            <Th>Time</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredAlerts.map((alert) => (
                            <Tr key={alert.alertID} bg={!alert.is_read ? 'blue.50' : 'transparent'}>
                              <Td>
                                {!alert.is_read && (
                                  <Badge colorScheme="red" variant="solid">
                                    New
                                  </Badge>
                                )}
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="bold">{alert.title}</Text>
                                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                                    {alert.message}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Badge colorScheme="blue">{alert.alert_type}</Badge>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    alert.severity === 'high'
                                      ? 'red'
                                      : alert.severity === 'medium'
                                      ? 'yellow'
                                      : 'green'
                                  }
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                              </Td>
                              <Td>{alert.farm_details?.name || 'N/A'}</Td>
                              <Td>
                                <Text fontSize="sm">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </Text>
                              </Td>
                              <Td>
                                <HStack spacing={2}>
                                  {!alert.is_read && (
                                    <IconButton
                                      aria-label="Mark as read"
                                      icon={<ViewIcon />}
                                      size="sm"
                                      colorScheme="green"
                                      onClick={() => handleMarkAsRead(alert)}
                                    />
                                  )}
                                  <IconButton
                                    aria-label="Edit alert"
                                    icon={<FaEdit />}
                                    size="sm"
                                    colorScheme="yellow"
                                    onClick={() => handleEditAlert(alert)}
                                  />
                                  <IconButton
                                    aria-label="Delete alert"
                                    icon={<FaTrash />}
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => handleDeleteAlert(alert)}
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </VStack>
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

      {/* Activity Modal */}
      <Modal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmitActivity}>
            <ModalHeader>
              {selectedActivity ? 'Edit Activity' : 'Add New Activity'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Breed</FormLabel>
                  <Select
                    value={activityFormData.breedID}
                    onChange={(e) => setActivityFormData({
                      ...activityFormData,
                      breedID: e.target.value
                    })}
                    placeholder="Select breed"
                  >
                    {breeds.map((breed) => (
                      <option key={breed.breedID} value={breed.breedID}>
                        {breed.breedName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Activity Type</FormLabel>
                  <Select
                    value={activityFormData.activityTypeID}
                    onChange={(e) => setActivityFormData({
                      ...activityFormData,
                      activityTypeID: e.target.value
                    })}
                    placeholder="Select activity type"
                  >
                    {activityTypes.map((activityType) => (
                      <option key={activityType.activityTypeID} value={activityType.activityTypeID}>
                        {activityType.activityType}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Age (days)</FormLabel>
                  <NumberInput
                    value={activityFormData.age}
                    onChange={(valueString, valueNumber) => setActivityFormData({
                      ...activityFormData,
                      age: valueNumber || 0
                    })}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={activityFormData.breed_activity_status}
                    onChange={(e) => setActivityFormData({
                      ...activityFormData,
                      breed_activity_status: parseInt(e.target.value)
                    })}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                    <option value={9}>Archived</option>
                  </Select>
                </FormControl>

                <HStack spacing={4} width="100%">
                  <Button
                    variant="outline"
                    onClick={() => setIsActivityModalOpen(false)}
                    flex={1}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    flex={1}
                  >
                    {selectedActivity ? 'Update' : 'Create'} Activity
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>

      {/* Sensor Reading Modal */}
      <Modal isOpen={isSensorReadingModalOpen} onClose={() => setIsSensorReadingModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmitSensorReading}>
            <ModalHeader>
              {selectedSensorReading ? 'Edit Sensor Reading' : 'Add New Sensor Reading'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Device</FormLabel>
                  <Select
                    value={sensorReadingFormData.deviceID}
                    onChange={(e) => setSensorReadingFormData({
                      ...sensorReadingFormData,
                      deviceID: e.target.value
                    })}
                    placeholder="Select device"
                  >
                    {devices.map((device) => (
                      <option key={device.deviceID} value={device.deviceID}>
                        {device.name} ({device.device_id})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Sensor Type</FormLabel>
                  <Select
                    value={sensorReadingFormData.sensor_typeID}
                    onChange={(e) => setSensorReadingFormData({
                      ...sensorReadingFormData,
                      sensor_typeID: e.target.value
                    })}
                    placeholder="Select sensor type"
                  >
                    {sensorTypes.map((sensorType) => (
                      <option key={sensorType.sensorTypeID} value={sensorType.sensorTypeID}>
                        {sensorType.name} ({sensorType.unit})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Value</FormLabel>
                  <NumberInput
                    value={sensorReadingFormData.value}
                    onChange={(valueString, valueNumber) => setSensorReadingFormData({
                      ...sensorReadingFormData,
                      value: valueNumber || 0
                    })}
                    precision={2}
                    step={0.01}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <HStack spacing={4} width="100%">
                  <Button
                    variant="outline"
                    onClick={() => setIsSensorReadingModalOpen(false)}
                    flex={1}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    flex={1}
                  >
                    {selectedSensorReading ? 'Update' : 'Create'} Reading
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </form>
        </ModalContent>
      </Modal>

      {/* Alert Modal */}
      <Modal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmitAlert}>
            <ModalHeader>
              {selectedAlert ? 'Edit Alert' : 'Add New Alert'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={alertFormData.title}
                    onChange={(e) => setAlertFormData({
                      ...alertFormData,
                      title: e.target.value
                    })}
                    placeholder="Alert title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    value={alertFormData.message}
                    onChange={(e) => setAlertFormData({
                      ...alertFormData,
                      message: e.target.value
                    })}
                    placeholder="Alert message"
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Alert Type</FormLabel>
                  <Select
                    value={alertFormData.alert_type}
                    onChange={(e) => setAlertFormData({
                      ...alertFormData,
                      alert_type: e.target.value
                    })}
                    placeholder="Select alert type"
                  >
                    <option value="Temperature">Temperature</option>
                    <option value="Humidity">Humidity</option>
                    <option value="Feeding">Feeding</option>
                    <option value="Health">Health</option>
                    <option value="Security">Security</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="General">General</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Severity</FormLabel>
                  <Select
                    value={alertFormData.severity}
                    onChange={(e) => setAlertFormData({
                      ...alertFormData,
                      severity: e.target.value
                    })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Farm</FormLabel>
                  <Select
                    value={alertFormData.farm_id}
                    onChange={(e) => setAlertFormData({
                      ...alertFormData,
                      farm_id: e.target.value
                    })}
                    placeholder="Select farm (optional)"
                  >
                    {farms.map((farm) => (
                      <option key={farm.farmID} value={farm.farmID}>
                        {farm.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <HStack spacing={4} width="100%">
                  <Button
                    variant="outline"
                    onClick={() => setIsAlertModalOpen(false)}
                    flex={1}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    flex={1}
                  >
                    {selectedAlert ? 'Update' : 'Create'} Alert
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