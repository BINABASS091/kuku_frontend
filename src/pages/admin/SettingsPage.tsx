import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Button,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
  useToast,
  Divider,
  Code,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SettingsPage() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const toast = useToast();
  const { logout } = useAuth();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
  const API_ROOT = API_BASE.replace(/\/api\/v1\/?$/, '');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

  const [backendStatus, setBackendStatus] = useState<string>('unknown');

  const checkBackend = async () => {
    try {
      await api.get('users/me/');
      setBackendStatus('ok');
      toast({ title: 'Backend reachable', status: 'success', duration: 3000, isClosable: true });
    } catch (e) {
      setBackendStatus('error');
      toast({ title: 'Backend check failed', status: 'error', duration: 4000, isClosable: true });
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    toast({ title: 'Tokens cleared', status: 'info', duration: 2000, isClosable: true });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h1" size="lg">System Settings</Heading>
          <Text color={textColor}>Environment and maintenance tools for admins.</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Environment</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text>API Base URL: <Code>{API_BASE}</Code></Text>
                <Text>Django Root: <Code>{API_ROOT}</Code></Text>
                <HStack>
                  <Text>Auth Token:</Text>
                  <Badge colorScheme={token ? 'green' : 'red'}>{token ? 'present' : 'missing'}</Badge>
                </HStack>
                <HStack>
                  <Text>Refresh Token:</Text>
                  <Badge colorScheme={refreshToken ? 'green' : 'red'}>{refreshToken ? 'present' : 'missing'}</Badge>
                </HStack>
                <HStack>
                  <Text>Backend Status:</Text>
                  <Badge colorScheme={backendStatus === 'ok' ? 'green' : backendStatus === 'error' ? 'red' : 'gray'}>
                    {backendStatus}
                  </Badge>
                </HStack>
                <HStack pt={2} spacing={3}>
                  <Button size="sm" onClick={checkBackend}>Check Backend</Button>
                  <Button size="sm" variant="outline" onClick={clearAuth}>Clear Tokens</Button>
                  <Button size="sm" colorScheme="red" variant="outline" onClick={handleLogout}>Logout</Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Shortcuts</Heading>
            </CardHeader>
            <CardBody>
              <VStack align="start" spacing={3}>
                <Button as="a" href={`${API_ROOT}/admin/`} target="_blank" rightIcon={<ExternalLinkIcon />}>Open Django Admin</Button>
                <Button as="a" href={`${API_ROOT}/api/schema/swagger-ui/`} target="_blank" rightIcon={<ExternalLinkIcon />}>Open API Docs</Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card bg={cardBg} borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Notes</Heading>
          </CardHeader>
          <CardBody>
            <Text color={textColor}>
              These settings reflect the current frontend configuration. API URLs come from your build-time environment variables.
            </Text>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}


