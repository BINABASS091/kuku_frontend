import { AxiosError } from 'axios';
import { useToast } from '@chakra-ui/react';

interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown, toast: ReturnType<typeof useToast>) => {
  const axiosError = error as AxiosError<ApiError>;
  let errorMessage = 'An unexpected error occurred';

  if (axiosError.response) {
    const { data, status } = axiosError.response;

    if (status === 400 && data.errors) {
      // Handle validation errors
      const errorMessages = Object.values(data.errors)
        .flat()
        .filter(Boolean)
        .join('\n');
      errorMessage = errorMessages || 'Validation error';
    } else if (data.message) {
      errorMessage = data.message;
    } else if (status === 401) {
      errorMessage = 'You are not authorized to perform this action';
    } else if (status === 403) {
      errorMessage = "You don't have permission to access this resource";
    } else if (status === 404) {
      errorMessage = 'The requested resource was not found';
    } else if (status >= 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    }
  } else if (axiosError.request) {
    errorMessage = 'No response received from the server. Please check your connection.';
  } else {
    errorMessage = axiosError.message || errorMessage;
  }

  toast({
    title: 'Error',
    description: errorMessage,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top-right',
  });

  return errorMessage;
};
