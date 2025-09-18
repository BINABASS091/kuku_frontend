
import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, FormControl, FormLabel, Input, Button, Select, useToast } from '@chakra-ui/react';
import { batchAPI, farmAPI, breedAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';

const AddBatchPage: React.FC = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [breeds, setBreeds] = useState<any[]>([]);
  const [form, setForm] = useState({
    farmID: '',
    breedID: '',
    arriveDate: '',
    initAge: '',
    harvestAge: '',
    quanitity: '',
    initWeight: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOptions() {
      const [farmsRes, breedsRes] = await Promise.all([
        farmAPI.list(),
        breedAPI.list(),
      ]);
      setFarms(farmsRes.results || farmsRes);
      setBreeds(breedsRes.results || breedsRes);
    }
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await batchAPI.create({
        farmID: form.farmID,
        breedID: form.breedID,
        arriveDate: form.arriveDate,
        initAge: Number(form.initAge),
        harvestAge: Number(form.harvestAge),
        quanitity: Number(form.quanitity),
        initWeight: Number(form.initWeight),
      });
      toast({ title: 'Batch created!', status: 'success' });
      navigate('/farmer/dashboard');
    } catch (err: any) {
      toast({ title: 'Failed to create batch', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout>
      <Box p={6} maxW="lg" mx="auto">
        <Heading size="lg" mb={4}>Add New Batch</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Farm</FormLabel>
              <Select name="farmID" value={form.farmID} onChange={handleChange} placeholder="Select farm">
                {farms.map((farm) => (
                  <option key={farm.farmID || farm.id} value={farm.farmID || farm.id}>{farm.farmName || farm.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Breed</FormLabel>
              <Select name="breedID" value={form.breedID} onChange={handleChange} placeholder="Select breed">
                {breeds.map((breed) => (
                  <option key={breed.breedID || breed.id} value={breed.breedID || breed.id}>{breed.breedName || breed.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Arrive Date</FormLabel>
              <Input type="date" name="arriveDate" value={form.arriveDate} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Initial Age (days)</FormLabel>
              <Input type="number" name="initAge" value={form.initAge} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Harvest Age (days)</FormLabel>
              <Input type="number" name="harvestAge" value={form.harvestAge} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Quantity</FormLabel>
              <Input type="number" name="quanitity" value={form.quanitity} onChange={handleChange} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Initial Weight (g)</FormLabel>
              <Input type="number" name="initWeight" value={form.initWeight} onChange={handleChange} />
            </FormControl>
            <Button colorScheme="green" type="submit" isLoading={loading}>Create Batch</Button>
          </VStack>
        </form>
      </Box>
    </FarmerLayout>
  );
};

export default AddBatchPage;
