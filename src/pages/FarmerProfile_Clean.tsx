import { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmerAPI, farmAPI, batchAPI } from '../services/api';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Badge,
  Avatar,
  Divider,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Container,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMapPin,
  FiLayers,
  FiTrendingUp,
  FiEdit3,
  FiArrowRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';

// Types
interface FarmerData {
  farmerID: number;
  farmerName: string;
  phone: string;
  address: string;
  created_date: string;
  user: {
    userID: number;
    username: string;
    email: string;
    role: string;
    profile_image: string;
  };
}

interface FarmData {
  farmID: number;
  farmName: string;
  location: string;
  farmSize: string;
  created_date: string;
}

interface BatchData {
  batchID: number;
  batchNumber: string;
  quantity: number;
  farmID: number;
  created_date: string;
}

const FarmerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const [editForm, setEditForm] = useState({
    farmerName: '',
    phone: '',
    address: '',
    email: '',
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const farmerId = user?.userID || 0;

  // API Queries
  const { data: farmers, isLoading: farmersLoading, error: farmersError } = useQuery({
    queryKey: ['farmers'],
    queryFn: farmerAPI.getAllFarmers,
  });

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: farmAPI.getAllFarms,
  });

  const { data: batches, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchAPI.getAllBatches,
  });

  const isLoading = farmersLoading || farmsLoading || batchesLoading;

  // Find current farmer
  const currentFarmer = farmers?.find((farmer: FarmerData) => 
    farmer.user.userID === farmerId
  );

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: Partial<FarmerData>) => 
      farmerAPI.updateFarmer(farmerId, updatedData),
    onSuccess: () => {
      onEditModalClose();
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Form handlers
  useEffect(() => {
    if (currentFarmer) {
      setEditForm({
        farmerName: currentFarmer.farmerName || '',
        phone: currentFarmer.phone || '',
        address: currentFarmer.address || '',
        email: currentFarmer.user.email || '',
      });
    }
  }, [currentFarmer]);

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(editForm);
  };

  const getUserRole = (role: string) => {
    const roles = {
      ADMIN: 'Administrator',
      FARMER: 'Farmer',
      ACCOUNTANT: 'Accountant',
      EXPERT: 'Expert',
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      ADMIN: 'purple',
      FARMER: 'green',
      ACCOUNTANT: 'blue',
      EXPERT: 'orange',
    };
    return colors[role as keyof typeof colors] || 'gray';
  };

  // Get farmer's farms (assuming farmer can belong to multiple farms)
  const farmerFarms = farms?.filter((farm: FarmData) => 
    // This is a simplified check - you might need to adjust based on your membership model
    farm.farmID
  ) || [];

  // Get farmer's batches (filter by farms the farmer belongs to)
  const farmerBatches = batches?.filter((batch: BatchData) => 
    farmerFarms.some((farm: FarmData) => farm.farmID === batch.farmID)
  ) || [];

  const calculateProfileCompletion = () => {
    if (!currentFarmer) return { percentage: 0, completed: 0, total: 6, items: [] };
    
    const completionItems = [
      { label: 'Name', completed: !!currentFarmer.farmerName },
      { label: 'Phone', completed: !!currentFarmer.phone },
      { label: 'Address', completed: !!currentFarmer.address },
      { label: 'Email', completed: !!currentFarmer.user.email },
      { label: 'Farm Setup', completed: farmerFarms.length > 0 },
      { label: 'Active Batches', completed: farmerBatches.length > 0 },
    ];
    
    const completed = completionItems.filter(item => item.completed).length;
    const total = completionItems.length;
    
    return {
      percentage: (completed / total) * 100,
      completed,
      total,
      items: completionItems
    };
  };

  const completionData = calculateProfileCompletion();

  if (isLoading) {
    return (
      <FarmerLayout>
        <Center h="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="green.500" thickness="4px" />
            <Text>Loading profile...</Text>
          </VStack>
        </Center>
      </FarmerLayout>
    );
  }

  if (!currentFarmer) {
    return (
      <FarmerLayout>
        <Center h="400px">
          <Alert status="error" maxW="md" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Profile Not Found</AlertTitle>
              <AlertDescription>
                {farmersError ? 'Failed to load farmer data.' : 'Farmer profile not found. Please complete your registration.'}
              </AlertDescription>
            </Box>
          </Alert>
        </Center>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <Container maxW="7xl" py={6}>
        <VStack spacing={8} align="stretch">
          {/* Header Section with Gradient Background */}
          <Box
            bgGradient="linear(to-r, green.400, green.600)"
            borderRadius="xl"
            p={8}
            color="white"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="-50%"
              right="-10%"
              w="200px"
              h="200px"
              borderRadius="full"
              bg="whiteAlpha.100"
            />
            <Box
              position="absolute"
              bottom="-30%"
              left="-5%"
              w="150px"
              h="150px"
              borderRadius="full"
              bg="whiteAlpha.50"
            />
            
            <HStack justify="space-between" align="center" position="relative" zIndex={1}>
              <VStack align="start" spacing={2}>
                <Heading size="xl" fontWeight="bold">
                  Welcome back, {currentFarmer.farmerName}!
                </Heading>
                <Text fontSize="lg" opacity={0.9}>
                  Manage your farm operations and profile settings
                </Text>
              </VStack>
              <Button
                leftIcon={<Icon as={FiEdit3} />}
                bg="whiteAlpha.200"
                color="white"
                border="1px solid"
                borderColor="whiteAlpha.300"
                _hover={{
                  bg: "whiteAlpha.300",
                  transform: "translateY(-2px)",
                  boxShadow: "lg"
                }}
                onClick={onEditModalOpen}
                transition="all 0.2s"
              >
                Edit Profile
              </Button>
            </HStack>
          </Box>

          {/* Profile Completion Alert */}
          {completionData.percentage < 100 && (
            <Alert 
              status="warning" 
              borderRadius="xl"
              bg="orange.50"
              borderColor="orange.200"
              borderWidth="1px"
              p={6}
            >
              <AlertIcon />
              <Box flex="1">
                <AlertTitle mb={2} fontSize="lg" color="orange.800">
                  Complete Your Profile Setup
                </AlertTitle>
                <AlertDescription display="block" fontSize="md" color="orange.700" mb={3}>
                  You're {Math.round(completionData.percentage)}% done! Complete the remaining {completionData.total - completionData.completed} steps to unlock all features.
                </AlertDescription>
                <Button
                  colorScheme="orange"
                  size="sm"
                  leftIcon={<Icon as={FiArrowRight} />}
                  onClick={() => navigate('/farmer/onboarding')}
                  _hover={{
                    transform: "translateY(-1px)",
                    boxShadow: "md"
                  }}
                  transition="all 0.2s"
                >
                  Complete Setup
                </Button>
              </Box>
            </Alert>
          )}

          {/* Main Content Grid */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
            {/* Personal Information Card */}
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s"
            >
              <Box bgGradient="linear(to-r, green.500, green.600)" h="4px" />
              <CardBody p={6}>
                <VStack align="stretch" spacing={5}>
                  <HStack>
                    <Icon as={FiUser} color="green.500" boxSize={5} />
                    <Heading size="md" color="gray.700">Personal Information</Heading>
                  </HStack>
                  
                  <Flex direction="column" align="center" p={4} bg="gray.50" borderRadius="lg">
                    <Avatar
                      size="xl"
                      name={currentFarmer.farmerName}
                      src={currentFarmer.user.profile_image !== 'default.png' ? currentFarmer.user.profile_image : undefined}
                      bg="green.500"
                      mb={3}
                    />
                    <Text fontSize="xl" fontWeight="bold" color="gray.800" textAlign="center">
                      {currentFarmer.farmerName}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      {currentFarmer.user.email}
                    </Text>
                    <Badge 
                      colorScheme={getRoleColor(currentFarmer.user.role)}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                    >
                      {getUserRole(currentFarmer.user.role)}
                    </Badge>
                  </Flex>

                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="semibold" color="gray.600" fontSize="sm">Phone</Text>
                      <Text fontSize="sm" color="gray.800">{currentFarmer.phone || 'Not provided'}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="semibold" color="gray.600" fontSize="sm">Username</Text>
                      <Text fontSize="sm" color="gray.800">{currentFarmer.user.username}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" p={3} bg="gray.50" borderRadius="md">
                      <Text fontWeight="semibold" color="gray.600" fontSize="sm">Member Since</Text>
                      <Text fontSize="sm" color="gray.800">{new Date(currentFarmer.created_date).toLocaleDateString()}</Text>
                    </Flex>
                  </VStack>

                  {currentFarmer.address && (
                    <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
                      <Text fontWeight="semibold" color="blue.800" fontSize="sm" mb={1}>Address</Text>
                      <Text fontSize="sm" color="blue.700">{currentFarmer.address}</Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>

            {/* Profile Completion Card */}
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s"
            >
              <Box bgGradient="linear(to-r, blue.500, blue.600)" h="4px" />
              <CardBody p={6}>
                <VStack align="stretch" spacing={5}>
                  <HStack>
                    <Icon as={FiTrendingUp} color="blue.500" boxSize={5} />
                    <Heading size="md" color="gray.700">Profile Completion</Heading>
                  </HStack>
                  
                  <Box textAlign="center" p={4} bg="blue.50" borderRadius="lg">
                    <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                      {Math.round(completionData.percentage)}%
                    </Text>
                    <Text fontSize="sm" color="blue.500" mb={3}>
                      {completionData.completed} of {completionData.total} completed
                    </Text>
                    <Progress 
                      value={completionData.percentage} 
                      colorScheme="blue" 
                      borderRadius="full"
                      size="lg"
                      bg="blue.100"
                    />
                  </Box>
                  
                  <VStack align="stretch" spacing={2}>
                    <Text fontWeight="semibold" color="gray.700" fontSize="sm" mb={2}>
                      Complete your profile:
                    </Text>
                    {completionData.items.map((item, index) => (
                      <Flex key={index} justify="space-between" align="center" p={2} borderRadius="md" _hover={{ bg: "gray.50" }}>
                        <HStack>
                          <Text color={item.completed ? "green.500" : "gray.400"} fontSize="lg">
                            {item.completed ? "✓" : "○"}
                          </Text>
                          <Text 
                            fontSize="sm" 
                            color={item.completed ? "green.600" : "gray.600"}
                          >
                            {item.label}
                          </Text>
                        </HStack>
                        {!item.completed && (
                          <Button
                            size="xs"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => {
                              if (item.label === 'Farm Setup') navigate('/farmer/onboarding');
                              else if (item.label === 'Active Batches') navigate('/farmer/batches');
                              else onEditModalOpen();
                            }}
                            _hover={{
                              bg: "blue.100",
                              transform: "scale(1.05)"
                            }}
                          >
                            Add
                          </Button>
                        )}
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Farm Information Card */}
            <Card 
              bg={cardBg} 
              borderWidth="1px" 
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="lg"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s"
            >
              <Box bgGradient="linear(to-r, orange.500, orange.600)" h="4px" />
              <CardBody p={6}>
                <VStack align="stretch" spacing={5}>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={FiMapPin} color="orange.500" boxSize={5} />
                      <Heading size="md" color="gray.700">Farm Information</Heading>
                    </HStack>
                    {farmerFarms.length === 0 && (
                      <Button
                        size="sm"
                        colorScheme="orange"
                        variant="outline"
                        onClick={() => navigate('/farmer/onboarding')}
                        _hover={{
                          transform: "translateY(-1px)",
                          boxShadow: "md"
                        }}
                      >
                        Setup Farm
                      </Button>
                    )}
                  </HStack>

                  {farmerFarms.length > 0 ? (
                    <VStack align="stretch" spacing={4}>
                      {farmerFarms.map((farm: FarmData) => (
                        <Box 
                          key={farm.farmID} 
                          p={4} 
                          borderWidth="1px" 
                          borderRadius="lg" 
                          borderColor="orange.200"
                          bg="orange.50"
                          _hover={{
                            borderColor: "orange.300",
                            bg: "orange.100"
                          }}
                          transition="all 0.2s"
                        >
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between">
                              <Text fontWeight="bold" color="orange.800" fontSize="lg">
                                {farm.farmName}
                              </Text>
                              <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                                Active
                              </Badge>
                            </HStack>
                            <HStack spacing={4}>
                              <HStack>
                                <Text fontSize="sm" color="orange.600">📍</Text>
                                <Text fontSize="sm" color="orange.700">{farm.location}</Text>
                              </HStack>
                              <HStack>
                                <Text fontSize="sm" color="orange.600">📏</Text>
                                <Text fontSize="sm" color="orange.700">{farm.farmSize}</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                      
                      {/* Farm Stats */}
                      <SimpleGrid columns={2} spacing={3} mt={4}>
                        <Stat textAlign="center" p={3} bg="orange.50" borderRadius="md">
                          <StatLabel color="orange.600" fontSize="xs">Total Farms</StatLabel>
                          <StatNumber color="orange.800" fontSize="2xl">{farmerFarms.length}</StatNumber>
                        </Stat>
                        <Stat textAlign="center" p={3} bg="green.50" borderRadius="md">
                          <StatLabel color="green.600" fontSize="xs">Active Batches</StatLabel>
                          <StatNumber color="green.800" fontSize="2xl">{farmerBatches.length}</StatNumber>
                        </Stat>
                      </SimpleGrid>
                    </VStack>
                  ) : (
                    <Alert status="info" borderRadius="lg" bg="blue.50" borderColor="blue.200">
                      <AlertIcon color="blue.500" />
                      <Box>
                        <AlertTitle color="blue.800">No Farm Setup Yet</AlertTitle>
                        <AlertDescription color="blue.700">
                          Get started by setting up your first farm to begin managing your poultry operations.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Current Batches Section */}
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor}
            borderRadius="xl"
            overflow="hidden"
            boxShadow="lg"
          >
            <Box bgGradient="linear(to-r, purple.500, purple.600)" h="4px" />
            <CardBody p={6}>
              <VStack align="stretch" spacing={5}>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiLayers} color="purple.500" boxSize={5} />
                    <Heading size="md" color="gray.700">Current Batches</Heading>
                  </HStack>
                  {farmerBatches.length === 0 && farmerFarms.length > 0 && (
                    <Button
                      size="sm"
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => navigate('/farmer/batches')}
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow: "md"
                      }}
                    >
                      Create Batch
                    </Button>
                  )}
                </HStack>

                {farmerBatches.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {farmerBatches.slice(0, 4).map((batch: BatchData) => (
                      <Box 
                        key={batch.batchID} 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        borderColor="purple.200"
                        bg="purple.50"
                        _hover={{
                          borderColor: "purple.300",
                          bg: "purple.100",
                          transform: "translateY(-2px)",
                          boxShadow: "md"
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        onClick={() => navigate('/farmer/batches')}
                      >
                        <VStack align="stretch" spacing={2}>
                          <HStack justify="space-between">
                            <Text fontWeight="bold" color="purple.800">
                              Batch #{batch.batchNumber}
                            </Text>
                            <Badge colorScheme="purple" fontSize="xs">
                              Active
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="purple.600">
                            🐔 {batch.quantity} birds
                          </Text>
                          <Text fontSize="xs" color="purple.500">
                            Started: {new Date(batch.created_date).toLocaleDateString()}
                          </Text>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Alert status="info" borderRadius="lg" bg="purple.50" borderColor="purple.200">
                    <AlertIcon color="purple.500" />
                    <Box>
                      <AlertTitle color="purple.800">No Active Batches</AlertTitle>
                      <AlertDescription color="purple.700">
                        {farmerFarms.length === 0 
                          ? "Set up your farm first, then you can create batches to start your poultry operations."
                          : "Create your first batch to begin tracking your poultry production."
                        }
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Button
              h="80px"
              flexDirection="column"
              colorScheme="green"
              variant="outline"
              onClick={() => navigate('/farmer/batches')}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
              transition="all 0.2s"
            >
              <Icon as={FiLayers} mb={2} boxSize={5} />
              <Text fontSize="sm">View Batches</Text>
            </Button>

            <Button
              h="80px"
              flexDirection="column"
              colorScheme="blue"
              variant="outline"
              onClick={() => navigate('/farmer/tasks')}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
              transition="all 0.2s"
            >
              <Icon as={FiTrendingUp} mb={2} boxSize={5} />
              <Text fontSize="sm">Daily Tasks</Text>
            </Button>

            <Button
              h="80px"
              flexDirection="column"
              colorScheme="orange"
              variant="outline"
              onClick={() => navigate('/farmer/onboarding')}
              isDisabled={completionData.percentage === 100}
              _hover={{
                transform: completionData.percentage < 100 ? "translateY(-2px)" : "none",
                boxShadow: completionData.percentage < 100 ? "lg" : "none"
              }}
              transition="all 0.2s"
            >
              <Icon as={FiUser} mb={2} boxSize={5} />
              <Text fontSize="sm">
                {completionData.percentage === 100 ? "Setup Complete" : "Complete Setup"}
              </Text>
            </Button>

            <Button
              h="80px"
              flexDirection="column"
              colorScheme="purple"
              variant="outline"
              onClick={onEditModalOpen}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
              transition="all 0.2s"
            >
              <Icon as={FiEdit3} mb={2} boxSize={5} />
              <Text fontSize="sm">Edit Profile</Text>
            </Button>
          </SimpleGrid>

          {/* Edit Profile Modal */}
          <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="md">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Edit Profile</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleEditFormSubmit}>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        name="farmerName"
                        value={editForm.farmerName}
                        onChange={handleEditFormChange}
                        placeholder="Enter your full name"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="phone"
                        value={editForm.phone}
                        onChange={handleEditFormChange}
                        placeholder="Enter your phone number"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Address</FormLabel>
                      <Input
                        name="address"
                        value={editForm.address}
                        onChange={handleEditFormChange}
                        placeholder="Enter your address"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleEditFormChange}
                        placeholder="Enter your email"
                      />
                    </FormControl>
                  </VStack>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onEditModalClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="green"
                  onClick={handleEditFormSubmit}
                  isLoading={updateProfileMutation.isPending}
                >
                  Update Profile
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </FarmerLayout>
  );
};

export default FarmerProfile;
