import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Badge,
  Icon,
  useColorModeValue,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMapPin,
  FiLayers,
  FiSettings,
  FiCheckCircle,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../../layouts/FarmerLayout';

interface FarmerProfile {
  // Personal Info
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  experience: string;
  
  // Farm Info
  farmName: string;
  farmLocation: string;
  farmSize: string;
  farmType: string;
  
  // Initial Batch Info
  initialBatchSize: number;
  breedType: string;
  expectedStartDate: string;
  
  // Preferences
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const steps = [
  {
    title: 'Personal Information',
    description: 'Basic details about you',
    icon: FiUser,
  },
  {
    title: 'Farm Setup',
    description: 'Your farm details',
    icon: FiMapPin,
  },
  {
    title: 'Initial Batch',
    description: 'Your first batch details',
    icon: FiLayers,
  },
  {
    title: 'Preferences',
    description: 'Notification settings',
    icon: FiSettings,
  },
];

const FarmerOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState<FarmerProfile>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    phone: '',
    address: '',
    experience: '',
    farmName: '',
    farmLocation: '',
    farmSize: '',
    farmType: '',
    initialBatchSize: 0,
    breedType: '',
    expectedStartDate: '',
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
  });

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof FarmerProfile],
        [field]: value,
      },
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return profile.firstName && profile.lastName && profile.phone && profile.address;
      case 1:
        return profile.farmName && profile.farmLocation && profile.farmSize && profile.farmType;
      case 2:
        return profile.initialBatchSize > 0 && profile.breedType && profile.expectedStartDate;
      case 3:
        return true; // Preferences are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill in all required fields before proceeding.',
        status: 'warning',
        duration: 3000,
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Here you would make API calls to:
      // 1. Update user profile
      // 2. Create farmer profile
      // 3. Create farm
      // 4. Create initial batch (optional)
      // 5. Set notification preferences
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Welcome to Smart Kuku!',
        description: 'Your account has been set up successfully.',
        status: 'success',
        duration: 5000,
      });
      
      // Redirect to farmer dashboard
      navigate('/farmer');
    } catch (error) {
      toast({
        title: 'Setup Failed',
        description: 'There was an error setting up your account. Please try again.',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <VStack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  value={profile.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={profile.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </FormControl>
            </SimpleGrid>
            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                type="tel"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Address</FormLabel>
              <Textarea
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your complete address"
                rows={3}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Farming Experience</FormLabel>
              <Select
                value={profile.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Select your experience level"
              >
                <option value="beginner">Beginner (Less than 1 year)</option>
                <option value="intermediate">Intermediate (1-3 years)</option>
                <option value="experienced">Experienced (3-5 years)</option>
                <option value="expert">Expert (5+ years)</option>
              </Select>
            </FormControl>
          </VStack>
        );

      case 1:
        return (
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Farm Name</FormLabel>
              <Input
                value={profile.farmName}
                onChange={(e) => handleInputChange('farmName', e.target.value)}
                placeholder="Enter your farm name"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Farm Location</FormLabel>
              <Input
                value={profile.farmLocation}
                onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                placeholder="Enter farm location/address"
              />
            </FormControl>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel>Farm Size</FormLabel>
                <Select
                  value={profile.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                  placeholder="Select farm size"
                >
                  <option value="small">Small (Up to 500 birds)</option>
                  <option value="medium">Medium (500-2000 birds)</option>
                  <option value="large">Large (2000-5000 birds)</option>
                  <option value="commercial">Commercial (5000+ birds)</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Farm Type</FormLabel>
                <Select
                  value={profile.farmType}
                  onChange={(e) => handleInputChange('farmType', e.target.value)}
                  placeholder="Select farm type"
                >
                  <option value="layers">Layers (Egg Production)</option>
                  <option value="broilers">Broilers (Meat Production)</option>
                  <option value="mixed">Mixed (Both)</option>
                  <option value="breeding">Breeding Farm</option>
                </Select>
              </FormControl>
            </SimpleGrid>
            
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Farm Setup Tips</AlertTitle>
                <AlertDescription>
                  Choose your farm type carefully as it will determine the breed recommendations 
                  and management practices suggested by our system.
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        );

      case 2:
        return (
          <VStack spacing={4}>
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Optional Step</AlertTitle>
                <AlertDescription>
                  You can skip this step and add batches later from your dashboard.
                </AlertDescription>
              </Box>
            </Alert>
            
            <FormControl>
              <FormLabel>Initial Batch Size</FormLabel>
              <NumberInput
                value={profile.initialBatchSize}
                onChange={(_, value) => handleInputChange('initialBatchSize', value || 0)}
                min={0}
                max={10000}
              >
                <NumberInputField placeholder="Enter number of birds" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <FormControl>
              <FormLabel>Breed Type</FormLabel>
              <Select
                value={profile.breedType}
                onChange={(e) => handleInputChange('breedType', e.target.value)}
                placeholder="Select breed type"
              >
                <option value="rhode-island-red">Rhode Island Red</option>
                <option value="leghorn">White Leghorn</option>
                <option value="plymouth-rock">Plymouth Rock</option>
                <option value="sussex">Sussex</option>
                <option value="new-hampshire">New Hampshire</option>
                <option value="australorp">Black Australorp</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Expected Start Date</FormLabel>
              <Input
                type="date"
                value={profile.expectedStartDate}
                onChange={(e) => handleInputChange('expectedStartDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormControl>
          </VStack>
        );

      case 3:
        return (
          <VStack spacing={4}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Configure how you'd like to receive notifications about your farm
            </Text>
            
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} w="full">
              <CardBody>
                <VStack spacing={4}>
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb="0">Email Notifications</FormLabel>
                    <input
                      type="checkbox"
                      checked={profile.notifications.email}
                      onChange={(e) => handleNestedInputChange('notifications', 'email', e.target.checked)}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb="0">SMS Notifications</FormLabel>
                    <input
                      type="checkbox"
                      checked={profile.notifications.sms}
                      onChange={(e) => handleNestedInputChange('notifications', 'sms', e.target.checked)}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center" justifyContent="space-between">
                    <FormLabel mb="0">Push Notifications</FormLabel>
                    <input
                      type="checkbox"
                      checked={profile.notifications.push}
                      onChange={(e) => handleNestedInputChange('notifications', 'push', e.target.checked)}
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
            
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Stay Updated</AlertTitle>
                <AlertDescription>
                  Notifications help you stay on top of important farm activities, 
                  health alerts, and daily tasks.
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <FarmerLayout>
      <Box maxW="4xl" mx="auto">
        <VStack spacing={8}>
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Heading size="lg">Welcome to Smart Kuku! 🐔</Heading>
            <Text color="gray.600">
              Let's set up your farm profile to get you started
            </Text>
          </VStack>

          {/* Progress */}
          <Box w="full">
            <Progress
              value={(currentStep + 1) / steps.length * 100}
              colorScheme="green"
              borderRadius="full"
              h="8px"
            />
            <HStack justify="space-between" mt={2}>
              <Text fontSize="sm" color="gray.500">
                Step {currentStep + 1} of {steps.length}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {Math.round((currentStep + 1) / steps.length * 100)}% Complete
              </Text>
            </HStack>
          </Box>

          {/* Stepper */}
          <Stepper index={currentStep} w="full">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box display={{ base: 'none', md: 'block' }}>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>

          {/* Form Content */}
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} w="full">
            <CardHeader>
              <HStack>
                <Icon as={steps[currentStep].icon} color="green.500" />
                <VStack align="start" spacing={0}>
                  <Heading size="md">{steps[currentStep].title}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    {steps[currentStep].description}
                  </Text>
                </VStack>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              {renderStepContent()}
            </CardBody>
          </Card>

          {/* Navigation */}
          <HStack spacing={4} w="full" justify="space-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              isDisabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <HStack>
              <Button
                variant="ghost"
                onClick={() => navigate('/farmer')}
              >
                Skip Setup
              </Button>
              <Button
                colorScheme="green"
                onClick={handleNext}
                isLoading={isLoading}
                loadingText={currentStep === steps.length - 1 ? "Setting up..." : "Next"}
              >
                {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </FarmerLayout>
  );
};

export default FarmerOnboarding;
