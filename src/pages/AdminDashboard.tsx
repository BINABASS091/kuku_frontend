import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useColorModeValue,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
} from "@chakra-ui/react";
import { AddIcon, ViewIcon, SettingsIcon, StarIcon, CheckCircleIcon, InfoIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { dashboardAPI } from "../services/api";
import type { DashboardStats } from "../types";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("users");
  
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataManagement = (tab: string) => {
    setActiveTab(tab);
    onOpen();
  };

  const statsData = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: ViewIcon,
      color: "blue.500",
      change: { value: 12, isPositive: true },
    },
    {
      label: "Active Farmers",
      value: stats?.totalFarmers ?? 0,
      icon: SettingsIcon,
      color: "green.500",
      change: { value: 8, isPositive: true },
    },
    {
      label: "Active Farms",
      value: stats?.activeFarms ?? 0,
      icon: InfoIcon,
      color: "teal.500",
      change: { value: 5, isPositive: true },
    },
    {
      label: "Monthly Revenue",
      value: stats?.monthlyRevenue ? `$${stats.monthlyRevenue.toLocaleString()}` : "$0",
      icon: StarIcon,
      color: "purple.500",
      change: { value: 15, isPositive: true },
    },
    {
      label: "Active Subscriptions",
      value: stats?.activeSubscriptions ?? 0,
      icon: CheckCircleIcon,
      color: "orange.500",
      change: { value: 10, isPositive: true },
    },
    {
      label: "Total Devices",
      value: stats?.totalDevices ?? 0,
      icon: SettingsIcon,
      color: "cyan.500",
      change: { value: 3, isPositive: true },
    },
  ];

  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={8}>
          <Spinner size="xl" />
          <Text>Loading dashboard...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            Admin Dashboard
          </Heading>
          <Text color={textColor}>
            Welcome back, {user?.name || "Admin"}! 👋
          </Text>
        </Box>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {statsData.map((stat, index) => (
            <Card key={index} bg={cardBg} boxShadow="lg" borderRadius="xl">
              <CardBody p={6}>
                <Stat>
                  <Flex justify="space-between" align="start" mb={2}>
                    <StatLabel color={textColor} fontSize="sm" fontWeight="medium">
                      {stat.label}
                    </StatLabel>
                    <stat.icon color={stat.color} />
                  </Flex>
                  <StatNumber color={stat.color} fontSize="2xl" fontWeight="bold" mb={1}>
                    {stat.value}
                  </StatNumber>
                  <StatHelpText fontSize="xs" mb={0}>
                    <StatArrow type={stat.change.isPositive ? "increase" : "decrease"} />
                    {stat.change.value}% from last month
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Quick Actions */}
        <Card bg={cardBg} boxShadow="lg" borderRadius="xl">
          <CardBody p={6}>
            <Heading size="md" mb={4}>Quick Actions</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                variant="outline"
                onClick={() => handleDataManagement("users")}
              >
                Manage Users
              </Button>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="green"
                variant="outline"
                onClick={() => handleDataManagement("farms")}
              >
                Manage Farms
              </Button>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="purple"
                variant="outline"
                onClick={() => handleDataManagement("batches")}
              >
                Manage Batches
              </Button>
              <Button
                leftIcon={<ViewIcon />}
                colorScheme="orange"
                variant="outline"
                onClick={() => handleDataManagement("breeds")}
              >
                View Breeds
              </Button>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Data Management Modal Placeholder */}
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Data Management - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Modal-based data management for {activeTab} will be implemented here.</Text>
              <Text>This follows the user's requirement to avoid multiple sidebar pages.</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default AdminDashboard;
