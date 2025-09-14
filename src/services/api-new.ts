import axios from 'axios';
import type { 
  User, Farmer, Farm, Device, Batch, ActivitySchedule,
  BreedType, Breed, BreedActivity, ActivityType,
  SubscriptionType, FarmerSubscription, Resource,
  SensorType, Reading, PaginatedResponse,
  CreateFarmerData, CreateFarmData, CreateBatchData, CreateDeviceData
} from '../types/models';

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('accessToken', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/accounts/token/', credentials);
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.post('/accounts/token/blacklist/', { refresh: refreshToken });
      } catch (error) {
        console.error('Error blacklisting token:', error);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/accounts/me/');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/accounts/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async (): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/accounts/users/');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/accounts/users/${id}/`);
    return response.data;
  },

  create: async (userData: Partial<User>): Promise<User> => {
    const response = await api.post('/accounts/users/', userData);
    return response.data;
  },

  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.patch(`/accounts/users/${id}/`, userData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/accounts/users/${id}/`);
  },
};

// Farmers API
export const farmersAPI = {
  getAll: async (): Promise<PaginatedResponse<Farmer>> => {
    const response = await api.get('/accounts/farmers/');
    return response.data;
  },

  getById: async (id: number): Promise<Farmer> => {
    const response = await api.get(`/accounts/farmers/${id}/`);
    return response.data;
  },

  create: async (farmerData: CreateFarmerData): Promise<Farmer> => {
    const response = await api.post('/accounts/farmers/', farmerData);
    return response.data;
  },

  update: async (id: number, farmerData: Partial<Farmer>): Promise<Farmer> => {
    const response = await api.patch(`/accounts/farmers/${id}/`, farmerData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/accounts/farmers/${id}/`);
  },
};

// Farms API
export const farmsAPI = {
  getAll: async (): Promise<PaginatedResponse<Farm>> => {
    const response = await api.get('/farms/farms/');
    return response.data;
  },

  getById: async (id: number): Promise<Farm> => {
    const response = await api.get(`/farms/farms/${id}/`);
    return response.data;
  },

  create: async (farmData: CreateFarmData): Promise<Farm> => {
    const response = await api.post('/farms/farms/', farmData);
    return response.data;
  },

  update: async (id: number, farmData: Partial<Farm>): Promise<Farm> => {
    const response = await api.patch(`/farms/farms/${id}/`, farmData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/farms/farms/${id}/`);
  },
};

// Devices API
export const devicesAPI = {
  getAll: async (): Promise<PaginatedResponse<Device>> => {
    const response = await api.get('/farms/devices/');
    return response.data;
  },

  getById: async (id: number): Promise<Device> => {
    const response = await api.get(`/farms/devices/${id}/`);
    return response.data;
  },

  getByFarm: async (farmId: number): Promise<Device[]> => {
    const response = await api.get(`/farms/devices/?farm=${farmId}`);
    return response.data.results || response.data;
  },

  create: async (deviceData: CreateDeviceData): Promise<Device> => {
    const response = await api.post('/farms/devices/', deviceData);
    return response.data;
  },

  update: async (id: number, deviceData: Partial<Device>): Promise<Device> => {
    const response = await api.patch(`/farms/devices/${id}/`, deviceData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/farms/devices/${id}/`);
  },
};

// Breeds API
export const breedsAPI = {
  getTypes: async (): Promise<PaginatedResponse<BreedType>> => {
    const response = await api.get('/breeds/breed-types/');
    return response.data;
  },

  getAll: async (): Promise<PaginatedResponse<Breed>> => {
    const response = await api.get('/breeds/breeds/');
    return response.data;
  },

  getById: async (id: number): Promise<Breed> => {
    const response = await api.get(`/breeds/breeds/${id}/`);
    return response.data;
  },

  getActivities: async (): Promise<PaginatedResponse<BreedActivity>> => {
    const response = await api.get('/breeds/breed-activities/');
    return response.data;
  },

  getActivityTypes: async (): Promise<PaginatedResponse<ActivityType>> => {
    const response = await api.get('/breeds/activity-types/');
    return response.data;
  },
};

// Batches API
export const batchesAPI = {
  getAll: async (): Promise<PaginatedResponse<Batch>> => {
    const response = await api.get('/batches/batches/');
    return response.data;
  },

  getById: async (id: number): Promise<Batch> => {
    const response = await api.get(`/batches/batches/${id}/`);
    return response.data;
  },

  getByFarm: async (farmId: number): Promise<Batch[]> => {
    const response = await api.get(`/batches/batches/?farmID=${farmId}`);
    return response.data.results || response.data;
  },

  create: async (batchData: CreateBatchData): Promise<Batch> => {
    const response = await api.post('/batches/batches/', batchData);
    return response.data;
  },

  update: async (id: number, batchData: Partial<Batch>): Promise<Batch> => {
    const response = await api.patch(`/batches/batches/${id}/`, batchData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/batches/batches/${id}/`);
  },

  getSchedules: async (batchId: number): Promise<ActivitySchedule[]> => {
    const response = await api.get(`/batches/activity-schedules/?batchID=${batchId}`);
    return response.data.results || response.data;
  },

  createSchedule: async (scheduleData: Partial<ActivitySchedule>): Promise<ActivitySchedule> => {
    const response = await api.post('/batches/activity-schedules/', scheduleData);
    return response.data;
  },
};

// Subscriptions API
export const subscriptionsAPI = {
  getTypes: async (): Promise<PaginatedResponse<SubscriptionType>> => {
    const response = await api.get('/subscriptions/subscription-types/');
    return response.data;
  },

  getFarmerSubscriptions: async (): Promise<PaginatedResponse<FarmerSubscription>> => {
    const response = await api.get('/subscriptions/farmer-subscriptions/');
    return response.data;
  },

  getResources: async (): Promise<PaginatedResponse<Resource>> => {
    const response = await api.get('/subscriptions/resources/');
    return response.data;
  },

  createSubscription: async (subscriptionData: Partial<FarmerSubscription>): Promise<FarmerSubscription> => {
    const response = await api.post('/subscriptions/farmer-subscriptions/', subscriptionData);
    return response.data;
  },

  updateSubscription: async (id: number, subscriptionData: Partial<FarmerSubscription>): Promise<FarmerSubscription> => {
    const response = await api.patch(`/subscriptions/farmer-subscriptions/${id}/`, subscriptionData);
    return response.data;
  },
};

// Sensors API
export const sensorsAPI = {
  getTypes: async (): Promise<PaginatedResponse<SensorType>> => {
    const response = await api.get('/sensors/sensor-types/');
    return response.data;
  },

  getReadings: async (deviceId?: number): Promise<PaginatedResponse<Reading>> => {
    const url = deviceId ? `/sensors/readings/?deviceID=${deviceId}` : '/sensors/readings/';
    const response = await api.get(url);
    return response.data;
  },

  getLatestReadings: async (deviceId: number): Promise<Reading[]> => {
    const response = await api.get(`/sensors/readings/?deviceID=${deviceId}&latest=true`);
    return response.data.results || response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const [usersRes, farmersRes, farmsRes, devicesRes, subscriptionsRes] = await Promise.allSettled([
      usersAPI.getAll(),
      farmersAPI.getAll(),
      farmsAPI.getAll(),
      devicesAPI.getAll(),
      subscriptionsAPI.getFarmerSubscriptions(),
    ]);

    return {
      totalUsers: usersRes.status === 'fulfilled' ? usersRes.value.count : 0,
      totalFarmers: farmersRes.status === 'fulfilled' ? farmersRes.value.count : 0,
      activeFarms: farmsRes.status === 'fulfilled' ? farmsRes.value.count : 0,
      totalDevices: devicesRes.status === 'fulfilled' ? devicesRes.value.count : 0,
      activeSubscriptions: subscriptionsRes.status === 'fulfilled' ? subscriptionsRes.value.count : 0,
      monthlyRevenue: 15750, // This would come from payments API
      systemHealth: 95,
      pendingTasks: 3,
      alerts: 1,
    };
  },
};

export default api;
