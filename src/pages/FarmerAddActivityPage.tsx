import React, { useState, useEffect } from 'react';
import { Box, Heading, VStack, FormControl, FormLabel, Input, Button, Select, Textarea, useToast } from '@chakra-ui/react';
import { activityAPI, batchAPI, activityTypeAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FarmerLayout from '../layouts/FarmerLayout';

const FarmerAddActivityPage: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const [form, setForm] = useState({
    batchID: '',
    activityTypeID: '',
    batchActivityName: '',
    batchActivityDate: '',
    batchActivityDetails: '',
    batchAcitivtyCost: '',
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOptions() {
      const [batchesRes, typesRes] = await Promise.all([
        batchAPI.list(),
        activityTypeAPI.list(),
      ]);
      setBatches(batchesRes.results || batchesRes);
      setActivityTypes(typesRes.results || typesRes);
    }
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await activityAPI.create({
        batchID: form.batchID,
        breedActivityID: form.activityTypeID,
        batchActivityName: form.batchActivityName,
        batchActivityDate: form.batchActivityDate,
        batchActivityDetails: form.batchActivityDetails,
        batchAcitivtyCost: Number(form.batchAcitivtyCost),
      });
      toast({ title: 'Activity recorded!', status: 'success' });
      navigate('/farmer/dashboard');
    } catch (err: any) {
      toast({ title: 'Failed to record activity', description: err.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FarmerLayout>
      <Box p={6} maxW="lg" mx="auto">
        <Heading size="lg" mb={4}>Record Activity</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Batch</FormLabel>
              <Select name="batchID" value={form.batchID} onChange={handleChange} placeholder="Select batch">
                {batches.map((batch) => (
                  <option key={batch.batchID || batch.id} value={batch.batchID || batch.id}>{batch.batchID || batch.id}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Activity Type</FormLabel>
              <Select name="activityTypeID" value={form.activityTypeID} onChange={handleChange} placeholder="Select type">
                {activityTypes.map((type) => (
                  <option key={type.breedActivityID || type.id} value={type.breedActivityID || type.id}>{type.activityName || type.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Activity Name</FormLabel>
              <Input name="batchActivityName" value={form.batchActivityName} onChange={handleChange} placeholder="Activity name" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input type="date" name="batchActivityDate" value={form.batchActivityDate} onChange={handleChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Details</FormLabel>
              <Textarea name="batchActivityDetails" value={form.batchActivityDetails} onChange={handleChange} placeholder="Details (optional)" />
            </FormControl>
            <FormControl>
              <FormLabel>Cost (₦)</FormLabel>
              <Input type="number" name="batchAcitivtyCost" value={form.batchAcitivtyCost} onChange={handleChange} />
            </FormControl>
            <Button colorScheme="blue" type="submit" isLoading={loading}>Record Activity</Button>
          </VStack>
        </form>
      </Box>
    </FarmerLayout>
  );
};

export default FarmerAddActivityPage;
