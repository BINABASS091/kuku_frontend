import {
  Box,
  VStack,
  Heading,
  Text,
  Icon,
  useColorModeValue,
  Divider,
  Avatar,
  HStack,
  Button,
  Badge,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ViewIcon,
  SettingsIcon,
  InfoIcon,
  UnlockIcon,
} from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: ViewIcon,
    description: 'Overview & analytics',
  },
  {
    name: 'Operations',
    href: '/admin/operations',
    icon: SettingsIcon,
    description: 'Farm & device monitoring',
  },
  {
    name: 'System',
    href: '/admin/system',
    icon: SettingsIcon,
    description: 'Settings & configuration',
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: InfoIcon,
    description: 'Analytics & insights',
  },
  {
    name: 'Batches',
    href: '/admin/batches',
    icon: SettingsIcon,
    description: 'Manage batches and related data',
  },
  {
    name: 'Activities',
    href: '/admin/activities',
    icon: SettingsIcon,
    description: 'Track farm activities',
  },
  {
    name: 'Sensor Readings',
    href: '/admin/sensor-readings',
    icon: SettingsIcon,
    description: 'View sensor data and analytics',
  },
  {
    name: 'Alerts',
    href: '/admin/alerts',
    icon: SettingsIcon,
    description: 'Manage alerts and notifications',
  },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const activeColor = useColorModeValue('blue.500', 'blue.300');
  const activeBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box
      w="280px"
      h="100vh"
      bg={bg}
      borderRight="1px"
      borderColor={borderColor}
      p={6}
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <VStack spacing={4} align="stretch" mb={8}>
        <Heading size="lg" color={activeColor}>
          🐔 Smart Kuku
        </Heading>
        <Text fontSize="sm" color={textColor}>
          Poultry Management System
        </Text>
        
        {/* User Profile */}
        <Box p={4} bg={activeBg} borderRadius="lg" border="1px" borderColor={borderColor}>
          <HStack spacing={3}>
            <Avatar size="sm" name={user?.name} bg={activeColor} color="white" />
            <VStack align="start" spacing={1} flex={1}>
              <Text fontSize="sm" fontWeight="bold">
                {user?.name || 'Admin'}
              </Text>
              <HStack spacing={2}>
                <Badge colorScheme="blue" size="sm">
                  {user?.role?.toUpperCase() || 'ADMIN'}
                </Badge>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </VStack>

      <Divider mb={6} />

      {/* Navigation */}
      <VStack spacing={2} align="stretch" flex={1}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Box
              key={item.name}
              as={NavLink}
              to={item.href}
              p={3}
              borderRadius="lg"
              bg={isActive ? activeBg : 'transparent'}
              border="1px"
              borderColor={isActive ? activeColor : 'transparent'}
              _hover={{
                bg: isActive ? activeBg : useColorModeValue('gray.50', 'gray.700'),
                borderColor: isActive ? activeColor : borderColor,
                textDecoration: 'none',
              }}
              transition="all 0.2s"
            >
              <HStack spacing={3}>
                <Icon
                  as={item.icon}
                  boxSize={5}
                  color={isActive ? activeColor : textColor}
                />
                <VStack align="start" spacing={0} flex={1}>
                  <Text
                    fontSize="sm"
                    fontWeight={isActive ? 'bold' : 'medium'}
                    color={isActive ? activeColor : 'inherit'}
                  >
                    {item.name}
                  </Text>
                  <Text fontSize="xs" color={textColor}>
                    {item.description}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>

      <Divider mt={6} mb={4} />

      {/* Footer */}
      <Button
        leftIcon={<UnlockIcon />}
        variant="ghost"
        size="sm"
        onClick={logout}
        colorScheme="red"
        justifyContent="flex-start"
      >
        Logout
      </Button>
    </Box>
  );
}
