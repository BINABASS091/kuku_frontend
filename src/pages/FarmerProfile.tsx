import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
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
  List,
  ListItem,
  ListIcon,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMapPin,
  FiLayers,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiTrendingUp,
  FiEdit3,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';

interface FarmerProfileData {
  id: number;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  phone: string;
  address: string;
  experience_level: string;
  profile_completed: boolean;
  farm: {
    id: number;
    name: string;
    location: string;
    size: string;
    farm_type: string;
    total_capacity: number;
    current_birds: number;
  } | null;
  batches: Array<{
    id: number;
    breed: string;
    current_count: number;
    start_date: string;
    status: string;
  }>;
}

const FarmerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [farmerData, setFarmerData] = useState<FarmerProfileData>({
    id: 1,
    user: {
      first_name: user?.first_name || 'John',
      last_name: user?.last_name || 'Doe',
      email: user?.email || 'john.doe@example.com',
    },
    phone: '+254 712 345 678',
    address: 'Kiambu County, Kenya',
    experience_level: 'intermediate',
    profile_completed: false,
    farm: null,
    batches: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Simulate API call
    const fetchFarmerData = async () => {
      try {
        // Here you would make an actual API call to get farmer profile
        // const response = await api.get('/api/farmer/profile/');
        // setFarmerData(response.data);
        
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching farmer data:', error);
        setIsLoading(false);
      }
    };

    fetchFarmerData();
  }, []);

  const getExperienceLabel = (level: string) => {
    const levels = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      experienced: 'Experienced',
      expert: 'Expert',
    };
    return levels[level as keyof typeof levels] || 'Unknown';
  };

  const getExperienceColor = (level: string) => {
    const colors = {
      beginner: 'blue',
      intermediate: 'green',
      experienced: 'orange',
      expert: 'purple',
    };
    return colors[level as keyof typeof colors] || 'gray';
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 6;
    
    if (farmerData.user.first_name) completed++;
    if (farmerData.phone) completed++;
    if (farmerData.address) completed++;
    if (farmerData.experience_level) completed++;
    if (farmerData.farm) completed++;
    if (farmerData.batches.length > 0) completed++;
    
    return (completed / total) * 100;
  };

  const profileCompletion = calculateProfileCompletion();

  if (isLoading) {
    return (
      <FarmerLayout>
        <Box display="flex" justifyContent="center" alignItems="center" h="400px">
          <Text>Loading profile...</Text>
        </Box>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading size="lg">My Profile</Heading>
            <Text color="gray.600">
              Manage your personal information and farm settings
            </Text>
          </VStack>
          <Button
            leftIcon={<Icon as={FiEdit3} />}
            colorScheme="green"
            variant="outline"
            onClick={() => navigate('/farmer/profile/edit')}
          >
            Edit Profile
          </Button>
        </HStack>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Box flex="1">
              <AlertTitle>Complete Your Profile</AlertTitle>
              <AlertDescription display="block">
                Your profile is {Math.round(profileCompletion)}% complete. 
                <Button
                  variant="link"
                  colorScheme="orange"
                  size="sm"
                  ml={2}
                  onClick={() => navigate('/farmer/onboarding')}
                >
                  Complete setup
                </Button>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Personal Information */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Icon as={FiUser} color="green.500" />
                  <Heading size="md">Personal Information</Heading>
                </HStack>
                
                <HStack>
                  <Avatar
                    size="lg"
                    name={`${farmerData.user.first_name} ${farmerData.user.last_name}`}
                    bg="green.500"
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="semibold">
                      {farmerData.user.first_name} {farmerData.user.last_name}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {farmerData.user.email}
                    </Text>
                    <Badge colorScheme={getExperienceColor(farmerData.experience_level)}>
                      {getExperienceLabel(farmerData.experience_level)}
                    </Badge>
                  </VStack>
                </HStack>

                <Divider />

                <VStack align="stretch" spacing={3}>
                  <HStack>
                    <Text fontWeight="semibold" w="100px">Phone:</Text>
                    <Text>{farmerData.phone}</Text>
                  </HStack>
                  <HStack align="start">
                    <Text fontWeight="semibold" w="100px">Address:</Text>
                    <Text>{farmerData.address}</Text>
                  </HStack>
                </VStack>

                {/* Profile Completion */}
                <Box>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="semibold">Profile Completion</Text>
                    <Text fontSize="sm" color="gray.600">
                      {Math.round(profileCompletion)}%
                    </Text>
                  </HStack>
                  <Progress 
                    value={profileCompletion} 
                    colorScheme="green" 
                    borderRadius="full"
                  />
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Farm Information */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={FiMapPin} color="green.500" />
                    <Heading size="md">Farm Information</Heading>
                  </HStack>
                  {!farmerData.farm && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      variant="outline"
                      onClick={() => navigate('/farmer/onboarding')}
                    >
                      Setup Farm
                    </Button>
                  )}
                </HStack>

                {farmerData.farm ? (
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Text fontWeight="semibold" w="100px">Name:</Text>
                      <Text>{farmerData.farm.name}</Text>
                    </HStack>
                    <HStack align="start">
                      <Text fontWeight="semibold" w="100px">Location:</Text>
                      <Text>{farmerData.farm.location}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="semibold" w="100px">Type:</Text>
                      <Badge colorScheme="blue">{farmerData.farm.farm_type}</Badge>
                    </HStack>
                    <HStack>
                      <Text fontWeight="semibold" w="100px">Size:</Text>
                      <Text>{farmerData.farm.size}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="semibold" w="100px">Capacity:</Text>
                      <Text>
                        {farmerData.farm.current_birds} / {farmerData.farm.total_capacity} birds
                      </Text>
                    </HStack>
                    <Progress 
                      value={(farmerData.farm.current_birds / farmerData.farm.total_capacity) * 100}
                      colorScheme="blue"
                      borderRadius="full"
                    />
                  </VStack>
                ) : (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>No Farm Setup</AlertTitle>
                      <AlertDescription>
                        You haven't set up your farm yet. Complete the onboarding to get started.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Current Batches */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <HStack>
                  <Icon as={FiLayers} color="green.500" />
                  <Heading size="md">Current Batches</Heading>
                </HStack>
                {farmerData.batches.length === 0 && farmerData.farm && (
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => navigate('/farmer/batches/create')}
                  >
                    Add Batch
                  </Button>
                )}
              </HStack>

              {farmerData.batches.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {farmerData.batches.map((batch) => (
                    <Card key={batch.id} borderWidth="1px" borderColor={borderColor}>
                      <CardBody>
                        <VStack align="stretch" spacing={2}>
                          <HStack justify="space-between">
                            <Text fontWeight="semibold">{batch.breed}</Text>
                            <Badge 
                              colorScheme={batch.status === 'active' ? 'green' : 'gray'}
                            >
                              {batch.status}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {batch.current_count} birds
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Started: {new Date(batch.start_date).toLocaleDateString()}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              ) : (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>No Active Batches</AlertTitle>
                    <AlertDescription>
                      {farmerData.farm 
                        ? "You don't have any active batches. Create your first batch to start managing your flock."
                        : "Set up your farm first before creating batches."
                      }
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Icon as={FiTrendingUp} color="green.500" />
                <Heading size="md">Quick Actions</Heading>
              </HStack>

              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <Button
                  variant="outline"
                  h="60px"
                  onClick={() => navigate('/farmer/onboarding')}
                  isDisabled={profileCompletion === 100}
                >
                  Complete Setup
                </Button>
                <Button
                  variant="outline"
                  h="60px"
                  onClick={() => navigate('/farmer/batches')}
                >
                  Manage Batches
                </Button>
                <Button
                  variant="outline"
                  h="60px"
                  onClick={() => navigate('/farmer/health')}
                >
                  Health Records
                </Button>
                <Button
                  variant="outline"
                  h="60px"
                  onClick={() => navigate('/farmer/reports')}
                >
                  View Reports
                </Button>
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerProfile;

// Farmer.objects.create(user=user, farmerName='Farmer One', ...)
