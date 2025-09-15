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
  Tooltip,
  IconButton,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SettingsIcon,
  ViewIcon,
  ExternalLinkIcon,
  RepeatIcon,
  BellIcon,
} from '@chakra-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface SidebarItemProps {
  icon: any;
  label: string;
  href?: string;
  children?: SidebarItemProps[];
  badge?: string | number;
  tooltip?: string;
  isExternal?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, href, children, badge, tooltip, isExternal, onClick }: SidebarItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const hasChildren = children && children.length > 0;
  const location = useLocation();
  
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const activeTextColor = useColorModeValue('blue.600', 'blue.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const activeIconColor = useColorModeValue('blue.500', 'blue.300');

  const isCurrentActive = href ? location.pathname === href : false;

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (hasChildren) {
      onToggle();
    }
  };

  if (hasChildren) {
    return (
      <Box>
        <Tooltip label={tooltip} placement="right" hasArrow>
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
            borderRadius="md"
            _hover={{ 
              bg: hoverBg,
              transform: 'translateX(2px)',
            }}
            _active={{ bg: hoverBg }}
            transition="all 0.2s"
          >
            <HStack justify="space-between" w="full">
              <Text fontSize="sm">{label}</Text>
              {badge && (
                <Badge colorScheme="blue" variant="subtle" fontSize="xs" borderRadius="full">
                  {badge}
                </Badge>
              )}
            </HStack>
          </Button>
        </Tooltip>
        <Collapse in={isOpen} animateOpacity>
          <VStack spacing={0} align="stretch" pl={6} mt={1}>
            {children.map((child, index) => (
              <SidebarItem key={index} {...child} />
            ))}
          </VStack>
        </Collapse>
      </Box>
    );
  }

  const buttonContent = href && !isExternal ? (
    <Button
      as={Link}
      to={href}
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
      borderRadius="md"
      _hover={{ 
        bg: hoverBg 
      }}
      transition="all 0.2s"
      onClick={handleClick}
    >
      <HStack spacing={3} flex="1" justify="space-between">
        <Text>{label}</Text>
        {badge && (
          <Badge colorScheme="blue" size="sm">
            {badge}
          </Badge>
        )}
        {hasChildren && <Icon as={isOpen ? ChevronDownIcon : ChevronRightIcon} />}
      </HStack>
    </Button>
  ) : (
    <Button
      as={isExternal ? 'a' : 'button'}
      href={isExternal ? href : undefined}
      target={isExternal ? '_blank' : undefined}
      variant="ghost"
      justifyContent="flex-start"
      leftIcon={<Icon as={icon} color={isCurrentActive ? activeIconColor : iconColor} />}
      rightIcon={isExternal ? <ExternalLinkIcon color={iconColor} /> : undefined}
      w="full"
      h="auto"
      py={3}
      px={4}
      textAlign="left"
      fontWeight="medium"
      color={isCurrentActive ? activeTextColor : textColor}
      bg={isCurrentActive ? activeBg : 'transparent'}
      borderRadius="md"
      _hover={{ 
        bg: hoverBg 
      }}
      transition="all 0.2s"
      onClick={handleClick}
    >
      <HStack spacing={3} flex="1" justify="space-between">
        <Text>{label}</Text>
        {badge && (
          <Badge colorScheme="blue" size="sm">
            {badge}
          </Badge>
        )}
        {hasChildren && <Icon as={isOpen ? ChevronDownIcon : ChevronRightIcon} />}
      </HStack>
    </Button>
  );

  return tooltip ? (
    <Tooltip label={tooltip} placement="right" hasArrow>
      {buttonContent}
    </Tooltip>
  ) : buttonContent;
};

const AdminSidebar = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const { user } = useAuth();
  const toast = useToast();

  // Mock data for badges - in real app, these would come from API
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    activeFarms: 0,
    totalDevices: 0,
    activeSubscriptions: 0,
    pendingTasks: 0,
    alerts: 0,
    batches: 0,
    activities: 0,
    sensorReadings: 0,
  });

  useEffect(() => {
    // In a real app, you would fetch these stats from your API
    // For now, using mock data
    setStats({
      totalUsers: 156,
      totalFarmers: 89,
      activeFarms: 67,
      totalDevices: 234,
      activeSubscriptions: 45,
      pendingTasks: 12,
      alerts: 3,
      batches: 120,
      activities: 350,
      sensorReadings: 890,
    });
  }, []);

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "All dashboard data has been updated.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const sidebarItems: SidebarItemProps[] = [
    {
      icon: ViewIcon,
      label: 'Dashboard',
      href: '/admin',
      tooltip: 'Main admin dashboard with system overview',
    },
    {
      icon: SettingsIcon,
      label: 'User Management',
      children: [
        {
          icon: ViewIcon,
          label: 'All Users',
          href: '/admin/users',
          badge: stats.totalUsers,
          tooltip: 'Manage all system users',
        },
        {
          icon: ViewIcon,
          label: 'Farmers',
          href: '/admin/farmers',
          badge: stats.totalFarmers,
          tooltip: 'Manage farmer accounts and profiles',
        },
      ],
    },
    {
      icon: SettingsIcon,
      label: 'Farm Operations',
      href: '/admin/farms',
      badge: stats.activeFarms + stats.totalDevices + stats.batches + stats.activities + stats.sensorReadings + stats.alerts,
      tooltip: 'Comprehensive farm management with farms, devices, batches, activities, sensor readings, and alerts',
    },
    {
      icon: SettingsIcon,
      label: 'Relational Master Data',
      href: '/admin/relational-master-data',
      tooltip: 'Complete relational database management with all model relationships',
    },
    {
      icon: SettingsIcon,
      label: 'Subscriptions & Billing',
      href: '/admin/subscriptions-billing',
      tooltip: 'Manage subscriptions, payments, resources, and billing reports in one place',
    },
    {
      icon: SettingsIcon,
      label: 'System Administration',
      href: '/admin/system-administration',
      tooltip: 'Comprehensive system management, configuration, and administrative tools',
    },
    {
      icon: SettingsIcon,
      label: 'Reports & Analytics',
      href: '/admin/reports',
      tooltip: 'Comprehensive analytics, performance reports, and data insights across all farm operations',
    },
  ];

  return (
    <Box
      w="280px"
      h="100vh"
      bg={bg}
      borderRightWidth="1px"
      borderRightColor={borderColor}
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
      zIndex={20}
      boxShadow="xl"
      _dark={{
        bg: 'gray.800',
        borderRightColor: 'gray.700',
      }}
    >
      <VStack spacing={0} align="stretch" p={4}>
        {/* Header */}
        <Box mb={4}>
          <HStack justify="space-between" mb={3}>
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>
                Smart Kuku
              </Text>
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                Admin Panel
              </Text>
            </VStack>
            <HStack spacing={1}>
              <Tooltip label="Refresh Data" placement="bottom">
                <IconButton
                  aria-label="Refresh data"
                  icon={<RepeatIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={handleRefreshData}
                  colorScheme="blue"
                />
              </Tooltip>
              <Tooltip label="Notifications" placement="bottom">
                <IconButton
                  aria-label="Notifications"
                  icon={<BellIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme={stats.alerts > 0 ? "red" : "gray"}
                  position="relative"
                >
                  {stats.alerts > 0 && (
                    <Badge
                      position="absolute"
                      top="-1"
                      right="-1"
                      colorScheme="red"
                      borderRadius="full"
                      fontSize="xs"
                      minW="16px"
                      h="16px"
                    >
                      {stats.alerts}
                    </Badge>
                  )}
                </IconButton>
              </Tooltip>
            </HStack>
          </HStack>
          <Text fontSize="sm" color={textColor} mb={3}>
            Welcome, {user?.name || 'Admin'}
          </Text>
          <Divider />
        </Box>
        
        {/* Quick Stats */}
        <Box mb={4} p={3} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="lg" border="1px solid" borderColor={useColorModeValue('blue.200', 'blue.700')}>
          <Text fontSize="sm" fontWeight="semibold" mb={3} color={useColorModeValue('blue.700', 'blue.200')}>
            System Overview
          </Text>
          <SimpleGrid columns={2} spacing={3}>
            <Box textAlign="center" p={2} bg={useColorModeValue('white', 'gray.800')} borderRadius="md" border="1px solid" borderColor={useColorModeValue('blue.100', 'blue.600')}>
              <Text fontSize="xs" color={textColor} mb={1}>Users</Text>
              <Text fontSize="lg" fontWeight="bold" color="blue.500">{stats.totalUsers}</Text>
            </Box>
            <Box textAlign="center" p={2} bg={useColorModeValue('white', 'gray.800')} borderRadius="md" border="1px solid" borderColor={useColorModeValue('blue.100', 'blue.600')}>
              <Text fontSize="xs" color={textColor} mb={1}>Farms</Text>
              <Text fontSize="lg" fontWeight="bold" color="green.500">{stats.activeFarms}</Text>
            </Box>
            <Box textAlign="center" p={2} bg={useColorModeValue('white', 'gray.800')} borderRadius="md" border="1px solid" borderColor={useColorModeValue('blue.100', 'blue.600')}>
              <Text fontSize="xs" color={textColor} mb={1}>Devices</Text>
              <Text fontSize="lg" fontWeight="bold" color="purple.500">{stats.totalDevices}</Text>
            </Box>
            <Box textAlign="center" p={2} bg={useColorModeValue('white', 'gray.800')} borderRadius="md" border="1px solid" borderColor={useColorModeValue('blue.100', 'blue.600')}>
              <Text fontSize="xs" color={textColor} mb={1}>Subscriptions</Text>
              <Text fontSize="lg" fontWeight="bold" color="orange.500">{stats.activeSubscriptions}</Text>
            </Box>
          </SimpleGrid>
        </Box>
        
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
              © 2024 Poultry Management System
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminSidebar;
