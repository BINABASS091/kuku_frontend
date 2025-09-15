import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Button,
  Alert,
  AlertIcon,
  Badge,
  Progress,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Input,
  FormControl,
  FormLabel,
  Switch,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Code,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import {
  DownloadIcon,
  RepeatIcon,
  WarningIcon,
  InfoIcon,
  CheckIcon,
  TimeIcon,
  DeleteIcon,
  SettingsIcon,
} from '@chakra-ui/icons';

interface BackupFile {
  id: string;
  filename: string;
  created_at: string;
  size: string;
  type: 'automatic' | 'manual' | 'scheduled';
  status: 'completed' | 'in_progress' | 'failed';
  description: string;
}

interface BackupSettings {
  autoBackupEnabled: boolean;
  backupFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retentionDays: number;
  backupLocation: 'local' | 'cloud' | 'both';
  compressBackups: boolean;
  includeMedia: boolean;
  includeUserData: boolean;
  includeLogs: boolean;
}

interface BackupStats {
  totalBackups: number;
  totalSize: string;
  lastBackup: string;
  successRate: number;
  diskUsage: number;
  availableSpace: string;
}

const BackupRecoveryPage: React.FC = () => {
  const [backups, setBackups] = useState<BackupFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupFile | null>(null);
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackupEnabled: true,
    backupFrequency: 'daily',
    retentionDays: 30,
    backupLocation: 'local',
    compressBackups: true,
    includeMedia: true,
    includeUserData: true,
    includeLogs: false,
  });
  const [stats, setStats] = useState<BackupStats>({
    totalBackups: 0,
    totalSize: '0 MB',
    lastBackup: '',
    successRate: 0,
    diskUsage: 0,
    availableSpace: '0 GB',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose
  } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchBackups();
    fetchStats();
  }, []);

  const fetchBackups = async () => {
    try {
      setIsLoading(true);
      // Mock backup data - in real implementation, fetch from API
      const mockBackups: BackupFile[] = [
        {
          id: '1',
          filename: 'smartkuku-backup-2024-01-15-14-30.sql',
          created_at: new Date().toISOString(),
          size: '45.2 MB',
          type: 'automatic',
          status: 'completed',
          description: 'Daily automatic backup - Full database'
        },
        {
          id: '2',
          filename: 'smartkuku-backup-2024-01-14-14-30.sql',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          size: '44.8 MB',
          type: 'automatic',
          status: 'completed',
          description: 'Daily automatic backup - Full database'
        },
        {
          id: '3',
          filename: 'smartkuku-manual-backup-2024-01-14-10-15.sql',
          created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
          size: '46.1 MB',
          type: 'manual',
          status: 'completed',
          description: 'Manual backup before system update'
        },
        {
          id: '4',
          filename: 'smartkuku-backup-2024-01-13-14-30.sql',
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          size: '43.9 MB',
          type: 'automatic',
          status: 'failed',
          description: 'Daily automatic backup - Failed due to disk space'
        }
      ];

      setBackups(mockBackups);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load backup files',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStats({
        totalBackups: 15,
        totalSize: '672 MB',
        lastBackup: new Date().toISOString(),
        successRate: 92.5,
        diskUsage: 23,
        availableSpace: '2.1 GB',
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsCreatingBackup(true);
      
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newBackup: BackupFile = {
        id: Date.now().toString(),
        filename: `smartkuku-manual-backup-${new Date().toISOString().split('T')[0]}-${new Date().toTimeString().slice(0, 8).replace(/:/g, '-')}.sql`,
        created_at: new Date().toISOString(),
        size: '45.8 MB',
        type: 'manual',
        status: 'completed',
        description: 'Manual backup created from admin panel'
      };
      
      setBackups([newBackup, ...backups]);
      
      toast({
        title: 'Backup Created',
        description: 'Manual backup has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Backup Failed',
        description: 'Failed to create backup',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownloadBackup = (backup: BackupFile) => {
    // In real implementation, this would download the actual backup file
    toast({
      title: 'Download Started',
      description: `Downloading ${backup.filename}`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRestoreBackup = (backup: BackupFile) => {
    setSelectedBackup(backup);
    onOpen();
  };

  const confirmRestore = async () => {
    if (!selectedBackup) return;

    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onClose();
      toast({
        title: 'Restore Completed',
        description: `Database restored from ${selectedBackup.filename}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Restore Failed',
        description: 'Failed to restore from backup',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    try {
      setBackups(backups.filter(b => b.id !== backupId));
      toast({
        title: 'Backup Deleted',
        description: 'Backup file has been deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete backup',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      // In real implementation, save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSettingsClose();
      toast({
        title: 'Settings Saved',
        description: 'Backup settings have been updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'automatic': return 'blue';
      case 'manual': return 'green';
      case 'scheduled': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <Heading size="md">Backup & Recovery</Heading>
              <Text color="gray.600" fontSize="sm">
                Manage system backups, data recovery, and automated backup schedules
              </Text>
            </VStack>
            <HStack spacing={3}>
              <Button
                variant="outline"
                onClick={onSettingsOpen}
                leftIcon={<SettingsIcon />}
                size="sm"
              >
                Settings
              </Button>
              <Button
                variant="outline"
                onClick={fetchBackups}
                leftIcon={<RepeatIcon />}
                size="sm"
                isLoading={isLoading}
              >
                Refresh
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCreateBackup}
                isLoading={isCreatingBackup}
                leftIcon={<DownloadIcon />}
                size="sm"
              >
                Create Backup
              </Button>
            </HStack>
          </HStack>
        </Box>

        {/* Core Aims Explanation */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <HStack>
              <InfoIcon color="purple.500" />
              <Heading size="sm">Backup & Recovery - Core Aims</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text fontSize="sm">
                <strong>Primary Purpose:</strong> Comprehensive data protection and disaster recovery system ensuring 
                business continuity and data integrity for the Smart Kuku platform.
              </Text>
              <Divider />
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold">Key Functions & Capabilities:</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="blue.600">Automated Backup Management</Text>
                    <List spacing={1} fontSize="xs">
                      <ListIcon as={CheckIcon} color="green.500" />
                      <ListItem>• Scheduled automatic backups (hourly/daily/weekly)</ListItem>
                      <ListItem>• Configurable retention policies</ListItem>
                      <ListItem>• Compression and storage optimization</ListItem>
                      <ListItem>• Multi-location backup storage</ListItem>
                      <ListItem>• Backup integrity verification</ListItem>
                    </List>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="green.600">Data Recovery & Restoration</Text>
                    <List spacing={1} fontSize="xs">
                      <ListIcon as={CheckIcon} color="green.500" />
                      <ListItem>• Point-in-time recovery capabilities</ListItem>
                      <ListItem>• Selective data restoration</ListItem>
                      <ListItem>• Database rollback functionality</ListItem>
                      <ListItem>• Recovery testing and validation</ListItem>
                      <ListItem>• Emergency recovery procedures</ListItem>
                    </List>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="purple.600">Disaster Recovery Planning</Text>
                    <List spacing={1} fontSize="xs">
                      <ListIcon as={CheckIcon} color="green.500" />
                      <ListItem>• Business continuity assurance</ListItem>
                      <ListItem>• RTO/RPO compliance monitoring</ListItem>
                      <ListItem>• Backup storage redundancy</ListItem>
                      <ListItem>• Cross-platform compatibility</ListItem>
                      <ListItem>• Documentation and procedures</ListItem>
                    </List>
                  </VStack>
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm" fontWeight="medium" color="orange.600">Monitoring & Alerting</Text>
                    <List spacing={1} fontSize="xs">
                      <ListIcon as={CheckIcon} color="green.500" />
                      <ListItem>• Backup success/failure notifications</ListItem>
                      <ListItem>• Storage capacity monitoring</ListItem>
                      <ListItem>• Performance metrics tracking</ListItem>
                      <ListItem>• Compliance reporting</ListItem>
                      <ListItem>• Proactive issue detection</ListItem>
                    </List>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Backup Statistics */}
        <SimpleGrid columns={{ base: 2, md: 6 }} spacing={4}>
          <Stat>
            <StatLabel>Total Backups</StatLabel>
            <StatNumber>{stats.totalBackups}</StatNumber>
            <StatHelpText>All backups</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Size</StatLabel>
            <StatNumber>{stats.totalSize}</StatNumber>
            <StatHelpText>Storage used</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Last Backup</StatLabel>
            <StatNumber fontSize="sm">
              {stats.lastBackup ? new Date(stats.lastBackup).toLocaleDateString() : 'Never'}
            </StatNumber>
            <StatHelpText>Most recent</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Success Rate</StatLabel>
            <StatNumber color="green.500">{stats.successRate}%</StatNumber>
            <StatHelpText>Reliability</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Disk Usage</StatLabel>
            <StatNumber>{stats.diskUsage}%</StatNumber>
            <StatHelpText>
              <Progress value={stats.diskUsage} size="sm" colorScheme="blue" />
            </StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Available Space</StatLabel>
            <StatNumber>{stats.availableSpace}</StatNumber>
            <StatHelpText>Free storage</StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Current Settings Status */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardBody>
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="semibold">Current Backup Configuration</Text>
                <HStack spacing={4}>
                  <HStack>
                    <Text fontSize="xs">Auto Backup:</Text>
                    <Badge colorScheme={settings.autoBackupEnabled ? 'green' : 'red'}>
                      {settings.autoBackupEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Text fontSize="xs">Frequency:</Text>
                    <Badge colorScheme="blue">{settings.backupFrequency}</Badge>
                  </HStack>
                  <HStack>
                    <Text fontSize="xs">Retention:</Text>
                    <Badge colorScheme="purple">{settings.retentionDays} days</Badge>
                  </HStack>
                  <HStack>
                    <Text fontSize="xs">Location:</Text>
                    <Badge colorScheme="orange">{settings.backupLocation}</Badge>
                  </HStack>
                </HStack>
              </VStack>
              <Button size="sm" variant="outline" onClick={onSettingsOpen}>
                Configure
              </Button>
            </HStack>
          </CardBody>
        </Card>

        {/* Backup Files */}
        <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="sm">Backup Files</Heading>
              <Text fontSize="sm" color="gray.600">
                {backups.length} backup files available
              </Text>
            </HStack>
          </CardHeader>
          <CardBody p={0}>
            {isLoading ? (
              <Box p={6} textAlign="center">
                <Spinner size="lg" />
                <Text mt={4}>Loading backups...</Text>
              </Box>
            ) : (
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Filename</Th>
                      <Th>Created</Th>
                      <Th>Size</Th>
                      <Th>Type</Th>
                      <Th>Status</Th>
                      <Th>Description</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {backups.map((backup) => (
                      <Tr key={backup.id}>
                        <Td>
                          <Code fontSize="xs">{backup.filename}</Code>
                        </Td>
                        <Td fontSize="xs">
                          {new Date(backup.created_at).toLocaleString()}
                        </Td>
                        <Td fontSize="sm">{backup.size}</Td>
                        <Td>
                          <Badge colorScheme={getTypeColor(backup.type)} size="sm">
                            {backup.type}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(backup.status)} size="sm">
                            {backup.status}
                          </Badge>
                        </Td>
                        <Td fontSize="xs" maxW="200px" isTruncated>
                          {backup.description}
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Button
                              size="xs"
                              variant="ghost"
                              leftIcon={<DownloadIcon />}
                              onClick={() => handleDownloadBackup(backup)}
                            >
                              Download
                            </Button>
                            {backup.status === 'completed' && (
                              <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="green"
                                leftIcon={<RepeatIcon />}
                                onClick={() => handleRestoreBackup(backup)}
                              >
                                Restore
                              </Button>
                            )}
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              leftIcon={<DeleteIcon />}
                              onClick={() => handleDeleteBackup(backup.id)}
                            >
                              Delete
                            </Button>
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

        {/* Restore Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Database Restore</ModalHeader>
            <ModalBody>
              <Alert status="warning" borderRadius="md" mb={4}>
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm" fontWeight="medium">Warning: This action cannot be undone</Text>
                  <Text fontSize="xs">
                    Restoring from backup will replace all current data with the backup data.
                    Make sure to create a current backup before proceeding.
                  </Text>
                </VStack>
              </Alert>
              
              {selectedBackup && (
                <VStack spacing={3} align="stretch">
                  <Text fontSize="sm">
                    You are about to restore the database from:
                  </Text>
                  <Box p={3} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
                    <Text fontSize="sm" fontWeight="semibold">{selectedBackup.filename}</Text>
                    <Text fontSize="xs" color="gray.600">
                      Created: {new Date(selectedBackup.created_at).toLocaleString()}
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Size: {selectedBackup.size}
                    </Text>
                  </Box>
                  <Text fontSize="sm">
                    Are you sure you want to proceed with the restoration?
                  </Text>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button colorScheme="orange" onClick={confirmRestore}>
                Restore Database
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Settings Modal */}
        <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Backup Settings</ModalHeader>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Enable Automatic Backups</FormLabel>
                  <Switch
                    isChecked={settings.autoBackupEnabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      autoBackupEnabled: e.target.checked
                    })}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Backup Frequency</FormLabel>
                  <Select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({
                      ...settings,
                      backupFrequency: e.target.value as any
                    })}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Retention Period (days)</FormLabel>
                  <Input
                    type="number"
                    value={settings.retentionDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      retentionDays: parseInt(e.target.value)
                    })}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Backup Location</FormLabel>
                  <Select
                    value={settings.backupLocation}
                    onChange={(e) => setSettings({
                      ...settings,
                      backupLocation: e.target.value as any
                    })}
                  >
                    <option value="local">Local Storage</option>
                    <option value="cloud">Cloud Storage</option>
                    <option value="both">Both Local & Cloud</option>
                  </Select>
                </FormControl>
                
                <VStack spacing={2} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Compress Backups</FormLabel>
                    <Switch
                      isChecked={settings.compressBackups}
                      onChange={(e) => setSettings({
                        ...settings,
                        compressBackups: e.target.checked
                      })}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Include Media Files</FormLabel>
                    <Switch
                      isChecked={settings.includeMedia}
                      onChange={(e) => setSettings({
                        ...settings,
                        includeMedia: e.target.checked
                      })}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Include User Data</FormLabel>
                    <Switch
                      isChecked={settings.includeUserData}
                      onChange={(e) => setSettings({
                        ...settings,
                        includeUserData: e.target.checked
                      })}
                    />
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Include Log Files</FormLabel>
                    <Switch
                      isChecked={settings.includeLogs}
                      onChange={(e) => setSettings({
                        ...settings,
                        includeLogs: e.target.checked
                      })}
                    />
                  </FormControl>
                </VStack>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={onSettingsClose} mr={3}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default BackupRecoveryPage;
