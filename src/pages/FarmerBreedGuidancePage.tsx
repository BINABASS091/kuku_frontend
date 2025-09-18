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
} from '@chakra-ui/react';
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
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const [selectedBreed, setSelectedBreed] = useState<'broiler' | 'layer' | 'dual'>('broiler');

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
            Breed Guidance Center 📚
          </Heading>
          <Text color={textColor}>
            Comprehensive breed management guidance and performance optimization
          </Text>
        </Box>

        {/* Breed Selection */}
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4} align="center">
              <Text fontWeight="medium" color={textColor}>Select Breed:</Text>
              <Select 
                value={selectedBreed} 
                onChange={(e) => setSelectedBreed(e.target.value as 'broiler' | 'layer' | 'dual')}
                maxW="300px"
                bg={cardBg}
              >
                <option value="broiler">Broiler Chicken</option>
                <option value="layer">Layer Chicken</option>
                <option value="dual">Dual Purpose</option>
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
                <Text>Overview</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiTarget} />
                <Text>Lifecycle</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiBarChart} />
                <Text>Performance</Text>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <Icon as={FiShield} />
                <Text>Health & Care</Text>
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
                            <Text fontSize="sm" color={textColor} mb={1}>Purpose</Text>
                            <Badge colorScheme="blue" size="lg">{currentBreed.type}</Badge>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color={textColor} mb={1}>Category</Text>
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
                            <StatLabel color={textColor}>Target Weight</StatLabel>
                            <StatNumber color="green.500">{(currentBreed.performance as any).slaughterWeight}g</StatNumber>
                            <StatHelpText>At {(currentBreed.performance as any).slaughterWeek} weeks</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>Feed Conversion</StatLabel>
                            <StatNumber color="blue.500">{(currentBreed.performance as any).feedConversion}</StatNumber>
                            <StatHelpText>FCR Ratio</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>Survival Rate</StatLabel>
                            <StatNumber color="purple.500">{(currentBreed.performance as any).survivalRate}%</StatNumber>
                            <StatHelpText>Expected</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>Market Ready</StatLabel>
                            <StatNumber color="orange.500">{(currentBreed.performance as any).slaughterWeek}</StatNumber>
                            <StatHelpText>Weeks</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>Laying Rate</StatLabel>
                            <StatNumber color="green.500">{(currentBreed.performance as any).layingRate}%</StatNumber>
                            <StatHelpText>Peak production</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>First Egg</StatLabel>
                            <StatNumber color="blue.500">{(currentBreed.performance as any).layingStart}</StatNumber>
                            <StatHelpText>Weeks old</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>Egg Weight</StatLabel>
                            <StatNumber color="purple.500">{(currentBreed.performance as any).eggWeight || 60}g</StatNumber>
                            <StatHelpText>Average</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                        <CardBody>
                          <Stat>
                            <StatLabel color={textColor}>Laying Period</StatLabel>
                            <StatNumber color="orange.500">{(currentBreed.performance as any).layingPeriod || 52}</StatNumber>
                            <StatHelpText>Weeks</StatHelpText>
                          </Stat>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </SimpleGrid>

                {/* Environmental Requirements */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Environmental Requirements</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Icon as={FiThermometer} color="red.500" />
                          <Text fontWeight="bold" color={textColor}>Temperature Range</Text>
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
                          <Text fontWeight="bold" color={textColor}>Humidity Range</Text>
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
                    <Heading size="md">Expected Growth Curve</Heading>
                  </CardHeader>
                  <CardBody>
                    <Box h="400px">
                      <SafeChartContainer minHeight={400}>
                        <AreaChart data={growthData} width={400} height={400}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" label={{ value: 'Week', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#48BB78" 
                            fill="#48BB78" 
                            fillOpacity={0.6} 
                            name="Weight (g)" 
                          />
                        </AreaChart>
                      </SafeChartContainer>
                    </Box>
                  </CardBody>
                </Card>

                {/* Feeding Schedule */}
                <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Feeding Schedule</Heading>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Stage</Th>
                            <Th>Age (Weeks)</Th>
                            <Th>Protein</Th>
                            <Th>Energy</Th>
                            <Th>Form</Th>
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
                      <Button leftIcon={<FiTarget />} colorScheme="green" variant="outline">
                        Set Targets
                      </Button>
                      <Button leftIcon={<FiBarChart />} colorScheme="blue" variant="outline">
                        View Analytics
                      </Button>
                      <Button leftIcon={<FiActivity />} colorScheme="purple" variant="outline">
                        Track Progress
                      </Button>
                      <Button leftIcon={<FiAward />} colorScheme="orange" variant="outline">
                        Compare Breeds
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
                      <Button leftIcon={<FiShield />} colorScheme="green" variant="outline">
                        Schedule Vaccination
                      </Button>
                      <Button leftIcon={<FiHeart />} colorScheme="red" variant="outline">
                        Health Check
                      </Button>
                      <Button leftIcon={<FiCalendar />} colorScheme="blue" variant="outline">
                        Set Reminders
                      </Button>
                      <Button leftIcon={<FiActivity />} colorScheme="purple" variant="outline">
                        Log Health Data
                      </Button>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </FarmerLayout>
  );
};

export default FarmerBreedGuidancePage;
