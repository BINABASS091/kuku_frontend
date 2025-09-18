import api from './api';

// Fetch all tasks for the current farmer (assumes /tasks/ endpoint returns relevant tasks)
export const fetchFarmerTasks = async () => {
  // Fetch all batch activities as tasks for the farmer
  const response = await api.get('/batch-activities/');
  // If paginated, return results; else, return data directly
  return response.data.results || response.data;
};
