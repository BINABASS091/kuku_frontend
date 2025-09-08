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
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created. Please log in.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Redirect to login; users will log in and be redirected by role
      navigate('/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration',
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
                  Create your account
                </Heading>
                <Text color={textColor}>
                  Join Smart Kuku and start managing your farm today
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
                    <FormControl id="name" isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
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
                    transition={{ duration: 0.3, delay: 0.25 }}
                    style={{ width: '100%' }}
                  >
                    <FormControl id="email" isRequired>
                      <FormLabel>Email address</FormLabel>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        autoComplete="email"
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
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          autoComplete="new-password"
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    style={{ width: '100%' }}
                  >
                    <FormControl id="confirmPassword" isRequired>
                      <FormLabel>Confirm Password</FormLabel>
                      <InputGroup>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          size="lg"
                          focusBorderColor="blue.400"
                          _hover={{
                            borderColor: 'blue.300',
                          }}
                        />
                        <InputRightElement h="full" pr={2}>
                          <IconButton
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    style={{ width: '100%', marginTop: '1rem' }}
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
                      loadingText="Creating account..."
                      _hover={{
                        transform: 'translateY(-2px)',
                        boxShadow: 'lg',
                      }}
                      transition="all 0.2s"
                    >
                      Create Account
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
                  Already have an account?{' '}
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="link"
                    colorScheme="blue"
                    fontWeight="semibold"
                    p={1}
                    _hover={{
                      textDecoration: 'none',
                      color: 'blue.500',
                    }}
                  >
                    Sign in
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

export default Register;
