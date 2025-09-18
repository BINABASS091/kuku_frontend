import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  FormHelperText,
  Textarea,
  Switch,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Badge,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Spinner,
  Center,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import {
  FiPlus,
  FiEdit2,
  FiSave,
  FiRefreshCw,
  FiDownload,
  FiUpload,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/api';
import StageGuidelineEditor from './StageGuidelineEditor';

interface BreedConfiguration {
  configuration_id: number;
  breed: number;
  breed_name?: string;
  purpose: 'EGGS' | 'MEAT' | 'DUAL';
  brooding_end_week: number;
  growing_end_week: number;
  laying_start_week?: number;
  slaughter_week?: number;
  expected_laying_rate?: number;
  target_weight_at_slaughter?: number;
  optimal_temperature_min: number;
  optimal_temperature_max: number;
  optimal_humidity_min: number;
  optimal_humidity_max: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LifecycleStage {
  stage_id: number;
  breed_config: number;
  stage_name: 'BROODING' | 'GROWING' | 'LAYING' | 'FINISHING';
  start_week: number;
  end_week: number;
  daily_feed_per_bird: number;
  feeding_frequency: number;
  water_requirement: number;
  temperature_min: number;
  temperature_max: number;
  humidity_min: number;
  humidity_max: number;
  floor_space_per_bird: number;
  critical_monitoring_points: string;
  common_health_issues: string;
}

interface BreedGuideline {
  guideline_id: number;
  breed_config: number;
  stage?: number;
  guideline_type: 'FEEDING' | 'HEALTH' | 'ENVIRONMENT' | 'BREEDING' | 'PRODUCTION' | 'GENERAL';
  title: string;
  description: string;
  applicable_from_week: number;
  applicable_to_week?: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  is_critical: boolean;
  is_automated: boolean;
  implementation_steps: string;
  required_resources: string;
  success_indicators: string;
  is_active: boolean;
}

interface Breed {
  breedID: number;
  breedName: string;
  breed_typeID: number;
}

const BreedConfigurationManager: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isImportOpen, onOpen: onImportOpen, onClose: onImportClose } = useDisclosure();

  // State management
  const [configurations, setConfigurations] = useState<BreedConfiguration[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<BreedConfiguration | null>(null);
  const [lifecycleStages, setLifecycleStages] = useState<LifecycleStage[]>([]);
  const [guidelines, setGuidelines] = useState<BreedGuideline[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [importData, setImportData] = useState('');

  // Form state for configuration
  const [configForm, setConfigForm] = useState<Partial<BreedConfiguration>>({
    purpose: 'EGGS',
    brooding_end_week: 6,
    growing_end_week: 16,
    laying_start_week: 17,
    expected_laying_rate: 85,
    optimal_temperature_min: 18,
    optimal_temperature_max: 24,
    optimal_humidity_min: 60,
    optimal_humidity_max: 70,
    is_active: true,
  });

  // Load initial data
  useEffect(() => {
    loadConfigurations();
    loadBreeds();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/breed-configurations/');
      setConfigurations(response.data.results || response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load breed configurations',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBreeds = async () => {
    try {
      const response = await apiClient.get('/breeds/');
      setBreeds(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to load breeds:', error);
    }
  };

  const loadConfigurationDetails = async (configId: number) => {
    try {
      setLoading(true);
      
      // Load configuration details with nested stages and guidelines
      const configResponse = await apiClient.get(`/breed-configurations/${configId}/`);
      const configData = configResponse.data;
      
      setSelectedConfig(configData);
      setConfigForm(configData);
      
      // Extract nested stages and guidelines from the configuration response
      setLifecycleStages(configData.stages || []);
      setGuidelines(configData.guidelines || []);
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load configuration details',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };  const saveConfiguration = async () => {
    try {
      setSaving(true);
      
      if (selectedConfig) {
        // Update existing configuration
        await apiClient.patch(`/breed-configurations/${selectedConfig.configuration_id}/`, configForm);
        toast({
          title: 'Success',
          description: 'Configuration updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        // Create new configuration
        const response = await apiClient.post('/breed-configurations/', configForm);
        setSelectedConfig(response.data);
        toast({
          title: 'Success',
          description: 'Configuration created successfully',
          status: 'success',
          duration: 3000,
        });
      }
      
      loadConfigurations();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save configuration',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const resetToDefault = async (configId: number) => {
    try {
      setSaving(true);
      await apiClient.post(`/breed-configurations/${configId}/reset_to_default/`);
      
      toast({
        title: 'Success',
        description: 'Configuration reset to defaults successfully',
        status: 'success',
        duration: 3000,
      });
      
      // Reload data
      loadConfigurations();
      if (selectedConfig?.configuration_id === configId) {
        loadConfigurationDetails(configId);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to reset configuration',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const exportConfiguration = async (configId: number) => {
    try {
      const response = await apiClient.get(`/breed-configurations/${configId}/export_configuration/`);
      const { export_data, filename } = response.data;
      
      // Create and download file
      const blob = new Blob([JSON.stringify(export_data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Configuration exported successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export configuration',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const importConfiguration = async () => {
    try {
      setSaving(true);
      const parsedData = JSON.parse(importData);
      
      await apiClient.post('/breed-configurations/import_configuration/', {
        import_data: parsedData
      });
      
      toast({
        title: 'Success',
        description: 'Configuration imported successfully',
        status: 'success',
        duration: 3000,
      });
      
      loadConfigurations();
      onImportClose();
      setImportData('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to import configuration',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const createNewConfiguration = () => {
    setSelectedConfig(null);
    setConfigForm({
      purpose: 'EGGS',
      brooding_end_week: 6,
      growing_end_week: 16,
      laying_start_week: 17,
      expected_laying_rate: 85,
      optimal_temperature_min: 18,
      optimal_temperature_max: 24,
      optimal_humidity_min: 60,
      optimal_humidity_max: 70,
      is_active: true,
    });
    setLifecycleStages([]);
    setGuidelines([]);
    onModalOpen();
  };

  const renderConfigurationForm = () => (
    <VStack spacing={6} align="stretch">
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>Breed</FormLabel>
            <Select
              value={configForm.breed || ''}
              onChange={(e) => setConfigForm({ ...configForm, breed: parseInt(e.target.value) })}
            >
              <option value="">Select Breed</option>
              {breeds.map((breed) => (
                <option key={breed.breedID} value={breed.breedID}>
                  {breed.breedName}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>Purpose</FormLabel>
            <Select
              value={configForm.purpose}
              onChange={(e) => setConfigForm({ ...configForm, purpose: e.target.value as any })}
            >
              <option value="EGGS">Egg Production</option>
              <option value="MEAT">Meat Production</option>
              <option value="DUAL">Dual Purpose</option>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Brooding End Week</FormLabel>
            <NumberInput
              value={configForm.brooding_end_week}
              onChange={(_, value) => setConfigForm({ ...configForm, brooding_end_week: value })}
              min={1}
              max={12}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Growing End Week</FormLabel>
            <NumberInput
              value={configForm.growing_end_week}
              onChange={(_, value) => setConfigForm({ ...configForm, growing_end_week: value })}
              min={7}
              max={24}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>

        {configForm.purpose === 'EGGS' && (
          <>
            <GridItem>
              <FormControl>
                <FormLabel>Laying Start Week</FormLabel>
                <NumberInput
                  value={configForm.laying_start_week}
                  onChange={(_, value) => setConfigForm({ ...configForm, laying_start_week: value })}
                  min={16}
                  max={30}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Expected Laying Rate (%)</FormLabel>
                <NumberInput
                  value={configForm.expected_laying_rate}
                  onChange={(_, value) => setConfigForm({ ...configForm, expected_laying_rate: value })}
                  min={0}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
          </>
        )}

        {configForm.purpose === 'MEAT' && (
          <>
            <GridItem>
              <FormControl>
                <FormLabel>Slaughter Week</FormLabel>
                <NumberInput
                  value={configForm.slaughter_week}
                  onChange={(_, value) => setConfigForm({ ...configForm, slaughter_week: value })}
                  min={6}
                  max={20}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Target Weight at Slaughter (g)</FormLabel>
                <NumberInput
                  value={configForm.target_weight_at_slaughter}
                  onChange={(_, value) => setConfigForm({ ...configForm, target_weight_at_slaughter: value })}
                  min={1000}
                  max={5000}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>
          </>
        )}
      </Grid>

      <Divider />

      <Heading size="md">Environmental Parameters</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl>
            <FormLabel>Min Temperature (°C)</FormLabel>
            <NumberInput
              value={configForm.optimal_temperature_min}
              onChange={(_, value) => setConfigForm({ ...configForm, optimal_temperature_min: value })}
              min={5}
              max={40}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Max Temperature (°C)</FormLabel>
            <NumberInput
              value={configForm.optimal_temperature_max}
              onChange={(_, value) => setConfigForm({ ...configForm, optimal_temperature_max: value })}
              min={10}
              max={45}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Min Humidity (%)</FormLabel>
            <NumberInput
              value={configForm.optimal_humidity_min}
              onChange={(_, value) => setConfigForm({ ...configForm, optimal_humidity_min: value })}
              min={30}
              max={90}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl>
            <FormLabel>Max Humidity (%)</FormLabel>
            <NumberInput
              value={configForm.optimal_humidity_max}
              onChange={(_, value) => setConfigForm({ ...configForm, optimal_humidity_max: value })}
              min={40}
              max={95}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </GridItem>
      </Grid>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb={0}>Active Configuration</FormLabel>
        <Switch
          isChecked={configForm.is_active}
          onChange={(e) => setConfigForm({ ...configForm, is_active: e.target.checked })}
        />
      </FormControl>
    </VStack>
  );

  if (!user?.is_staff) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>You need admin privileges to access this page.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex align="center">
          <Heading size="lg">Breed Configuration Manager</Heading>
          <Spacer />
          <HStack>
            <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={createNewConfiguration}>
              New Configuration
            </Button>
            <Button leftIcon={<FiUpload />} variant="outline" onClick={onImportOpen}>
              Import
            </Button>
          </HStack>
        </Flex>

        {/* Configurations List */}
        <Card>
          <CardHeader>
            <Heading size="md">Existing Configurations</Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Center py={8}>
                <Spinner size="lg" />
              </Center>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Breed Name</Th>
                      <Th>Purpose</Th>
                      <Th>Status</Th>
                      <Th>Last Updated</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {configurations.map((config) => (
                      <Tr key={config.configuration_id}>
                        <Td>{config.breed_name}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              config.purpose === 'EGGS' ? 'orange' :
                              config.purpose === 'MEAT' ? 'red' : 'purple'
                            }
                          >
                            {config.purpose}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={config.is_active ? 'green' : 'gray'}>
                            {config.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td>{new Date(config.updated_at).toLocaleDateString()}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              aria-label="Edit"
                              icon={<FiEdit2 />}
                              size="sm"
                              onClick={() => {
                                loadConfigurationDetails(config.configuration_id);
                                onModalOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Reset to Default"
                              icon={<FiRefreshCw />}
                              size="sm"
                              colorScheme="orange"
                              onClick={() => resetToDefault(config.configuration_id)}
                            />
                            <IconButton
                              aria-label="Export"
                              icon={<FiDownload />}
                              size="sm"
                              colorScheme="green"
                              onClick={() => exportConfiguration(config.configuration_id)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </CardBody>
        </Card>
      </VStack>

      {/* Configuration Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            {selectedConfig ? 'Edit Configuration' : 'New Configuration'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>Basic Configuration</Tab>
                <Tab>Stages & Guidelines</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {renderConfigurationForm()}
                </TabPanel>

                <TabPanel>
                  <StageGuidelineEditor
                    configId={selectedConfig?.configuration_id || 0}
                    stages={lifecycleStages}
                    guidelines={guidelines}
                    onUpdate={() => {
                      if (selectedConfig) {
                        loadConfigurationDetails(selectedConfig.configuration_id);
                      }
                    }}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<FiSave />}
              onClick={saveConfiguration}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Configuration
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={isImportOpen} onClose={onImportClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Configuration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Configuration JSON</FormLabel>
                <Textarea
                  placeholder="Paste exported configuration JSON here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={15}
                  fontFamily="mono"
                />
                <FormHelperText>
                  Paste the JSON content from an exported configuration file.
                </FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onImportClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<FiUpload />}
              onClick={importConfiguration}
              isLoading={saving}
              loadingText="Importing..."
              isDisabled={!importData.trim()}
            >
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BreedConfigurationManager;
