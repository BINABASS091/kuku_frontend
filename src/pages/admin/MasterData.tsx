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
} from '@chakra-ui/icons';
import MasterDataManager from '../../components/MasterDataManager';
import api from '../../services/api';

// Master Data Statistics Interface
interface MasterDataStats {
  breedTypes: number;
  breeds: number;
  activityTypes: number;
  conditionTypes: number;
  foodTypes: number;
  sensorTypes: number;
  recommendations: number;
  healthConditions: number;
  medications: number;
  subscriptionTypes: number;
  resources: number;
}

// Type definitions for our data
// Removed unused BreedType

type Breed = {
  id: number;
  breedID: number;
  breedName: string;
  breed_typeID: any;
  type_detail: any;
  preedphoto: string;
  activities_count: number;
  conditions_count: number;
  feeding_schedules_count: number;
  growth_records_count: number;
};

type ActivityType = {
  id: number;
  activityTypeID: number;
  activityType: string;
  total_breed_activities: number;
};

type ConditionType = {
  id: number;
  condition_typeID: number;
  conditionName: string;
  condition_unit: string;
  name: string; // duplicate field from serializer
  unit: string; // duplicate field from serializer
  breed_conditions_count: number;
  active_conditions_count: number;
};

type FoodType = {
  id: number;
  foodTypeID: number;
  name: string;
  feeding_schedules_count: number;
  breeds_using_count: number;
};

type SensorType = {
  id: number;
  sensorTypeID: number;
  name: string;
  unit: string;
  total_readings: number;
  active_devices_count: number;
  latest_reading_timestamp: string;
  avg_reading_value: number;
};

type Recommendation = {
  id: number;
  description: string;
  reco_type: string;
  context: string;
  reco_type_display: string;
  context_display: string;
  exceptions_count: number;
  anomalies_count: number;
};

type HealthCondition = {
  id: number;
  description: string;
  exceptions_count: number;
  recommendations_affected: number;
};

type Medication = {
  id: number;
  name: string;
  dosage: string;
  description: string;
};

type SubscriptionType = {
  id: number;
  name: string;
  tier: string;
  tier_display: string;
  farm_size: string;
  cost: number;
  max_hardware_nodes: number;
  max_software_services: number;
  includes_predictions: boolean;
  includes_analytics: boolean;
  active_subscriptions_count: number;
  total_revenue: number;
  average_usage: number;
};

type Resource = {
  id: number;
  name: string;
  resource_type: string;
  resource_type_display: string;
  category: string;
  category_display: string;
  unit_cost: number;
  status: boolean;
  status_display: string;
  is_basic: boolean;
  subscriptions_using_count: number;
  total_allocations: number;
};

const MasterData: React.FC = () => {
  const [stats, setStats] = useState<MasterDataStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [breedTypes, setBreedTypes] = useState<any[]>([]);
  
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchMasterDataStats();
    // Fetch breed types for dropdown
    api.get('v1/breed-types/').then((res: any) => {
      // Handle both paginated and non-paginated responses
      const breedTypesData = res.data.results || res.data || [];
      setBreedTypes(Array.isArray(breedTypesData) ? breedTypesData : []);
    }).catch((error) => {
      console.error('Error fetching breed types:', error);
      setBreedTypes([]); // Set empty array on error
    });
  }, []);

  const fetchMasterDataStats = async () => {
    try {
      setIsLoadingStats(true);
      
      // Fetch counts for each master data category
      const responses = await Promise.all([
        api.get('/breed-types/'),
        api.get('/breeds/'),
        api.get('/activity-types/'),
        api.get('/condition-types/'),
        api.get('/food-types/'),
        api.get('/sensor-types/'),
        api.get('/recommendations/'),
        api.get('/health-conditions/'),
        api.get('/medications/'),
        api.get('/subscription-types/'),
        api.get('/resources/'),
      ]);

      const [
        breedTypesRes, breedsRes, activityTypesRes, conditionTypesRes,
        foodTypesRes, sensorTypesRes, recommendationsRes, healthConditionsRes,
        medicationsRes, subscriptionTypesRes, resourcesRes
      ] = responses;

      setStats({
        breedTypes: (breedTypesRes.data.results || breedTypesRes.data || []).length,
        breeds: (breedsRes.data.results || breedsRes.data || []).length,
        activityTypes: (activityTypesRes.data.results || activityTypesRes.data || []).length,
        conditionTypes: (conditionTypesRes.data.results || conditionTypesRes.data || []).length,
        foodTypes: (foodTypesRes.data.results || foodTypesRes.data || []).length,
        sensorTypes: (sensorTypesRes.data.results || sensorTypesRes.data || []).length,
        recommendations: (recommendationsRes.data.results || recommendationsRes.data || []).length,
        healthConditions: (healthConditionsRes.data.results || healthConditionsRes.data || []).length,
        medications: (medicationsRes.data.results || medicationsRes.data || []).length,
        subscriptionTypes: (subscriptionTypesRes.data.results || subscriptionTypesRes.data || []).length,
        resources: (resourcesRes.data.results || resourcesRes.data || []).length,
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
    helpText 
  }: { 
    label: string; 
    value: number; 
    icon: any; 
    color?: string; 
    helpText?: string; 
  }) => (
    <Card bg={cardBg} borderColor={borderColor}>
      <CardBody>
        <Stat>
          <HStack>
            <Icon as={icon} boxSize={6} color={`${color}.500`} />
            <Box>
              <StatLabel fontSize="sm">{label}</StatLabel>
              <StatNumber fontSize="2xl">{value}</StatNumber>
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
          <Text>Loading Master Data...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box w="100%" minH="100vh" bg={bgColor} p={6}>
      <VStack spacing={6} align="stretch">
        
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>Master Data Management</Heading>
          <Text color="gray.600" fontSize="md">
            Manage system configuration data including breeds, types, knowledge base, and subscriptions
          </Text>
        </Box>

        {/* Statistics Dashboard */}
        {stats && (
          <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
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
            <StatCard
              label="Recommendations"
              value={stats.recommendations}
              icon={InfoIcon}
              color="blue"
              helpText="Knowledge base"
            />
            <StatCard
              label="Health Conditions"
              value={stats.healthConditions}
              icon={WarningIcon}
              color="red"
              helpText="Medical records"
            />
            <StatCard
              label="Medications"
              value={stats.medications}
              icon={CheckCircleIcon}
              color="green"
              helpText="Drug database"
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
              color="orange"
              helpText="Service resources"
            />
          </SimpleGrid>
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
              <TabList>
                <Tab>Breed Types</Tab>
                <Tab>Breeds</Tab>
                <Tab>Activity Types</Tab>
                <Tab>Condition Types</Tab>
                <Tab>Food Types</Tab>
                <Tab>Sensor Types</Tab>
                <Tab>Recommendations</Tab>
                <Tab>Health Conditions</Tab>
                <Tab>Medications</Tab>
                <Tab>Subscription Types</Tab>
                <Tab>Resources</Tab>
              </TabList>

              <TabPanels>
                {/* Breed Types Tab */}
                <TabPanel>
                  <MasterDataManager<Breed>
                    title="Breeds"
                    endpoint="breeds/"
                    columns={[
                      { key: 'breedName', header: 'Breed Name' },
                      { 
                        key: 'type_detail', 
                        header: 'Type',
                        render: (row) => row.type_detail?.breedType || 'N/A'
                      },
                      { 
                        key: 'activities_count', 
                        header: 'Activities',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="subtle">
                            {row.activities_count}
                          </Badge>
                        )
                      },
                      { 
                        key: 'conditions_count', 
                        header: 'Conditions',
                        render: (row) => (
                          <Badge colorScheme="orange" variant="subtle">
                            {row.conditions_count}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'breedName', label: 'Breed Name', required: true, placeholder: 'e.g., Rhode Island Red' },
                      {
                        type: 'select',
                        name: 'breed_typeID',
                        label: 'Breed Type',
                        required: true,
                        options: Array.isArray(breedTypes) ? breedTypes.map((bt: any) => ({
                          label: bt.breedType,
                          value: bt.breed_typeID
                        })) : [],
                        defaultValue: (Array.isArray(breedTypes) && breedTypes.length === 1)
                          ? breedTypes[0].breed_typeID
                          : undefined
                      },
                      { type: 'text', name: 'preedphoto', label: 'Photo URL', placeholder: 'breed_photo.jpg' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.breedID })}
                    normalizeIn={(formData) => ({
                      ...formData,
                      breed_typeID: formData.breed_typeID ? parseInt(formData.breed_typeID) : undefined,
                      preedphoto: formData.preedphoto || 'preedphoto.png'
                    })}
                  />
                </TabPanel>

                {/* Activity Types Tab */}
                <TabPanel>
                  <MasterDataManager<ActivityType>
                    title="Activity Types"
                    endpoint="activity-types/"
                    columns={[
                      { key: 'activityType', header: 'Activity Type' },
                      { 
                        key: 'total_breed_activities', 
                        header: 'Used By Breeds',
                        render: (row) => (
                          <Badge colorScheme="green" variant="subtle">
                            {row.total_breed_activities}
                          </Badge>
                        )
                      },
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
                    endpoint="condition-types/"
                    columns={[
                      { key: 'conditionName', header: 'Condition Name' },
                      { key: 'condition_unit', header: 'Unit' },
                      { 
                        key: 'breed_conditions_count', 
                        header: 'Total Conditions',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="subtle">
                            {row.breed_conditions_count}
                          </Badge>
                        )
                      },
                      { 
                        key: 'active_conditions_count', 
                        header: 'Active',
                        render: (row) => (
                          <Badge colorScheme="green" variant="subtle">
                            {row.active_conditions_count}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'conditionName', label: 'Condition Name', required: true, placeholder: 'e.g., Temperature, Humidity' },
                      { type: 'text', name: 'condition_unit', label: 'Unit', required: true, placeholder: 'e.g., °C, %' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.condition_typeID })}
                    normalizeIn={(formData) => ({
                      conditionName: formData.conditionName,
                      condition_unit: formData.condition_unit,
                    })}
                  />
                </TabPanel>

                {/* Food Types Tab */}
                <TabPanel>
                  <MasterDataManager<FoodType>
                    title="Food Types"
                    endpoint="food-types/"
                    columns={[
                      { key: 'name', header: 'Food Type' },
                      { 
                        key: 'feeding_schedules_count', 
                        header: 'Schedules',
                        render: (row) => (
                          <Badge colorScheme="teal" variant="subtle">
                            {row.feeding_schedules_count}
                          </Badge>
                        )
                      },
                      { 
                        key: 'breeds_using_count', 
                        header: 'Breeds Using',
                        render: (row) => (
                          <Badge colorScheme="purple" variant="subtle">
                            {row.breeds_using_count}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'name', label: 'Food Type', required: true, placeholder: 'e.g., Starter Feed, Grower Feed' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.foodTypeID })}
                  />
                </TabPanel>

                {/* Sensor Types Tab */}
                <TabPanel>
                  <MasterDataManager<SensorType>
                    title="Sensor Types"
                    endpoint="sensor-types/"
                    columns={[
                      { key: 'name', header: 'Sensor Name' },
                      { key: 'unit', header: 'Unit' },
                      { 
                        key: 'total_readings', 
                        header: 'Total Readings',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="subtle">
                            {row.total_readings}
                          </Badge>
                        )
                      },
                      { 
                        key: 'active_devices_count', 
                        header: 'Active Devices',
                        render: (row) => (
                          <Badge colorScheme="green" variant="subtle">
                            {row.active_devices_count}
                          </Badge>
                        )
                      },
                      { 
                        key: 'avg_reading_value', 
                        header: 'Avg Value',
                        render: (row) => `${row.avg_reading_value} ${row.unit}`
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'name', label: 'Sensor Name', required: true, placeholder: 'e.g., Temperature, Humidity' },
                      { type: 'text', name: 'unit', label: 'Unit', required: true, placeholder: 'e.g., °C, %' },
                    ]}
                    normalizeOut={(item) => ({ ...item, id: item.sensorTypeID })}
                  />
                </TabPanel>

                {/* Recommendations Tab */}
                <TabPanel>
                  <MasterDataManager<Recommendation>
                    title="Recommendations"
                    endpoint="recommendations/"
                    columns={[
                      { key: 'description', header: 'Description' },
                      { 
                        key: 'reco_type_display', 
                        header: 'Type',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="outline">
                            {row.reco_type_display}
                          </Badge>
                        )
                      },
                      { 
                        key: 'context_display', 
                        header: 'Context',
                        render: (row) => (
                          <Badge colorScheme="purple" variant="outline">
                            {row.context_display}
                          </Badge>
                        )
                      },
                      { 
                        key: 'exceptions_count', 
                        header: 'Exceptions',
                        render: (row) => (
                          <Badge colorScheme="orange" variant="subtle">
                            {row.exceptions_count}
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

                {/* Health Conditions Tab */}
                <TabPanel>
                  <MasterDataManager<HealthCondition>
                    title="Health Conditions"
                    endpoint="health-conditions/"
                    columns={[
                      { key: 'description', header: 'Description' },
                      { 
                        key: 'exceptions_count', 
                        header: 'Exceptions',
                        render: (row) => (
                          <Badge colorScheme="orange" variant="subtle">
                            {row.exceptions_count}
                          </Badge>
                        )
                      },
                      { 
                        key: 'recommendations_affected', 
                        header: 'Recommendations Affected',
                        render: (row) => (
                          <Badge colorScheme="red" variant="subtle">
                            {row.recommendations_affected}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'description', label: 'Description', required: true, placeholder: 'e.g., Diabetes, Hypertension' },
                    ]}
                  />
                </TabPanel>

                {/* Medications Tab */}
                <TabPanel>
                  <MasterDataManager<Medication>
                    title="Medications"
                    endpoint="medications/"
                    columns={[
                      { key: 'name', header: 'Name' },
                      { key: 'dosage', header: 'Dosage' },
                      { key: 'description', header: 'Description' },
                    ]}
                    fields={[
                      { type: 'text', name: 'name', label: 'Name', required: true, placeholder: 'Medication name' },
                      { type: 'text', name: 'dosage', label: 'Dosage', required: true, placeholder: 'e.g., 500mg twice daily' },
                      { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Usage instructions...' },
                    ]}
                  />
                </TabPanel>

                {/* Subscription Types Tab */}
                <TabPanel>
                  <MasterDataManager<SubscriptionType>
                    title="Subscription Types"
                    endpoint="subscription-types/"
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
                            {row.tier_display}
                          </Badge>
                        )
                      },
                      { key: 'farm_size', header: 'Farm Size' },
                      { 
                        key: 'cost', 
                        header: 'Cost',
                        render: (row) => `$${row.cost}`
                      },
                      { 
                        key: 'active_subscriptions_count', 
                        header: 'Active Subscriptions',
                        render: (row) => (
                          <Badge colorScheme="green" variant="subtle">
                            {row.active_subscriptions_count}
                          </Badge>
                        )
                      },
                      { 
                        key: 'total_revenue', 
                        header: 'Revenue',
                        render: (row) => `$${row.total_revenue.toFixed(2)}`
                      },
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
                  />
                </TabPanel>

                {/* Resources Tab */}
                <TabPanel>
                  <MasterDataManager<Resource>
                    title="Resources"
                    endpoint="resources/"
                    columns={[
                      { key: 'name', header: 'Name' },
                      { 
                        key: 'resource_type_display', 
                        header: 'Type',
                        render: (row) => (
                          <Badge colorScheme="blue" variant="outline">
                            {row.resource_type_display}
                          </Badge>
                        )
                      },
                      { 
                        key: 'category_display', 
                        header: 'Category',
                        render: (row) => (
                          <Badge colorScheme="teal" variant="outline">
                            {row.category_display}
                          </Badge>
                        )
                      },
                      { 
                        key: 'unit_cost', 
                        header: 'Unit Cost',
                        render: (row) => `$${row.unit_cost}`
                      },
                      { 
                        key: 'status_display', 
                        header: 'Status',
                        render: (row) => (
                          <Badge 
                            colorScheme={row.status ? 'green' : 'red'} 
                            variant="subtle"
                          >
                            {row.status_display}
                          </Badge>
                        )
                      },
                      { 
                        key: 'subscriptions_using_count', 
                        header: 'Subscriptions Using',
                        render: (row) => (
                          <Badge colorScheme="purple" variant="subtle">
                            {row.subscriptions_using_count}
                          </Badge>
                        )
                      },
                    ]}
                    fields={[
                      { type: 'text', name: 'name', label: 'Name', required: true, placeholder: 'Resource name' },
                      { type: 'text', name: 'unit_cost', label: 'Unit Cost', placeholder: 'Cost per unit' },
                      { type: 'textarea', name: 'description', label: 'Description', placeholder: 'Resource details...' },
                    ]}
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

export default MasterData;