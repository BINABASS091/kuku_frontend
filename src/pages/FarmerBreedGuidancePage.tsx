import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Icon,
  Badge,
  Progress,
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { 
  FiTarget, 
  FiThermometer, 
  FiDroplet,
  FiActivity,
  FiTrendingUp,
  FiClock,
  FiAward,
  FiBookOpen,
  FiBarChart,
  FiHeart,
  FiShield,
  FiUsers,
  FiCalendar
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar } from 'recharts';
import FarmerLayout from '../layouts/FarmerLayout';
import SafeChartContainer from '../components/common/SafeChartContainer';

const FarmerBreedGuidancePage: React.FC = () => {
  const { t } = useTranslation();
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [selectedBreed, setSelectedBreed] = useState<'broiler' | 'layer' | 'dual'>('broiler');
  const toast = useToast();

  // Modal disclosures
  const { isOpen: isTargetsModalOpen, onOpen: onTargetsModalOpen, onClose: onTargetsModalClose } = useDisclosure();
  const { isOpen: isVaccinationModalOpen, onOpen: onVaccinationModalOpen, onClose: onVaccinationModalClose } = useDisclosure();
  const { isOpen: isHealthCheckModalOpen, onOpen: onHealthCheckModalOpen, onClose: onHealthCheckModalClose } = useDisclosure();
  const { isOpen: isRemindersModalOpen, onOpen: onRemindersModalOpen, onClose: onRemindersModalClose } = useDisclosure();
  const { isOpen: isProgressModalOpen, onOpen: onProgressModalOpen, onClose: onProgressModalClose } = useDisclosure();
  const { isOpen: isComparisonModalOpen, onOpen: onComparisonModalOpen, onClose: onComparisonModalClose } = useDisclosure();

  // Form states
  const [targetForm, setTargetForm] = useState({
    targetWeight: '',
    targetWeeks: '',
    feedConversionTarget: '',
    mortalityTarget: ''
  });

  const [vaccinationForm, setVaccinationForm] = useState({
    vaccineName: '',
    scheduleDate: '',
    batchId: '',
    notes: ''
  });

  const [healthCheckForm, setHealthCheckForm] = useState({
    checkType: '',
    observations: '',
    recommendations: ''
  });

  const [reminderForm, setReminderForm] = useState({
    reminderType: '',
    reminderDate: '',
    notes: ''
  });

  const [progressForm, setProgressForm] = useState({
    trackingPeriod: 'lastMonth',
    batchId: ''
  });

  const [comparisonForm, setComparisonForm] = useState({
    breed1: 'broiler',
    breed2: 'layer'
  });

  // Mock data for progress tracking
  const progressData = {
    lastWeek: {
      weightProgress: [
        { day: 'Mon', actual: 1.2, target: 1.1 },
        { day: 'Tue', actual: 1.22, target: 1.12 },
        { day: 'Wed', actual: 1.25, target: 1.14 },
        { day: 'Thu', actual: 1.27, target: 1.16 },
        { day: 'Fri', actual: 1.3, target: 1.18 },
        { day: 'Sat', actual: 1.32, target: 1.2 },
        { day: 'Sun', actual: 1.35, target: 1.22 }
      ],
      feedConversion: [
        { day: 'Mon', rate: 2.1 },
        { day: 'Tue', rate: 2.0 },
        { day: 'Wed', rate: 2.2 },
        { day: 'Thu', rate: 2.1 },
        { day: 'Fri', rate: 2.0 },
        { day: 'Sat', rate: 1.9 },
        { day: 'Sun', rate: 1.8 }
      ],
      mortality: [
        { day: 'Mon', rate: 0.5 },
        { day: 'Tue', rate: 0.3 },
        { day: 'Wed', rate: 0.4 },
        { day: 'Thu', rate: 0.2 },
        { day: 'Fri', rate: 0.1 },
        { day: 'Sat', rate: 0.2 },
        { day: 'Sun', rate: 0.1 }
      ],
      eggProduction: [
        { day: 'Mon', rate: 85 },
        { day: 'Tue', rate: 87 },
        { day: 'Wed', rate: 89 },
        { day: 'Thu', rate: 86 },
        { day: 'Fri', rate: 88 },
        { day: 'Sat', rate: 90 },
        { day: 'Sun', rate: 92 }
      ],
      metrics: {
        currentWeight: 1.35,
        targetWeight: 1.22,
        weightVariance: '+10.7%',
        avgDailyGain: 0.02,
        feedEfficiency: 1.8,
        mortalityThisWeek: 0.24,
        eggsPerHen: 6.3,
        productionRate: 88
      }
    }
  };

  // Mock data for breed comparison
  const breedData = {
    broiler: {
      name: 'Broiler Chicken',
      maturityWeeks: 6,
      avgWeight: 2.5,
      eggProductionYear: 0,
      feedRequirement: 0.15,
      mortalityRate: 5,
      profitabilityIndex: 8.5,
      hardiness: 'medium',
      diseaseResistance: 'medium',
      economics: {
        initialCost: 3.5,
        feedCostPerYear: 54,
        revenuePerYear: 12,
        netProfitPerYear: 8.5,
        roi: 85,
        paybackPeriod: 3
      }
    },
    layer: {
      name: 'Layer Chicken',
      maturityWeeks: 18,
      avgWeight: 1.8,
      eggProductionYear: 280,
      feedRequirement: 0.12,
      mortalityRate: 3,
      profitabilityIndex: 9.2,
      hardiness: 'high',
      diseaseResistance: 'high',
      economics: {
        initialCost: 4.0,
        feedCostPerYear: 44,
        revenuePerYear: 25,
        netProfitPerYear: 21,
        roi: 120,
        paybackPeriod: 4
      }
    },
    dual: {
      name: 'Dual Purpose',
      maturityWeeks: 12,
      avgWeight: 2.2,
      eggProductionYear: 180,
      feedRequirement: 0.13,
      mortalityRate: 4,
      profitabilityIndex: 7.8,
      hardiness: 'high',
      diseaseResistance: 'high',
      economics: {
        initialCost: 3.8,
        feedCostPerYear: 47,
        revenuePerYear: 18,
        netProfitPerYear: 14.2,
        roi: 95,
        paybackPeriod: 5
      }
    }
  };

  // Handler functions
  const handleSetTargets = () => {
    onTargetsModalOpen();
  };

  const handleViewAnalytics = () => {
    toast({
      title: t('redirectingToAnalytics'),
      description: t('takingYouToAnalyticsPage'),
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    // In a real app, this would navigate to analytics page
  };

  const handleTrackProgress = () => {
    onProgressModalOpen();
  };

  const handleCompareBreeds = () => {
    onComparisonModalOpen();
  };

  const handleScheduleVaccination = () => {
    onVaccinationModalOpen();
  };

  const handleHealthCheck = () => {
    onHealthCheckModalOpen();
  };

  const handleSetReminders = () => {
    onRemindersModalOpen();
  };

  const handleLogHealthData = () => {
    toast({
      title: t('healthDataLogging'),
      description: t('healthDataLoggingFeature'),
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleSaveTargets = () => {
    toast({
      title: t('targetsSaved'),
      description: t('performanceTargetsUpdated'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onTargetsModalClose();
    setTargetForm({ targetWeight: '', targetWeeks: '', feedConversionTarget: '', mortalityTarget: '' });
  };

  const handleSaveVaccination = () => {
    toast({
      title: t('vaccinationScheduled'),
      description: t('vaccinationScheduledSuccessfully'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onVaccinationModalClose();
    setVaccinationForm({ vaccineName: '', scheduleDate: '', batchId: '', notes: '' });
  };

  const handleSaveHealthCheck = () => {
    toast({
      title: t('healthCheckLogged'),
      description: t('healthCheckDataSaved'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onHealthCheckModalClose();
    setHealthCheckForm({ checkType: '', observations: '', recommendations: '' });
  };

  const handleSaveReminder = () => {
    toast({
      title: t('reminderSet'),
      description: t('reminderSetSuccessfully'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onRemindersModalClose();
    setReminderForm({ reminderType: '', reminderDate: '', notes: '' });
  };

  // Mock data for breed configurations
  const breedConfigurations = {
    broiler: {
      name: 'Broiler Chicken',
      type: 'Meat Production',
      purpose: 'MEAT',
      image: '/images/broiler.jpg',
      description: 'Fast-growing meat birds optimized for commercial production',
      lifecycle: {
        brooding: { weeks: '0-6', description: 'Critical early development phase' },
        growing: { weeks: '7-16', description: 'Rapid weight gain period' },
        finishing: { weeks: '6-8', description: 'Final growth before processing' }
      },
      performance: {
        slaughterWeight: 2500, // grams
        slaughterWeek: 8,
        feedConversion: 1.8,
        survivalRate: 95
      },
      environmental: {
        tempMin: 18,
        tempMax: 25,
        humidityMin: 50,
        humidityMax: 70
      }
    },
    layer: {
      name: 'Layer Chicken',
      type: 'Egg Production',
      purpose: 'EGGS',
      image: '/images/layer.jpg',
      description: 'High-performance egg laying breeds for sustained production',
      lifecycle: {
        brooding: { weeks: '0-6', description: 'Foundation for future laying' },
        growing: { weeks: '7-16', description: 'Sexual maturity development' },
        laying: { weeks: '17+', description: 'Peak egg production period' }
      },
      performance: {
        layingRate: 85, // percentage
        layingStart: 17,
        eggWeight: 60, // grams
        layingPeriod: 52 // weeks
      },
      environmental: {
        tempMin: 16,
        tempMax: 24,
        humidityMin: 55,
        humidityMax: 65
      }
    },
    dual: {
      name: 'Dual Purpose',
      type: 'Dual Purpose',
      purpose: 'DUAL',
      image: '/images/dual.jpg',
      description: 'Versatile breeds suitable for both meat and egg production',
      lifecycle: {
        brooding: { weeks: '0-6', description: 'Balanced early development' },
        growing: { weeks: '7-16', description: 'Moderate growth phase' },
        laying: { weeks: '18+', description: 'Moderate egg production' }
      },
      performance: {
        layingRate: 70,
        layingStart: 18,
        slaughterWeight: 2000,
        slaughterWeek: 12
      },
      environmental: {
        tempMin: 17,
        tempMax: 26,
        humidityMin: 45,
        humidityMax: 75
      }
    }
  };

  // Mock growth data
  const growthData = [
    { week: 1, weight: 45, feed: 25, temperature: 32 },
    { week: 2, weight: 120, feed: 35, temperature: 30 },
    { week: 3, weight: 250, feed: 50, temperature: 28 },
    { week: 4, weight: 450, feed: 75, temperature: 26 },
    { week: 5, weight: 750, feed: 105, temperature: 24 },
    { week: 6, weight: 1200, feed: 140, temperature: 22 },
    { week: 7, weight: 1700, feed: 180, temperature: 21 },
    { week: 8, weight: 2300, feed: 220, temperature: 20 }
  ];

  // Mock vaccination schedule
  const vaccinationSchedule = [
    { day: 1, vaccine: 'Marek\'s Disease', type: 'Injection', status: 'completed' },
    { day: 7, vaccine: 'Newcastle + IB', type: 'Drinking water', status: 'completed' },
    { day: 14, vaccine: 'Gumboro', type: 'Drinking water', status: 'pending' },
    { day: 21, vaccine: 'Newcastle + IB', type: 'Spray', status: 'pending' },
    { day: 35, vaccine: 'Newcastle', type: 'Injection', status: 'scheduled' }
  ];

  // Mock feeding schedule
  const feedingSchedule = [
    { stage: 'Starter', weeks: '0-3', protein: '22-24%', energy: '3000 kcal/kg', form: 'Crumbles' },
    { stage: 'Grower', weeks: '4-6', protein: '19-21%', energy: '3100 kcal/kg', form: 'Pellets' },
    { stage: 'Finisher', weeks: '7-8', protein: '16-18%', energy: '3200 kcal/kg', form: 'Pellets' }
  ];

  const currentBreed = breedConfigurations[selectedBreed];

  return (
    <FarmerLayout>
      <VStack spacing={6} align="stretch">
        {/* Page Header */}
        <Box>
          <Heading size="lg" mb={2}>
            {t('breedGuidanceCenter')} 📚
          </Heading>
          <Text color={textColor}>
            {t('comprehensiveBreedManagement')}
          </Text>
        </Box>

        {/* Breed Selection */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4} align="center">
              <Text fontWeight="medium" color={textColor}>{t('breedSelectBreed')}:</Text>
              <Select 
                value={selectedBreed} 
                onChange={(e) => setSelectedBreed(e.target.value as 'broiler' | 'layer' | 'dual')}
                maxW="300px"
                bg={cardBg}
              >
                <option value="broiler">{t('broilerChicken')}</option>
                <option value="layer">{t('layerChicken')}</option>
                <option value="dual">{t('dualPurpose')}</option>
              </Select>
              <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                {currentBreed.type}
              </Badge>
            </HStack>
          </CardBody>
        </Card>

        {/* Breed Guidance Tabs */}
        <Tabs colorScheme="green" variant="enclosed-colored">
          <TabList>
            <Tab>
              <HStack>
                <Icon as={FiBookOpen} />
                <Text>{t('overview')}</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiTarget} />
                <Text>{t('lifecycle')}</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiBarChart} />
                <Text>{t('performance')}</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiShield} />
                <Text>{t('healthCare')}</Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Breed Information Card */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardBody>
                    <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
                      <Box flex="0 0 auto">
                        <Image
                          src={currentBreed.image}
                          alt={currentBreed.name}
                          w="200px"
                          h="150px"
                          objectFit="cover"
                          borderRadius="md"
                          fallback={
                            <Box
                              w="200px"
                              h="150px"
                              bg="gray.100"
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon as={FiUsers} size="48px" color="gray.400" />
                            </Box>
                          }
                        />
                      </Box>
                      <VStack align="stretch" flex="1" spacing={4}>
                        <Box>
                          <Heading size="md" mb={2}>{currentBreed.name}</Heading>
                          <Text color={textColor}>{currentBreed.description}</Text>
                        </Box>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color={textColor} mb={1}>{t('purpose')}</Text>
                            <Badge colorScheme="blue" size="lg">{currentBreed.type}</Badge>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color={textColor} mb={1}>{t('category')}</Text>
                            <Badge colorScheme="purple" size="lg">{currentBreed.purpose}</Badge>
                          </Box>
                        </SimpleGrid>
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>

                {/* Key Performance Indicators */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  {currentBreed.purpose === 'MEAT' ? (
                    <>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('breedTargetWeight')}</StatLabel>
                            <StatNumber color="green.500">{(currentBreed.performance as any).slaughterWeight}g</StatNumber>
                            <StatHelpText>{t('atWeeks', { weeks: (currentBreed.performance as any).slaughterWeek })}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('feedConversion')}</StatLabel>
                            <StatNumber color="blue.500">{(currentBreed.performance as any).feedConversion}</StatNumber>
                            <StatHelpText>{t('fcrRatio')}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('survivalRate')}</StatLabel>
                            <StatNumber color="purple.500">{(currentBreed.performance as any).survivalRate}%</StatNumber>
                            <StatHelpText>{t('expected')}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('marketReady')}</StatLabel>
                            <StatNumber color="orange.500">{(currentBreed.performance as any).slaughterWeek}</StatNumber>
                            <StatHelpText>{t('breedWeeks')}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('layingRate')}</StatLabel>
                            <StatNumber color="green.500">{(currentBreed.performance as any).layingRate}%</StatNumber>
                            <StatHelpText>{t('peakProduction')}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('firstEgg')}</StatLabel>
                            <StatNumber color="blue.500">{(currentBreed.performance as any).layingStart}</StatNumber>
                            <StatHelpText>{t('weeksOld')}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('eggWeight')}</StatLabel>
                            <StatNumber color="purple.500">{(currentBreed.performance as any).eggWeight || 60}g</StatNumber>
                            <StatHelpText>{t('average')}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>{t('layingPeriod')}</StatLabel>
                            <StatNumber color="orange.500">{(currentBreed.performance as any).layingPeriod || 52}</StatNumber>
                            <StatHelpText>{t('breedWeeks')}</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </SimpleGrid>

                {/* Environmental Requirements */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">{t('environmentalRequirements')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Icon as={FiThermometer} color="red.500" />
                          <Text fontWeight="bold" color={textColor}>{t('temperatureRange')}</Text>
                        </HStack>
                        <Box>
                          <Text fontSize="sm" color={textColor} mb={2}>
                            {currentBreed.environmental.tempMin}°C - {currentBreed.environmental.tempMax}°C
                          </Text>
                          <Progress
                            value={((currentBreed.environmental.tempMax - currentBreed.environmental.tempMin) / 20) * 100}
                            colorScheme="red"
                            size="lg"
                            borderRadius="md"
                          />
                        </Box>
                      </VStack>

                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Icon as={FiDroplet} color="blue.500" />
                          <Text fontWeight="bold" color={textColor}>{t('humidityRange')}</Text>
                        </HStack>
                        <Box>
                          <Text fontSize="sm" color={textColor} mb={2}>
                            {currentBreed.environmental.humidityMin}% - {currentBreed.environmental.humidityMax}%
                          </Text>
                          <Progress
                            value={((currentBreed.environmental.humidityMax - currentBreed.environmental.humidityMin) / 50) * 100}
                            colorScheme="blue"
                            size="lg"
                            borderRadius="md"
                          />
                        </Box>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Lifecycle Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Lifecycle Stages */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  {Object.entries(currentBreed.lifecycle).map(([stage, info], index) => (
                    <Card key={stage} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <HStack>
                          <Badge colorScheme="green" variant="solid" borderRadius="full" px={3}>
                            {index + 1}
                          </Badge>
                          <Heading size="sm" textTransform="capitalize">{stage}</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <HStack>
                            <Icon as={FiClock} color="gray.500" />
                            <Text fontSize="sm" fontWeight="bold">{(info as any).weeks} weeks</Text>
                          </HStack>
                          <Text fontSize="sm" color={textColor}>{(info as any).description}</Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>

                {/* Growth Chart */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">{t('expectedGrowthCurve')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="400px">
                      <SafeChartContainer minHeight={400}>
                        <AreaChart data={growthData} width={400} height={400}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" label={{ value: t('breedWeek'), position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: t('breedWeightG'), angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#48BB78" 
                            fill="#48BB78" 
                            fillOpacity={0.6} 
                            name={t('breedWeightG')} 
                          />
                        </AreaChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Feeding Schedule */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">{t('feedingSchedule')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>{t('stage')}</Th>
                            <Th>{t('breedAgeWeeks')}</Th>
                            <Th>{t('protein')}</Th>
                            <Th>{t('energy')}</Th>
                            <Th>{t('form')}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {feedingSchedule.map((phase, index) => (
                            <Tr key={index}>
                              <Td fontWeight="bold">{phase.stage}</Td>
                              <Td>{phase.weeks}</Td>
                              <Td>{phase.protein}</Td>
                              <Td>{phase.energy}</Td>
                              <Td>{phase.form}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Performance Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Performance Metrics */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Weight vs Feed Consumption</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <LineChart data={growthData} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="weight" stroke="#48BB78" strokeWidth={3} name="Weight (g)" />
                            <Line type="monotone" dataKey="feed" stroke="#38B2AC" strokeWidth={3} name="Feed (g/day)" />
                          </LineChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Temperature Requirements</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <BarChart data={growthData} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="temperature" fill="#ED8936" name="Temperature (°C)" />
                          </BarChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Performance Targets */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Performance Benchmarks</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Icon as={FiTarget} color="green.500" />
                          <Text fontWeight="bold" color={textColor}>Weight Targets</Text>
                        </HStack>
                        <Box>
                          <Text fontSize="sm" color={textColor}>Week 4: 450g</Text>
                          <Text fontSize="sm" color={textColor}>Week 6: 1200g</Text>
                          <Text fontSize="sm" color={textColor}>Week 8: 2300g</Text>
                        </Box>
                      </VStack>

                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Icon as={FiTrendingUp} color="blue.500" />
                          <Text fontWeight="bold" color={textColor}>Feed Efficiency</Text>
                        </HStack>
                        <Box>
                          <Text fontSize="sm" color={textColor}>FCR Target: 1.8</Text>
                          <Text fontSize="sm" color={textColor}>Daily Gain: 42g</Text>
                          <Text fontSize="sm" color={textColor}>Feed Intake: 220g/day</Text>
                        </Box>
                      </VStack>

                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Icon as={FiHeart} color="red.500" />
                          <Text fontWeight="bold" color={textColor}>Health Metrics</Text>
                        </HStack>
                        <Box>
                          <Text fontSize="sm" color={textColor}>Mortality: &lt;5%</Text>
                          <Text fontSize="sm" color={textColor}>Culling: &lt;2%</Text>
                          <Text fontSize="sm" color={textColor}>Uniformity: &gt;85%</Text>
                        </Box>
                      </VStack>

                      <VStack align="stretch" spacing={3}>
                        <HStack>
                          <Icon as={FiAward} color="purple.500" />
                          <Text fontWeight="bold" color={textColor}>Quality Standards</Text>
                        </HStack>
                        <Box>
                          <Text fontSize="sm" color={textColor}>Breast Yield: 22%</Text>
                          <Text fontSize="sm" color={textColor}>Leg Yield: 30%</Text>
                          <Text fontSize="sm" color={textColor}>Grade A: &gt;90%</Text>
                        </Box>
                      </VStack>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Performance Actions */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Performance Management</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Button 
                        leftIcon={<FiTarget />} 
                        colorScheme="green" 
                        variant="outline"
                        onClick={handleSetTargets}
                      >
                        {t('breedSetTargets')}
                      </Button>
                      <Button 
                        leftIcon={<FiBarChart />} 
                        colorScheme="blue" 
                        variant="outline"
                        onClick={handleViewAnalytics}
                      >
                        {t('breedViewAnalytics')}
                      </Button>
                      <Button 
                        leftIcon={<FiActivity />} 
                        colorScheme="purple" 
                        variant="outline"
                        onClick={handleTrackProgress}
                      >
                        {t('breedTrackProgress')}
                      </Button>
                      <Button 
                        leftIcon={<FiAward />} 
                        colorScheme="orange" 
                        variant="outline"
                        onClick={handleCompareBreeds}
                      >
                        {t('breedCompareBreeds')}
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* Health & Care Tab */}
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                {/* Health Alerts */}
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Vaccination Due!</AlertTitle>
                    <AlertDescription>
                      Gumboro vaccination is scheduled for day 14. Ensure proper preparation and administration.
                    </AlertDescription>
                  </Box>
                </Alert>

                {/* Vaccination Schedule */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Vaccination Schedule</Heading>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Day</Th>
                            <Th>Vaccine</Th>
                            <Th>Method</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {vaccinationSchedule.map((vaccine, index) => (
                            <Tr key={index}>
                              <Td fontWeight="bold">Day {vaccine.day}</Td>
                              <Td>{vaccine.vaccine}</Td>
                              <Td>{vaccine.type}</Td>
                              <Td>
                                <Badge 
                                  colorScheme={
                                    vaccine.status === 'completed' ? 'green' : 
                                    vaccine.status === 'pending' ? 'orange' : 'blue'
                                  }
                                >
                                  {vaccine.status}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>

                {/* Health Monitoring Guidelines */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Daily Health Checks</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Text color={textColor}>General Activity</Text>
                          <Badge colorScheme="green">Normal</Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Feed Consumption</Text>
                          <Badge colorScheme="green">Good</Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Water Intake</Text>
                          <Badge colorScheme="green">Normal</Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Respiratory Health</Text>
                          <Badge colorScheme="yellow">Monitor</Badge>
                        </HStack>
                        <HStack justify="space-between">
                          <Text color={textColor}>Mortality Rate</Text>
                          <Badge colorScheme="green">0.8%</Badge>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                    <CardHeader>
                      <Heading size="md">Common Health Issues</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Box>
                          <Text fontWeight="bold" fontSize="sm" color="red.500">Respiratory Issues</Text>
                          <Text fontSize="sm" color={textColor}>Watch for coughing, sneezing, nasal discharge</Text>
                        </Box>
                        <Divider />
                        <Box>
                          <Text fontWeight="bold" fontSize="sm" color="orange.500">Digestive Problems</Text>
                          <Text fontSize="sm" color={textColor}>Monitor for diarrhea, poor feed conversion</Text>
                        </Box>
                        <Divider />
                        <Box>
                          <Text fontWeight="bold" fontSize="sm" color="yellow.500">Leg Problems</Text>
                          <Text fontSize="sm" color={textColor}>Check for lameness, especially in fast-growing birds</Text>
                        </Box>
                        <Divider />
                        <Box>
                          <Text fontWeight="bold" fontSize="sm" color="purple.500">Heat Stress</Text>
                          <Text fontSize="sm" color={textColor}>Monitor during high temperatures, ensure ventilation</Text>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Care Actions */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Health Management Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Button 
                        leftIcon={<FiShield />} 
                        colorScheme="green" 
                        variant="outline"
                        onClick={handleScheduleVaccination}
                      >
                        {t('breedScheduleVaccination')}
                      </Button>
                      <Button 
                        leftIcon={<FiHeart />} 
                        colorScheme="red" 
                        variant="outline"
                        onClick={handleHealthCheck}
                      >
                        {t('breedHealthCheck')}
                      </Button>
                      <Button 
                        leftIcon={<FiCalendar />} 
                        colorScheme="blue" 
                        variant="outline"
                        onClick={handleSetReminders}
                      >
                        {t('breedSetReminders')}
                      </Button>
                      <Button 
                        leftIcon={<FiActivity />} 
                        colorScheme="purple" 
                        variant="outline"
                        onClick={handleLogHealthData}
                      >
                        {t('breedLogHealthData')}
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Set Targets Modal */}
        <Modal isOpen={isTargetsModalOpen} onClose={onTargetsModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('breedSetTargets')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>{t('targetWeight')} (g)</FormLabel>
                  <NumberInput 
                    value={targetForm.targetWeight}
                    onChange={(value) => setTargetForm({...targetForm, targetWeight: value})}
                  >
                    <NumberInputField placeholder="2500" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('targetWeeks')}</FormLabel>
                  <NumberInput 
                    value={targetForm.targetWeeks}
                    onChange={(value) => setTargetForm({...targetForm, targetWeeks: value})}
                  >
                    <NumberInputField placeholder="8" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('feedConversionTarget')}</FormLabel>
                  <NumberInput 
                    step={0.1}
                    value={targetForm.feedConversionTarget}
                    onChange={(value) => setTargetForm({...targetForm, feedConversionTarget: value})}
                  >
                    <NumberInputField placeholder="1.8" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('mortalityTarget')} (%)</FormLabel>
                  <NumberInput 
                    step={0.1}
                    value={targetForm.mortalityTarget}
                    onChange={(value) => setTargetForm({...targetForm, mortalityTarget: value})}
                  >
                    <NumberInputField placeholder="5.0" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onTargetsModalClose}>
                {t('cancel')}
              </Button>
              <Button colorScheme="green" onClick={handleSaveTargets}>
                {t('saveTargets')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Schedule Vaccination Modal */}
        <Modal isOpen={isVaccinationModalOpen} onClose={onVaccinationModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('breedScheduleVaccination')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>{t('vaccineName')}</FormLabel>
                  <Select 
                    placeholder={t('selectVaccine')}
                    value={vaccinationForm.vaccineName}
                    onChange={(e) => setVaccinationForm({...vaccinationForm, vaccineName: e.target.value})}
                  >
                    <option value="newcastle">Newcastle Disease</option>
                    <option value="gumboro">Gumboro</option>
                    <option value="mareks">Marek's Disease</option>
                    <option value="ib">Infectious Bronchitis</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('scheduleDate')}</FormLabel>
                  <Input 
                    type="date"
                    value={vaccinationForm.scheduleDate}
                    onChange={(e) => setVaccinationForm({...vaccinationForm, scheduleDate: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('batchId')}</FormLabel>
                  <Select 
                    placeholder={t('selectBatch')}
                    value={vaccinationForm.batchId}
                    onChange={(e) => setVaccinationForm({...vaccinationForm, batchId: e.target.value})}
                  >
                    <option value="B001">Batch B001</option>
                    <option value="B002">Batch B002</option>
                    <option value="B003">Batch B003</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('notes')}</FormLabel>
                  <Textarea 
                    placeholder={t('addNotes')}
                    value={vaccinationForm.notes}
                    onChange={(e) => setVaccinationForm({...vaccinationForm, notes: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onVaccinationModalClose}>
                {t('cancel')}
              </Button>
              <Button colorScheme="green" onClick={handleSaveVaccination}>
                {t('scheduleVaccination')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Health Check Modal */}
        <Modal isOpen={isHealthCheckModalOpen} onClose={onHealthCheckModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('breedHealthCheck')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>{t('checkType')}</FormLabel>
                  <Select 
                    placeholder={t('selectCheckType')}
                    value={healthCheckForm.checkType}
                    onChange={(e) => setHealthCheckForm({...healthCheckForm, checkType: e.target.value})}
                  >
                    <option value="routine">Routine Check</option>
                    <option value="illness">Illness Assessment</option>
                    <option value="mortality">Mortality Investigation</option>
                    <option value="performance">Performance Review</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('observations')}</FormLabel>
                  <Textarea 
                    placeholder={t('recordObservations')}
                    value={healthCheckForm.observations}
                    onChange={(e) => setHealthCheckForm({...healthCheckForm, observations: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('recommendations')}</FormLabel>
                  <Textarea 
                    placeholder={t('addRecommendations')}
                    value={healthCheckForm.recommendations}
                    onChange={(e) => setHealthCheckForm({...healthCheckForm, recommendations: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onHealthCheckModalClose}>
                {t('cancel')}
              </Button>
              <Button colorScheme="red" onClick={handleSaveHealthCheck}>
                {t('saveHealthCheck')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Set Reminders Modal */}
        <Modal isOpen={isRemindersModalOpen} onClose={onRemindersModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('breedSetReminders')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>{t('reminderType')}</FormLabel>
                  <Select 
                    placeholder={t('selectReminderType')}
                    value={reminderForm.reminderType}
                    onChange={(e) => setReminderForm({...reminderForm, reminderType: e.target.value})}
                  >
                    <option value="vaccination">Vaccination Reminder</option>
                    <option value="feeding">Feeding Schedule</option>
                    <option value="weighing">Weight Check</option>
                    <option value="cleaning">Cleaning Schedule</option>
                    <option value="medication">Medication</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>{t('reminderDate')}</FormLabel>
                  <Input 
                    type="datetime-local"
                    value={reminderForm.reminderDate}
                    onChange={(e) => setReminderForm({...reminderForm, reminderDate: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>{t('notes')}</FormLabel>
                  <Textarea 
                    placeholder={t('addReminderNotes')}
                    value={reminderForm.notes}
                    onChange={(e) => setReminderForm({...reminderForm, notes: e.target.value})}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onRemindersModalClose}>
                {t('cancel')}
              </Button>
              <Button colorScheme="blue" onClick={handleSaveReminder}>
                {t('setReminder')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Progress Tracking Modal */}
        <Modal isOpen={isProgressModalOpen} onClose={onProgressModalClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('progressTrackingModal')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                {/* Period Selection */}
                <FormControl>
                  <FormLabel>{t('selectTrackingPeriod')}</FormLabel>
                  <Select 
                    value={progressForm.trackingPeriod}
                    onChange={(e) => setProgressForm({...progressForm, trackingPeriod: e.target.value})}
                  >
                    <option value="lastWeek">{t('progressLastWeek')}</option>
                    <option value="lastMonth">{t('progressLastMonth')}</option>
                    <option value="lastQuarter">{t('progressLastQuarter')}</option>
                  </Select>
                </FormControl>

                {/* Key Metrics Cards */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="100%">
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('currentWeight')}</StatLabel>
                        <StatNumber color="green.500">{progressData.lastWeek.metrics.currentWeight} kg</StatNumber>
                        <StatHelpText>{t('progressTargetWeight')}: {progressData.lastWeek.metrics.targetWeight} kg</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('weightVariance')}</StatLabel>
                        <StatNumber color="blue.500">{progressData.lastWeek.metrics.weightVariance}</StatNumber>
                        <StatHelpText>{t('aboveTarget')}</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('progressFeedEfficiency')}</StatLabel>
                        <StatNumber color="orange.500">{progressData.lastWeek.metrics.feedEfficiency}</StatNumber>
                        <StatHelpText>{t('progressExcellent')}</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardBody>
                      <Stat>
                        <StatLabel>{t('productionRate')}</StatLabel>
                        <StatNumber color="purple.500">{progressData.lastWeek.metrics.productionRate}%</StatNumber>
                        <StatHelpText>{t('onTrack')}</StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Charts */}
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} w="100%">
                  {/* Weight Progress Chart */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">{t('weightGainProgress')}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <AreaChart data={progressData.lastWeek.weightProgress} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="target" stackId="1" stroke="#E2E8F0" fill="#E2E8F0" name={t('progressTargetWeight')} />
                            <Area type="monotone" dataKey="actual" stackId="2" stroke="#38B2AC" fill="#38B2AC" name={t('currentWeight')} />
                          </AreaChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  {/* Feed Conversion Chart */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">{t('feedConversionTrend')}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <LineChart data={progressData.lastWeek.feedConversion} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="rate" stroke="#ED8936" strokeWidth={3} name={t('progressFeedEfficiency')} />
                          </LineChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  {/* Mortality Trend Chart */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">{t('mortalityTrend')}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <BarChart data={progressData.lastWeek.mortality} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="rate" fill="#E53E3E" name={t('comparisonMortalityRate')} />
                          </BarChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>

                  {/* Egg Production Chart */}
                  <Card>
                    <CardHeader>
                      <Heading size="md">{t('eggProductionTrend')}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Box h="300px">
                        <SafeChartContainer minHeight={300}>
                          <LineChart data={progressData.lastWeek.eggProduction} width={400} height={300}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="rate" stroke="#48BB78" strokeWidth={3} name={t('productionRate')} />
                          </LineChart>
                        </SafeChartContainer>
                      </Box>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Progress Summary */}
                <Card w="100%">
                  <CardHeader>
                    <Heading size="md">{t('progressSummary')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text>{t('weightGainProgress')}</Text>
                        <Badge colorScheme="green" size="lg">{t('progressExcellent')}</Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>{t('progressFeedEfficiency')}</Text>
                        <Badge colorScheme="green" size="lg">{t('onTrack')}</Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>{t('mortalityTrend')}</Text>
                        <Badge colorScheme="yellow" size="lg">{t('improvementNeeded')}</Badge>
                      </HStack>
                      <HStack justify="space-between">
                        <Text>{t('eggProductionTrend')}</Text>
                        <Badge colorScheme="green" size="lg">{t('aboveTarget')}</Badge>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onProgressModalClose}>
                {t('close')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Breed Comparison Modal */}
        <Modal isOpen={isComparisonModalOpen} onClose={onComparisonModalClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{t('breedComparisonModal')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                {/* Breed Selection */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                  <FormControl>
                    <FormLabel>{t('breed1')}</FormLabel>
                    <Select 
                      value={comparisonForm.breed1}
                      onChange={(e) => setComparisonForm({...comparisonForm, breed1: e.target.value})}
                    >
                      <option value="broiler">Broiler Chicken</option>
                      <option value="layer">Layer Chicken</option>
                      <option value="dual">Dual Purpose</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>{t('breed2')}</FormLabel>
                    <Select 
                      value={comparisonForm.breed2}
                      onChange={(e) => setComparisonForm({...comparisonForm, breed2: e.target.value})}
                    >
                      <option value="broiler">Broiler Chicken</option>
                      <option value="layer">Layer Chicken</option>
                      <option value="dual">Dual Purpose</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                {/* Performance Comparison Table */}
                <Card w="100%">
                  <CardHeader>
                    <Heading size="md">{t('comparePerformance')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>{t('metric')}</Th>
                            <Th>{breedData[comparisonForm.breed1 as keyof typeof breedData].name}</Th>
                            <Th>{breedData[comparisonForm.breed2 as keyof typeof breedData].name}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>{t('maturityWeeks')}</Td>
                            <Td>{breedData[comparisonForm.breed1 as keyof typeof breedData].maturityWeeks}</Td>
                            <Td>{breedData[comparisonForm.breed2 as keyof typeof breedData].maturityWeeks}</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('comparisonAvgWeight')}</Td>
                            <Td>{breedData[comparisonForm.breed1 as keyof typeof breedData].avgWeight} kg</Td>
                            <Td>{breedData[comparisonForm.breed2 as keyof typeof breedData].avgWeight} kg</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('eggProductionYear')}</Td>
                            <Td>{breedData[comparisonForm.breed1 as keyof typeof breedData].eggProductionYear}</Td>
                            <Td>{breedData[comparisonForm.breed2 as keyof typeof breedData].eggProductionYear}</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('feedRequirement')}</Td>
                            <Td>{breedData[comparisonForm.breed1 as keyof typeof breedData].feedRequirement} kg/day</Td>
                            <Td>{breedData[comparisonForm.breed2 as keyof typeof breedData].feedRequirement} kg/day</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('comparisonMortalityRate')}</Td>
                            <Td>{breedData[comparisonForm.breed1 as keyof typeof breedData].mortalityRate}%</Td>
                            <Td>{breedData[comparisonForm.breed2 as keyof typeof breedData].mortalityRate}%</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('profitabilityIndex')}</Td>
                            <Td>{breedData[comparisonForm.breed1 as keyof typeof breedData].profitabilityIndex}/10</Td>
                            <Td>{breedData[comparisonForm.breed2 as keyof typeof breedData].profitabilityIndex}/10</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('hardiness')}</Td>
                            <Td>
                              <Badge 
                                colorScheme={breedData[comparisonForm.breed1 as keyof typeof breedData].hardiness === 'high' ? 'green' : 'yellow'}
                              >
                                {t(breedData[comparisonForm.breed1 as keyof typeof breedData].hardiness)}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge 
                                colorScheme={breedData[comparisonForm.breed2 as keyof typeof breedData].hardiness === 'high' ? 'green' : 'yellow'}
                              >
                                {t(breedData[comparisonForm.breed2 as keyof typeof breedData].hardiness)}
                              </Badge>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>{t('diseaseResistance')}</Td>
                            <Td>
                              <Badge 
                                colorScheme={breedData[comparisonForm.breed1 as keyof typeof breedData].diseaseResistance === 'high' ? 'green' : 'yellow'}
                              >
                                {t(breedData[comparisonForm.breed1 as keyof typeof breedData].diseaseResistance)}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge 
                                colorScheme={breedData[comparisonForm.breed2 as keyof typeof breedData].diseaseResistance === 'high' ? 'green' : 'yellow'}
                              >
                                {t(breedData[comparisonForm.breed2 as keyof typeof breedData].diseaseResistance)}
                              </Badge>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>

                {/* Economic Analysis */}
                <Card w="100%">
                  <CardHeader>
                    <Heading size="md">{t('economicAnalysis')}</Heading>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>{t('economicMetric')}</Th>
                            <Th>{breedData[comparisonForm.breed1 as keyof typeof breedData].name}</Th>
                            <Th>{breedData[comparisonForm.breed2 as keyof typeof breedData].name}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>{t('initialCost')}</Td>
                            <Td>${breedData[comparisonForm.breed1 as keyof typeof breedData].economics.initialCost}</Td>
                            <Td>${breedData[comparisonForm.breed2 as keyof typeof breedData].economics.initialCost}</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('feedCostPerYear')}</Td>
                            <Td>${breedData[comparisonForm.breed1 as keyof typeof breedData].economics.feedCostPerYear}</Td>
                            <Td>${breedData[comparisonForm.breed2 as keyof typeof breedData].economics.feedCostPerYear}</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('revenuePerYear')}</Td>
                            <Td>${breedData[comparisonForm.breed1 as keyof typeof breedData].economics.revenuePerYear}</Td>
                            <Td>${breedData[comparisonForm.breed2 as keyof typeof breedData].economics.revenuePerYear}</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('netProfitPerYear')}</Td>
                            <Td color="green.500">${breedData[comparisonForm.breed1 as keyof typeof breedData].economics.netProfitPerYear}</Td>
                            <Td color="green.500">${breedData[comparisonForm.breed2 as keyof typeof breedData].economics.netProfitPerYear}</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('comparisonROI')}</Td>
                            <Td color="blue.500">{breedData[comparisonForm.breed1 as keyof typeof breedData].economics.roi}%</Td>
                            <Td color="blue.500">{breedData[comparisonForm.breed2 as keyof typeof breedData].economics.roi}%</Td>
                          </Tr>
                          <Tr>
                            <Td>{t('paybackPeriod')}</Td>
                            <Td>{breedData[comparisonForm.breed1 as keyof typeof breedData].economics.paybackPeriod} months</Td>
                            <Td>{breedData[comparisonForm.breed2 as keyof typeof breedData].economics.paybackPeriod} months</Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>

                {/* Recommendation */}
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('recommendation')}</AlertTitle>
                    <AlertDescription>
                      {t('breedRecommendation')}{' '}
                      <strong>
                        {breedData[comparisonForm.breed1 as keyof typeof breedData].economics.roi > 
                         breedData[comparisonForm.breed2 as keyof typeof breedData].economics.roi 
                          ? breedData[comparisonForm.breed1 as keyof typeof breedData].name 
                          : breedData[comparisonForm.breed2 as keyof typeof breedData].name}
                      </strong>{' '}
                      {t('basedOnHigherROI')}
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onComparisonModalClose}>
                {t('close')}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerBreedGuidancePage;
