import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Stack,
  Alert,
  AlertIcon,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { farmAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';

const FarmerAddFarmPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    location: '',
    farmSize: '',
    status: 'active',
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: typeof form) => {
      console.log('DEBUG: Creating farm with data:', data);
      return farmAPI.create({
        farmName: data.name,
        location: data.location,
        farmSize: data.farmSize,
        status: data.status,
      });
    },
    {
      onSuccess: (response) => {
        console.log('DEBUG: Farm created successfully:', response);
        toast({ title: 'Farm created', status: 'success', duration: 3000, isClosable: true });
        queryClient.invalidateQueries(['myFarms']);
        navigate('/farmer/farms');
      },
      onError: (err: any) => {
        console.error('DEBUG: Farm creation error:', err);
        setErrorMsg(err?.message || 'Failed to create farm.');
      },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    mutation.mutate(form);
  };

  return (
    <FarmerLayout>
      {/* Use color mode values for background and text */}
      <Box maxW="4xl" mx="auto">
        <Heading size="lg" mb={6} color={useColorModeValue('gray.700', 'white')}>Add New Farm</Heading>

        {errorMsg && (
          <Alert status="error" mb={6} borderRadius="md">
            <AlertIcon />
            {errorMsg}
          </Alert>
        )}

        <Box
          bg={useColorModeValue('white', 'gray.800')}
          p={8}
          borderRadius="lg"
          shadow="sm"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel color={useColorModeValue('gray.700', 'gray.100')}>Farm Name <Box as="span" color="red.400">*</Box></FormLabel>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter farm name"
                  size="lg"
                  color={useColorModeValue('gray.800', 'white')}
                  bg={useColorModeValue('white', 'gray.900')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={useColorModeValue('gray.700', 'gray.100')}>Farm Size <Box as="span" color="red.400">*</Box></FormLabel>
                <Input
                  name="farmSize"
                  value={form.farmSize}
                  onChange={handleChange}
                  placeholder="e.g., 2 acres, 5000 sq ft"
                  size="lg"
                  color={useColorModeValue('gray.800', 'white')}
                  bg={useColorModeValue('white', 'gray.900')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={useColorModeValue('gray.700', 'gray.100')}>Location <Box as="span" color="red.400">*</Box></FormLabel>
                <Input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter farm location"
                  size="lg"
                  color={useColorModeValue('gray.800', 'white')}
                  bg={useColorModeValue('white', 'gray.900')}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={useColorModeValue('gray.700', 'gray.100')}>Status <Box as="span" color="red.400">*</Box></FormLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  size="lg"
                  color={useColorModeValue('gray.800', 'white')}
                  bg={useColorModeValue('white', 'gray.900')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                size="lg"
                isLoading={mutation.isLoading}
                loadingText="Creating Farm..."
              >
                Create Farm
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </FarmerLayout>
  );
};

export default FarmerAddFarmPage;
