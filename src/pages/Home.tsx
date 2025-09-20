import { Box, Heading, Text, Button, VStack, Container, Flex, useColorModeValue, Icon } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFeather, FiTrendingUp, FiShield } from 'react-icons/fi';

const Home = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, rgba(56, 178, 172, 0.9), rgba(59, 130, 246, 0.8))',
    'linear(to-br, rgba(56, 178, 172, 0.8), rgba(59, 130, 246, 0.7))'
  );
  
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.85)', 'rgba(26, 32, 44, 0.85)');
  const textColor = useColorModeValue('gray.800', 'white');
  const overlayBg = useColorModeValue('rgba(255, 255, 255, 0.05)', 'rgba(0, 0, 0, 0.1)');
  
  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}
      </style>
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      px={4}
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/images/5.jpeg)',
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.8,
        zIndex: 0,
      }}
      bgGradient={bgGradient}
    >
      {/* Minimal overlay for slight text contrast */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={overlayBg}
        zIndex={1}
      />
      {/* Enhanced animated background elements */}
      <Box
        position="absolute"
        top="-5%"
        right="-5%"
        width="400px"
        height="400px"
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.08)"
        filter="blur(50px)"
        zIndex={1}
        animation="float 6s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="-5%"
        left="-5%"
        width="500px"
        height="500px"
        borderRadius="full"
        bg="rgba(56, 178, 172, 0.1)"
        filter="blur(60px)"
        zIndex={1}
        animation="float 8s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        top="20%"
        left="10%"
        width="200px"
        height="200px"
        borderRadius="full"
        bg="rgba(59, 130, 246, 0.08)"
        filter="blur(40px)"
        zIndex={1}
        animation="float 10s ease-in-out infinite"
      />
      
      <Container 
        maxW="container.lg" 
        py={20} 
        position="relative" 
        zIndex={3} 
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
              p={{ base: 6, md: 10 }}
              borderRadius="2xl"
              boxShadow="2xl"
              textAlign="center"
              w="100%"
              position="relative"
              overflow="hidden"
              backdropFilter="blur(2px)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.15)"
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                bgGradient: 'linear(to-r, teal.400, blue.500, purple.500)',
              }}
              _after={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgGradient: 'radial(circle at top right, rgba(56, 178, 172, 0.1), transparent 60%)',
                pointerEvents: 'none',
              }}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotateY: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                style={{
                  display: 'inline-block',
                  marginBottom: '2rem'
                }}
              >
                <Box
                  as="span"
                  display="inline-block"
                  p={6}
                  borderRadius="xl"
                  bgGradient="linear(135deg, teal.400, blue.500, purple.500)"
                  color="white"
                  boxShadow="xl"
                  transform="perspective(1000px) rotateX(5deg)"
                  _hover={{
                    transform: "perspective(1000px) rotateX(0deg) scale(1.05)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon as={FiFeather} boxSize={12} />
                </Box>
              </motion.div>
              
              <Heading 
                as="h1" 
                size={{ base: "xl", md: "2xl", lg: "3xl" }}
                mb={6} 
                bgGradient="linear(135deg, teal.400, blue.500, purple.600)"
                bgClip="text"
                fontWeight="extrabold"
                letterSpacing="tight"
                lineHeight="shorter"
                textShadow="0 0 20px rgba(56, 178, 172, 0.3)"
              >
                Welcome to Smart Kuku
              </Heading>
              
              <Text 
                fontSize={{ base: "lg", md: "xl" }}
                mb={10} 
                color={textColor}
                maxW="3xl" 
                mx="auto"
                lineHeight="tall"
                fontWeight="medium"
                textAlign="center"
                opacity={0.9}
              >
                Transform your poultry farming with our comprehensive farm management solution. 
                Monitor, manage, and grow your business with intelligent insights and real-time data.
              </Text>
              
              <VStack spacing={8} maxW="md" mx="auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: '100%' }}
                >
                  <Button
                    as={RouterLink}
                    to="/login"
                    size="lg"
                    width="100%"
                    py={8}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="xl"
                    bgGradient="linear(135deg, teal.400, blue.500)"
                    color="white"
                    _hover={{
                      bgGradient: "linear(135deg, teal.500, blue.600)",
                      transform: 'translateY(-3px)',
                      boxShadow: '0 20px 40px rgba(56, 178, 172, 0.4)',
                    }}
                    _active={{
                      transform: 'translateY(-1px)',
                    }}
                    transition="all 0.3s ease"
                    position="relative"
                    overflow="hidden"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'left 0.5s',
                    }}
                    _groupHover={{
                      _before: {
                        left: '100%',
                      }
                    }}
                  >
                    🚀 Get Started - Login
                  </Button>
                </motion.div>
                
                <Text color={textColor} my={4} fontSize="md">
                  Don't have an account?{' '}
                  <Button 
                    as={RouterLink} 
                    to="/register" 
                    variant="link" 
                    colorScheme="blue"
                    fontSize="md"
                    fontWeight="bold"
                    textDecoration="underline"
                    _hover={{
                      textDecoration: 'none',
                      color: 'blue.400',
                      transform: 'scale(1.05)',
                    }}
                    transition="all 0.2s"
                  >
                    Sign up now ✨
                  </Button>
                </Text>
              </VStack>
              
              <Flex 
                mt={16} 
                justify="center" 
                gap={{ base: 4, md: 8 }} 
                flexWrap="wrap"
                color={textColor}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flex align="center" gap={3} p={3} borderRadius="lg" bg="rgba(56, 178, 172, 0.1)" backdropFilter="blur(10px)">
                    <Icon as={FiTrendingUp} color="green.400" boxSize={5} />
                    <Text fontWeight="medium">Real-time Monitoring</Text>
                  </Flex>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flex align="center" gap={3} p={3} borderRadius="lg" bg="rgba(59, 130, 246, 0.1)" backdropFilter="blur(10px)">
                    <Box w={5} h={5} borderRadius="full" bg="blue.400" />
                    <Text fontWeight="medium">Smart Analytics</Text>
                  </Flex>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Flex align="center" gap={3} p={3} borderRadius="lg" bg="rgba(147, 51, 234, 0.1)" backdropFilter="blur(10px)">
                    <Icon as={FiShield} color="purple.400" boxSize={5} />
                    <Text fontWeight="medium">24/7 Support</Text>
                  </Flex>
                </motion.div>
              </Flex>
            </Box>
          </motion.div>
        </VStack>
      </Container>
    </Box>
    </>
  );
};

export default Home;
