import { Box, Flex, Button, useColorMode, useColorModeValue, Heading, IconButton } from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sidebarBg = useColorModeValue('white', 'gray.800');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={bg} display="flex">
      {/* Sidebar - Desktop */}
      <Box display={{ base: 'none', md: 'block' }}>
        <AdminSidebar />
      </Box>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={30}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <Box
        position="fixed"
        top={0}
        left={0}
        w="280px"
        h="100vh"
        bg={sidebarBg}
        zIndex={40}
        transform={sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}
        transition="transform 0.3s ease"
        display={{ base: 'block', md: 'none' }}
      >
        <AdminSidebar />
      </Box>

      {/* Main Content Area */}
      <Box flex="1" display="flex" flexDirection="column" ml={{ base: 0, md: '280px' }} minW={0}>
        {/* Header */}
        <Box
          as="header"
          bg={headerBg}
          px={4}
          py={2}
          borderBottomWidth="1px"
          borderBottomColor={borderColor}
          position="sticky"
          top={0}
          zIndex={10}
        >
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <Flex alignItems="center" gap={4}>
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                icon={sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
                variant="ghost"
                aria-label="Toggle sidebar"
              />
              <Link to="/admin">
                <Heading
                  as="h1"
                  size="md"
                  bgGradient="linear(to-r, teal.500, blue.500)"
                  bgClip="text"
                  cursor="pointer"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  Smart Kuku Admin
                </Heading>
              </Link>
            </Flex>
            <Flex alignItems="center" gap={4}>
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                aria-label="Toggle color mode"
              >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
              {user && (
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={handleLogout}
                  variant="outline"
                >
                  Logout
                </Button>
              )}
            </Flex>
          </Flex>
        </Box>

        {/* Main Content */}
        <Box as="main" flex="1" py={8} px={{ base: 4, md: 6, lg: 8 }}>
          <Box w="100%">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
