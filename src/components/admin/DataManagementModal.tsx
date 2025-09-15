import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  IconButton,
  Tooltip,
  Input,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Text,
  Spinner,
  Center,
  useColorModeValue,
  Box,
  Grid,
  GridItem,
  Divider,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiLayers } from 'react-icons/fi';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'FARMER' | 'EXPERT' | 'ACCOUNTANT';
  is_active: boolean;
  date_joined: string;
  phone?: string;
  profile_image?: string;
}

interface Farmer {
  id: number;
  farmerID?: number;
  user: number;
  farmerName: string;
  address: string;
  email: string;
  phone: string;
  created_date: string;
}

interface Farm {
  farmID: number;
  farmerID: number;
  farmName: string;
  location: string;
  farmSize: string;
  farmer_details?: Farmer;
}

interface Batch {
  batchID: number;
  farmID: number;
  breedID: number;
  arriveDate: string;
  initAge: number;
  harvestAge: number;
  quanitity: number; // Note: Backend has typo
  initWeight: number;
  batch_status: number;
  farm_details?: Farm;
  breed_details?: Breed;
}

interface Breed {
  breedID: number;
  breedName: string;
  breed_typeID: number;
  preedphoto?: string;
  breed_details?: BreedType;
}

interface BreedType {
  breed_typeID: number;
  breedType: string;
}

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
}

const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  activeTab,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [breedTypes, setBreedTypes] = useState<BreedType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      switch (activeTab) {
        case 'users':
          try {
            const response = await fetch('/api/v1/users/', { headers });
            if (response.ok) {
              const data = await response.json();
              setUsers(data.results || []);
            } else {
              setUsers([]);
            }
          } catch {
            setUsers([]);
          }
          break;
        case 'farmers':
          try {
            const response = await fetch('/api/v1/farmers/', { headers });
            if (response.ok) {
              const data = await response.json();
              setFarmers(data.results || []);
            } else {
              setFarmers([]);
            }
          } catch {
            setFarmers([]);
          }
          break;
        case 'farms':
          try {
            const response = await fetch('/api/v1/farms/', { headers });
            if (response.ok) {
              const data = await response.json();
              setFarms(data.results || []);
            }
            // Also load farmers for farm creation
            const farmersResponse = await fetch('/api/v1/farmers/', { headers });
            if (farmersResponse.ok) {
              const farmersData = await farmersResponse.json();
              setFarmers(farmersData.results || []);
            }
          } catch {
            setFarms([]);
          }
          break;
        case 'batches':
          try {
            const response = await fetch('/api/v1/batches/', { headers });
            if (response.ok) {
              const data = await response.json();
              setBatches(data.results || []);
            }
            // Also load farms and breeds for batch creation
            const farmsResponse = await fetch('/api/v1/farms/', { headers });
            if (farmsResponse.ok) {
              const farmsData = await farmsResponse.json();
              setFarms(farmsData.results || []);
            }
            const breedsResponse = await fetch('/api/v1/breeds/', { headers });
            if (breedsResponse.ok) {
              const breedsData = await breedsResponse.json();
              setBreeds(breedsData.results || []);
            }
          } catch {
            setBatches([]);
          }
          break;
        case 'breeds':
          try {
            const response = await fetch('/api/v1/breeds/', { headers });
            if (response.ok) {
              const data = await response.json();
              setBreeds(data.results || []);
            }
            // Also load breed types for breed creation
            const breedTypesResponse = await fetch('/api/v1/breed-types/', { headers });
            if (breedTypesResponse.ok) {
              const breedTypesData = await breedTypesResponse.json();
              setBreedTypes(breedTypesData.results || []);
            }
          } catch {
            setBreeds([]);
          }
          break;
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsEditing(true);
    setFormData({});
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsEditing(true);
    setFormData({ ...item });
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/${activeTab}/${selectedItem.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${activeTab.slice(0, -1)} deleted successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        loadData();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to delete ${activeTab.slice(0, -1)}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    onDeleteClose();
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = selectedItem ? 'PUT' : 'POST';
      const url = selectedItem 
        ? `/api/v1/${activeTab}/${selectedItem.id}/`
        : `/api/v1/${activeTab}/`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `${activeTab.slice(0, -1)} ${selectedItem ? 'updated' : 'created'} successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsEditing(false);
        loadData();
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save ${activeTab.slice(0, -1)}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const renderUserForm = () => (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2} color={useColorModeValue('gray.700', 'gray.200')}>
            {selectedItem ? 'Edit User Details' : 'Create New User'}
          </Heading>
          <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
            {selectedItem ? 'Update the user information below' : 'Fill in the details to create a new user account'}
          </Text>
          <Divider mt={4} />
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Username
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiUser} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Email Address
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiMail} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                First Name
              </FormLabel>
              <Input
                value={formData.first_name || ''}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Enter first name"
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Last Name
              </FormLabel>
              <Input
                value={formData.last_name || ''}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Enter last name"
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Phone Number
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiPhone} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                User Role
              </FormLabel>
              <Select
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              >
                <option value="">Select role</option>
                <option value="FARMER">Farmer</option>
                <option value="ADMIN">Admin</option>
                <option value="EXPERT">Expert</option>
                <option value="ACCOUNTANT">Accountant</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Account Status
              </FormLabel>
              <Select
                value={formData.is_active !== undefined ? (formData.is_active ? 'true' : 'false') : 'true'}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </FormControl>
          </GridItem>

          {!selectedItem && (
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl>
                <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                  Password
                </FormLabel>
                <Input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
                />
              </FormControl>
            </GridItem>
          )}
        </Grid>
      </VStack>
    </Box>
  );

  const renderFarmerForm = () => (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2} color={useColorModeValue('gray.700', 'gray.200')}>
            {selectedItem ? 'Edit Farmer Details' : 'Register New Farmer'}
          </Heading>
          <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
            {selectedItem ? 'Update the farmer information below' : 'Fill in the details to register a new farmer'}
          </Text>
          <Divider mt={4} />
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Farmer Name
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiUser} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={formData.farmerName || ''}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  placeholder="Enter farmer name"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'green.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Email Address
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiMail} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'green.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Phone Number
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiPhone} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'green.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                User Account
              </FormLabel>
              <Select
                value={formData.user || ''}
                onChange={(e) => setFormData({ ...formData, user: parseInt(e.target.value) })}
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'green.500', boxShadow: 'none' }}
              >
                <option value="">Select user account</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Address
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiMapPin} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter farmer address"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'green.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );

  const renderFarmForm = () => (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2} color={useColorModeValue('gray.700', 'gray.200')}>
            {selectedItem ? 'Edit Farm Details' : 'Register New Farm'}
          </Heading>
          <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
            {selectedItem ? 'Update the farm information below' : 'Fill in the details to register a new farm'}
          </Text>
          <Divider mt={4} />
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Farm Name
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiHome} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={formData.farmName || ''}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="Enter farm name"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'purple.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Farm Size
              </FormLabel>
              <Select
                value={formData.farmSize || ''}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'purple.500', boxShadow: 'none' }}
              >
                <option value="">Select farm size</option>
                <option value="Small">Small (1-100 birds)</option>
                <option value="Medium">Medium (101-500 birds)</option>
                <option value="Large">Large (501-1000 birds)</option>
                <option value="Very Large">Very Large (1000+ birds)</option>
              </Select>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Location
              </FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={FiMapPin} color="gray.400" />
                </InputLeftElement>
                <Input
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter farm location (address, coordinates, etc.)"
                  bg={useColorModeValue('white', 'gray.700')}
                  border="2px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _focus={{ borderColor: 'purple.500', boxShadow: 'none' }}
                />
              </InputGroup>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Farm Owner
              </FormLabel>
              <Select
                value={formData.farmerID || ''}
                onChange={(e) => setFormData({ ...formData, farmerID: parseInt(e.target.value) })}
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'purple.500', boxShadow: 'none' }}
              >
                <option value="">Select farm owner</option>
                {farmers.map((farmer) => (
                  <option key={farmer.id} value={farmer.id}>
                    {farmer.farmerName} ({farmer.email})
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );

  const renderBatchForm = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel>Farm</FormLabel>
        <Select
          value={formData.farmID || ''}
          onChange={(e) => setFormData({ ...formData, farmID: parseInt(e.target.value) })}
        >
          <option value="">Select farm</option>
          {farms.map((farm) => (
            <option key={farm.farmID} value={farm.farmID}>
              {farm.farmName}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Breed</FormLabel>
        <Select
          value={formData.breedID || ''}
          onChange={(e) => setFormData({ ...formData, breedID: parseInt(e.target.value) })}
        >
          <option value="">Select breed</option>
          {breeds.map((breed) => (
            <option key={breed.breedID} value={breed.breedID}>
              {breed.breedName}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Quantity (Number of Birds)</FormLabel>
        <Input
          type="number"
          value={formData.quanitity || ''}
          onChange={(e) => setFormData({ ...formData, quanitity: parseInt(e.target.value) })}
          placeholder="Enter bird count"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Arrive Date</FormLabel>
        <Input
          type="date"
          value={formData.arriveDate || ''}
          onChange={(e) => setFormData({ ...formData, arriveDate: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Initial Age (days)</FormLabel>
        <Input
          type="number"
          value={formData.initAge || ''}
          onChange={(e) => setFormData({ ...formData, initAge: parseInt(e.target.value) })}
          placeholder="Enter initial age in days"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Harvest Age (days)</FormLabel>
        <Input
          type="number"
          value={formData.harvestAge || ''}
          onChange={(e) => setFormData({ ...formData, harvestAge: parseInt(e.target.value) })}
          placeholder="Enter planned harvest age in days"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Initial Weight (grams)</FormLabel>
        <Input
          type="number"
          value={formData.initWeight || ''}
          onChange={(e) => setFormData({ ...formData, initWeight: parseInt(e.target.value) })}
          placeholder="Enter initial weight in grams"
        />
      </FormControl>
    </VStack>
  );

  const renderBreedForm = () => (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.800')} borderRadius="lg">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2} color={useColorModeValue('gray.700', 'gray.200')}>
            {selectedItem ? 'Edit Breed Details' : 'Register New Breed'}
          </Heading>
          <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
            {selectedItem ? 'Update the breed information below' : 'Fill in the details to register a new poultry breed'}
          </Text>
          <Divider mt={4} />
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Breed Name
              </FormLabel>
              <Input
                value={formData.breedName || ''}
                onChange={(e) => setFormData({ ...formData, breedName: e.target.value })}
                placeholder="Enter breed name"
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'teal.500', boxShadow: 'none' }}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Breed Type
              </FormLabel>
              <Select
                value={formData.breed_typeID || ''}
                onChange={(e) => setFormData({ ...formData, breed_typeID: parseInt(e.target.value) })}
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'teal.500', boxShadow: 'none' }}
              >
                <option value="">Select breed type</option>
                {breedTypes.map((breedType) => (
                  <option key={breedType.breed_typeID} value={breedType.breed_typeID}>
                    {breedType.breedType}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.200')}>
                Photo URL <Text as="span" color="gray.500" fontSize="sm">(optional)</Text>
              </FormLabel>
              <Input
                value={formData.preedphoto || ''}
                onChange={(e) => setFormData({ ...formData, preedphoto: e.target.value })}
                placeholder="Enter photo URL for the breed"
                bg={useColorModeValue('white', 'gray.700')}
                border="2px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                _focus={{ borderColor: 'teal.500', boxShadow: 'none' }}
              />
            </FormControl>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );

  const renderTable = () => {
    let data: any[] = [];
    let columns: string[] = [];

    switch (activeTab) {
      case 'users':
        data = users;
        columns = ['Username', 'Name', 'Email', 'Role', 'Status', 'Actions'];
        break;
      case 'farmers':
        data = farmers;
        columns = ['Name', 'Email', 'Phone', 'Address', 'Created', 'Actions'];
        break;
      case 'farms':
        data = farms;
        columns = ['Farm Name', 'Location', 'Farm Size', 'Farmer', 'Actions'];
        break;
      case 'batches':
        data = batches;
        columns = ['Farm', 'Breed', 'Quantity', 'Arrive Date', 'Init Age', 'Actions'];
        break;
      case 'breeds':
        data = breeds;
        columns = ['Breed Name', 'Breed Type', 'Photo', 'Actions'];
        break;
    }

    if (loading) {
      return (
        <Center py={10}>
          <VStack spacing={4}>
            <Spinner size="xl" />
            <Text>Loading {activeTab}...</Text>
          </VStack>
        </Center>
      );
    }

    if (data.length === 0) {
      return (
        <Center py={10}>
          <VStack spacing={4}>
            <Text fontSize="lg" color="gray.500">
              No {activeTab} found
            </Text>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
              Add First {activeTab.slice(0, -1)}
            </Button>
          </VStack>
        </Center>
      );
    }

    return (
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th key={column}>{column}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id || item.farmID || item.batchID || item.breedID}>
                {activeTab === 'users' && (
                  <>
                    <Td fontWeight="medium">{item.username}</Td>
                    <Td>{`${item.first_name} ${item.last_name}`}</Td>
                    <Td>{item.email}</Td>
                    <Td>
                      <Badge colorScheme={item.role === 'ADMIN' ? 'red' : 'blue'}>
                        {item.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={item.is_active ? 'green' : 'red'}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                  </>
                )}
                {activeTab === 'farmers' && (
                  <>
                    <Td fontWeight="medium">{item.farmerName}</Td>
                    <Td>{item.email}</Td>
                    <Td>{item.phone}</Td>
                    <Td>{item.address}</Td>
                    <Td fontSize="sm">{new Date(item.created_date).toLocaleDateString()}</Td>
                  </>
                )}
                {activeTab === 'farms' && (
                  <>
                    <Td fontWeight="medium">{item.farmName}</Td>
                    <Td>{item.location}</Td>
                    <Td>{item.farmSize}</Td>
                    <Td>{item.farmer_details?.farmerName || `Farmer ID: ${item.farmerID}`}</Td>
                  </>
                )}
                {activeTab === 'batches' && (
                  <>
                    <Td fontWeight="medium">{item.farm_details?.farmName || `Farm ID: ${item.farmID}`}</Td>
                    <Td>{item.breed_details?.breedName || `Breed ID: ${item.breedID}`}</Td>
                    <Td>{item.quanitity?.toLocaleString()}</Td>
                    <Td fontSize="sm">{new Date(item.arriveDate).toLocaleDateString()}</Td>
                    <Td>{item.initAge} days</Td>
                  </>
                )}
                {activeTab === 'breeds' && (
                  <>
                    <Td fontWeight="medium">{item.breedName}</Td>
                    <Td>{item.breed_details?.breedType || `Type ID: ${item.breed_typeID}`}</Td>
                    <Td>{item.preedphoto ? 'Yes' : 'No'}</Td>
                  </>
                )}
                <Td>
                  <HStack spacing={1}>
                    <Tooltip label="Edit">
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      />
                    </Tooltip>
                    <Tooltip label="Delete">
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={() => handleDelete(item)}
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="xl"
          boxShadow="2xl"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <ModalHeader 
            pb={6}
            borderBottom="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
          >
            <Flex align="center" gap={3}>
              <Icon 
                as={
                  activeTab === 'users' ? FiUser :
                  activeTab === 'farms' ? FiHome :
                  activeTab === 'batches' ? FiLayers :
                  FiUser
                } 
                boxSize={6}
                color={
                  activeTab === 'users' ? 'blue.500' :
                  activeTab === 'farmers' ? 'green.500' :
                  activeTab === 'farms' ? 'purple.500' :
                  activeTab === 'batches' ? 'orange.500' :
                  'teal.500'
                }
              />
              <Box>
                <Heading size="lg" color={useColorModeValue('gray.800', 'white')}>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                </Heading>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} mt={1}>
                  {isEditing 
                    ? `${selectedItem ? 'Edit existing' : 'Create new'} ${activeTab.slice(0, -1)} record`
                    : `Manage ${activeTab} records, add new entries, and update existing data`
                  }
                </Text>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalCloseButton 
            size="lg"
            color={useColorModeValue('gray.400', 'gray.300')}
            _hover={{ color: useColorModeValue('gray.600', 'gray.100') }}
          />
          <ModalBody p={8}>
            {isEditing ? (
              <VStack spacing={8} align="stretch">
                {activeTab === 'users' && renderUserForm()}
                {activeTab === 'farmers' && renderFarmerForm()}
                {activeTab === 'farms' && renderFarmForm()}
                {activeTab === 'batches' && renderBatchForm()}
                {activeTab === 'breeds' && renderBreedForm()}
                
                <Flex justify="end" pt={6} borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.700')}>
                  <HStack spacing={4}>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                      size="lg"
                      colorScheme="gray"
                    >
                      Cancel
                    </Button>
                    <Button 
                      colorScheme={
                        activeTab === 'users' ? 'blue' :
                        activeTab === 'farmers' ? 'green' :
                        activeTab === 'farms' ? 'purple' :
                        activeTab === 'batches' ? 'orange' :
                        'teal'
                      }
                      onClick={handleSave}
                      size="lg"
                      leftIcon={selectedItem ? <EditIcon /> : <AddIcon />}
                    >
                      {selectedItem ? 'Update' : 'Create'} {activeTab.slice(0, -1)}
                    </Button>
                  </HStack>
                </Flex>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="lg" fontWeight="bold">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                  </Text>
                  <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd}>
                    Add {activeTab.slice(0, -1)}
                  </Button>
                </HStack>
                {renderTable()}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {activeTab.slice(0, -1)}
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this {activeTab.slice(0, -1)}? 
              This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DataManagementModal;
