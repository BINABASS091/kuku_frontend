import { Box, Flex, Button, useColorMode, useColorModeValue, Heading } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const headerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={bg} display="flex" flexDirection="column">
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
        <Flex h={16} alignItems="center" justifyContent="space-between" maxW="container.xl" mx="auto" w="100%">
          <Flex alignItems="center">
            <Link to="/">
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
                Smart Kuku
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
      <Box as="main" flex="1" py={8} px={4} display="flex" flexDirection="column">
        <Box maxW="container.xl" w="100%" mx="auto" flex="1" display="flex" flexDirection="column">
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
