import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { SpinnerIcon } from '@chakra-ui/icons';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import './index.css';
import theme from './theme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ErrorBoundary
          fallback={({ error, resetErrorBoundary }) => (
            <Box textAlign="center" py={10} px={6}>
              <SpinnerIcon boxSize={'50px'} color={'red.500'} />
              <Heading as="h2" size="xl" mt={6} mb={2}>
                Something went wrong
              </Heading>
              <Text color={'gray.500'} mb={6}>
                {error.message}
              </Text>
              <Button
                colorScheme="teal"
                bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
                color="white"
                variant="solid"
                onClick={resetErrorBoundary}
              >
                Try again
              </Button>
            </Box>
          )}
        >
          <Router>
            <AuthProvider>
              <App />
            </AuthProvider>
          </Router>
        </ErrorBoundary>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
