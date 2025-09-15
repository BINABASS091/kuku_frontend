import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Heading,
  Icon,
  useToast,
} from '@chakra-ui/react';
import {
  ViewIcon,
  SettingsIcon,
  InfoIcon,
  StarIcon,
  CheckCircleIcon,
  WarningIcon,
  LinkIcon,
} from '@chakra-ui/icons';
import MasterDataManager from '../../components/MasterDataManager';
import { masterDataAPI } from '../../services/api';

interface RelationalMasterDataStats {
  // Base entities
  breedTypes: number;
  breeds: number;
  activityTypes: number;
  conditionTypes: number;
  foodTypes: number;
  sensorTypes: number;
  patientHealths: number;
  recommendations: number;
  subscriptionTypes: number;
  resources: number;
  
  // Relational entities
  breedActivities: number;
  breedConditions: number;
  breedFeedings: number;
  breedGrowths: number;
  exceptionDiseases: number;
  anomalies: number;
  medications: number;
}

// Enhanced type definitions with relational data
type BreedType = {
  id: number;
  breed_typeID: number;
  breedType: string;
  breeds_count?: number;
  total_activities?: number;
};

type Breed = {
  id: number;
  breedID: number;
  breedName: string;
  breed_typeID: number;
  breed_type_detail?: any;
  preedphoto: string;
  activities_count?: number;
  conditions_count?: number;
  feeding_schedules_count?: number;
  growth_records_count?: number;
};

type ActivityType = {
  id: number;
  activityTypeID: number;
  activityType: string;
  total_breed_activities?: number;
};

type BreedActivity = {
  id: number;
  breedActivityID: number;
  breedID: number;
  activityTypeID: number;
  age: number;
  breed_activity_status: number;
  breed_detail?: any;
  activity_type_detail?: any;
  status_display?: string;
};

type ConditionType = {
  id: number;
  condition_typeID: number;
  conditionName: string;
  condition_unit: string;
  breed_conditions_count?: number;
  active_conditions_count?: number;
};

type BreedCondition = {
  id: number;
  breed_conditionID: number;
  breedID: number;
  condition_typeID: number;
  condictionMin: number;
  conditionMax: number;
  condition_status: number;
  breed_detail?: any;
  condition_type_detail?: any;
  status_display?: string;
};

type FoodType = {
  id: number;
  foodTypeID: number;
  foodName: string;
  feeding_schedules_count?: number;
  breeds_using_count?: number;
};

type BreedFeeding = {
  id: number;
  breedFeedingID: number;
  breedID: number;
  foodTypeID: number;
  quantity: number;
  age: number;
  frequency: number;
  breed_feed_status: number;
  breed_detail?: any;
  food_type_detail?: any;
  status_display?: string;
};

type BreedGrowth = {
  id: number;
  breedGrowthID: number;
  breedID: number;
  age: number;
  minWeight: number;
  breed_detail?: any;
};

type SensorType = {
  id: number;
  sensorTypeID: number;
  name: string;
  unit: string;
  total_readings?: number;
  active_devices_count?: number;
  latest_reading_timestamp?: string;
  avg_reading_value?: number;
};

type PatientHealth = {
  id: number;
  description: string;
  exceptions_count?: number;
  recommendations_affected?: number;
  created_at?: string;
  updated_at?: string;
};

type Recommendation = {
  id: number;
  description: string;
  reco_type: string;
  context: string;
  reco_type_display?: string;
  context_display?: string;
  exceptions_count?: number;
  medications_count?: number;
  created_at?: string;
  updated_at?: string;
};

type ExceptionDisease = {
  id: number;
  recommendation: number;
  health: number;
  recommendation_detail?: any;
  health_detail?: any;
  created_at?: string;
};

type Anomaly = {
  id: number;
  hr_id: number;
  sp_id: number;
  pr_id: number;
  bt_id: number;
  resp_id: number;
  status: boolean;
  status_display?: string;
  medications_count?: number;
  created_at?: string;
};

type Medication = {
  id: number;
  diagnosis: number;
  recommendation: number;
  user: number;
  sequence_no: number;
  notes?: string;
  diagnosis_detail?: any;
  recommendation_detail?: any;
  user_detail?: any;
  created_at?: string;
};

type SubscriptionType = {
  id: number;
  subscriptionTypeID: number;
  name: string;
  tier: string;
  tier_display?: string;
  farm_size: string;
  cost: number;
  max_hardware_nodes: number;
  max_software_services: number;
  includes_predictions: boolean;
  includes_analytics: boolean;
  description?: string;
  active_subscriptions_count?: number;
  total_revenue?: number;
};

type Resource = {
  id: number;
  resourceID: number;
  name: string;
  resource_type: string;
  resource_type_display?: string;
  category: string;
  category_display?: string;
  unit_cost: number;
  status: boolean;
  status_display?: string;
  is_basic: boolean;
  description?: string;
  subscriptions_using_count?: number;
  total_allocations?: number;
};

const RelationalMasterData: React.FC = () => {
  const [stats, setStats] = useState<RelationalMasterDataStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dropdownData, setDropdownData] = useState<any>({});
  
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchMasterDataStats();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [breedTypesRes, breedsRes, activityTypesRes, conditionTypesRes, 
             foodTypesRes, patientHealthsRes, recommendationsRes, anomaliesRes] = await Promise.all([
        masterDataAPI.breedTypes.list(),
        masterDataAPI.breeds.list(),
        masterDataAPI.activityTypes.list(),
        masterDataAPI.conditionTypes.list(),
        masterDataAPI.foodTypes.list(),
        masterDataAPI.patientHealths.list(),
        masterDataAPI.recommendations.list(),
        masterDataAPI.anomalies.list(),
      ]);

      setDropdownData({
        breedTypes: breedTypesRes.results || breedTypesRes,
        breeds: breedsRes.results || breedsRes,
        activityTypes: activityTypesRes.results || activityTypesRes,
        conditionTypes: conditionTypesRes.results || conditionTypesRes,
        foodTypes: foodTypesRes.results || foodTypesRes,
        patientHealths: patientHealthsRes.results || patientHealthsRes,
        recommendations: recommendationsRes.results || recommendationsRes,
        anomalies: anomaliesRes.results || anomaliesRes,
      });
    } catch (err) {
      console.error('Error fetching dropdown data:', err);
    }
  };

  const fetchMasterDataStats = async () => {
    try {
      setIsLoadingStats(true);
      
      const responses = await Promise.all([
        masterDataAPI.breedTypes.list(),
        masterDataAPI.breeds.list(),
        masterDataAPI.activityTypes.list(),
        masterDataAPI.breedActivities.list(),
        masterDataAPI.conditionTypes.list(),
        masterDataAPI.breedConditions.list(),
        masterDataAPI.foodTypes.list(),
        masterDataAPI.breedFeedings.list(),
        masterDataAPI.breedGrowths.list(),
        masterDataAPI.sensorTypes.list(),
        masterDataAPI.patientHealths.list(),
        masterDataAPI.recommendations.list(),
        masterDataAPI.exceptionDiseases.list(),
        masterDataAPI.anomalies.list(),
        masterDataAPI.medications.list(),
        masterDataAPI.subscriptionTypes.list(),
        masterDataAPI.resources.list(),
      ]);

      const [
        breedTypesRes, breedsRes, activityTypesRes, breedActivitiesRes,
        conditionTypesRes, breedConditionsRes, foodTypesRes, breedFeedingsRes,
        breedGrowthsRes, sensorTypesRes, patientHealthsRes, recommendationsRes,
        exceptionDiseasesRes, anomaliesRes, medicationsRes, subscriptionTypesRes,
        resourcesRes
      ] = responses;

      setStats({
        breedTypes: (breedTypesRes.results || breedTypesRes || []).length,
        breeds: (breedsRes.results || breedsRes || []).length,
        activityTypes: (activityTypesRes.results || activityTypesRes || []).length,
        breedActivities: (breedActivitiesRes.results || breedActivitiesRes || []).length,
        conditionTypes: (conditionTypesRes.results || conditionTypesRes || []).length,
        breedConditions: (breedConditionsRes.results || breedConditionsRes || []).length,
        foodTypes: (foodTypesRes.results || foodTypesRes || []).length,
        breedFeedings: (breedFeedingsRes.results || breedFeedingsRes || []).length,
        breedGrowths: (breedGrowthsRes.results || breedGrowthsRes || []).length,
        sensorTypes: (sensorTypesRes.results || sensorTypesRes || []).length,
        patientHealths: (patientHealthsRes.results || patientHealthsRes || []).length,
        recommendations: (recommendationsRes.results || recommendationsRes || []).length,
        exceptionDiseases: (exceptionDiseasesRes.results || exceptionDiseasesRes || []).length,
        anomalies: (anomaliesRes.results || anomaliesRes || []).length,
        medications: (medicationsRes.results || medicationsRes || []).length,
        subscriptionTypes: (subscriptionTypesRes.results || subscriptionTypesRes || []).length,
        resources: (resourcesRes.results || resourcesRes || []).length,
      });

    } catch (err: any) {
      console.error('Error fetching master data stats:', err);
      setError('Failed to load master data statistics');
      toast({
        title: 'Error',
        description: 'Failed to load master data statistics',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const StatCard = ({ 
    label, 
    value, 
    icon, 
    color = 'blue', 
    helpText,
    isRelational = false 
  }: { 
    label: string; 
    value: number; 
    icon: any; 
    color?: string; 
    helpText?: string; 
    isRelational?: boolean;
  }) => (
    <Card bg={cardBg} borderColor={borderColor} size="sm">
      <CardBody p={3}>
        <Stat size="sm">
          <HStack spacing={2}>
            <Icon as={icon} boxSize={4} color={`${color}.500`} />
            {isRelational && <Icon as={LinkIcon} boxSize={3} color="gray.400" />}
            <Box>
              <StatLabel fontSize="xs">{label}</StatLabel>
              <StatNumber fontSize="lg">{value}</StatNumber>
              {helpText && <StatHelpText fontSize="xs">{helpText}</StatHelpText>}
            </Box>
          </HStack>
        </Stat>
      </CardBody>
    </Card>
  );

  if (isLoadingStats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading Relational Master Data...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="100%" minH="100vh" bg={bgColor} p={6}>
      <VStack spacing={6} align="stretch">
        
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Relational Master Data Management</Heading>
          <Text color="gray.600" fontSize="md">
            Comprehensive management of system configuration data with full relational model support
          </Text>
        </Box>

        {/* Statistics Dashboard */}
        {stats && (
          <VStack spacing={4} align="stretch">
            {/* Base Entities */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.600">Base Entities</Text>
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
                <StatCard
                  label="Breed Types"
                  value={stats.breedTypes}
                  icon={SettingsIcon}
                  color="purple"
                  helpText="Categories"
                />
                <StatCard
                  label="Breeds"
                  value={stats.breeds}
                  icon={StarIcon}
                  color="green"
                  helpText="Specific breeds"
                />
                <StatCard
                  label="Activity Types"
                  value={stats.activityTypes}
                  icon={CheckCircleIcon}
                  color="blue"
                  helpText="Farm activities"
                />
                <StatCard
                  label="Condition Types"
                  value={stats.conditionTypes}
                  icon={WarningIcon}
                  color="orange"
                  helpText="Health conditions"
                />
                <StatCard
                  label="Food Types"
                  value={stats.foodTypes}
                  icon={ViewIcon}
                  color="teal"
                  helpText="Feed categories"
                />
                <StatCard
                  label="Sensor Types"
                  value={stats.sensorTypes}
                  icon={SettingsIcon}
                  color="cyan"
                  helpText="Sensor configs"
                />
              </SimpleGrid>
            </Box>

            {/* Relational Entities */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">Relational Entities</Text>
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
                <StatCard
                  label="Breed Activities"
                  value={stats.breedActivities}
                  icon={LinkIcon}
                  color="blue"
                  helpText="Breed-Activity links"
                  isRelational={true}
                />
                <StatCard
                  label="Breed Conditions"
                  value={stats.breedConditions}
                  icon={LinkIcon}
                  color="orange"
                  helpText="Breed-Condition links"
                  isRelational={true}
                />
                <StatCard
                  label="Breed Feedings"
                  value={stats.breedFeedings}
                  icon={LinkIcon}
                  color="teal"
                  helpText="Breed-Food links"
                  isRelational={true}
                />
                <StatCard
                  label="Breed Growths"
                  value={stats.breedGrowths}
                  icon={LinkIcon}
                  color="green"
                  helpText="Growth records"
                  isRelational={true}
                />
                <StatCard
                  label="Exception Diseases"
                  value={stats.exceptionDiseases}
                  icon={LinkIcon}
                  color="red"
                  helpText="Recommendation exceptions"
                  isRelational={true}
                />
                <StatCard
                  label="Medications"
                  value={stats.medications}
                  icon={LinkIcon}
                  color="purple"
                  helpText="Anomaly treatments"
                  isRelational={true}
                />
              </SimpleGrid>
            </Box>

            {/* Knowledge & System Entities */}
            <Box>
              <Text fontSize="md" fontWeight="semibold" mb={3} color="purple.600">Knowledge & System</Text>
              <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
                <StatCard
                  label="Patient Health"
                  value={stats.patientHealths}
                  icon={WarningIcon}
                  color="red"
                  helpText="Health conditions"
                />
                <StatCard
                  label="Recommendations"
                  value={stats.recommendations}
                  icon={InfoIcon}
                  color="blue"
                  helpText="Knowledge base"
                />
                <StatCard
                  label="Anomalies"
                  value={stats.anomalies}
                  icon={WarningIcon}
                  color="orange"
                  helpText="Detected anomalies"
                />
                <StatCard
                  label="Subscription Types"
                  value={stats.subscriptionTypes}
                  icon={StarIcon}
                  color="purple"
                  helpText="Plans available"
                />
                <StatCard
                  label="Resources"
                  value={stats.resources}
                  icon={ViewIcon}
                  color="cyan"
                  helpText="Service resources"
                />
              </SimpleGrid>
            </Box>
          </VStack>
        )}

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Master Data Tabs */}
        <Card bg={cardBg} borderColor={borderColor} minH="600px">
          <CardBody p={0}>
            <Tabs
              index={activeTab}
              onChange={setActiveTab}
              variant="enclosed"
              colorScheme="blue"
            >
              <TabList overflowX="auto" overflowY="hidden">
                {/* Base Entity Tabs */}
                <Tab>Breed Types</Tab>
                <Tab>Breeds</Tab>
                <Tab>Activity Types</Tab>
                <Tab>Condition Types</Tab>
                <Tab>Food Types</Tab>
                <Tab>Sensor Types</Tab>
                
                {/* Relational Tabs */}
                <Tab>Breed Activities</Tab>
                <Tab>Breed Conditions</Tab>
                <Tab>Breed Feedings</Tab>
                <Tab>Breed Growths</Tab>
                
                {/* Knowledge Tabs */}
                <Tab>Patient Health</Tab>
                <Tab>Recommendations</Tab>
                <Tab>Exception Diseases</Tab>
                <Tab>Anomalies</Tab>
                <Tab>Medications</Tab>
                
                {/* System Tabs */}
                <Tab>Subscription Types</Tab>
                <Tab>Resources</Tab>
              </TabList>

              <TabPanels>
                {/* Breed Types Tab */}
                <TabPanel>
                  <MasterDataManager<BreedType>
                    title="Breed Types"
                    endpoint=""
                    api={masterDataAPI.breedTypes}
                    columns={[
                      { key: 'breedType', header: 'Breed Type' },
                      { 
                        key: 'breeds_count', 
                        header: 'Breeds Count',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="subtle">
                            {row.breeds_count || 0}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'breedType', label: 'Breed Type', required: true, placeholder: 'e.g., Broiler, Layer' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.breed_typeID })}
                  />
                </TabPanel>

                {/* Breeds Tab */}
                <TabPanel>
                  <MasterDataManager<Breed>
                    title="Breeds"
                    endpoint=""
                    api={masterDataAPI.breeds}
                    columns={[
                      { key: 'breedName', header: 'Breed Name' },
                      { 
                        key: 'breed_type_detail', 
                        header: 'Type',
                        render: (row) => row.breed_type_detail?.breedType || 'N/A'
                      },
                      { key: 'preedphoto', header: 'Photo' },
                    ]}
                    fields={[
                      { type: 'text', name: 'breedName', label: 'Breed Name', required: true, placeholder: 'e.g., Rhode Island Red' },
                      { 
                        type: 'select', 
                        name: 'breed_typeID', 
                        label: 'Breed Type', 
                        required: true,
                        options: dropdownData.breedTypes?.map((bt: any) => ({ 
                          label: bt.breedType, 
                          value: bt.breed_typeID 
                        })) || []
                      },
                      { type: 'text', name: 'preedphoto', label: 'Photo URL', required: false, placeholder: 'breed_photo.jpg (optional)' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.breedID })}
                    normalizeIn={(formData) => {
                      const breedTypeID = formData.breed_typeID ? parseInt(formData.breed_typeID) : undefined;
                      if (!breedTypeID) {
                        throw new Error('Please select a breed type');
                      }
                      return {
                        ...formData,
                        breed_typeID: breedTypeID,
                        preedphoto: formData.preedphoto || 'preedphoto.png'
                      };
                    }}
                  />
                </TabPanel>

                {/* Activity Types Tab */}
                <TabPanel>
                  <MasterDataManager<ActivityType>
                    title="Activity Types"
                    endpoint=""
                    api={masterDataAPI.activityTypes}
                    columns={[
                      { key: 'activityType', header: 'Activity Type' },
                    ]}
                    fields={[
                      { type: 'text', name: 'activityType', label: 'Activity Type', required: true, placeholder: 'e.g., Feeding, Vaccination' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.activityTypeID })}
                  />
                </TabPanel>

                {/* Condition Types Tab */}
                <TabPanel>
                  <MasterDataManager<ConditionType>
                    title="Condition Types"
                    endpoint=""
                    api={masterDataAPI.conditionTypes}
                    columns={[
                      { key: 'conditionName', header: 'Condition Name' },
                      { key: 'condition_unit', header: 'Unit' },
                    ]}
                    fields={[
                      { type: 'text', name: 'conditionName', label: 'Condition Name', required: true, placeholder: 'e.g., Temperature, Humidity' },
                      { type: 'text', name: 'condition_unit', label: 'Unit', required: true, placeholder: 'e.g., °C, %' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.condition_typeID })}
                  />
                </TabPanel>

                {/* Food Types Tab */}
                <TabPanel>
                  <MasterDataManager<FoodType>
                    title="Food Types"
                    endpoint=""
                    api={masterDataAPI.foodTypes}
                    columns={[
                      { key: 'foodName', header: 'Food Type' },
                    ]}
                    fields={[
                      { type: 'text', name: 'foodName', label: 'Food Type', required: true, placeholder: 'e.g., Starter Feed, Grower Feed' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.foodTypeID })}
                  />
                </TabPanel>

                {/* Sensor Types Tab */}
                <TabPanel>
                  <MasterDataManager<SensorType>
                    title="Sensor Types"
                    endpoint=""
                    api={masterDataAPI.sensorTypes}
                    columns={[
                      { key: 'name', header: 'Sensor Name' },
                      { key: 'unit', header: 'Unit' },
                    ]}
                    fields={[
                      { type: 'text', name: 'name', label: 'Sensor Name', required: true, placeholder: 'e.g., Temperature, Humidity' },
                      { type: 'text', name: 'unit', label: 'Unit', required: true, placeholder: 'e.g., °C, %' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.sensorTypeID })}
                  />
                </TabPanel>

                {/* Breed Activities Tab - Relational */}
                <TabPanel>
                  <MasterDataManager<BreedActivity>
                    title="Breed Activities"
                    endpoint=""
                    api={masterDataAPI.breedActivities}
                    columns={[
                      { 
                        key: 'breed_detail', 
                        header: 'Breed',
                        render: (row) => row.breed_detail?.breedName || `Breed ID: ${row.breedID}`
                      },
                      { 
                        key: 'activity_type_detail', 
                        header: 'Activity Type',
                        render: (row) => row.activity_type_detail?.activityType || `Activity ID: ${row.activityTypeID}`
                      },
                      { key: 'age', header: 'Age (days)' },
                      { 
                        key: 'status_display', 
                        header: 'Status',
                        render: (row) => (
                          <Badge 
                            colorScheme={row.breed_activity_status === 1 ? 'green' : 'red'} 
                            variant="subtle"
                          >
                            {row.breed_activity_status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { 
                        type: 'select', 
                        name: 'breedID', 
                        label: 'Breed', 
                        required: true,
                        options: dropdownData.breeds?.map((breed: any) => ({ 
                          label: breed.breedName, 
                          value: breed.breedID 
                        })) || []
                      },
                      { 
                        type: 'select', 
                        name: 'activityTypeID', 
                        label: 'Activity Type', 
                        required: true,
                        options: dropdownData.activityTypes?.map((at: any) => ({ 
                          label: at.activityType, 
                          value: at.activityTypeID 
                        })) || []
                      },
                      { type: 'text', name: 'age', label: 'Age (days)', required: true, placeholder: 'Age in days' },
                      { 
                        type: 'select', 
                        name: 'breed_activity_status', 
                        label: 'Status', 
                        required: true,
                        options: [
                          { label: 'Active', value: 1 },
                          { label: 'Inactive', value: 0 },
                          { label: 'Archived', value: 9 },
                        ]
                      },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.breedActivityID })}
                  />
                </TabPanel>

                {/* Breed Conditions Tab - Relational */}
                <TabPanel>
                  <MasterDataManager<BreedCondition>
                    title="Breed Conditions"
                    endpoint=""
                    api={masterDataAPI.breedConditions}
                    columns={[
                      { 
                        key: 'breed_detail', 
                        header: 'Breed',
                        render: (row) => row.breed_detail?.breedName || `Breed ID: ${row.breedID}`
                      },
                      { 
                        key: 'condition_type_detail', 
                        header: 'Condition Type',
                        render: (row) => row.condition_type_detail?.name || `Condition ID: ${row.condition_typeID}`
                      },
                      { key: 'condictionMin', header: 'Min Value' },
                      { key: 'conditionMax', header: 'Max Value' },
                      { 
                        key: 'status_display', 
                        header: 'Status',
                        render: (row) => (
                          <Badge 
                            colorScheme={row.condition_status === 1 ? 'green' : 'red'} 
                            variant="subtle"
                          >
                            {row.condition_status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { 
                        type: 'select', 
                        name: 'breedID', 
                        label: 'Breed', 
                        required: true,
                        options: dropdownData.breeds?.map((breed: any) => ({ 
                          label: breed.breedName, 
                          value: breed.breedID 
                        })) || []
                      },
                      { 
                        type: 'select', 
                        name: 'condition_typeID', 
                        label: 'Condition Type', 
                        required: true,
                        options: dropdownData.conditionTypes?.map((ct: any) => ({ 
                          label: `${ct.conditionName} (${ct.condition_unit})`, 
                          value: ct.condition_typeID 
                        })) || []
                      },
                      { type: 'text', name: 'condictionMin', label: 'Minimum Value', required: true, placeholder: 'Minimum value' },
                      { type: 'text', name: 'conditionMax', label: 'Maximum Value', required: true, placeholder: 'Maximum value' },
                      { 
                        type: 'select', 
                        name: 'condition_status', 
                        label: 'Status', 
                        required: true,
                        options: [
                          { label: 'Active', value: 1 },
                          { label: 'Inactive', value: 0 },
                          { label: 'Archived', value: 9 },
                        ]
                      },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.breed_conditionID })}
                  />
                </TabPanel>

                {/* Breed Feedings Tab - Relational */}
                <TabPanel>
                  <MasterDataManager<BreedFeeding>
                    title="Breed Feedings"
                    endpoint=""
                    api={masterDataAPI.breedFeedings}
                    columns={[
                      { 
                        key: 'breed_detail', 
                        header: 'Breed',
                        render: (row) => row.breed_detail?.breedName || `Breed ID: ${row.breedID}`
                      },
                      { 
                        key: 'food_type_detail', 
                        header: 'Food Type',
                        render: (row) => row.food_type_detail?.name || `Food ID: ${row.foodTypeID}`
                      },
                      { key: 'age', header: 'Age (days)' },
                      { key: 'quantity', header: 'Quantity' },
                      { key: 'frequency', header: 'Frequency' },
                      { 
                        key: 'status_display', 
                        header: 'Status',
                        render: (row) => (
                          <Badge 
                            colorScheme={row.breed_feed_status === 1 ? 'green' : 'red'} 
                            variant="subtle"
                          >
                            {row.breed_feed_status === 1 ? 'Active' : 'Inactive'}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { 
                        type: 'select', 
                        name: 'breedID', 
                        label: 'Breed', 
                        required: true,
                        options: dropdownData.breeds?.map((breed: any) => ({ 
                          label: breed.breedName, 
                          value: breed.breedID 
                        })) || []
                      },
                      { 
                        type: 'select', 
                        name: 'foodTypeID', 
                        label: 'Food Type', 
                        required: true,
                        options: dropdownData.foodTypes?.map((ft: any) => ({ 
                          label: ft.foodName, 
                          value: ft.foodTypeID 
                        })) || []
                      },
                      { type: 'text', name: 'age', label: 'Age (days)', required: true, placeholder: 'Age in days' },
                      { type: 'text', name: 'quantity', label: 'Quantity', required: true, placeholder: 'Amount to feed' },
                      { type: 'text', name: 'frequency', label: 'Frequency', required: true, placeholder: 'Times per day' },
                      { 
                        type: 'select', 
                        name: 'breed_feed_status', 
                        label: 'Status', 
                        required: true,
                        options: [
                          { label: 'Active', value: 1 },
                          { label: 'Inactive', value: 0 },
                          { label: 'Archived', value: 9 },
                        ]
                      },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.breedFeedingID })}
                  />
                </TabPanel>

                {/* Breed Growths Tab - Relational */}
                <TabPanel>
                  <MasterDataManager<BreedGrowth>
                    title="Breed Growths"
                    endpoint=""
                    api={masterDataAPI.breedGrowths}
                    columns={[
                      { 
                        key: 'breed_detail', 
                        header: 'Breed',
                        render: (row) => row.breed_detail?.breedName || `Breed ID: ${row.breedID}`
                      },
                      { key: 'age', header: 'Age (days)' },
                      { key: 'minWeight', header: 'Min Weight (g)' },
                    ]}
                    fields={[
                      { 
                        type: 'select', 
                        name: 'breedID', 
                        label: 'Breed', 
                        required: true,
                        options: dropdownData.breeds?.map((breed: any) => ({ 
                          label: breed.breedName, 
                          value: breed.breedID 
                        })) || []
                      },
                      { type: 'text', name: 'age', label: 'Age (days)', required: true, placeholder: 'Age in days' },
                      { type: 'text', name: 'minWeight', label: 'Minimum Weight (g)', required: true, placeholder: 'Weight in grams' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.breedGrowthID })}
                  />
                </TabPanel>

                {/* Patient Health Tab */}
                <TabPanel>
                  <MasterDataManager<PatientHealth>
                    title="Patient Health Conditions"
                    endpoint=""
                    api={masterDataAPI.patientHealths}
                    columns={[
                      { key: 'description', header: 'Description' },
                      { 
                        key: 'exceptions_count', 
                        header: 'Exceptions',
                        render: (row) => (
                          <Badge colorScheme="orange" variant="subtle">
                            {row.exceptions_count || 0}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'description', label: 'Description', required: true, placeholder: 'e.g., Diabetes, Hypertension' },
                    ]}
                  />
                </TabPanel>

                {/* Recommendations Tab */}
                <TabPanel>
                  <MasterDataManager<Recommendation>
                    title="Recommendations"
                    endpoint=""
                    api={masterDataAPI.recommendations}
                    columns={[
                      { key: 'description', header: 'Description' },
                      { 
                        key: 'reco_type_display', 
                        header: 'Type',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="outline">
                            {row.reco_type_display || row.reco_type}
                          </Badge>
                        )
                      },
                      { 
                        key: 'context_display', 
                        header: 'Context',
                        render: (row) => (
                          <Badge colorScheme="purple" variant="outline">
                            {row.context_display || row.context}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'textarea', name: 'description', label: 'Description', required: true, placeholder: 'Recommendation details...' },
                      { 
                        type: 'select', 
                        name: 'reco_type', 
                        label: 'Type', 
                        required: true,
                        options: [
                          { label: 'Temperature', value: 'Temperature' },
                          { label: 'Blood Oxygen', value: 'Spo2' },
                          { label: 'Heart Rate', value: 'Heart' },
                          { label: 'Respiration', value: 'Respiration' },
                          { label: 'Blood Pressure', value: 'Pressure' },
                          { label: 'Other', value: 'Other' },
                        ]
                      },
                      { 
                        type: 'select', 
                        name: 'context', 
                        label: 'Context', 
                        required: true,
                        options: [
                          { label: 'Home', value: 'Home' },
                          { label: 'Hospital', value: 'Hospital' },
                          { label: 'Ambulatory', value: 'Ambulatory' },
                          { label: 'Any', value: 'Any' },
                        ]
                      },
                    ]}
                  />
                </TabPanel>

                {/* Exception Diseases Tab - Relational */}
                <TabPanel>
                  <MasterDataManager<ExceptionDisease>
                    title="Exception Diseases"
                    endpoint=""
                    api={masterDataAPI.exceptionDiseases}
                    columns={[
                      { 
                        key: 'recommendation_detail', 
                        header: 'Recommendation',
                        render: (row) => row.recommendation_detail?.description?.substring(0, 50) + '...' || `Recommendation ID: ${row.recommendation}`
                      },
                      { 
                        key: 'health_detail', 
                        header: 'Health Condition',
                        render: (row) => row.health_detail?.description || `Health ID: ${row.health}`
                      },
                    ]}
                    fields={[
                      { 
                        type: 'select', 
                        name: 'recommendation', 
                        label: 'Recommendation', 
                        required: true,
                        options: dropdownData.recommendations?.map((rec: any) => ({ 
                          label: rec.description.length > 50 ? rec.description.substring(0, 50) + '...' : rec.description, 
                          value: rec.id 
                        })) || []
                      },
                      { 
                        type: 'select', 
                        name: 'health', 
                        label: 'Health Condition', 
                        required: true,
                        options: dropdownData.patientHealths?.map((health: any) => ({ 
                          label: health.description, 
                          value: health.id 
                        })) || []
                      },
                    ]}
                  />
                </TabPanel>

                {/* Anomalies Tab */}
                <TabPanel>
                  <MasterDataManager<Anomaly>
                    title="Anomalies"
                    endpoint=""
                    api={masterDataAPI.anomalies}
                    columns={[
                      { key: 'hr_id', header: 'Heart Rate ID' },
                      { key: 'sp_id', header: 'SPO2 ID' },
                      { key: 'pr_id', header: 'Pulse Rate ID' },
                      { key: 'bt_id', header: 'Body Temp ID' },
                      { key: 'resp_id', header: 'Respiration ID' },
                      { 
                        key: 'status', 
                        header: 'Status',
                        render: (row) => (
                          <Badge 
                            colorScheme={row.status ? 'orange' : 'green'} 
                            variant="subtle"
                          >
                            {row.status ? 'Active' : 'Resolved'}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'hr_id', label: 'Heart Rate Anomaly ID', required: true, placeholder: 'HR anomaly reference' },
                      { type: 'text', name: 'sp_id', label: 'SPO2 Anomaly ID', required: true, placeholder: 'SPO2 anomaly reference' },
                      { type: 'text', name: 'pr_id', label: 'Pulse Rate Anomaly ID', required: true, placeholder: 'Pulse anomaly reference' },
                      { type: 'text', name: 'bt_id', label: 'Body Temperature Anomaly ID', required: true, placeholder: 'Temperature anomaly reference' },
                      { type: 'text', name: 'resp_id', label: 'Respiration Anomaly ID', required: true, placeholder: 'Respiration anomaly reference' },
                      { 
                        type: 'select', 
                        name: 'status', 
                        label: 'Status', 
                        required: true,
                        options: [
                          { label: 'Active', value: true },
                          { label: 'Resolved', value: false },
                        ]
                      },
                    ]}
                  />
                </TabPanel>

                {/* Medications Tab - Relational */}
                <TabPanel>
                  <MasterDataManager<Medication>
                    title="Medications"
                    endpoint=""
                    api={masterDataAPI.medications}
                    columns={[
                      { 
                        key: 'diagnosis_detail', 
                        header: 'Diagnosis',
                        render: (row) => `Anomaly ID: ${row.diagnosis}`
                      },
                      { 
                        key: 'recommendation_detail', 
                        header: 'Recommendation',
                        render: (row) => row.recommendation_detail?.description?.substring(0, 40) + '...' || `Recommendation ID: ${row.recommendation}`
                      },
                      { key: 'sequence_no', header: 'Sequence' },
                      { key: 'notes', header: 'Notes' },
                    ]}
                    fields={[
                      { 
                        type: 'select', 
                        name: 'diagnosis', 
                        label: 'Diagnosis (Anomaly)', 
                        required: true,
                        options: dropdownData.anomalies?.map((anomaly: any) => ({ 
                          label: `Anomaly ${anomaly.id} (${anomaly.status ? 'Active' : 'Resolved'})`, 
                          value: anomaly.id 
                        })) || []
                      },
                      { 
                        type: 'select', 
                        name: 'recommendation', 
                        label: 'Recommendation', 
                        required: true,
                        options: dropdownData.recommendations?.map((rec: any) => ({ 
                          label: rec.description.length > 40 ? rec.description.substring(0, 40) + '...' : rec.description, 
                          value: rec.id 
                        })) || []
                      },
                      { type: 'text', name: 'sequence_no', label: 'Sequence Number', required: true, placeholder: 'Order of administration' },
                      { type: 'textarea', name: 'notes', label: 'Notes', placeholder: 'Additional instructions...' },
                    ]}
                  />
                </TabPanel>

                {/* Subscription Types Tab */}
                <TabPanel>
                  <MasterDataManager<SubscriptionType>
                    title="Subscription Types"
                    endpoint=""
                    api={masterDataAPI.subscriptionTypes}
                    columns={[
                      { key: 'name', header: 'Name' },
                      { 
                        key: 'tier_display', 
                        header: 'Tier',
                        render: (row) => (
                          <Badge 
                            colorScheme={
                              row.tier === 'PREMIUM' ? 'purple' : 
                              row.tier === 'NORMAL' ? 'blue' : 'green'
                            } 
                            variant="solid"
                          >
                            {row.tier_display || row.tier}
                          </Badge>
                        )
                      },
                      { key: 'farm_size', header: 'Farm Size' },
                      { 
                        key: 'cost', 
                        header: 'Cost',
                        render: (row) => `$${row.cost}`
                      },
                      { key: 'max_hardware_nodes', header: 'Max Hardware' },
                      { key: 'max_software_services', header: 'Max Software' },
                    ]}
                    fields={[
                      { type: 'text', name: 'name', label: 'Name', required: true, placeholder: 'Subscription plan name' },
                      { 
                        type: 'select', 
                        name: 'tier', 
                        label: 'Tier', 
                        required: true,
                        options: [
                          { label: 'Individual/Small', value: 'INDIVIDUAL' },
                          { label: 'Normal/Medium', value: 'NORMAL' },
                          { label: 'Premium/Large', value: 'PREMIUM' },
                        ]
                      },
                      { type: 'text', name: 'farm_size', label: 'Farm Size', placeholder: 'e.g., Small, Medium, Large' },
                      { type: 'text', name: 'cost', label: 'Cost', placeholder: 'Monthly cost in USD' },
                      { type: 'text', name: 'max_hardware_nodes', label: 'Max Hardware Nodes', placeholder: 'Number of devices' },
                      { type: 'text', name: 'max_software_services', label: 'Max Software Services', placeholder: 'Number of services' },
                      { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Plan details...' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.subscriptionTypeID })}
                  />
                </TabPanel>

                {/* Resources Tab */}
                <TabPanel>
                  <MasterDataManager<Resource>
                    title="Resources"
                    endpoint=""
                    api={masterDataAPI.resources}
                    columns={[
                      { key: 'name', header: 'Name' },
                      { 
                        key: 'resource_type_display', 
                        header: 'Type',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="outline">
                            {row.resource_type_display || row.resource_type}
                          </Badge>
                        )
                      },
                      { 
                        key: 'category_display', 
                        header: 'Category',
                        render: (row) => (
                          <Badge colorScheme="teal" variant="outline">
                            {row.category_display || row.category}
                          </Badge>
                        )
                      },
                      { 
                        key: 'unit_cost', 
                        header: 'Unit Cost',
                        render: (row) => `$${row.unit_cost}`
                      },
                      { 
                        key: 'status', 
                        header: 'Status',
                        render: (row) => (
                          <Badge 
                            colorScheme={row.status ? 'green' : 'red'} 
                            variant="subtle"
                          >
                            {row.status ? 'Available' : 'Unavailable'}
                          </Badge>
                        )
                      },
                      { 
                        key: 'is_basic', 
                        header: 'Basic',
                        render: (row) => (
                          <Badge 
                            colorScheme={row.is_basic ? 'green' : 'gray'} 
                            variant="subtle"
                          >
                            {row.is_basic ? 'Yes' : 'No'}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'name', label: 'Name', required: true, placeholder: 'Resource name' },
                      { 
                        type: 'select', 
                        name: 'resource_type', 
                        label: 'Resource Type', 
                        required: true,
                        options: [
                          { label: 'Hardware Node', value: 'HARDWARE' },
                          { label: 'Software Service', value: 'SOFTWARE' },
                          { label: 'Prediction Service', value: 'PREDICTION' },
                          { label: 'Analytics Service', value: 'ANALYTICS' },
                        ]
                      },
                      { 
                        type: 'select', 
                        name: 'category', 
                        label: 'Category', 
                        required: true,
                        options: [
                          { label: 'Feeding Node', value: 'FEEDING' },
                          { label: 'Thermal Node', value: 'THERMAL' },
                          { label: 'Watering Node', value: 'WATERING' },
                          { label: 'Weighting Node', value: 'WEIGHTING' },
                          { label: 'Dusting Node', value: 'DUSTING' },
                          { label: 'Prediction Service', value: 'PREDICTION' },
                          { label: 'Analytics Service', value: 'ANALYTICS' },
                          { label: 'Inventory Management', value: 'INVENTORY' },
                        ]
                      },
                      { type: 'text', name: 'unit_cost', label: 'Unit Cost', placeholder: 'Cost per unit' },
                      { 
                        type: 'select', 
                        name: 'status', 
                        label: 'Status', 
                        required: true,
                        options: [
                          { label: 'Available', value: true },
                          { label: 'Unavailable', value: false },
                        ]
                      },
                      { 
                        type: 'select', 
                        name: 'is_basic', 
                        label: 'Is Basic Resource?', 
                        required: true,
                        options: [
                          { label: 'Yes (Available to all)', value: true },
                          { label: 'No (Subscription-based)', value: false },
                        ]
                      },
                      { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Resource details...' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.resourceID })}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default RelationalMasterData;
