import React, { useState, useMemo } from 'react';
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
  const bg = useColorModeValue('gray.50', 'gray.900');
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
      return `Overdue by ${Math.abs(diffHours)}h`;
    } else if (diffHours < 24) {
      return `Due in ${diffHours}h`;
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
                {task.category.replace('-', ' ')}
              </Badge>
              <Badge colorScheme={getPriorityColor(task.priority)} size="sm">
                {task.priority}
              </Badge>
              <Badge colorScheme={getStatusColor(task.status)} size="sm">
                {task.status.replace('-', ' ')}
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
                  {task.estimatedDuration}min
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
                    {task.recurringPattern}
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
        <Text mt={4}>Loading tasks...</Text>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={6}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error instanceof Error ? error.message : 'Failed to load tasks.'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6} bg={bg} minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={0}>
          <Heading size="lg" color={textColor}>Daily Tasks</Heading>
          <Text color={textColor}>Manage your farm activities and schedules</Text>
        </VStack>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={onNewTaskOpen}
        >
          New Task
        </Button>
      </Flex>

      {/* Task Statistics */}
      <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} mb={6}>
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {taskStats.total}
            </Text>
            <Text fontSize="sm" color={textColor}>Total Tasks</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
              {taskStats.pending}
            </Text>
            <Text fontSize="sm" color={textColor}>Pending</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {taskStats.inProgress}
            </Text>
            <Text fontSize="sm" color={textColor}>In Progress</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {taskStats.completed}
            </Text>
            <Text fontSize="sm" color={textColor}>Completed</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
          <CardBody textAlign="center" py={4}>
            <Text fontSize="2xl" fontWeight="bold" color="red.500">
              {taskStats.overdue}
            </Text>
            <Text fontSize="sm" color={textColor}>Overdue</Text>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} mb={6}>
        <CardHeader>
          <Heading size="md" color={textColor}>Quick Actions</Heading>
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
              Add Feeding
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
              Health Check
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
              Cleaning
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
              Maintenance
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
              Record Data
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
              View Calendar
            </Button>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Filters */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm">Search</FormLabel>
              <InputGroup>
                <InputLeftElement>
                  <FiSearch />
                </InputLeftElement>
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm">Category</FormLabel>
              <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="feeding">Feeding</option>
                <option value="health">Health</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
                <option value="breeding">Breeding</option>
                <option value="record-keeping">Record Keeping</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm">Status</FormLabel>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel fontSize="sm">Priority</FormLabel>
              <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Tasks Tabs */}
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>Today ({tasksByStatus.today.length})</Tab>
          <Tab>Pending ({tasksByStatus.pending.length})</Tab>
          <Tab>In Progress ({tasksByStatus.inProgress.length})</Tab>
          <Tab>Completed ({tasksByStatus.completed.length})</Tab>
          <Tab>Overdue ({tasksByStatus.overdue.length})</Tab>
          <Tab>Calendar View</Tab>
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
                No tasks scheduled for today
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
                No pending tasks
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
                No tasks in progress
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
                No completed tasks
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
                No overdue tasks
              </Text>
            )}
          </TabPanel>

          {/* Calendar View Tab */}
          <TabPanel px={0}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Weekly Task Schedule</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={7} spacing={2} mb={4}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
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
                              +{dayTasks.length - 2} more
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
          <ModalHeader>Create New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Task Title</FormLabel>
                <Input placeholder="Enter task title..." />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="Enter task description..." />
              </FormControl>
              
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select>
                    <option value="feeding">Feeding</option>
                    <option value="health">Health</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="breeding">Breeding</option>
                    <option value="record-keeping">Record Keeping</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>Due Date</FormLabel>
                  <Input type="datetime-local" />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Estimated Duration (minutes)</FormLabel>
                  <Input type="number" placeholder="30" />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input placeholder="e.g., Coop A, Farm Office" />
              </FormControl>
              
              <FormControl>
                <HStack justify="space-between">
                  <FormLabel mb={0}>Recurring Task</FormLabel>
                  <Switch />
                </HStack>
              </FormControl>
              
              <HStack spacing={4} w="full" justify="flex-end">
                <Button variant="ghost" onClick={onNewTaskClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={onNewTaskClose}>
                  Create Task
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
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTask && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Task Title</FormLabel>
                  <Input defaultValue={selectedTask.title} />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea defaultValue={selectedTask.description} />
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select defaultValue={selectedTask.category}>
                      <option value="feeding">Feeding</option>
                      <option value="health">Health</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="breeding">Breeding</option>
                      <option value="record-keeping">Record Keeping</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Priority</FormLabel>
                    <Select defaultValue={selectedTask.priority}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select defaultValue={selectedTask.status}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>
                </FormControl>
                
                <HStack spacing={4} w="full" justify="flex-end">
                  <Button variant="ghost" onClick={onEditTaskClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" onClick={onEditTaskClose}>
                    Save Changes
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FarmerTasksPage;
