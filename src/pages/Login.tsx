import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  // Removed unused Container and Flex after layout refactor
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// (Reserved for future subtle background animation)

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const bgGradient = useColorModeValue(
    'linear(to-r, teal.400, blue.500)',
    'linear(to-r, teal.500, blue.600)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const headingColor = useColorModeValue('gray.800', 'white');
  
  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      alignItems="stretch"
      w="100%"
    >
      {/* Animated background elements */}
      <Box
        position="absolute"
        top="-10%"
        right="0"
        width="300px"
        height="300px"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
        filter="blur(40px)"
      />
      <Box
        position="absolute"
        bottom="-10%"
        left="0"
        width="400px"
        height="400px"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
        filter="blur(40px)"
      />
      
      {/* Left panel (form) */}
      <Box
        flexBasis={{ base: '100%', md: '45%', lg: '38%' }}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        px={{ base: 6, md: 12 }}
        py={{ base: 10, md: 12 }}
        position="relative"
        zIndex={1}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%' }}
        >
          <Box
            bg={cardBg}
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            boxShadow="xl"
            position="relative"
            overflow="hidden"
            w="100%"
            maxW={{ base: '100%', md: '420px' }}
            mx="0"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              bgGradient: 'linear(to-r, teal.400, blue.500)',
            }}
          >
            <Button
              as={RouterLink}
              to="/"
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              size="sm"
              mb={6}
              pl={0}
              color={textColor}
              _hover={{
                textDecoration: 'none',
                color: 'blue.500',
              }}
            >
              Back to home
            </Button>
            
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Box
                    display="inline-flex"
                    p={3}
                    borderRadius="lg"
                    bgGradient={bgGradient}
                    color="white"
                    boxShadow="md"
                    mb={4}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </Box>
                </motion.div>
                
                <Heading size="xl" color={headingColor} mb={2}>
                  Welcome back!
                </Heading>
                <Text color={textColor}>
                  Sign in to access your Smart Kuku account
                </Text>
              </Box>

              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    style={{ width: '100%' }}
                  >
                    <FormControl id="email" isRequired>
                      <FormLabel>Username or Email</FormLabel>
                      <Input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your username or email"
                        autoComplete="username"
                        size="lg"
                        focusBorderColor="blue.400"
                        _hover={{
                          borderColor: 'blue.300',
                        }}
                      />
                    </FormControl>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    style={{ width: '100%' }}
                  >
                    <FormControl id="password" isRequired>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          size="lg"
                          focusBorderColor="blue.400"
                          _hover={{
                            borderColor: 'blue.300',
                          }}
                        />
                        <InputRightElement h="full" pr={2}>
                          <IconButton
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            _hover={{
                              bg: 'transparent',
                              color: 'blue.500',
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    style={{ width: '100%', marginTop: '1.5rem' }}
                  >
                    <Button
                      type="submit"
                      colorScheme="blue"
                      width="full"
                      size="lg"
                      py={6}
                      fontSize="lg"
                      fontWeight="bold"
                      borderRadius="lg"
                      isLoading={isLoading}
                      loadingText="Signing in..."
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </VStack>
              </form>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Text textAlign="center" mt={6} color={textColor}>
                  Don't have an account?{' '}
                  <Button
                    as={RouterLink}
                    to="/register"
                    variant="link"
                    colorScheme="blue"
                    fontWeight="semibold"
                    p={1}
                    _hover={{
                      textDecoration: 'none',
                      color: 'blue.500',
                    }}
                  >
                    Sign up now
                  </Button>
                </Text>
              </motion.div>
            </VStack>
          </Box>
        </motion.div>
      </Box>
      {/* Right visual / branding panel */}
      <Box
        flexGrow={1}
        display={{ base: 'none', md: 'flex' }}
        alignItems="center"
        justifyContent="center"
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          inset: 0,
          bgGradient: 'linear(to-r, rgba(0,0,0,0.15), rgba(0,0,0,0))',
        }}
      >
        <Box textAlign="center" color="white" px={10} maxW="640px">
          <Heading size="2xl" mb={6} lineHeight="1.15">Smart Poultry Management</Heading>
          <Text fontSize="lg" opacity={0.9} mb={4}>Monitor, optimize and grow your poultry operations with data‑driven insights.</Text>
          <Text fontSize="md" opacity={0.8}>Secure platform • Real‑time monitoring • Actionable recommendations</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
