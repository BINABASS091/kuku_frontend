import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Badge,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import {
  ViewIcon,
  AddIcon,
  SettingsIcon,
  EditIcon,
  DeleteIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import { userAPI, farmerAPI, farmAPI } from '../../../../services/api';

interface DataCardProps {
  title: string;
  count: number;
  description: string;
  icon: any;
  color: string;
  onView: () => void;
  onAdd: () => void;
  loading?: boolean;
}

function DataCard({ title, count, description, icon, color, onView, onAdd, loading }: DataCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" boxShadow="md">
      <CardHeader pb={2}>
        <HStack justify="space-between">
          <HStack spacing={3}>
            <Icon as={icon} boxSize={6} color={`${color}.500`} />
            <VStack align="start" spacing={0}>
              <Heading size="md">{title}</Heading>
              <Text fontSize="sm" color="gray.500">
                {description}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody pt={0}>
        <VStack align="stretch" spacing={4}>
          <Stat>
            <StatNumber fontSize="3xl" color={`${color}.500`}>
              {loading ? <Spinner size="sm" /> : count}
            </StatNumber>
            <StatLabel>Total Records</StatLabel>
            <StatHelpText>Active and archived</StatHelpText>
          </Stat>
          <HStack spacing={2}>
            <Button
              leftIcon={<ViewIcon />}
              colorScheme={color}
              variant="outline"
              size="sm"
              onClick={onView}
              flex={1}
              isLoading={loading}
            >
              View All
            </Button>
            <Button
              leftIcon={<AddIcon />}
              colorScheme={color}
              size="sm"
              onClick={onAdd}
              flex={1}
              isLoading={loading}
            >
              Add New
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
}

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[];
  columns: { key: string; label: string; render?: (value: any, item: any) => React.ReactNode }[];
  loading?: boolean;
  error?: string;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

function DataTableModal({ isOpen, onClose, title, data, columns, loading, error, onEdit, onDelete }: DataTableModalProps) {
  const toast = useToast();

  const handleDelete = async (item: any) => {
    if (window.confirm(`Are you sure you want to delete this ${title.toLowerCase().slice(0, -1)}?`)) {
      try {
        if (onDelete) {
          await onDelete(item);
          toast({
            title: 'Success',
            description: `${title.slice(0, -1)} deleted successfully`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to delete ${title.toLowerCase().slice(0, -1)}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading && (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" />
            </Flex>
          )}

          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!loading && !error && (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {columns.map((column) => (
                      <Th key={column.key}>{column.label}</Th>
                    ))}
                    {(onEdit || onDelete) && <Th>Actions</Th>}
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item, index) => (
                    <Tr key={item.id || item.farmID || item.deviceID || index}>
                      {columns.map((column) => (
                        <Td key={column.key}>
                          {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </Td>
                      ))}
                      {(onEdit || onDelete) && (
                        <Td>
                          <HStack spacing={2}>
                            {onEdit && (
                              <Button
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                leftIcon={<EditIcon />}
                                onClick={() => onEdit(item)}
                              >
                                Edit
                              </Button>
                            )}
                            {onDelete && (
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                leftIcon={<DeleteIcon />}
                                onClick={() => handleDelete(item)}
                              >
                                Delete
                              </Button>
                            )}
                          </HStack>
                        </Td>
                      )}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              {data.length === 0 && !loading && (
                <Flex justify="center" align="center" h="200px">
                  <VStack spacing={3}>
                    <WarningIcon boxSize={8} color="gray.400" />
                    <Text color="gray.500">No data found</Text>
                  </VStack>
                </Flex>
              )}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function DataManagement() {
  const [selectedData, setSelectedData] = useState<'users' | 'farmers' | 'farms' | 'devices' | 'subscriptions' | 'batches' | 'activities' | 'sensorReadings' | 'alerts' | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Data fetching hooks
  const { data: usersData, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['users'],
    queryFn: userAPI.list,
    enabled: selectedData === 'users',
  });

  const { data: farmersData, isLoading: farmersLoading, error: farmersError } = useQuery({
    queryKey: ['farmers'],
    queryFn: farmerAPI.list,
    enabled: selectedData === 'farmers',
  });

  const { data: farmsData, isLoading: farmsLoading, error: farmsError } = useQuery({
    queryKey: ['farms'],
    queryFn: farmAPI.list,
    enabled: selectedData === 'farms',
  });

  const { data: devicesData, isLoading: devicesLoading, error: devicesError } = useQuery({
    queryKey: ['devices'],
    queryFn: devicesAPI.getAll,
    enabled: selectedData === 'devices',
  });

  const { data: subscriptionsData, isLoading: subscriptionsLoading, error: subscriptionsError } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionsAPI.getFarmerSubscriptions,
    enabled: selectedData === 'subscriptions',
  });

  const handleViewData = (dataType: 'users' | 'farmers' | 'farms' | 'devices' | 'subscriptions' | 'batches' | 'activities' | 'sensorReadings' | 'alerts') => {
    setSelectedData(dataType);
    onOpen();
  };

  const handleAddNew = (dataType: 'users' | 'farmers' | 'farms' | 'devices' | 'subscriptions' | 'batches' | 'activities' | 'sensorReadings' | 'alerts') => {
    // TODO: Implement add new modals
    console.log('Add new', dataType);
  };

  // Column definitions for different data types
  const userColumns = [
    { key: 'id', label: 'ID' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { 
      key: 'role', 
      label: 'Role',
      render: (value: string) => (
        <Badge colorScheme={value === 'ADMIN' ? 'purple' : value === 'FARMER' ? 'green' : 'blue'}>
          {value}
        </Badge>
      )
    },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge colorScheme={value ? 'green' : 'red'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  ];

  const farmerColumns = [
    { key: 'id', label: 'ID' },
    { key: 'full_name', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'address', label: 'Address' },
    { key: 'created_date', label: 'Joined Date' },
  ];

  const batchColumns = [
    { key: 'batchID', label: 'Batch ID' },
    { key: 'name', label: 'Batch Name' },
    { key: 'status', label: 'Status' },
    { key: 'created_at', label: 'Created At' },
  ];

  const activityColumns = [
    { key: 'activityID', label: 'Activity ID' },
    { key: 'description', label: 'Description' },
    { key: 'timestamp', label: 'Timestamp' },
  ];

  const sensorReadingColumns = [
    { key: 'readingID', label: 'Reading ID' },
    { key: 'value', label: 'Value' },
    { key: 'unit', label: 'Unit' },
    { key: 'timestamp', label: 'Timestamp' },
  ];

  const alertColumns = [
    { key: 'alertID', label: 'Alert ID' },
    { key: 'message', label: 'Message' },
    { key: 'severity', label: 'Severity' },
    { key: 'timestamp', label: 'Timestamp' },
  ];

  const farmColumns = [
    { key: 'farmID', label: 'Farm ID' },
    { key: 'name', label: 'Farm Name' },
    { key: 'location', label: 'Location' },
    { key: 'size', label: 'Size' },
    { key: 'farm_status', label: 'Status' },
    { 
      key: 'farmer', 
      label: 'Farmer',
      render: (value: any) => typeof value === 'object' ? value.full_name : value
    },
  ];

  const deviceColumns = [
    { key: 'deviceID', label: 'Device ID' },
    { key: 'device_id', label: 'Device Code' },
    { key: 'name', label: 'Device Name' },
    { key: 'cell_no', label: 'Cell Number' },
    { key: 'status', label: 'Status' },
    { key: 'farm', label: 'Farm' },
  ];

  const subscriptionColumns = [
    { key: 'subscriptionID', label: 'ID' },
    { 
      key: 'farmer', 
      label: 'Farmer',
      render: (value: any) => typeof value === 'object' ? value.full_name : value
    },
    { 
      key: 'subscription_type', 
      label: 'Type',
      render: (value: any) => typeof value === 'object' ? value.name : value
    },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
    { 
      key: 'is_active', 
      label: 'Status',
      render: (value: boolean) => (
        <Badge colorScheme={value ? 'green' : 'red'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
  ];

  const getModalData = () => {
    switch (selectedData) {
      case 'users':
        return {
          title: 'System Users',
          data: usersData?.results || [],
          columns: userColumns,
          loading: usersLoading,
          error: usersError ? String(usersError) : undefined,
        };
      case 'farmers':
        return {
          title: 'Farmers',
          data: farmersData?.results || [],
          columns: farmerColumns,
          loading: farmersLoading,
          error: farmersError ? String(farmersError) : undefined,
        };
      case 'farms':
        return {
          title: 'Farms',
          data: farmsData?.results || [],
          columns: farmColumns,
          loading: farmsLoading,
          error: farmsError ? String(farmsError) : undefined,
        };
      case 'devices':
        return {
          title: 'Devices',
          data: devicesData?.results || [],
          columns: deviceColumns,
          loading: devicesLoading,
          error: devicesError ? String(devicesError) : undefined,
        };
      case 'subscriptions':
        return {
          title: 'Subscriptions',
          data: subscriptionsData?.results || [],
          columns: subscriptionColumns,
          loading: subscriptionsLoading,
          error: subscriptionsError ? String(subscriptionsError) : undefined,
        };
      default:
        return {
          title: '',
          data: [],
          columns: [],
          loading: false,
          error: undefined,
        };
    }
  };

  const modalData = getModalData();

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Data Management</Heading>
          <Text color="gray.600">
            Manage all system data including users, farmers, farms, devices, and subscriptions
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <DataCard
            title="Users"
            count={usersData?.count || 0}
            description="System users and administrators"
            icon={ViewIcon}
            color="blue"
            onView={() => handleViewData('users')}
            onAdd={() => handleAddNew('users')}
            loading={usersLoading}
          />

          <DataCard
            title="Farmers"
            count={farmersData?.count || 0}
            description="Registered farmers and profiles"
            icon={AddIcon}
            color="green"
            onView={() => handleViewData('farmers')}
            onAdd={() => handleAddNew('farmers')}
            loading={farmersLoading}
          />

          <DataCard
            title="Farms"
            count={farmsData?.count || 0}
            description="Farm locations and properties"
            icon={SettingsIcon}
            color="teal"
            onView={() => handleViewData('farms')}
            onAdd={() => handleAddNew('farms')}
            loading={farmsLoading}
          />

          <DataCard
            title="Devices"
            count={devicesData?.count || 0}
            description="IoT devices and sensors"
            icon={SettingsIcon}
            color="orange"
            onView={() => handleViewData('devices')}
            onAdd={() => handleAddNew('devices')}
            loading={devicesLoading}
          />

          <DataCard
            title="Subscriptions"
            count={subscriptionsData?.count || 0}
            description="Active and inactive subscriptions"
            icon={ViewIcon}
            color="purple"
            onView={() => handleViewData('subscriptions')}
            onAdd={() => handleAddNew('subscriptions')}
            loading={subscriptionsLoading}
          />

          {/* Placeholders for new sections */}
          <DataCard
            title="Batches"
            count={0}
            description="Batch management functionality will be implemented here."
            icon={SettingsIcon}
            color="blue"
            onView={() => handleViewData('batches')}
            onAdd={() => handleAddNew('batches')}
            loading={false}
          />
          <DataCard
            title="Activities"
            count={0}
            description="Activity tracking functionality will be implemented here."
            icon={SettingsIcon}
            color="green"
            onView={() => handleViewData('activities')}
            onAdd={() => handleAddNew('activities')}
            loading={false}
          />
          <DataCard
            title="Sensor Readings"
            count={0}
            description="Sensor readings and analytics will be implemented here."
            icon={SettingsIcon}
            color="orange"
            onView={() => handleViewData('sensorReadings')}
            onAdd={() => handleAddNew('sensorReadings')}
            loading={false}
          />
          <DataCard
            title="Alerts"
            count={0}
            description="Alerts and notifications management will be implemented here."
            icon={SettingsIcon}
            color="red"
            onView={() => handleViewData('alerts')}
            onAdd={() => handleAddNew('alerts')}
            loading={false}
          />
        </SimpleGrid>
      </VStack>

      <DataTableModal
        isOpen={isOpen}
        onClose={onClose}
        title={modalData.title}
        data={modalData.data}
        columns={modalData.columns}
        loading={modalData.loading}
        error={modalData.error}
        onEdit={(item) => console.log('Edit', item)}
        onDelete={(item) => console.log('Delete', item)}
      />
    </Box>
  );
}
