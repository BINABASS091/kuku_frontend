import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  Stack,
  Alert,
  AlertIcon,
  useToast,
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
    (data) => farmAPI.create({
      farmName: data.name,
      location: data.location,
      farmSize: data.farmSize,
      status: data.status,
    }),
    {
      onSuccess: () => {
        toast({ title: 'Farm created', status: 'success', duration: 3000, isClosable: true });
        queryClient.invalidateQueries(['myFarms']);
        navigate('/farmer/farms');
      },
      onError: (err: any) => {
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
      <Box maxW="lg" mx="auto" mt={8} p={8} bg="white" borderRadius="xl" boxShadow="md">
        <Heading size="lg" mb={6}>Add New Farm</Heading>
        {errorMsg && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errorMsg}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <FormControl isRequired>
              <FormLabel>Farm Name</FormLabel>
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Farm Name" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Farm Size</FormLabel>
              <Input name="farmSize" value={form.farmSize} onChange={handleChange} placeholder="Farm Size (e.g. 2 acres)" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormControl>
            <Button type="submit" colorScheme="teal" isLoading={mutation.isLoading}>
              Create Farm
            </Button>
          </Stack>
        </form>
      </Box>
    </FarmerLayout>
  );
};

export default FarmerAddFarmPage;
