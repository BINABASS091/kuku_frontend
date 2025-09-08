import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={20} centerContent>
      <VStack spacing={6} textAlign="center">
        <Heading size="2xl" color="red.500">
          404
        </Heading>
        <Heading size="lg">Page Not Found</Heading>
        <Text color="gray.500">
          Oops! The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button colorScheme="blue" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFound;
