
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Badge,
  Button,
  Flex,
  useColorModeValue,
  Icon,
  Grid,
  GridItem,
  HStack,
  VStack,
  Tooltip,
  useToast,
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
  Select,
} from '@chakra-ui/react';
import { FiMapPin, FiLayers, FiActivity, FiSettings, FiEye, FiPlus, FiBarChart, FiTrendingUp, FiAlertTriangle, FiClock } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { farmAPI } from '../services/api';
import FarmerLayout from '../layouts/FarmerLayout';
import { useNavigate } from 'react-router-dom';


const MyFarmsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  // Modal state management
  const { isOpen: isAddFarmModalOpen, onOpen: onAddFarmModalOpen, onClose: onAddFarmModalClose } = useDisclosure();
  
  // Form state for Add Farm modal
  const [farmForm, setFarmForm] = useState({
    name: '',
    location: '',
    farmSize: '',
    status: 'active',
  });

  // Add Farm mutation
  const addFarmMutation = useMutation(
    (data: any) => {
      console.log('DEBUG: Creating farm with data:', data);
      return farmAPI.create({
        farmName: data.name,
        location: data.location,
        farmSize: data.farmSize,
        status: data.status,
      });
    },
    {
      onSuccess: (response) => {
        console.log('DEBUG: Farm created successfully:', response);
        toast({
          title: t('farmCreated'),
          description: t('farmCreatedSuccessfully'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setFarmForm({ name: '', location: '', farmSize: '', status: 'active' });
        queryClient.invalidateQueries(['myFarms']);
        onAddFarmModalClose();
      },
      onError: (err: any) => {
        console.error('DEBUG: Farm creation error:', err);
        toast({
          title: t('error'),
          description: err?.message || t('failedToCreateFarm'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  // Handle form submission
  const handleFarmSubmit = () => {
    addFarmMutation.mutate(farmForm);
  };
  
  // Fetch only farms for the logged-in farmer
  const { data, isLoading, isError, error } = useQuery(['myFarms'], () => farmAPI.list(), {
    onSuccess: (data) => {
      console.log('DEBUG: Farms API response:', data);
      console.log('DEBUG: Number of farms:', data?.results?.length || data?.length || 0);
    },
    onError: (error) => {
      console.error('DEBUG: Farms API error:', error);
    }
  });
  const farms = data?.results || data || [];

  // All color mode values at top level to avoid hook order violations
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');
  const statBg = useColorModeValue('gray.50', 'gray.700');
  const blueHoverBg = useColorModeValue('blue.50', 'blue.900');
  const greenHoverBg = useColorModeValue('green.50', 'green.900');
  const purpleHoverBg = useColorModeValue('purple.50', 'purple.900');
  const orangeHoverBg = useColorModeValue('orange.50', 'orange.900');

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'partial': return 'yellow';
      case 'inactive': return 'red';
      case 'setup required': return 'orange';
      default: return 'gray';
    }
  };

  // Helper function to get role color
  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'OWNER': return 'purple';
      case 'MANAGER': return 'blue';
      case 'WORKER': return 'teal';
      default: return 'gray';
    }
  };

  // Check if user can manage farm (Owner or Manager)
  const canManage = (farm: any) => {
    const role = farm.myRole?.toUpperCase();
    return role === 'OWNER' || role === 'MANAGER';
  };

  // Check if user can perform operations (not just a Worker)
  const canOperate = (farm: any) => {
    const role = farm.myRole?.toUpperCase();
    return role === 'OWNER' || role === 'MANAGER' || role === 'WORKER';
  };

  // Quick action handlers
  const handleQuickAction = (action: string, farm: any) => {
    if (!canOperate(farm)) {
      toast({
        title: t('accessDenied'),
        description: t('noPermissionToPerformAction'),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    switch (action) {
      case 'batches':
        navigate(`/farmer/batches?farmId=${farm.farmID}`);
        break;
      case 'addBatch':
        navigate(`/farmer/batches/add?farmId=${farm.farmID}`);
        break;
      case 'tasks':
        navigate(`/farmer/tasks?farmId=${farm.farmID}`);
        break;
      case 'analytics':
        navigate(`/farmer/analytics?farmId=${farm.farmID}`);
        break;
      case 'health':
        navigate(`/farmer/health?farmId=${farm.farmID}`);
        break;
      default:
        break;
    }
  };

  const EmptyState = () => (
    <Box textAlign="center" py={10}>
      <Icon as={FiPlus} w={16} h={16} color="gray.300" mb={4} />
      <Heading size="md" color="gray.500" mb={2}>{t('noFarmsYet')}</Heading>
      <Text color="gray.400" mb={6}>{t('startPoultryJourney')}</Text>
      <Button 
        colorScheme="teal" 
        leftIcon={<FiPlus />} 
        onClick={onAddFarmModalOpen}
      >
        {t('addFirstFarm')}
      </Button>
    </Box>
  );

  return (
    <FarmerLayout>
      <Box px={{ base: 4, md: 8 }} py={8}>
        <Flex align="center" justify="space-between" mb={8} flexWrap="wrap" gap={4}>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.700">{t('myFarms')}</Heading>
            <Text color="gray.500">{t('manageMonitorPoultryOperations')}</Text>
          </VStack>
          <Button 
            colorScheme="teal" 
            variant="solid" 
            size="md" 
            leftIcon={<FiPlus />}
            onClick={onAddFarmModalOpen}
            shadow="md"
          >
            {t('addNewFarm')}
          </Button>
        </Flex>

        {isLoading && (
          <Flex justify="center" py={10}>
            <Spinner size="lg" color="teal.500" />
          </Flex>
        )}

        {isError && (
          <Alert status="error" mb={6} borderRadius="lg">
            <AlertIcon />
            {error instanceof Error ? error.message : t('failedToLoadFarms')}
          </Alert>
        )}

        {!isLoading && farms.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Farm Summary Stats */}
            {farms.length > 0 && (
              <Box mb={6} p={4} bg={cardBg} borderRadius="lg" shadow="sm">
                <Text fontSize="sm" color="gray.600" mb={2}>{t('yourOperationOverview')}</Text>
                <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={4}>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                      {farms.length}
                    </Text>
                    <Text fontSize="xs" color="gray.500">{t('totalFarms')}</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                      {farms.reduce((sum: number, farm: any) => sum + (farm.total_devices || 0), 0)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">{t('totalDevices')}</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="green.600">
                      {farms.reduce((sum: number, farm: any) => sum + (farm.active_batches || 0), 0)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">{t('activeBatches')}</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                      {farms.reduce((sum: number, farm: any) => sum + (farm.total_birds || 0), 0)}
                    </Text>
                    <Text fontSize="xs" color="gray.500">{t('totalBirds')}</Text>
                  </Box>
                </Grid>
              </Box>
            )}

            {/* Farm Cards Grid */}
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
            {farms.map((farm: any) => (
              <Box
                key={farm.farmID}
                bg={cardBg}
                boxShadow={cardShadow}
                borderRadius="xl"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
                borderWidth={1}
                borderColor="gray.200"
              >
                {/* Header */}
                <Box p={6} pb={4}>
                  <HStack justify="space-between" align="start" mb={3}>
                    <VStack align="start" spacing={1} flex={1}>
                      <Heading size="md" color="gray.700" noOfLines={1}>
                        {farm.farmName}
                      </Heading>
                      <HStack spacing={2}>
                        <Badge 
                          colorScheme={getStatusColor(farm.farm_status)} 
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {farm.farm_status || t('unknown')}
                        </Badge>
                        {farm.myRole && (
                          <Badge 
                            colorScheme={getRoleColor(farm.myRole)} 
                            variant="outline"
                            px={2}
                            py={1}
                            borderRadius="md"
                          >
                            {farm.myRole}
                          </Badge>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>

                  {/* Farm Info */}
                  <VStack align="start" spacing={2} mb={4}>
                    <HStack color="gray.600" fontSize="sm">
                      <Icon as={FiMapPin} />
                      <Text noOfLines={1}>{farm.location || t('locationNotSet')}</Text>
                    </HStack>
                    <HStack color="gray.600" fontSize="sm">
                      <Icon as={FiLayers} />
                      <Text>{t('size')}: {farm.farmSize || t('notSpecified')}</Text>
                    </HStack>
                  </VStack>

                  {/* Stats Grid */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={3} mb={4}>
                    <GridItem>
                      <Tooltip label={t('devicesStatusTooltip', { active: farm.active_devices || 0, total: farm.total_devices || 0 })} hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => handleQuickAction('health', farm)}
                          _hover={{ bg: blueHoverBg }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>{t('devices').toUpperCase()}</Text>
                          <Text fontSize="lg" fontWeight="bold" color="blue.600">
                            {farm.active_devices || 0}/{farm.total_devices || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.total_devices === 0 ? t('setupNeeded') : 
                             farm.active_devices === farm.total_devices ? t('allOnline') : 
                             t('someOffline')}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                    <GridItem>
                      <Tooltip label={t('batchesStatusTooltip', { active: farm.active_batches || 0, total: farm.total_batches || 0 })} hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => handleQuickAction('batches', farm)}
                          _hover={{ bg: greenHoverBg }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>{t('batches').toUpperCase()}</Text>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            {farm.active_batches || 0}/{farm.total_batches || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.total_batches === 0 ? t('noBatches') : 
                             farm.active_batches > 0 ? t('productionActive') : 
                             t('allCompleted')}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                    <GridItem>
                      <Tooltip label={t('totalBirdsAcrossActiveBatches')} hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => handleQuickAction('analytics', farm)}
                          _hover={{ bg: purpleHoverBg }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>{t('totalBirds').toUpperCase()}</Text>
                          <Text fontSize="lg" fontWeight="bold" color="purple.600">
                            {farm.total_birds || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.total_birds === 0 ? t('noStock') : 
                             farm.total_birds > 1000 ? t('largeOperation') : 
                             t('smallMedium')}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                    <GridItem>
                      <Tooltip label={t('farmTeamMembersAndRoles')} hasArrow>
                        <Box 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md" 
                          textAlign="center"
                          cursor="pointer"
                          onClick={() => navigate(`/farmer/farms/${farm.farmID}/team`)}
                          _hover={{ bg: orangeHoverBg }}
                          transition="background 0.2s"
                        >
                          <Text fontSize="xs" color="gray.500" mb={1}>{t('team').toUpperCase()}</Text>
                          <Text fontSize="lg" fontWeight="bold" color="orange.600">
                            {farm.memberships?.length || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.400">
                            {farm.memberships?.length === 1 ? t('soloOperation') : 
                             farm.memberships?.length > 3 ? t('largeTeam') : 
                             t('smallTeam')}
                          </Text>
                        </Box>
                      </Tooltip>
                    </GridItem>
                  </Grid>
                </Box>

                {/* Actions */}
                <Box p={4} pt={0}>
                  {/* Primary Actions */}
                  <HStack spacing={2} mb={3}>
                    <Button 
                      size="sm" 
                      colorScheme="teal" 
                      variant="outline" 
                      leftIcon={<FiEye />}
                      onClick={() => navigate(`/farmer/farms/${farm.farmID}`)}
                      flex={1}
                    >
                      {t('viewDetails')}
                    </Button>
                    <Tooltip 
                      label={!canManage(farm) ? t('onlyOwnersManagersCanEditTooltip') : ""} 
                      hasArrow
                    >
                      <Button 
                        size="sm" 
                        colorScheme="blue" 
                        variant={canManage(farm) ? "solid" : "outline"}
                        leftIcon={<FiSettings />}
                        onClick={() => {
                          if (canManage(farm)) {
                            navigate(`/farmer/farms/${farm.farmID}/manage`);
                          } else {
                            toast({
                              title: t('accessDenied'),
                              description: t('onlyOwnersManagersCanEdit'),
                              status: "warning",
                              duration: 3000,
                              isClosable: true,
                            });
                          }
                        }}
                        isDisabled={!canManage(farm)}
                        flex={1}
                      >
                        {t('manage')}
                      </Button>
                    </Tooltip>
                  </HStack>

                  {/* Quick Actions Grid */}
                  <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                    <Tooltip label={t('viewManageBatches')} hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiLayers />}
                        onClick={() => handleQuickAction('batches', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        {t('batches')}
                      </Button>
                    </Tooltip>
                    <Tooltip label={t('dailyTasksActivities')} hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiClock />}
                        onClick={() => handleQuickAction('tasks', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        {t('tasks')}
                      </Button>
                    </Tooltip>
                    <Tooltip label={t('healthMonitoring')} hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiActivity />}
                        onClick={() => handleQuickAction('health', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        {t('health')}
                      </Button>
                    </Tooltip>
                    <Tooltip label={t('farmAnalytics')} hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiBarChart />}
                        onClick={() => handleQuickAction('analytics', farm)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        {t('analytics')}
                      </Button>
                    </Tooltip>
                    <Tooltip label={t('addNewBatch')} hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiPlus />}
                        onClick={() => handleQuickAction('addBatch', farm)}
                        isDisabled={!canManage(farm)}
                        fontSize="xs"
                        p={2}
                        colorScheme="green"
                      >
                        {t('addBatch')}
                      </Button>
                    </Tooltip>
                    <Tooltip label={t('performanceTracking')} hasArrow>
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<FiTrendingUp />}
                        onClick={() => navigate(`/farmer/performance?farmId=${farm.farmID}`)}
                        isDisabled={!canOperate(farm)}
                        fontSize="xs"
                        p={2}
                      >
                        {t('track')}
                      </Button>
                    </Tooltip>
                  </Grid>

                  {/* Status Indicator */}
                  {farm.farm_status === 'Setup Required' && (
                    <Box mt={3} p={2} bg="orange.50" borderRadius="md" borderLeft="3px solid" borderColor="orange.400">
                      <HStack>
                        <Icon as={FiAlertTriangle} color="orange.500" />
                        <Text fontSize="xs" color="orange.700">
                          {t('completeFarmSetupToStart')}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </SimpleGrid>
          </>
        )}
      </Box>

      {/* Add New Farm Modal */}
      <Modal isOpen={isAddFarmModalOpen} onClose={onAddFarmModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('addNewFarm')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>{t('farmName')}</FormLabel>
                <Input
                  value={farmForm.name}
                  onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
                  placeholder={t('enterFarmName')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('location')}</FormLabel>
                <Input
                  value={farmForm.location}
                  onChange={(e) => setFarmForm({ ...farmForm, location: e.target.value })}
                  placeholder={t('enterFarmLocationExample')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('farmSize')}</FormLabel>
                <Input
                  value={farmForm.farmSize}
                  onChange={(e) => setFarmForm({ ...farmForm, farmSize: e.target.value })}
                  placeholder={t('farmSizeExample')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>{t('status')}</FormLabel>
                <Select
                  value={farmForm.status}
                  onChange={(e) => setFarmForm({ ...farmForm, status: e.target.value })}
                >
                  <option value="active">{t('active')}</option>
                  <option value="inactive">{t('inactive')}</option>
                  <option value="setup_required">{t('setupRequired')}</option>
                  <option value="maintenance">{t('underMaintenance')}</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddFarmModalClose}>
              {t('cancel')}
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleFarmSubmit}
              isLoading={addFarmMutation.isLoading}
              loadingText={t('creatingFarm')}
            >
              {t('createFarm')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FarmerLayout>
  );
};

export default MyFarmsPage;
