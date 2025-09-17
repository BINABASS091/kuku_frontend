import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Heading,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon, SettingsIcon } from '@chakra-ui/icons';
import { FiHome, FiLayers, FiActivity, FiTrendingUp, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FarmerSidebar from '../components/farmer/FarmerSidebar';

interface FarmerLayoutProps {
  children: React.ReactNode;
}

const FarmerLayout = ({ children }: FarmerLayoutProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');

  // Mock notification count - in real app, fetch from API
  const [notificationCount, setNotificationCount] = useState(3);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 2000,
    });
  };

  const handleProfileClick = () => {
    navigate('/farmer/profile');
  };

  const handleSettingsClick = () => {
    navigate('/farmer/settings');
  };

  return (
    <Box minH="100vh" bg={bg}>
      {/* Mobile Sidebar */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Text fontWeight="bold" color="green.500">Smart Kuku</Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            <FarmerSidebar onNavigation={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Flex>
        {/* Desktop Sidebar */}
        <Box
          display={{ base: 'none', lg: 'block' }}
          w="280px"
          h="100vh"
          position="fixed"
          left={0}
          top={0}
          bg={headerBg}
          borderRightWidth="1px"
          borderColor={borderColor}
          overflowY="auto"
          zIndex={10}
        >
          <FarmerSidebar />
        </Box>

        {/* Main Content */}
        <Box
          flex="1"
          ml={{ base: 0, lg: "280px" }}
          transition="margin 0.3s"
        >
          {/* Header */}
          <Box
            bg={headerBg}
            borderBottomWidth="1px"
            borderColor={borderColor}
            px={4}
            py={3}
            position="sticky"
            top={0}
            zIndex={9}
          >
            <Flex align="center" justify="space-between">
              {/* Left side */}
              <HStack spacing={4}>
                <IconButton
                  display={{ base: 'flex', lg: 'none' }}
                  onClick={onOpen}
                  variant="ghost"
                  aria-label="Open menu"
                  icon={<HamburgerIcon />}
                />
                <VStack align="start" spacing={0}>
                  <Heading size="md" color={textColor}>
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    Welcome back, {user?.first_name || user?.username}
                  </Text>
                </VStack>
              </HStack>

              {/* Right side */}
              <HStack spacing={4}>
                {/* Notifications */}
                <Box position="relative">
                  <IconButton
                    aria-label="Notifications"
                    icon={<BellIcon />}
                    variant="ghost"
                    onClick={() => navigate('/farmer/notifications')}
                  />
                  {notificationCount > 0 && (
                    <Badge
                      position="absolute"
                      top="-1"
                      right="-1"
                      colorScheme="red"
                      borderRadius="full"
                      fontSize="xs"
                      minW="18px"
                      h="18px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Badge>
                  )}
                </Box>

                {/* Theme toggle */}
                <IconButton
                  aria-label="Toggle color mode"
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  variant="ghost"
                />

                {/* User menu */}
                <Menu>
                  <MenuButton>
                    <HStack spacing={2} cursor="pointer">
                      <Avatar
                        size="sm"
                        name={user?.first_name || user?.username}
                        src={user?.profile_image}
                      />
                      <VStack display={{ base: 'none', md: 'flex' }} spacing={0} align="start">
                        <Text fontSize="sm" fontWeight="medium">
                          {user?.first_name || user?.username}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Farmer
                        </Text>
                      </VStack>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiUser />} onClick={handleProfileClick}>
                      Profile
                    </MenuItem>
                    <MenuItem icon={<FiSettings />} onClick={handleSettingsClick}>
                      Settings
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Flex>
          </Box>

          {/* Page Content */}
          <Box p={{ base: 4, md: 6 }}>
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default FarmerLayout;
