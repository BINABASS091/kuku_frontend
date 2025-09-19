import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
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
  SimpleGrid,
  useColorModeValue,
  Icon,
  Progress,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Container,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
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
  Wrap,
  WrapItem,
  Select,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMapPin,
  FiLayers,
  FiTrendingUp,
  FiEdit3,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import FarmerLayout from '../layouts/FarmerLayout';
import { farmerAPI, farmAPI, batchAPI } from '../services/api';

// Type definitions
interface FarmerData {
  farmerID: number;
  user: {
    userID: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  farmerName: string;
  phone: string;
  address: string;
  experience_level: string;
  profile_completed: boolean;
}

interface FarmData {
  farmID: number;
  farmName: string;
  location: string;
  size: number;
  established_date: string;
}

interface BatchData {
  batchID: number;
  batchName: string;
  farmID: number;
  breed: string;
  currentPopulation: number;
  status: string;
}

const FarmerProfile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Form state for editing profile
  const [editForm, setEditForm] = useState({
    farmerName: '',
    phone: '',
    address: '',
    experience_level: '',
  });

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const gradientBg = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.600, purple.700)'
  );

  // API Queries
  const { data: farmers, isLoading: farmersLoading, error: farmersError } = useQuery({
    queryKey: ['farmers'],
    queryFn: farmerAPI.list,
  });

  const { data: farms, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: farmAPI.list,
  });

  const { data: batches, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchAPI.list,
  });

  const isLoading = farmersLoading || farmsLoading || batchesLoading;

  // Extract arrays from paginated API responses
  const farmersArray = Array.isArray(farmers) ? farmers : (farmers?.results || []);
  const farmsArray = Array.isArray(farms) ? farms : (farms?.results || []);
  const batchesArray = Array.isArray(batches) ? batches : (batches?.results || []);

  // Find current farmer based on authenticated user
  const currentFarmer = farmersArray.find((farmer: FarmerData) => 
    farmer.user.userID === user?.id || farmer.user.email === user?.email
  );

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (updatedData: Partial<FarmerData>) => 
      farmerAPI.update(currentFarmer?.farmerID || 0, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmers'] });
      toast({
        title: t('profileUpdatedSuccessfully'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: t('failedToUpdateProfile'),
        description: t('pleaseTryAgainLater'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Get farmer's farms (adjust logic based on your membership model)
  const farmerFarms = farmsArray;

  // Get farmer's batches
  const farmerBatches = batchesArray.filter((batch: BatchData) => 
    farmerFarms.some((farm: FarmData) => farm.farmID === batch.farmID)
  );

  const calculateProfileCompletion = () => {
    if (!currentFarmer) return { percentage: 0, completed: 0, total: 6, items: [] };
    
    const completionItems = [
      { label: 'Name', completed: !!currentFarmer.farmerName },
      { label: 'Phone', completed: !!currentFarmer.phone },
      { label: 'Address', completed: !!currentFarmer.address },
      { label: 'Experience Level', completed: !!currentFarmer.experience_level },
      { label: 'Email', completed: !!currentFarmer.user.email },
      { label: 'Profile Picture', completed: false }, // Add avatar logic later
    ];

    const completed = completionItems.filter(item => item.completed).length;
    const total = completionItems.length;
    const percentage = Math.round((completed / total) * 100);

    return { percentage, completed, total, items: completionItems };
  };

  const handleEditProfile = () => {
    if (currentFarmer) {
      setEditForm({
        farmerName: currentFarmer.farmerName || '',
        phone: currentFarmer.phone || '',
        address: currentFarmer.address || '',
        experience_level: currentFarmer.experience_level || '',
      });
      onOpen();
    }
  };

  const handleSaveProfile = () => {
    if (currentFarmer) {
      updateProfileMutation.mutate(editForm);
    }
  };

  const getExperienceLabel = (level: string) => {
    const levels = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      experienced: 'Experienced',
      expert: 'Expert',
    };
    return levels[level as keyof typeof levels] || 'Not Set';
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

  if (isLoading) {
    return (
      <FarmerLayout>
        <Center h="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>{t('loadingYourProfile')}</Text>
          </VStack>
        </Center>
      </FarmerLayout>
    );
  }

  if (farmersError) {
    return (
      <FarmerLayout>
        <Container maxW="container.xl" py={8}>
          <Alert status="error">
            <AlertIcon />
            {t('failedToLoadProfileData')}
          </Alert>
        </Container>
      </FarmerLayout>
    );
  }

  if (!currentFarmer) {
    return (
      <FarmerLayout>
        <Container maxW="container.xl" py={8}>
          <Alert status="warning">
            <AlertIcon />
            {t('farmerProfileNotFound')}
          </Alert>
        </Container>
      </FarmerLayout>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <FarmerLayout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header Section with Gradient */}
          <Box
            bgGradient={gradientBg}
            borderRadius="xl"
            p={8}
            color="white"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              left={0}
              bgGradient="linear(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)"
            />
            <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={6}>
              <Avatar
                size="2xl"
                name={currentFarmer.farmerName || `${currentFarmer.user.first_name} ${currentFarmer.user.last_name}`}
                src=""
                border="4px solid"
                borderColor="white"
                shadow="xl"
                _hover={{ transform: 'scale(1.05)' }}
                transition="transform 0.2s"
              />
              <Box flex={1} ml={{ base: 0, md: 6 }} textAlign={{ base: 'center', md: 'left' }}>
                <Heading size="xl" mb={2}>
                  {currentFarmer.farmerName || `${currentFarmer.user.first_name} ${currentFarmer.user.last_name}`}
                </Heading>
                <Text fontSize="lg" opacity={0.9} mb={3}>
                  {currentFarmer.user.email}
                </Text>
                <Wrap>
                  <WrapItem>
                    <Badge
                      colorScheme={getExperienceColor(currentFarmer.experience_level)}
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {getExperienceLabel(currentFarmer.experience_level)}
                    </Badge>
                  </WrapItem>
                  <WrapItem>
                    <Badge
                      colorScheme={profileCompletion.percentage === 100 ? 'green' : 'yellow'}
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {profileCompletion.percentage}% Complete
                    </Badge>
                  </WrapItem>
                </Wrap>
              </Box>
              <Button
                leftIcon={<Icon as={FiEdit3} />}
                colorScheme="whiteAlpha"
                variant="solid"
                onClick={handleEditProfile}
                _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                transition="all 0.2s"
              >
                {t('editProfile')}
              </Button>
            </Flex>
          </Box>

          {/* Profile Completion Card */}
          <Card bg={cardBg} borderColor={borderColor} shadow="lg">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Heading size="md">{t('profileCompletion')}</Heading>
                  <Text fontWeight="bold" color="blue.500">
                    {profileCompletion.completed}/{profileCompletion.total} completed
                  </Text>
                </HStack>
                <Progress
                  value={profileCompletion.percentage}
                  colorScheme="blue"
                  size="lg"
                  borderRadius="full"
                />
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                  {profileCompletion.items.map((item, index) => (
                    <HStack key={index} spacing={2}>
                      <Icon
                        as={item.completed ? FiCheck : FiX}
                        color={item.completed ? 'green.500' : 'red.500'}
                      />
                      <Text fontSize="sm" opacity={item.completed ? 1 : 0.7}>
                        {item.label}
                      </Text>
                    </HStack>
                  ))}
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Stats Grid */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor} shadow="lg" _hover={{ transform: 'translateY(-4px)' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel color="blue.500" fontWeight="semibold">
                    <Icon as={FiLayers} mr={2} />
                    Total Farms
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="blue.600">
                    {farmerFarms.length}
                  </StatNumber>
                  <StatHelpText>Active farms under management</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} shadow="lg" _hover={{ transform: 'translateY(-4px)' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel color="green.500" fontWeight="semibold">
                    <Icon as={FiTrendingUp} mr={2} />
                    Total Batches
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="green.600">
                    {farmerBatches.length}
                  </StatNumber>
                  <StatHelpText>Active poultry batches</StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderColor={borderColor} shadow="lg" _hover={{ transform: 'translateY(-4px)' }} transition="all 0.2s">
              <CardBody>
                <Stat>
                  <StatLabel color="purple.500" fontWeight="semibold">
                    <Icon as={FiUser} mr={2} />
                    Total Birds
                  </StatLabel>
                  <StatNumber fontSize="3xl" color="purple.600">
                    {farmerBatches.reduce((total: number, batch: any) => total + (batch.currentPopulation || 0), 0)}
                  </StatNumber>
                  <StatHelpText>Total birds across all batches</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Contact Information */}
          <Card bg={cardBg} borderColor={borderColor} shadow="lg">
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md" mb={2}>{t('contactInformation')}</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <HStack spacing={3}>
                    <Icon as={FiMail} color="blue.500" />
                    <Box>
                      <Text fontWeight="semibold">Email</Text>
                      <Text opacity={0.8}>{currentFarmer.user.email}</Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiPhone} color="green.500" />
                    <Box>
                      <Text fontWeight="semibold">Phone</Text>
                      <Text opacity={0.8}>{currentFarmer.phone || 'Not provided'}</Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiMapPin} color="red.500" />
                    <Box>
                      <Text fontWeight="semibold">Address</Text>
                      <Text opacity={0.8}>{currentFarmer.address || 'Not provided'}</Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Icon as={FiCalendar} color="purple.500" />
                    <Box>
                      <Text fontWeight="semibold">Experience Level</Text>
                      <Text opacity={0.8}>{getExperienceLabel(currentFarmer.experience_level)}</Text>
                    </Box>
                  </HStack>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </VStack>

        {/* Edit Profile Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('editProfile')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    value={editForm.farmerName}
                    onChange={(e) => setEditForm({ ...editForm, farmerName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Experience Level</FormLabel>
                  <Select
                    value={editForm.experience_level}
                    onChange={(e) => setEditForm({ ...editForm, experience_level: e.target.value })}
                    placeholder="Select experience level"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="experienced">Experienced</option>
                    <option value="expert">Expert</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button 
                colorScheme="blue" 
                mr={3} 
                onClick={handleSaveProfile} 
                isLoading={updateProfileMutation.isPending}
              >
                Save Changes
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </FarmerLayout>
  );
};

export default FarmerProfile;
