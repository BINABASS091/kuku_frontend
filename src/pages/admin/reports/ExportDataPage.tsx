import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  IconButton,
  Tooltip,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Spinner,
} from '@chakra-ui/react';
import { 
  DownloadIcon, 
  RepeatIcon, 
  CalendarIcon,
  ExternalLinkIcon,
  ViewIcon,
  SettingsIcon,
} from '@chakra-ui/icons';

interface ExportFormat {
  id: string;
  name: string;
  description: string;
  extension: string;
  size_estimate: string;
  features: string[];
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  data_types: string[];
  last_used: string;
  usage_count: number;
}

interface ExportHistory {
  id: number;
  filename: string;
  format: string;
  data_types: string[];
  size: string;
  status: string;
  created_at: string;
  expires_at: string;
  download_count: number;
}

interface DataType {
  id: string;
  name: string;
  description: string;
  table_count: number;
  record_count: number;
  last_updated: string;
  size_mb: number;
}

export default function ExportDataPage() {
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('csv');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isTemplateOpen, onOpen: onTemplateOpen, onClose: onTemplateClose } = useDisclosure();
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.800', 'white');

  const exportFormats: ExportFormat[] = [
    {
      id: 'csv',
      name: 'CSV (Comma Separated Values)',
      description: 'Universal format compatible with Excel and most databases',
      extension: '.csv',
      size_estimate: '~5MB for 10k records',
      features: ['Excel Compatible', 'Lightweight', 'Universal Support']
    },
    {
      id: 'excel',
      name: 'Excel Workbook',
      description: 'Microsoft Excel format with multiple sheets and formatting',
      extension: '.xlsx',
      size_estimate: '~8MB for 10k records',
      features: ['Multiple Sheets', 'Formatting', 'Charts & Graphs']
    },
    {
      id: 'json',
      name: 'JSON (JavaScript Object Notation)',
      description: 'Structured data format ideal for APIs and applications',
      extension: '.json',
      size_estimate: '~12MB for 10k records',
      features: ['Nested Data', 'API Ready', 'Structured Format']
    },
    {
      id: 'sql',
      name: 'SQL Dump',
      description: 'Database backup format with table structure and data',
      extension: '.sql',
      size_estimate: '~15MB for 10k records',
      features: ['Full Backup', 'Table Structure', 'Relationships']
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Formatted report with charts and summaries',
      extension: '.pdf',
      size_estimate: '~3MB per report',
      features: ['Professional Format', 'Charts Included', 'Print Ready']
    }
  ];

  const dataTypes: DataType[] = [
    {
      id: 'farms',
      name: 'Farms & Properties',
      description: 'Farm information, locations, and property details',
      table_count: 3,
      record_count: 125,
      last_updated: '2024-01-07 09:30:00',
      size_mb: 0.8
    },
    {
      id: 'devices',
      name: 'IoT Devices',
      description: 'Device information, status, and configuration data',
      table_count: 5,
      record_count: 1840,
      last_updated: '2024-01-07 09:45:00',
      size_mb: 2.3
    },
    {
      id: 'sensors',
      name: 'Sensor Readings',
      description: 'Environmental data, temperature, humidity readings',
      table_count: 8,
      record_count: 45680,
      last_updated: '2024-01-07 09:45:00',
      size_mb: 125.4
    },
    {
      id: 'batches',
      name: 'Poultry Batches',
      description: 'Batch information, bird counts, and management data',
      table_count: 6,
      record_count: 892,
      last_updated: '2024-01-07 08:20:00',
      size_mb: 5.2
    },
    {
      id: 'users',
      name: 'Users & Accounts',
      description: 'User profiles, roles, and authentication data',
      table_count: 4,
      record_count: 1247,
      last_updated: '2024-01-07 07:15:00',
      size_mb: 1.8
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions & Billing',
      description: 'Subscription plans, payments, and billing history',
      table_count: 7,
      record_count: 3456,
      last_updated: '2024-01-07 06:30:00',
      size_mb: 8.9
    },
    {
      id: 'alerts',
      name: 'Alerts & Notifications',
      description: 'System alerts, notifications, and event logs',
      table_count: 3,
      record_count: 12340,
      last_updated: '2024-01-07 09:44:00',
      size_mb: 15.6
    },
    {
      id: 'knowledge',
      name: 'Knowledge Base',
      description: 'Articles, guides, and knowledge management content',
      table_count: 5,
      record_count: 567,
      last_updated: '2024-01-06 16:45:00',
      size_mb: 12.3
    }
  ];

  const exportTemplates: ExportTemplate[] = [
    {
      id: 'full_backup',
      name: 'Complete System Backup',
      description: 'Full system export including all data types',
      data_types: dataTypes.map(dt => dt.id),
      last_used: '2024-01-01 10:00:00',
      usage_count: 12
    },
    {
      id: 'farm_operations',
      name: 'Farm Operations Report',
      description: 'Farms, devices, sensors, and batches only',
      data_types: ['farms', 'devices', 'sensors', 'batches'],
      last_used: '2024-01-05 14:30:00',
      usage_count: 8
    },
    {
      id: 'user_analytics',
      name: 'User Analytics Export',
      description: 'Users, subscriptions, and activity data',
      data_types: ['users', 'subscriptions', 'alerts'],
      last_used: '2024-01-03 11:20:00',
      usage_count: 5
    }
  ];

  useEffect(() => {
    fetchExportHistory();
  }, []);

  const fetchExportHistory = async () => {
    try {
      // Mock data for demonstration
      setExportHistory([
        {
          id: 1,
          filename: 'farm_operations_2024-01-07.xlsx',
          format: 'Excel',
          data_types: ['Farms', 'Devices', 'Sensors'],
          size: '45.2 MB',
          status: 'completed',
          created_at: '2024-01-07 09:15:00',
          expires_at: '2024-01-14 09:15:00',
          download_count: 3
        },
        {
          id: 2,
          filename: 'sensor_readings_2024-01-06.csv',
          format: 'CSV',
          data_types: ['Sensor Readings'],
          size: '125.8 MB',
          status: 'completed',
          created_at: '2024-01-06 15:30:00',
          expires_at: '2024-01-13 15:30:00',
          download_count: 1
        },
        {
          id: 3,
          filename: 'user_analytics_2024-01-05.json',
          format: 'JSON',
          data_types: ['Users', 'Subscriptions'],
          size: '8.3 MB',
          status: 'completed',
          created_at: '2024-01-05 11:45:00',
          expires_at: '2024-01-12 11:45:00',
          download_count: 5
        },
        {
          id: 4,
          filename: 'full_backup_2024-01-01.sql',
          format: 'SQL',
          data_types: ['All Data'],
          size: '234.7 MB',
          status: 'completed',
          created_at: '2024-01-01 10:00:00',
          expires_at: '2024-01-08 10:00:00',
          download_count: 2
        }
      ]);
    } catch (error) {
      console.error('Error fetching export history:', error);
      setError('Failed to load export history');
    }
  };

  const handleExport = async () => {
    if (selectedDataTypes.length === 0) {
      toast({
        title: 'No Data Selected',
        description: 'Please select at least one data type to export',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: 'Export Started',
        description: 'Your data export is being processed. You will receive an email when it\'s ready.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Refresh history after export
      fetchExportHistory();
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'An error occurred while processing your export request',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = (_exportId: number) => {
    toast({
      title: 'Download Started',
      description: 'Your file download has begun',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = exportTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedDataTypes(template.data_types);
      setSelectedTemplate(templateId);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'failed': return 'red';
      case 'expired': return 'gray';
      default: return 'gray';
    }
  };

  const getTotalSize = (): number => {
    return selectedDataTypes.reduce((total, typeId) => {
      const dataType = dataTypes.find(dt => dt.id === typeId);
      return total + (dataType?.size_mb || 0);
    }, 0);
  };

  const selectedFormat_ = exportFormats.find(f => f.id === selectedFormat);

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error Loading Data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading as="h2" size="lg" color={headingColor} mb={2}>
              Data Export & Backup Management
            </Heading>
            <Text color={textColor}>
              Export system data in various formats for backup, analysis, or migration
            </Text>
          </Box>
          <HStack spacing={4} wrap="wrap">
            <Button
              leftIcon={<CalendarIcon />}
              colorScheme="purple"
              variant="outline"
              onClick={onScheduleOpen}
            >
              Schedule Export
            </Button>
            <Button
              leftIcon={<SettingsIcon />}
              colorScheme="gray"
              variant="outline"
              onClick={onTemplateOpen}
            >
              Manage Templates
            </Button>
          </HStack>
        </Flex>

        {/* Export Configuration */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Create New Export</Heading>
            <Text fontSize="sm" color={textColor}>
              Configure your data export settings and download options
            </Text>
          </CardHeader>
          <CardBody>
            <Tabs colorScheme="blue">
              <TabList>
                <Tab>Select Data</Tab>
                <Tab>Export Format</Tab>
                <Tab>Options & Settings</Tab>
              </TabList>
              <TabPanels>
                {/* Data Selection Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    {/* Quick Templates */}
                    <Box>
                      <Text fontWeight="bold" mb={3}>Quick Templates</Text>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        {exportTemplates.map((template) => (
                          <Card
                            key={template.id}
                            bg={selectedTemplate === template.id ? useColorModeValue('blue.50', 'blue.900') : cardBg}
                            border="1px"
                            borderColor={selectedTemplate === template.id ? 'blue.500' : borderColor}
                            cursor="pointer"
                            onClick={() => handleTemplateSelect(template.id)}
                            _hover={{ borderColor: 'blue.300' }}
                          >
                            <CardBody>
                              <VStack align="start" spacing={2}>
                                <Text fontWeight="bold" fontSize="sm">{template.name}</Text>
                                <Text fontSize="xs" color={textColor}>
                                  {template.description}
                                </Text>
                                <HStack spacing={2}>
                                  <Badge size="sm">{template.data_types.length} data types</Badge>
                                  <Badge size="sm" variant="outline">
                                    Used {template.usage_count} times
                                  </Badge>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </Box>

                    {/* Data Type Selection */}
                    <Box>
                      <Text fontWeight="bold" mb={3}>Select Data Types</Text>
                      <CheckboxGroup value={selectedDataTypes} onChange={(values) => setSelectedDataTypes(values as string[])}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {dataTypes.map((dataType) => (
                            <Card key={dataType.id} bg={cardBg} border="1px" borderColor={borderColor}>
                              <CardBody>
                                <HStack spacing={3} align="start">
                                  <Checkbox value={dataType.id} colorScheme="blue" mt={1} />
                                  <VStack align="start" spacing={1} flex={1}>
                                    <Text fontWeight="bold" fontSize="sm">{dataType.name}</Text>
                                    <Text fontSize="xs" color={textColor}>
                                      {dataType.description}
                                    </Text>
                                    <HStack spacing={4} fontSize="xs" color={textColor}>
                                      <Text>{dataType.record_count.toLocaleString()} records</Text>
                                      <Text>{dataType.size_mb.toFixed(1)} MB</Text>
                                      <Text>{dataType.table_count} tables</Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                      Updated: {new Date(dataType.last_updated).toLocaleString()}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                        </SimpleGrid>
                      </CheckboxGroup>
                    </Box>

                    {/* Selection Summary */}
                    {selectedDataTypes.length > 0 && (
                      <Alert status="info">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Selection Summary</AlertTitle>
                          <AlertDescription>
                            {selectedDataTypes.length} data types selected • 
                            Estimated size: {getTotalSize().toFixed(1)} MB
                          </AlertDescription>
                        </Box>
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>

                {/* Format Selection Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Text fontWeight="bold" mb={3}>Export Format</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {exportFormats.map((format) => (
                          <Card
                            key={format.id}
                            bg={selectedFormat === format.id ? useColorModeValue('blue.50', 'blue.900') : cardBg}
                            border="1px"
                            borderColor={selectedFormat === format.id ? 'blue.500' : borderColor}
                            cursor="pointer"
                            onClick={() => setSelectedFormat(format.id)}
                            _hover={{ borderColor: 'blue.300' }}
                          >
                            <CardBody>
                              <VStack align="start" spacing={3}>
                                <HStack justify="space-between" w="full">
                                  <Text fontWeight="bold">{format.name}</Text>
                                  <Badge>{format.extension}</Badge>
                                </HStack>
                                <Text fontSize="sm" color={textColor}>
                                  {format.description}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {format.size_estimate}
                                </Text>
                                <HStack spacing={2} wrap="wrap">
                                  {format.features.map((feature, index) => (
                                    <Badge key={index} size="sm" variant="outline">
                                      {feature}
                                    </Badge>
                                  ))}
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    </Box>

                    {selectedFormat_ && (
                      <Alert status="info">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Format Selected: {selectedFormat_.name}</AlertTitle>
                          <AlertDescription>
                            Estimated file size: {(getTotalSize() * 1.2).toFixed(1)} MB
                          </AlertDescription>
                        </Box>
                      </Alert>
                    )}
                  </VStack>
                </TabPanel>

                {/* Options Tab */}
                <TabPanel px={0}>
                  <VStack spacing={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl>
                        <FormLabel>Date Range (Optional)</FormLabel>
                        <HStack spacing={4}>
                          <Input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          />
                          <Text>to</Text>
                          <Input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          />
                        </HStack>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Export Name (Optional)</FormLabel>
                        <Input placeholder="My Export 2024-01-07" />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl>
                      <FormLabel>Additional Notes</FormLabel>
                      <Textarea 
                        placeholder="Add any notes about this export for future reference..."
                        rows={3}
                      />
                    </FormControl>

                    <Box p={4} bg={useColorModeValue('yellow.50', 'yellow.900')} borderRadius="md">
                      <Text fontWeight="bold" color="yellow.600" mb={2}>
                        Export Guidelines
                      </Text>
                      <VStack align="start" spacing={1} fontSize="sm" color={textColor}>
                        <Text>• Large exports may take several minutes to process</Text>
                        <Text>• You will receive an email notification when ready</Text>
                        <Text>• Export files are available for 7 days</Text>
                        <Text>• Sensitive data is automatically encrypted</Text>
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>

            {/* Export Button */}
            <Box mt={6} pt={4} borderTop="1px" borderColor={borderColor}>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">
                    Ready to Export: {selectedDataTypes.length} data types
                  </Text>
                  <Text fontSize="sm" color={textColor}>
                    Format: {selectedFormat_?.name} • Estimated size: {getTotalSize().toFixed(1)} MB
                  </Text>
                </VStack>
                <Button
                  leftIcon={isExporting ? <Spinner size="sm" /> : <DownloadIcon />}
                  colorScheme="blue"
                  size="lg"
                  onClick={handleExport}
                  isLoading={isExporting}
                  loadingText="Processing..."
                  isDisabled={selectedDataTypes.length === 0}
                >
                  Start Export
                </Button>
              </HStack>
            </Box>
          </CardBody>
        </Card>

        {/* Export History */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack justify="space-between">
              <Box>
                <Heading size="md">Export History</Heading>
                <Text fontSize="sm" color={textColor}>
                  Recent exports and download history
                </Text>
              </Box>
              <Button
                leftIcon={<RepeatIcon />}
                colorScheme="blue"
                variant="outline"
                size="sm"
                onClick={fetchExportHistory}
              >
                Refresh
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>File Name</Th>
                    <Th>Format</Th>
                    <Th>Data Types</Th>
                    <Th>Size</Th>
                    <Th>Status</Th>
                    <Th>Created</Th>
                    <Th>Expires</Th>
                    <Th>Downloads</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {exportHistory.map((export_) => (
                    <Tr key={export_.id}>
                      <Td fontWeight="medium">{export_.filename}</Td>
                      <Td>
                        <Badge>{export_.format}</Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          {export_.data_types.slice(0, 2).map((type, index) => (
                            <Badge key={index} size="sm" variant="outline">
                              {type}
                            </Badge>
                          ))}
                          {export_.data_types.length > 2 && (
                            <Text fontSize="xs" color={textColor}>
                              +{export_.data_types.length - 2} more
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>{export_.size}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(export_.status)}>
                          {export_.status.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {new Date(export_.created_at).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={textColor}>
                          {new Date(export_.expires_at).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">
                          {export_.download_count}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          {export_.status === 'completed' && (
                            <Tooltip label="Download">
                              <IconButton
                                aria-label="Download"
                                icon={<DownloadIcon />}
                                size="sm"
                                colorScheme="green"
                                variant="outline"
                                onClick={() => handleDownload(export_.id)}
                              />
                            </Tooltip>
                          )}
                          <Tooltip label="Details">
                            <IconButton
                              aria-label="View details"
                              icon={<ViewIcon />}
                              size="sm"
                              variant="outline"
                            />
                          </Tooltip>
                          <Tooltip label="Share">
                            <IconButton
                              aria-label="Share"
                              icon={<ExternalLinkIcon />}
                              size="sm"
                              variant="outline"
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        {/* Schedule Export Modal */}
        <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Schedule Automated Export</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Schedule Name</FormLabel>
                  <Input placeholder="Weekly Farm Data Backup" />
                </FormControl>
                <FormControl>
                  <FormLabel>Frequency</FormLabel>
                  <Select>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Email Notifications</FormLabel>
                  <Input placeholder="admin@farm.com" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onScheduleClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Create Schedule</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Template Management Modal */}
        <Modal isOpen={isTemplateOpen} onClose={onTemplateClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Manage Export Templates</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text color={textColor} mb={4}>
                Create and manage reusable export templates for common data combinations.
              </Text>
              {/* Template management content would go here */}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onTemplateClose}>
                Close
              </Button>
              <Button colorScheme="blue">Save Changes</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
