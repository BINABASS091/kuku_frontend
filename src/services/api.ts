import axios from 'axios';

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

          // Retry original request with new token
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

// ============================================================================
// API FUNCTIONS
// ============================================================================

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post('/accounts/login/', credentials);
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/accounts/logout/', { refresh: refreshToken });
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getCurrentUser: async () => {
    const response = await api.get('/accounts/me/');
    return response.data;
  },
};

export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats/');
    return response.data;
  },
};

export const userAPI = {
  list: async (params?: any) => {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  create: async (userData: any) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  update: async (id: number, userData: any) => {
    const response = await api.patch(`/users/${id}/`, userData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/users/${id}/`);
  },
};

export const farmerAPI = {
  list: async (params?: any) => {
    const response = await api.get('/farmers/', { params });
    return response.data;
  },

  create: async (farmerData: any) => {
    const response = await api.post('/farmers/', farmerData);
    return response.data;
  },

  update: async (id: number, farmerData: any) => {
    const response = await api.patch(`/farmers/${id}/`, farmerData);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/farmers/${id}/`);
  },

  getMyFarm: async () => {
    const response = await api.get('/farmers/my_farm/');
    return response.data;
  },
};

export const farmAPI = {
  list: async (params?: any) => {
    const response = await api.get('/farms/', { params });
    return response.data;
  },

  create: async (farmData: any) => {
    const response = await api.post('/farms/', farmData);
    return response.data;
  },

  update: async (farmID: number, farmData: any) => {
    const response = await api.patch(`/farms/${farmID}/`, farmData);
    return response.data;
  },

  delete: async (farmID: number) => {
    await api.delete(`/farms/${farmID}/`);
  },
};

export const batchAPI = {
  list: async (params?: any) => {
    const response = await api.get('/batches/', { params });
    return response.data;
  },

  create: async (batchData: any) => {
    const response = await api.post('/batches/', batchData);
    return response.data;
  },

  update: async (batchID: number, batchData: any) => {
    const response = await api.patch(`/batches/${batchID}/`, batchData);
    return response.data;
  },

  delete: async (batchID: number) => {
    await api.delete(`/batches/${batchID}/`);
  },
};

export const breedAPI = {
  list: async (params?: any) => {
    const response = await api.get('/breeds/', { params });
    return response.data;
  },

  breedTypes: {
    list: async () => {
      const response = await api.get('/breeds/breed-types/');
      return response.data;
    },
  },
};

export const deviceAPI = {
  list: async (params?: any) => {
    const response = await api.get('/devices/', { params });
    return response.data;
  },

  create: async (deviceData: any) => {
    const response = await api.post('/devices/', deviceData);
    return response.data;
  },

  update: async (deviceID: number, deviceData: any) => {
    const response = await api.patch(`/devices/${deviceID}/`, deviceData);
    return response.data;
  },

  delete: async (deviceID: number) => {
    await api.delete(`/devices/${deviceID}/`);
  },

  getByFarm: async (farmID: number) => {
    const response = await api.get(`/devices/?farm=${farmID}`);
    return response.data;
  },
};

export default api;
