import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Button,
  Divider,
  Badge,
  Avatar,
  Progress,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  FiHome,
  FiLayers,
  FiActivity,
  FiTrendingUp,
  FiSettings,
  FiUser,
  FiDollarSign,
  FiBarChart2,
  FiCalendar,
  FiHeart,
  FiMapPin,
  FiStar,
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SidebarItemProps {
  icon: any;
  label: string;
  href?: string;
  children?: SidebarItemProps[];
  badge?: string | number;
  badgeColor?: string;
  onClick?: () => void;
}

interface FarmerSidebarProps {
  onNavigation?: () => void;
}

const SidebarItem = ({ icon, label, href, children, badge, badgeColor = 'blue', onClick }: SidebarItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const hasChildren = !!(children && children.length);
  const location = useLocation();

  const hoverBg = useColorModeValue('green.50', 'green.900');
  const activeBg = useColorModeValue('green.100', 'green.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const activeTextColor = useColorModeValue('green.700', 'green.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const activeIconColor = useColorModeValue('green.600', 'green.300');

  const isCurrentActive = href ? location.pathname === href : false;

  const handleClick = () => {
    if (onClick) onClick();
    if (hasChildren) onToggle();
  };

  if (hasChildren) {
    return (
      <Box>
        <Button
          variant="ghost"
          justifyContent="flex-start"
          leftIcon={<Icon as={icon} color={iconColor} />}
          rightIcon={isOpen ? <ChevronDownIcon color={iconColor} /> : <ChevronRightIcon color={iconColor} />}
          onClick={handleClick}
          w="full"
          h="auto"
          py={3}
          px={4}
          textAlign="left"
          fontWeight="medium"
          color={textColor}
          borderRadius="lg"
          _hover={{ bg: hoverBg, transform: 'translateX(2px)' }}
          _active={{ bg: hoverBg }}
          transition="all 0.2s"
        >
          <HStack justify="space-between" w="full">
            <Text fontSize="sm">{label}</Text>
            {badge && (
              <Badge colorScheme={badgeColor} variant="subtle" fontSize="xs" borderRadius="full">
                {badge}
              </Badge>
            )}
          </HStack>
        </Button>
        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={0} align="stretch" pl={6} mt={1}>
            {children!.map((child, index) => (
              <SidebarItem key={index} {...child} />
            ))}
          </VStack>
        </Collapse>
      </Box>
    );
  }

  return (
    <Button
      as={href ? (Link as any) : 'button'}
      to={href as any}
      variant="ghost"
      justifyContent="flex-start"
      leftIcon={<Icon as={icon} color={isCurrentActive ? activeIconColor : iconColor} />}
      w="full"
      h="auto"
      py={3}
      px={4}
      textAlign="left"
      fontWeight="medium"
      color={isCurrentActive ? activeTextColor : textColor}
      bg={isCurrentActive ? activeBg : 'transparent'}
      borderRadius="lg"
      _hover={{ bg: hoverBg, transform: 'translateX(2px)' }}
      transition="all 0.2s"
      onClick={handleClick}
    >
      <HStack spacing={3} flex="1" justify="space-between">
        <Text fontSize="sm">{label}</Text>
        {badge && (
          <Badge colorScheme={badgeColor} variant="subtle" fontSize="xs" borderRadius="full">
            {badge}
          </Badge>
        )}
      </HStack>
    </Button>
  );
};

const FarmerSidebar = ({ onNavigation }: FarmerSidebarProps) => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { user } = useAuth();

  // Mock farmer stats - in real app, these would come from API
  const [farmerStats, setFarmerStats] = useState({
    activeBatches: 3,
    totalBirds: 250,
    tasksToday: 5,
    notifications: 7,
    farmHealth: 85,
    subscription: 'Active',
  });

  const handleNavigation = () => {
    if (onNavigation) {
      onNavigation();
    }
  };

  const sidebarItems: SidebarItemProps[] = [
    {
      icon: FiHome,
      label: 'Dashboard',
      href: '/farmer',
      onClick: handleNavigation,
    },
    {
      icon: FiMapPin,
      label: 'My Farms',
      href: '/farmer/farms',
      badge: farmerStats.activeBatches,
      badgeColor: 'green',
      onClick: handleNavigation,
    },
    {
      icon: FiLayers,
      label: 'Batches',
      href: '/farmer/batches',
      badge: farmerStats.activeBatches,
      badgeColor: 'green',
      onClick: handleNavigation,
    },
    {
      icon: FiCalendar,
      label: 'Daily Tasks',
      href: '/farmer/tasks',
      badge: farmerStats.tasksToday,
      badgeColor: 'orange',
      onClick: handleNavigation,
    },
    {
      icon: FiHeart,
      label: 'Health Monitoring',
      onClick: handleNavigation,
      children: [
        {
          icon: FiHeart,
          label: 'Health Overview',
          href: '/farmer/health',
          onClick: handleNavigation,
        },
        {
          icon: FiActivity,
          label: 'Alerts',
          href: '/farmer/health/alerts',
          badge: 2,
          badgeColor: 'red',
          onClick: handleNavigation,
        },
        {
          icon: FiTrendingUp,
          label: 'Reports',
          href: '/farmer/health/reports',
          onClick: handleNavigation,
        },
      ],
    },
    {
      icon: FiTrendingUp,
      label: 'Analytics',
      onClick: handleNavigation,
      children: [
        {
          icon: FiBarChart2,
          label: 'Production',
          href: '/farmer/analytics/production',
          onClick: handleNavigation,
        },
        {
          icon: FiDollarSign,
          label: 'Financial',
          href: '/farmer/analytics/financial',
          onClick: handleNavigation,
        },
        {
          icon: FiTrendingUp,
          label: 'Growth Trends',
          href: '/farmer/analytics/growth',
          onClick: handleNavigation,
        },
      ],
    },
    {
      icon: FiStar,
      label: 'Breed Guidance',
      href: '/farmer/guidance',
      onClick: handleNavigation,
    },
    {
      icon: FiDollarSign,
      label: 'Subscription',
      href: '/farmer/subscription',
      badge: farmerStats.subscription,
      badgeColor: 'green',
      onClick: handleNavigation,
    },
  ];

  return (
    <Box
      h="100vh"
      bg={bg}
      borderRightWidth="1px"
      borderRightColor={borderColor}
      overflowY="auto"
      p={4}
    >
      <VStack spacing={0} align="stretch">
        {/* Logo/Brand */}
        <Box mb={6} textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="green.500" mb={1}>
            Smart Kuku
          </Text>
          <Text fontSize="xs" color={textColor}>
            Farmer Portal
          </Text>
        </Box>

        {/* User Info Card */}
        <Box
          p={4}
          bg={useColorModeValue('green.50', 'green.900')}
          borderRadius="xl"
          border="1px solid"
          borderColor={useColorModeValue('green.200', 'green.700')}
          mb={6}
        >
          <VStack spacing={3}>
            <Avatar
              size="md"
              name={user?.first_name || user?.username}
              src={user?.profile_image}
            />
            <VStack spacing={0}>
              <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('green.700', 'green.200')}>
                {user?.first_name || user?.username}
              </Text>
              <Text fontSize="xs" color={textColor}>
                Poultry Farmer
              </Text>
            </VStack>
            
            <Box w="full">
              <HStack justify="space-between" mb={1}>
                <Text fontSize="xs" color={textColor}>Farm Health</Text>
                <Text fontSize="xs" fontWeight="semibold" color="green.500">
                  {farmerStats.farmHealth}%
                </Text>
              </HStack>
              <Progress
                value={farmerStats.farmHealth}
                size="sm"
                colorScheme="green"
                borderRadius="full"
              />
            </Box>
          </VStack>
        </Box>

        {/* Quick Stats */}
        <Box mb={4}>
          <Text fontSize="xs" fontWeight="semibold" color={textColor} mb={3} textTransform="uppercase" letterSpacing="wide">
            Quick Overview
          </Text>
          <VStack spacing={2}>
            <HStack justify="space-between" w="full">
              <Text fontSize="sm" color={textColor}>Active Batches</Text>
              <Badge colorScheme="green" variant="subtle">{farmerStats.activeBatches}</Badge>
            </HStack>
            <HStack justify="space-between" w="full">
              <Text fontSize="sm" color={textColor}>Total Birds</Text>
              <Badge colorScheme="blue" variant="subtle">{farmerStats.totalBirds}</Badge>
            </HStack>
            <HStack justify="space-between" w="full">
              <Text fontSize="sm" color={textColor}>Tasks Today</Text>
              <Badge colorScheme="orange" variant="subtle">{farmerStats.tasksToday}</Badge>
            </HStack>
          </VStack>
        </Box>

        <Divider mb={4} />

        {/* Navigation Items */}
        <VStack spacing={1} align="stretch">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </VStack>

        {/* Footer */}
        <Box mt="auto" pt={4}>
          <Divider mb={3} />
          <VStack spacing={1}>
            <Text fontSize="xs" color={textColor} textAlign="center" fontWeight="medium">
              Smart Kuku v1.0.0
            </Text>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              © 2024 Poultry Management
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default FarmerSidebar;
