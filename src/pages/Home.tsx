import { Box, Heading, Text, Button, VStack, Container, Flex, useColorModeValue } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Home = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, teal.400, blue.500)',
    'linear(to-r, teal.500, blue.600)'
  );
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  
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
        maxW="container.lg" 
        py={16} 
        position="relative" 
        zIndex={1} 
        display="flex" 
        flexDirection="column" 
        alignItems="center"
        justifyContent="center"
        flex="1"
      >
        <VStack 
          spacing={8} 
          textAlign="center" 
          w="100%" 
          maxW="2xl"
          mx="auto"
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
              textAlign="center"
              w="100%"
              position="relative"
              overflow="hidden"
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
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  display: 'inline-block',
                  marginBottom: '1.5rem'
                }}
              >
                <Box
                  as="span"
                  display="inline-block"
                  p={4}
                  borderRadius="lg"
                  bgGradient={bgGradient}
                  color="white"
                  boxShadow="lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                  </svg>
                </Box>
              </motion.div>
              
              <Heading 
                as="h1" 
                size="2xl" 
                mb={4} 
                bgGradient={bgGradient}
                bgClip="text"
                fontWeight="extrabold"
              >
                Welcome to Smart Kuku
              </Heading>
              
              <Text 
                fontSize="xl" 
                mb={8} 
                color={textColor}
                maxW="2xl" 
                mx="auto"
                lineHeight="tall"
              >
                Transform your poultry farming with our comprehensive farm management solution. 
                Monitor, manage, and grow your business with ease.
              </Text>
              
              <VStack spacing={6} maxW="md" mx="auto">
                <Button
                  as={RouterLink}
                  to="/login"
                  colorScheme="teal"
                  size="lg"
                  width="100%"
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="lg"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Get Started - Login
                </Button>
                
                <Text color={textColor} my={2}>
                  Don't have an account?{' '}
                  <Button 
                    as={RouterLink} 
                    to="/register" 
                    variant="link" 
                    colorScheme="blue"
                    fontSize="lg"
                    fontWeight="semibold"
                    _hover={{
                      textDecoration: 'none',
                      color: 'blue.500',
                    }}
                  >
                    Sign up now
                  </Button>
                </Text>
              </VStack>
              
              <Flex 
                mt={12} 
                justify="center" 
                gap={8} 
                flexWrap="wrap"
                color={textColor}
              >
                <Flex align="center" gap={2}>
                  <Box w={3} h={3} borderRadius="full" bg="green.400" />
                  <Text>Real-time Monitoring</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Box w={3} h={3} borderRadius="full" bg="blue.400" />
                  <Text>Smart Analytics</Text>
                </Flex>
                <Flex align="center" gap={2}>
                  <Box w={3} h={3} borderRadius="full" bg="purple.400" />
                  <Text>24/7 Support</Text>
                </Flex>
              </Flex>
            </Box>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home;
