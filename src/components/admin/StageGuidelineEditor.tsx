import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Textarea,
  Switch,
  Grid,
  GridItem,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Card,
  CardBody,
  Divider,
  Flex,
  Spacer,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiSave, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import apiClient from '../../services/api';

interface LifecycleStage {
  stage_id?: number;
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
  guideline_id?: number;
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

interface StageGuidelineEditorProps {
  configId: number;
  stages: LifecycleStage[];
  guidelines: BreedGuideline[];
  onUpdate: () => void;
}

const StageGuidelineEditor: React.FC<StageGuidelineEditorProps> = ({
  configId,
  stages,
  guidelines,
  onUpdate,
}) => {
  const toast = useToast();
  const { isOpen: isStageModalOpen, onOpen: onStageModalOpen, onClose: onStageModalClose } = useDisclosure();
  const { isOpen: isGuidelineModalOpen, onOpen: onGuidelineModalOpen, onClose: onGuidelineModalClose } = useDisclosure();

  const [editingStage, setEditingStage] = useState<LifecycleStage | null>(null);
  const [editingGuideline, setEditingGuideline] = useState<BreedGuideline | null>(null);
  const [saving, setSaving] = useState(false);

  // Stage form state
  const [stageForm, setStageForm] = useState<Partial<LifecycleStage>>({
    breed_config: configId,
    stage_name: 'BROODING',
    start_week: 0,
    end_week: 6,
    daily_feed_per_bird: 25,
    feeding_frequency: 4,
    water_requirement: 50,
    temperature_min: 32,
    temperature_max: 35,
    humidity_min: 60,
    humidity_max: 65,
    floor_space_per_bird: 0.5,
    critical_monitoring_points: '[]',
    common_health_issues: '[]',
  });

  // Guideline form state
  const [guidelineForm, setGuidelineForm] = useState<Partial<BreedGuideline>>({
    breed_config: configId,
    guideline_type: 'FEEDING',
    title: '',
    description: '',
    applicable_from_week: 0,
    priority: 'MEDIUM',
    is_critical: false,
    is_automated: false,
    implementation_steps: '[]',
    required_resources: '[]',
    success_indicators: '[]',
    is_active: true,
  });

  const openStageModal = (stage?: LifecycleStage) => {
    if (stage) {
      setEditingStage(stage);
      setStageForm(stage);
    } else {
      setEditingStage(null);
      setStageForm({
        breed_config: configId,
        stage_name: 'BROODING',
        start_week: 0,
        end_week: 6,
        daily_feed_per_bird: 25,
        feeding_frequency: 4,
        water_requirement: 50,
        temperature_min: 32,
        temperature_max: 35,
        humidity_min: 60,
        humidity_max: 65,
        floor_space_per_bird: 0.5,
        critical_monitoring_points: '[]',
        common_health_issues: '[]',
      });
    }
    onStageModalOpen();
  };

  const openGuidelineModal = (guideline?: BreedGuideline) => {
    if (guideline) {
      setEditingGuideline(guideline);
      setGuidelineForm(guideline);
    } else {
      setEditingGuideline(null);
      setGuidelineForm({
        breed_config: configId,
        guideline_type: 'FEEDING',
        title: '',
        description: '',
        applicable_from_week: 0,
        priority: 'MEDIUM',
        is_critical: false,
        is_automated: false,
        implementation_steps: '[]',
        required_resources: '[]',
        success_indicators: '[]',
        is_active: true,
      });
    }
    onGuidelineModalOpen();
  };

  const saveStage = async () => {
    try {
      setSaving(true);
      
      if (editingStage) {
        await apiClient.patch(`/api/lifecycle-stages/${editingStage.stage_id}/`, stageForm);
        toast({
          title: 'Success',
          description: 'Lifecycle stage updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        await apiClient.post('/api/lifecycle-stages/', stageForm);
        toast({
          title: 'Success',
          description: 'Lifecycle stage created successfully',
          status: 'success',
          duration: 3000,
        });
      }
      
      onUpdate();
      onStageModalClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save stage',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const saveGuideline = async () => {
    try {
      setSaving(true);
      
      if (editingGuideline) {
        await apiClient.patch(`/api/breed-guidelines/${editingGuideline.guideline_id}/`, guidelineForm);
        toast({
          title: 'Success',
          description: 'Guideline updated successfully',
          status: 'success',
          duration: 3000,
        });
      } else {
        await apiClient.post('/api/breed-guidelines/', guidelineForm);
        toast({
          title: 'Success',
          description: 'Guideline created successfully',
          status: 'success',
          duration: 3000,
        });
      }
      
      onUpdate();
      onGuidelineModalClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save guideline',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteStage = async (stageId: number) => {
    try {
      await apiClient.delete(`/api/lifecycle-stages/${stageId}/`);
      toast({
        title: 'Success',
        description: 'Stage deleted successfully',
        status: 'success',
        duration: 3000,
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete stage',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const deleteGuideline = async (guidelineId: number) => {
    try {
      await apiClient.delete(`/api/breed-guidelines/${guidelineId}/`);
      toast({
        title: 'Success',
        description: 'Guideline deleted successfully',
        status: 'success',
        duration: 3000,
      });
      onUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete guideline',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const parseJsonField = (value: string) => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  };

  const formatJsonField = (value: string) => {
    const parsed = parseJsonField(value);
    return parsed.map((item: string, index: number) => (
      <Text key={index} fontSize="sm">• {item}</Text>
    ));
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Lifecycle Stages Section */}
      <Box>
        <Flex align="center" mb={4}>
          <Text fontSize="lg" fontWeight="semibold">Lifecycle Stages</Text>
          <Spacer />
          <Button leftIcon={<FiPlus />} size="sm" onClick={() => openStageModal()}>
            Add Stage
          </Button>
        </Flex>

        <VStack spacing={3} align="stretch">
          {stages.map((stage) => (
            <Card key={stage.stage_id}>
              <CardBody>
                <Flex align="center" mb={3}>
                  <HStack>
                    <Badge colorScheme="blue">{stage.stage_name}</Badge>
                    <Text fontWeight="medium">
                      Weeks {stage.start_week} - {stage.end_week}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {stage.daily_feed_per_bird}g feed/day
                    </Text>
                  </HStack>
                  <Spacer />
                  <HStack>
                    <IconButton
                      aria-label="Edit stage"
                      icon={<FiEdit2 />}
                      size="sm"
                      onClick={() => openStageModal(stage)}
                    />
                    <IconButton
                      aria-label="Delete stage"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => deleteStage(stage.stage_id!)}
                    />
                  </HStack>
                </Flex>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Text fontSize="sm" fontWeight="medium">Environment</Text>
                    <Text fontSize="sm">
                      Temperature: {stage.temperature_min}°C - {stage.temperature_max}°C
                    </Text>
                    <Text fontSize="sm">
                      Humidity: {stage.humidity_min}% - {stage.humidity_max}%
                    </Text>
                    <Text fontSize="sm">
                      Space: {stage.floor_space_per_bird} sq ft/bird
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" fontWeight="medium">Feeding</Text>
                    <Text fontSize="sm">
                      Feed: {stage.daily_feed_per_bird}g/day
                    </Text>
                    <Text fontSize="sm">
                      Frequency: {stage.feeding_frequency}x/day
                    </Text>
                    <Text fontSize="sm">
                      Water: {stage.water_requirement}ml/day
                    </Text>
                  </GridItem>
                </Grid>

                <Divider my={3} />

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Critical Monitoring Points</Text>
                    {formatJsonField(stage.critical_monitoring_points)}
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Common Health Issues</Text>
                    {formatJsonField(stage.common_health_issues)}
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>

      {/* Guidelines Section */}
      <Box>
        <Flex align="center" mb={4}>
          <Text fontSize="lg" fontWeight="semibold">Breed Guidelines</Text>
          <Spacer />
          <Button leftIcon={<FiPlus />} size="sm" onClick={() => openGuidelineModal()}>
            Add Guideline
          </Button>
        </Flex>

        <VStack spacing={3} align="stretch">
          {guidelines.map((guideline) => (
            <Card key={guideline.guideline_id}>
              <CardBody>
                <Flex align="center" mb={3}>
                  <HStack>
                    <Badge colorScheme={guideline.is_critical ? 'red' : 'blue'}>
                      {guideline.guideline_type}
                    </Badge>
                    <Badge colorScheme={
                      guideline.priority === 'HIGH' ? 'red' :
                      guideline.priority === 'MEDIUM' ? 'orange' : 'green'
                    }>
                      {guideline.priority}
                    </Badge>
                    {guideline.is_critical && (
                      <Badge colorScheme="red" variant="outline">
                        <FiAlertTriangle size={12} />
                        Critical
                      </Badge>
                    )}
                    {!guideline.is_active && (
                      <Badge colorScheme="gray">Inactive</Badge>
                    )}
                  </HStack>
                  <Spacer />
                  <HStack>
                    <IconButton
                      aria-label="Edit guideline"
                      icon={<FiEdit2 />}
                      size="sm"
                      onClick={() => openGuidelineModal(guideline)}
                    />
                    <IconButton
                      aria-label="Delete guideline"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => deleteGuideline(guideline.guideline_id!)}
                    />
                  </HStack>
                </Flex>

                <Text fontWeight="semibold" mb={2}>{guideline.title}</Text>
                <Text fontSize="sm" color="gray.600" mb={3}>{guideline.description}</Text>

                <Text fontSize="xs" color="gray.500" mb={3}>
                  Applicable: Week {guideline.applicable_from_week}
                  {guideline.applicable_to_week && ` - ${guideline.applicable_to_week}`}
                </Text>

                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <GridItem>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Implementation Steps</Text>
                    {formatJsonField(guideline.implementation_steps)}
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Required Resources</Text>
                    {formatJsonField(guideline.required_resources)}
                  </GridItem>
                  <GridItem>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Success Indicators</Text>
                    {formatJsonField(guideline.success_indicators)}
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>

      {/* Stage Modal */}
      <Modal isOpen={isStageModalOpen} onClose={onStageModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingStage ? 'Edit Lifecycle Stage' : 'New Lifecycle Stage'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Stage Name</FormLabel>
                    <Select
                      value={stageForm.stage_name}
                      onChange={(e) => setStageForm({ ...stageForm, stage_name: e.target.value as any })}
                    >
                      <option value="BROODING">Brooding</option>
                      <option value="GROWING">Growing</option>
                      <option value="LAYING">Laying</option>
                      <option value="FINISHING">Finishing</option>
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Week Range</FormLabel>
                    <HStack>
                      <NumberInput
                        value={stageForm.start_week}
                        onChange={(_, value) => setStageForm({ ...stageForm, start_week: value })}
                        min={0}
                        max={100}
                      >
                        <NumberInputField placeholder="Start" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text>to</Text>
                      <NumberInput
                        value={stageForm.end_week}
                        onChange={(_, value) => setStageForm({ ...stageForm, end_week: value })}
                        min={1}
                        max={100}
                      >
                        <NumberInputField placeholder="End" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </HStack>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>Daily Feed per Bird (g)</FormLabel>
                    <NumberInput
                      value={stageForm.daily_feed_per_bird}
                      onChange={(_, value) => setStageForm({ ...stageForm, daily_feed_per_bird: value })}
                      min={0}
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
                    <FormLabel>Feeding Frequency (times/day)</FormLabel>
                    <NumberInput
                      value={stageForm.feeding_frequency}
                      onChange={(_, value) => setStageForm({ ...stageForm, feeding_frequency: value })}
                      min={1}
                      max={6}
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
                    <FormLabel>Water Requirement (ml/day)</FormLabel>
                    <NumberInput
                      value={stageForm.water_requirement}
                      onChange={(_, value) => setStageForm({ ...stageForm, water_requirement: value })}
                      min={0}
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
                    <FormLabel>Floor Space per Bird (sq ft)</FormLabel>
                    <NumberInput
                      value={stageForm.floor_space_per_bird}
                      onChange={(_, value) => setStageForm({ ...stageForm, floor_space_per_bird: value })}
                      min={0}
                      step={0.1}
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
                    <FormLabel>Temperature Range (°C)</FormLabel>
                    <HStack>
                      <NumberInput
                        value={stageForm.temperature_min}
                        onChange={(_, value) => setStageForm({ ...stageForm, temperature_min: value })}
                        min={0}
                        max={50}
                      >
                        <NumberInputField placeholder="Min" />
                      </NumberInput>
                      <Text>-</Text>
                      <NumberInput
                        value={stageForm.temperature_max}
                        onChange={(_, value) => setStageForm({ ...stageForm, temperature_max: value })}
                        min={0}
                        max={50}
                      >
                        <NumberInputField placeholder="Max" />
                      </NumberInput>
                    </HStack>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>Humidity Range (%)</FormLabel>
                    <HStack>
                      <NumberInput
                        value={stageForm.humidity_min}
                        onChange={(_, value) => setStageForm({ ...stageForm, humidity_min: value })}
                        min={0}
                        max={100}
                      >
                        <NumberInputField placeholder="Min" />
                      </NumberInput>
                      <Text>-</Text>
                      <NumberInput
                        value={stageForm.humidity_max}
                        onChange={(_, value) => setStageForm({ ...stageForm, humidity_max: value })}
                        min={0}
                        max={100}
                      >
                        <NumberInputField placeholder="Max" />
                      </NumberInput>
                    </HStack>
                  </FormControl>
                </GridItem>
              </Grid>

              <FormControl>
                <FormLabel>Critical Monitoring Points (JSON array)</FormLabel>
                <Textarea
                  value={stageForm.critical_monitoring_points}
                  onChange={(e) => setStageForm({ ...stageForm, critical_monitoring_points: e.target.value })}
                  placeholder='["Temperature control", "Water access", "Feed intake"]'
                />
              </FormControl>

              <FormControl>
                <FormLabel>Common Health Issues (JSON array)</FormLabel>
                <Textarea
                  value={stageForm.common_health_issues}
                  onChange={(e) => setStageForm({ ...stageForm, common_health_issues: e.target.value })}
                  placeholder='["Respiratory issues", "Dehydration", "Hypothermia"]'
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onStageModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<FiSave />}
              onClick={saveStage}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Stage
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Guideline Modal */}
      <Modal isOpen={isGuidelineModalOpen} onClose={onGuidelineModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingGuideline ? 'Edit Breed Guideline' : 'New Breed Guideline'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Guideline Type</FormLabel>
                    <Select
                      value={guidelineForm.guideline_type}
                      onChange={(e) => setGuidelineForm({ ...guidelineForm, guideline_type: e.target.value as any })}
                    >
                      <option value="FEEDING">Feeding Guidelines</option>
                      <option value="HEALTH">Health Management</option>
                      <option value="ENVIRONMENT">Environmental Control</option>
                      <option value="BREEDING">Breeding Management</option>
                      <option value="PRODUCTION">Production Optimization</option>
                      <option value="GENERAL">General Care</option>
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      value={guidelineForm.priority}
                      onChange={(e) => setGuidelineForm({ ...guidelineForm, priority: e.target.value as any })}
                    >
                      <option value="LOW">Low Priority</option>
                      <option value="MEDIUM">Medium Priority</option>
                      <option value="HIGH">High Priority</option>
                    </Select>
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl>
                    <FormLabel>Applicable From Week</FormLabel>
                    <NumberInput
                      value={guidelineForm.applicable_from_week}
                      onChange={(_, value) => setGuidelineForm({ ...guidelineForm, applicable_from_week: value })}
                      min={0}
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
                    <FormLabel>Applicable To Week (optional)</FormLabel>
                    <NumberInput
                      value={guidelineForm.applicable_to_week || ''}
                      onChange={(_, value) => setGuidelineForm({ ...guidelineForm, applicable_to_week: value || undefined })}
                      min={0}
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

              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={guidelineForm.title}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, title: e.target.value })}
                  placeholder="Enter guideline title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={guidelineForm.description}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, description: e.target.value })}
                  placeholder="Enter detailed description"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Implementation Steps (JSON array)</FormLabel>
                <Textarea
                  value={guidelineForm.implementation_steps}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, implementation_steps: e.target.value })}
                  placeholder='["Step 1", "Step 2", "Step 3"]'
                />
              </FormControl>

              <FormControl>
                <FormLabel>Required Resources (JSON array)</FormLabel>
                <Textarea
                  value={guidelineForm.required_resources}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, required_resources: e.target.value })}
                  placeholder='["Resource 1", "Resource 2"]'
                />
              </FormControl>

              <FormControl>
                <FormLabel>Success Indicators (JSON array)</FormLabel>
                <Textarea
                  value={guidelineForm.success_indicators}
                  onChange={(e) => setGuidelineForm({ ...guidelineForm, success_indicators: e.target.value })}
                  placeholder='["Indicator 1", "Indicator 2"]'
                />
              </FormControl>

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <GridItem>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Critical</FormLabel>
                    <Switch
                      isChecked={guidelineForm.is_critical}
                      onChange={(e) => setGuidelineForm({ ...guidelineForm, is_critical: e.target.checked })}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Automated</FormLabel>
                    <Switch
                      isChecked={guidelineForm.is_automated}
                      onChange={(e) => setGuidelineForm({ ...guidelineForm, is_automated: e.target.checked })}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb={0}>Active</FormLabel>
                    <Switch
                      isChecked={guidelineForm.is_active}
                      onChange={(e) => setGuidelineForm({ ...guidelineForm, is_active: e.target.checked })}
                    />
                  </FormControl>
                </GridItem>
              </Grid>

              {guidelineForm.is_critical && (
                <Alert status="warning">
                  <AlertIcon />
                  This guideline is marked as critical and will be highlighted to farmers.
                </Alert>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGuidelineModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<FiSave />}
              onClick={saveGuideline}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Guideline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default StageGuidelineEditor;
