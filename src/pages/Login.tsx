import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
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
  Flex,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Animation keyframes
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

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
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      px={4}
      py={8}
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
      
      <Container 
        maxW="container.sm" 
        position="relative" 
        zIndex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex="1"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%' }}
        >
          <Box
            bg={cardBg}
            p={8}
            borderRadius="xl"
            boxShadow="xl"
            position="relative"
            overflow="hidden"
            w="100%"
            maxW="md"
            mx="auto"
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
      </Container>
    </Box>
  );
};

export default Login;
