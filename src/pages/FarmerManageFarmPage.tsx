import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Stack,
  Alert,
  AlertIcon,
  Spinner,
  HStack,
  VStack,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Icon,
  Text,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react';
import { 
  FiArrowLeft, 
  FiEdit3, 
  FiSave, 
  FiUsers, 
  FiSettings, 
  FiTrash2, 
  FiAlertTriangle 
} from 'react-icons/fi';
import { farmAPI } from '../services/api';
import FarmerLayout from '../layouts/FarmerLayout';

const FarmerManageFarmPage: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  // Colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  // Fetch farm details
  const { data: farm, isLoading: farmLoading, isError: farmError, error: farmErrorData } = useQuery(
    ['farmDetails', farmId], 
    () => farmAPI.retrieve(parseInt(farmId!, 10)), 
    { enabled: !!farmId }
  );

  // Form state
  const [form, setForm] = useState({
    farmName: '',
    location: '',
    farmSize: '',
    description: ''
  });

  const [isDirty, setIsDirty] = useState(false);

  // Initialize form when farm data loads
  useEffect(() => {
    if (farm) {
      const newForm = {
        farmName: farm.farmName || '',
        location: farm.location || '',
        farmSize: farm.farmSize || '',
        description: farm.description || ''
      };
      setForm(newForm);
      setIsDirty(false);
    }
  }, [farm]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  // Update farm mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => farmAPI.update(parseInt(farmId!, 10), data),
    onSuccess: () => {
      toast({
        title: 'Farm Updated',
        description: 'Farm details have been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['farmDetails', farmId]);
      queryClient.invalidateQueries(['farms']);
      setIsDirty(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update farm details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Delete farm mutation
  const deleteMutation = useMutation({
    mutationFn: () => farmAPI.delete(parseInt(farmId!, 10)),
    onSuccess: () => {
      toast({
        title: 'Farm Deleted',
        description: 'Farm has been permanently deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['farms']);
      navigate('/farmer/farms');
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.response?.data?.message || 'Failed to delete farm.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  // Handle farm deletion
  const handleDelete = () => {
    deleteMutation.mutate();
    onDeleteClose();
  };

  // Permission checks
  const canManage = () => {
    return farm?.myRole === 'OWNER' || farm?.myRole === 'MANAGER';
  };

  const canDelete = () => {
    return farm?.myRole === 'OWNER';
  };

  // Early returns for loading/error states
  if (farmLoading) {
    return (
      <FarmerLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Loading farm details...</Text>
          </VStack>
        </Box>
      </FarmerLayout>
    );
  }

  if (farmError) {
    return (
      <FarmerLayout>
        <Box px={{ base: 4, md: 8 }} py={6}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Error Loading Farm</Text>
              <Text fontSize="sm">
                {farmErrorData instanceof Error 
                  ? farmErrorData.message 
                  : 'Failed to load farm details. Please try again.'}
              </Text>
            </Box>
          </Alert>
          <Button 
            mt={4} 
            leftIcon={<FiArrowLeft />} 
            onClick={() => navigate('/farmer/farms')}
          >
            Back to My Farms
          </Button>
        </Box>
      </FarmerLayout>
    );
  }

  if (!farm) {
    return (
      <FarmerLayout>
        <Box px={{ base: 4, md: 8 }} py={6}>
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            <Text>Farm not found.</Text>
          </Alert>
          <Button 
            mt={4} 
            leftIcon={<FiArrowLeft />} 
            onClick={() => navigate('/farmer/farms')}
          >
            Back to My Farms
          </Button>
        </Box>
      </FarmerLayout>
    );
  }

  if (!canManage()) {
    return (
      <FarmerLayout>
        <Box px={{ base: 4, md: 8 }} py={6}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Access Denied</Text>
              <Text fontSize="sm">You don't have permission to manage this farm.</Text>
            </Box>
          </Alert>
          <Button 
            mt={4} 
            leftIcon={<FiArrowLeft />} 
            onClick={() => navigate(`/farmer/farms/${farmId}`)}
          >
            Back to Farm Details
          </Button>
        </Box>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <Box px={{ base: 4, md: 8 }} py={6} bg={bgColor} minH="100vh">
        {/* Breadcrumb Navigation */}
        <Breadcrumb mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/farmer/farms')}>
              My Farms
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/farmer/farms/${farmId}`)}>
              {farm.farmName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Manage</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <HStack justify="space-between" align="start" mb={8} flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={2}>
            <HStack>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<FiArrowLeft />}
                onClick={() => navigate(`/farmer/farms/${farmId}`)}
              >
                Back to Details
              </Button>
              <Heading size="lg" color="gray.700">
                Manage {farm.farmName}
              </Heading>
            </HStack>
            <Badge 
              colorScheme={farm.myRole?.toUpperCase() === 'OWNER' ? 'purple' : 'blue'} 
              variant="subtle"
              px={3}
              py={1}
              borderRadius="full"
            >
              {farm.myRole} Access
            </Badge>
          </VStack>
        </HStack>

        <Tabs>
          <TabList>
            <Tab>Basic Information</Tab>
            <Tab>Team Management</Tab>
            <Tab>Advanced Settings</Tab>
          </TabList>

          <TabPanels>
            {/* Basic Information Tab */}
            <TabPanel px={0}>
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                <Card bg={cardBg}>
                  <CardHeader>
                    <HStack>
                      <Icon as={FiEdit3} color="blue.500" />
                      <Heading size="md">Farm Information</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleSubmit}>
                      <Stack spacing={6}>
                        <FormControl isRequired>
                          <FormLabel>Farm Name</FormLabel>
                          <Input 
                            name="farmName" 
                            value={form.farmName} 
                            onChange={handleChange} 
                            placeholder="Enter farm name"
                            focusBorderColor="blue.500"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Location</FormLabel>
                          <Input 
                            name="location" 
                            value={form.location} 
                            onChange={handleChange} 
                            placeholder="Enter farm location"
                            focusBorderColor="blue.500"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Farm Size</FormLabel>
                          <Input 
                            name="farmSize" 
                            value={form.farmSize} 
                            onChange={handleChange} 
                            placeholder="e.g., 2 acres, 5000 sq ft"
                            focusBorderColor="blue.500"
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <Textarea 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange} 
                            placeholder="Optional farm description"
                            focusBorderColor="blue.500"
                            rows={3}
                          />
                        </FormControl>

                        <HStack justify="flex-end" spacing={3}>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/farmer/farms/${farmId}`)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            colorScheme="blue" 
                            leftIcon={<FiSave />}
                            isLoading={updateMutation.isLoading}
                            isDisabled={!isDirty}
                          >
                            Save Changes
                          </Button>
                        </HStack>
                      </Stack>
                    </form>
                  </CardBody>
                </Card>

                {/* Farm Stats */}
                <VStack spacing={6}>
                  <Card bg={cardBg} w="full">
                    <CardHeader>
                      <Heading size="sm">Farm Statistics</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4}>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm">Total Devices:</Text>
                          <Badge colorScheme="blue">{farm.total_devices || 0}</Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm">Active Batches:</Text>
                          <Badge colorScheme="green">{farm.active_batches || 0}</Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm">Total Birds:</Text>
                          <Badge colorScheme="purple">{farm.total_birds || 0}</Badge>
                        </HStack>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="sm">Team Members:</Text>
                          <Badge colorScheme="orange">{farm.memberships?.length || 0}</Badge>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  {isDirty && (
                    <Alert status="warning" borderRadius="lg">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold">Unsaved Changes</Text>
                        <Text fontSize="sm">You have unsaved changes. Click "Save Changes" to apply them.</Text>
                      </Box>
                    </Alert>
                  )}
                </VStack>
              </Grid>
            </TabPanel>

            {/* Team Management Tab */}
            <TabPanel px={0}>
              <Card bg={cardBg}>
                <CardHeader>
                  <HStack>
                    <Icon as={FiUsers} color="orange.500" />
                    <Heading size="md">Team Members</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  {farm.memberships && farm.memberships.length > 0 ? (
                    <VStack spacing={4} align="stretch">
                      {farm.memberships.map((membership: any, index: number) => (
                        <Box key={index} p={4} borderWidth={1} borderRadius="md" borderColor="gray.200">
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold">{membership.farmer?.farmerName || 'Unknown'}</Text>
                              <Text fontSize="sm" color="gray.600">{membership.farmer?.email || 'No email'}</Text>
                              <Text fontSize="xs" color="gray.500">
                                Joined: {new Date(membership.joined_at).toLocaleDateString()}
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={2}>
                              <Badge 
                                colorScheme={
                                  membership.role === 'OWNER' ? 'purple' : 
                                  membership.role === 'MANAGER' ? 'blue' : 'teal'
                                } 
                                variant="solid"
                              >
                                {membership.role}
                              </Badge>
                              {canDelete() && membership.role !== 'OWNER' && (
                                <Button size="xs" colorScheme="red" variant="outline">
                                  Remove
                                </Button>
                              )}
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                      
                      {canManage() && (
                        <Button 
                          leftIcon={<FiUsers />} 
                          variant="outline" 
                          colorScheme="blue"
                          mt={4}
                        >
                          Invite Team Member
                        </Button>
                      )}
                    </VStack>
                  ) : (
                    <VStack spacing={4} py={8} textAlign="center">
                      <Icon as={FiUsers} w={12} h={12} color="gray.300" />
                      <Text color="gray.500">No team members</Text>
                      <Button leftIcon={<FiUsers />} colorScheme="blue" size="sm">
                        Invite Team Member
                      </Button>
                    </VStack>
                  )}
                </CardBody>
              </Card>
            </TabPanel>

            {/* Advanced Settings Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Card bg={cardBg}>
                  <CardHeader>
                    <HStack>
                      <Icon as={FiSettings} color="gray.500" />
                      <Heading size="md">Farm Settings</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Box p={4} borderWidth={1} borderRadius="md" borderColor="gray.200">
                        <Text fontWeight="bold" mb={2}>Data Export</Text>
                        <Text fontSize="sm" color="gray.600" mb={3}>
                          Export farm data for backup or analysis
                        </Text>
                        <Button size="sm" variant="outline">Export Data</Button>
                      </Box>

                      <Box p={4} borderWidth={1} borderRadius="md" borderColor="gray.200">
                        <Text fontWeight="bold" mb={2}>Notifications</Text>
                        <Text fontSize="sm" color="gray.600" mb={3}>
                          Configure alert and notification preferences
                        </Text>
                        <Button size="sm" variant="outline">Configure Alerts</Button>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Danger Zone */}
                {canDelete() && (
                  <Card bg={cardBg} borderColor="red.200" borderWidth={2}>
                    <CardHeader>
                      <HStack>
                        <Icon as={FiAlertTriangle} color="red.500" />
                        <Heading size="md" color="red.600">Danger Zone</Heading>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <Text fontWeight="bold" color="red.600" mb={2}>Delete Farm</Text>
                          <Text fontSize="sm" color="gray.600" mb={4}>
                            Permanently delete this farm and all associated data. This action cannot be undone.
                          </Text>
                          <Button 
                            colorScheme="red" 
                            variant="outline"
                            leftIcon={<FiTrash2 />}
                            onClick={onDeleteOpen}
                          >
                            Delete Farm
                          </Button>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Farm</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="start">
                <Text>
                  Are you sure you want to delete <strong>{farm.farmName}</strong>? 
                  This will permanently remove:
                </Text>
                <VStack align="start" spacing={1} pl={4}>
                  <Text fontSize="sm">• All farm data and settings</Text>
                  <Text fontSize="sm">• All associated batches and activities</Text>
                  <Text fontSize="sm">• All device configurations</Text>
                  <Text fontSize="sm">• All team member access</Text>
                </VStack>
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">This action cannot be undone!</Text>
                </Alert>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete}
                isLoading={deleteMutation.isLoading}
              >
                Delete Forever
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </FarmerLayout>
  );
};

export default FarmerManageFarmPage;
