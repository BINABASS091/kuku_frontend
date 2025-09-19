import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Button,
  IconButton,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Checkbox,
  Flex,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Switch,
  Avatar,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { fetchFarmerTasks } from '../services/farmerTasks';
import FarmerLayout from '../layouts/FarmerLayout';
import {
  FiPlus,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiRepeat,
  FiSearch,
  FiEdit3,
  FiMapPin,
  FiUsers,
  FiTrendingUp,
  FiActivity,
} from 'react-icons/fi';

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'feeding' | 'health' | 'cleaning' | 'maintenance' | 'breeding' | 'record-keeping';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  estimatedDuration: number; // in minutes
  assignedTo?: string;
  batchId?: string;
  farmId?: string;
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  completedAt?: string;
  notes?: string;
  location?: string;
}

const FarmerTasksPage: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, isError, error } = useQuery(['farmerTasks'], fetchFarmerTasks);
  const { isOpen: isNewTaskOpen, onOpen: onNewTaskOpen, onClose: onNewTaskClose } = useDisclosure();
  const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [activeTab, setActiveTab] = useState(0);

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  // Mock tasks data for demonstration (replace with actual API data)
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Morning Feed Distribution',
      description: 'Distribute morning feed to all batches according to feeding schedule',
      category: 'feeding',
      priority: 'high',
      status: 'pending',
      dueDate: '2025-09-18T07:00:00Z',
      estimatedDuration: 45,
      batchId: 'batch-001',
      farmId: 'farm-001',
      isRecurring: true,
      recurringPattern: 'daily',
      location: 'Coop A, B, C',
    },
    {
      id: '2',
      title: 'Health Check - Batch 1',
      description: 'Conduct routine health inspection for signs of illness or distress',
      category: 'health',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2025-09-18T09:30:00Z',
      estimatedDuration: 60,
      batchId: 'batch-001',
      farmId: 'farm-001',
      isRecurring: true,
      recurringPattern: 'daily',
      location: 'Coop A',
      assignedTo: 'John Doe',
    },
    {
      id: '3',
      title: 'Clean Water Systems',
      description: 'Clean and refill all water dispensers, check for blockages',
      category: 'cleaning',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-09-18T10:00:00Z',
      estimatedDuration: 30,
      isRecurring: true,
      recurringPattern: 'daily',
      location: 'All Coops',
    },
    {
      id: '4',
      title: 'Equipment Maintenance',
      description: 'Weekly maintenance check on feed dispensers and ventilation systems',
      category: 'maintenance',
      priority: 'low',
      status: 'pending',
      dueDate: '2025-09-18T14:00:00Z',
      estimatedDuration: 120,
      isRecurring: true,
      recurringPattern: 'weekly',
      location: 'All Equipment Areas',
    },
    {
      id: '5',
      title: 'Record Production Data',
      description: 'Update daily egg production and mortality records',
      category: 'record-keeping',
      priority: 'high',
      status: 'completed',
      dueDate: '2025-09-17T18:00:00Z',
      estimatedDuration: 15,
      completedAt: '2025-09-17T17:45:00Z',
      isRecurring: true,
      recurringPattern: 'daily',
      location: 'Office',
    },
  ];

  // Use mock data for now, replace with actual API data later
  const tasks = mockTasks;

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filterCategory, filterStatus, filterPriority]);

  // Group tasks by status for different tabs
  const tasksByStatus = useMemo(() => ({
    today: filteredTasks.filter(task => {
      const today = new Date().toDateString();
      const taskDate = new Date(task.dueDate).toDateString();
      return taskDate === today;
    }),
    pending: filteredTasks.filter(task => task.status === 'pending'),
    inProgress: filteredTasks.filter(task => task.status === 'in-progress'),
    completed: filteredTasks.filter(task => task.status === 'completed'),
    overdue: filteredTasks.filter(task => {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status !== 'completed';
    }),
  }), [filteredTasks]);

  // Task statistics
  const taskStats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => {
      const now = new Date();
      const dueDate = new Date(t.dueDate);
      return dueDate < now && t.status !== 'completed';
    }).length,
  }), [tasks]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'feeding': return <FiActivity />;
      case 'health': return <FiAlertCircle />;
      case 'cleaning': return <FiCheckCircle />;
      case 'maintenance': return <FiRepeat />;
      case 'breeding': return <FiUsers />;
      case 'record-keeping': return <FiTrendingUp />;
      default: return <FiCalendar />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'feeding': return 'blue';
      case 'health': return 'red';
      case 'cleaning': return 'green';
      case 'maintenance': return 'orange';
      case 'breeding': return 'purple';
      case 'record-keeping': return 'teal';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'blue';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diff / (1000 * 60 * 60));
    
    if (diffHours < 0) {
      return t('overdueByHours', { hours: Math.abs(diffHours) });
    } else if (diffHours < 24) {
      return t('dueInHours', { hours: diffHours });
    } else {
      return date.toLocaleDateString();
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <Card 
      key={task.id}
      bg={cardBg} 
      borderWidth="1px" 
      borderColor={borderColor}
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      <CardHeader pb={2}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <HStack>
              <Box color={`${getCategoryColor(task.category)}.500`}>
                {getCategoryIcon(task.category)}
              </Box>
              <Heading size="sm" color={textColor}>{task.title}</Heading>
            </HStack>
            <HStack spacing={2}>
              <Badge colorScheme={getCategoryColor(task.category)} size="sm">
                {t(task.category.replace('-', ''))}
              </Badge>
              <Badge colorScheme={getPriorityColor(task.priority)} size="sm">
                {t(task.priority)}
              </Badge>
              <Badge colorScheme={getStatusColor(task.status)} size="sm">
                {t(task.status.replace('-', ''))}
              </Badge>
            </HStack>
          </VStack>
          <HStack>
            <IconButton
              icon={<FiEdit3 />}
              size="sm"
              variant="ghost"
              aria-label="Edit task"
              onClick={() => {
                setSelectedTask(task);
                onEditTaskOpen();
              }}
            />
            <Checkbox
              isChecked={task.status === 'completed'}
              onChange={() => {
                // Handle task completion toggle
                console.log('Toggle task completion:', task.id);
              }}
            />
          </HStack>
        </HStack>
      </CardHeader>
      
      <CardBody pt={0}>
        <VStack align="start" spacing={3}>
          <Text fontSize="sm" color={textColor} noOfLines={2}>
            {task.description}
          </Text>
          
          <HStack justify="space-between" w="full">
            <HStack spacing={4}>
              <HStack spacing={1}>
                <FiClock />
                <Text fontSize="xs" color={textColor}>
                  {task.estimatedDuration}{t('min')}
                </Text>
              </HStack>
              
              {task.location && (
                <HStack spacing={1}>
                  <FiMapPin />
                  <Text fontSize="xs" color={textColor}>
                    {task.location}
                  </Text>
                </HStack>
              )}
              
              {task.isRecurring && (
                <HStack spacing={1}>
                  <FiRepeat />
                  <Text fontSize="xs" color={textColor}>
                    {t(task.recurringPattern || '')}
                  </Text>
                </HStack>
              )}
            </HStack>
          </HStack>
          
          <HStack justify="space-between" w="full">
            <Text fontSize="xs" color={textColor}>
              {formatDueDate(task.dueDate)}
            </Text>
            
            {task.assignedTo && (
              <HStack spacing={1}>
                <Avatar size="xs" name={task.assignedTo} />
                <Text fontSize="xs" color={textColor}>
                  {task.assignedTo}
                </Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>{t('loadingTasks')}</Text>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={6}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error instanceof Error ? error.message : t('failedToLoadTasks')}
        </Alert>
      </Box>
    );
  }

  return (
    <FarmerLayout>
      <Box p={6}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading size="lg" color={textColor}>{t('dailyTasks')}</Heading>
          <Text color={textColor}>{t('manageFarmActivities')}</Text>
        </VStack>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={onNewTaskOpen}
        >
          {t('newTask')}
        </Button>
      </Flex>

      {/* Task Statistics */}
      <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} mb={6}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {taskStats.total}
            </Text>
            <Text fontSize="sm" color={textColor}>{t('totalTasks')}</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
              {taskStats.pending}
            </Text>
            <Text fontSize="sm" color={textColor}>{t('pending')}</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {taskStats.inProgress}
            </Text>
            <Text fontSize="sm" color={textColor}>{t('inprogress')}</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {taskStats.completed}
            </Text>
            <Text fontSize="sm" color={textColor}>{t('completed')}</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              {taskStats.overdue}
            </Text>
            <Text fontSize="sm" color={textColor}>{t('overdue')}</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Heading size="md" color={textColor}>{t('quickActions')}</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
            <Button
              leftIcon={<FiActivity />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              onClick={() => {
                // Create feeding task
                console.log('Create feeding task');
              }}
            >
              {t('addFeeding')}
            </Button>
            
            <Button
              leftIcon={<FiAlertCircle />}
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => {
                // Create health check task
                console.log('Create health check task');
              }}
            >
              {t('healthCheck')}
            </Button>
            
            <Button
              leftIcon={<FiCheckCircle />}
              colorScheme="green"
              variant="outline"
              size="sm"
              onClick={() => {
                // Create cleaning task
                console.log('Create cleaning task');
              }}
            >
              {t('cleaning')}
            </Button>
            
            <Button
              leftIcon={<FiRepeat />}
              colorScheme="orange"
              variant="outline"
              size="sm"
              onClick={() => {
                // Create maintenance task
                console.log('Create maintenance task');
              }}
            >
              {t('maintenance')}
            </Button>
            
            <Button
              leftIcon={<FiTrendingUp />}
              colorScheme="teal"
              variant="outline"
              size="sm"
              onClick={() => {
                // Create record keeping task
                console.log('Create record keeping task');
              }}
            >
              {t('recordData')}
            </Button>
            
            <Button
              leftIcon={<FiCalendar />}
              colorScheme="purple"
              variant="outline"
              size="sm"
              onClick={() => {
                // Switch to calendar view
                setActiveTab(5);
              }}
            >
              {t('viewCalendar')}
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Filters */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">{t('search')}</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FiSearch />
                </InputLeftElement>
                <Input
                  placeholder={t('searchTasks')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm">{t('category')}</FormLabel>
              <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">{t('allCategories')}</option>
                <option value="feeding">{t('feeding')}</option>
                <option value="health">{t('health')}</option>
                <option value="cleaning">{t('cleaning')}</option>
                <option value="maintenance">{t('maintenance')}</option>
                <option value="breeding">{t('breeding')}</option>
                <option value="record-keeping">{t('recordkeeping')}</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm">{t('status')}</FormLabel>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">{t('allStatus')}</option>
                <option value="pending">{t('pending')}</option>
                <option value="in-progress">{t('inprogress')}</option>
                <option value="completed">{t('completed')}</option>
                <option value="overdue">{t('overdue')}</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm">{t('priority')}</FormLabel>
              <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="all">{t('allPriorities')}</option>
                <option value="urgent">{t('urgent')}</option>
                <option value="high">{t('high')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="low">{t('low')}</option>
              </Select>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Tasks Tabs */}
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>{t('today')} ({tasksByStatus.today.length})</Tab>
          <Tab>{t('pending')} ({tasksByStatus.pending.length})</Tab>
          <Tab>{t('inprogress')} ({tasksByStatus.inProgress.length})</Tab>
          <Tab>{t('completed')} ({tasksByStatus.completed.length})</Tab>
          <Tab>{t('overdue')} ({tasksByStatus.overdue.length})</Tab>
          <Tab>{t('calendarView')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {tasksByStatus.today.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SimpleGrid>
            {tasksByStatus.today.length === 0 && (
              <Text textAlign="center" color={textColor} py={8}>
                {t('noTasksScheduledToday')}
              </Text>
            )}
          </TabPanel>
          
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {tasksByStatus.pending.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SimpleGrid>
            {tasksByStatus.pending.length === 0 && (
              <Text textAlign="center" color={textColor} py={8}>
                {t('noPendingTasks')}
              </Text>
            )}
          </TabPanel>
          
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {tasksByStatus.inProgress.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SimpleGrid>
            {tasksByStatus.inProgress.length === 0 && (
              <Text textAlign="center" color={textColor} py={8}>
                {t('noTasksInProgress')}
              </Text>
            )}
          </TabPanel>
          
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {tasksByStatus.completed.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SimpleGrid>
            {tasksByStatus.completed.length === 0 && (
              <Text textAlign="center" color={textColor} py={8}>
                {t('noCompletedTasks')}
              </Text>
            )}
          </TabPanel>
          
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {tasksByStatus.overdue.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SimpleGrid>
            {tasksByStatus.overdue.length === 0 && (
              <Text textAlign="center" color={textColor} py={8}>
                {t('noOverdueTasks')}
              </Text>
            )}
          </TabPanel>

          {/* Calendar View Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">{t('weeklyTaskSchedule')}</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={7} spacing={2} mb={4}>
                  {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map(day => (
                    <Text key={day} textAlign="center" fontWeight="bold" fontSize="sm" color={textColor}>
                      {day}
                    </Text>
                  ))}
                </SimpleGrid>
                
                <SimpleGrid columns={7} spacing={2} minH="400px">
                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date();
                    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                    const startOfCalendar = new Date(startOfMonth);
                    startOfCalendar.setDate(startOfCalendar.getDate() - startOfMonth.getDay());
                    
                    const currentDate = new Date(startOfCalendar);
                    currentDate.setDate(currentDate.getDate() + i);
                    
                    const dayTasks = tasks.filter(task => {
                      const taskDate = new Date(task.dueDate);
                      return taskDate.toDateString() === currentDate.toDateString();
                    });
                    
                    const isCurrentMonth = currentDate.getMonth() === date.getMonth();
                    const isToday = currentDate.toDateString() === date.toDateString();
                    
                    return (
                      <Box
                        key={i}
                        minH="80px"
                        p={1}
                        border="1px solid"
                        borderColor={borderColor}
                        bg={isToday ? 'blue.50' : isCurrentMonth ? cardBg : 'gray.50'}
                        opacity={isCurrentMonth ? 1 : 0.5}
                      >
                        <Text fontSize="xs" fontWeight={isToday ? 'bold' : 'normal'} mb={1}>
                          {currentDate.getDate()}
                        </Text>
                        <VStack spacing={1}>
                          {dayTasks.slice(0, 2).map(task => (
                            <Box
                              key={task.id}
                              fontSize="xs"
                              p={1}
                              bg={`${getCategoryColor(task.category)}.100`}
                              color={`${getCategoryColor(task.category)}.700`}
                              borderRadius="sm"
                              w="full"
                              noOfLines={1}
                            >
                              {task.title}
                            </Box>
                          ))}
                          {dayTasks.length > 2 && (
                            <Text fontSize="xs" color={textColor}>
                              +{dayTasks.length - 2} {t('more')}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* New Task Modal */}
      <Modal isOpen={isNewTaskOpen} onClose={onNewTaskClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('createNewTask')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>{t('taskTitle')}</FormLabel>
                <Input placeholder={t('enterTaskTitle')} />
              </FormControl>
              
              <FormControl>
                <FormLabel>{t('description')}</FormLabel>
                <Textarea placeholder={t('enterTaskDescription')} />
              </FormControl>
              
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>{t('category')}</FormLabel>
                  <Select>
                    <option value="feeding">{t('feeding')}</option>
                    <option value="health">{t('health')}</option>
                    <option value="cleaning">{t('cleaning')}</option>
                    <option value="maintenance">{t('maintenance')}</option>
                    <option value="breeding">{t('breeding')}</option>
                    <option value="record-keeping">{t('recordkeeping')}</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>{t('priority')}</FormLabel>
                  <Select>
                    <option value="low">{t('low')}</option>
                    <option value="medium">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                    <option value="urgent">{t('urgent')}</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>{t('dueDate')}</FormLabel>
                  <Input type="datetime-local" />
                </FormControl>
                
                <FormControl>
                  <FormLabel>{t('estimatedDuration')} ({t('minutes')})</FormLabel>
                  <Input type="number" placeholder="30" />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel>{t('location')}</FormLabel>
                <Input placeholder={t('locationPlaceholder')} />
              </FormControl>
              
              <FormControl>
                <HStack justify="space-between">
                  <FormLabel mb={0}>{t('recurringTask')}</FormLabel>
                  <Switch />
                </HStack>
              </FormControl>
              
              <HStack spacing={4} w="full" justify="flex-end">
                <Button variant="ghost" onClick={onNewTaskClose}>
                  {t('cancel')}
                </Button>
                <Button colorScheme="blue" onClick={onNewTaskClose}>
                  {t('createTask')}
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditTaskOpen} onClose={onEditTaskClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t('editTask')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTask && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>{t('taskTitle')}</FormLabel>
                  <Input defaultValue={selectedTask.title} />
                </FormControl>
                
                <FormControl>
                  <FormLabel>{t('description')}</FormLabel>
                  <Textarea defaultValue={selectedTask.description} />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>{t('category')}</FormLabel>
                    <Select defaultValue={selectedTask.category}>
                      <option value="feeding">{t('feeding')}</option>
                      <option value="health">{t('health')}</option>
                      <option value="cleaning">{t('cleaning')}</option>
                      <option value="maintenance">{t('maintenance')}</option>
                      <option value="breeding">{t('breeding')}</option>
                      <option value="record-keeping">{t('recordkeeping')}</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>{t('priority')}</FormLabel>
                    <Select defaultValue={selectedTask.priority}>
                      <option value="low">{t('low')}</option>
                      <option value="medium">{t('medium')}</option>
                      <option value="high">{t('high')}</option>
                      <option value="urgent">{t('urgent')}</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>{t('status')}</FormLabel>
                  <Select defaultValue={selectedTask.status}>
                    <option value="pending">{t('pending')}</option>
                    <option value="in-progress">{t('inprogress')}</option>
                    <option value="completed">{t('completed')}</option>
                  </Select>
                </FormControl>
                
                <HStack spacing={4} w="full" justify="flex-end">
                  <Button variant="ghost" onClick={onEditTaskClose}>
                    {t('cancel')}
                  </Button>
                  <Button colorScheme="blue" onClick={onEditTaskClose}>
                    {t('saveChanges')}
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
    </FarmerLayout>
  );
};

export default FarmerTasksPage;
