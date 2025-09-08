import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  SearchIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  ChevronDownIcon,
  CheckIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import api from '../../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

interface UserFormData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  password?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Theme variables
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'FARMER',
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('users/');
      setUsers(response.data.results || response.data);
      setFilteredUsers(response.data.results || response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term and active tab
  useEffect(() => {
    let filtered = [...users];
    
    // Apply role filter based on active tab
    if (activeTab === 1) { // Farmers tab
      filtered = filtered.filter(user => user.role === 'FARMER');
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTermLower) ||
        user.email.toLowerCase().includes(searchTermLower) ||
        user.first_name.toLowerCase().includes(searchTermLower) ||
        user.last_name.toLowerCase().includes(searchTermLower) ||
        user.role.toLowerCase().includes(searchTermLower)
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, users, activeTab]);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedUser) {
        // Update existing user
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`users/${selectedUser.id}/`, updateData);
        toast({
          title: 'Success',
          description: 'User updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new user
        await api.post('users/', formData);
        toast({
          title: 'Success',
          description: 'User created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
      resetForm();
      fetchUsers();
    } catch (err: any) {
      console.error('Error saving user:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to save user';
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`users/${selectedUser.id}/`);
      toast({
        title: 'Success',
        description: 'User deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      resetForm();
      fetchUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      role: 'FARMER',
    });
    setSelectedUser(null);
  };

  // Open form for editing
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    });
    onOpen();
  };


  // Open delete confirmation
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  // Toggle user active status
  const toggleUserStatus = async (user: User) => {
    try {
      await api.patch(`users/${user.id}/`, { is_active: !user.is_active });
      toast({
        title: 'Success',
        description: `User ${user.is_active ? 'deactivated' : 'activated'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchUsers();
    } catch (err: any) {
      console.error('Error toggling user status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'red';
      case 'FARMER':
        return 'green';
      case 'ACCOUNTANT':
        return 'blue';
      case 'EXPERT':
        return 'purple';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" mb={4}>User Management</Heading>

        <Card bg={cardBg} borderColor={borderColor} mb={6}>
          <CardBody p={0}>
            <Tabs isFitted variant="enclosed" onChange={(index: number) => setActiveTab(index)}>
              <TabList>
                <Tab>All Users</Tab>
                <Tab>Farmers</Tab>
              </TabList>
              <TabPanels p={4}>
                <TabPanel p={0}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search all users by name, email, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </TabPanel>
                <TabPanel p={0}>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search farmers by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Users Table */}
        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Text fontSize="lg" fontWeight="semibold">
              Users ({filteredUsers.length})
            </Text>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Last Login</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold">
                          {user.first_name} {user.last_name}
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                          @{user.username}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge colorScheme={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={user.is_active ? 'green' : 'red'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      {user.last_login ? (
                        new Date(user.last_login).toLocaleDateString()
                      ) : (
                        'Never'
                      )}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="View user"
                          icon={<ViewIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(user)}
                        />
                        <IconButton
                          aria-label="Edit user"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => handleEdit(user)}
                        />
                        <IconButton
                          aria-label="Toggle status"
                          icon={user.is_active ? <CloseIcon /> : <CheckIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme={user.is_active ? 'red' : 'green'}
                          onClick={() => toggleUserStatus(user)}
                        />
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More actions"
                            icon={<ChevronDownIcon />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<DeleteIcon />}
                              color="red.500"
                              onClick={() => handleDeleteClick(user)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </VStack>

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser ? 'Edit User' : 'Create New User'}
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </FormControl>

                <HStack spacing={4} w="full">
                  <FormControl isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="FARMER">Farmer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="EXPERT">Expert</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Password {selectedUser && '(leave blank to keep current)'}</FormLabel>
                  <Input
                    type="password"
                    value={formData.password || ''}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <Box p={6} pt={0}>
              <HStack spacing={3} justify="flex-end">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  loadingText="Saving..."
                >
                  {selectedUser ? 'Update' : 'Create'}
                </Button>
              </HStack>
            </Box>
          </form>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete user "{selectedUser?.first_name} {selectedUser?.last_name}"?
              This action cannot be undone.
            </Text>
          </ModalBody>
          <Box p={6} pt={0}>
            <HStack spacing={3} justify="flex-end">
              <Button variant="ghost" onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                leftIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </HStack>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement;
