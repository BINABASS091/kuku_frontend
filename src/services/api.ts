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

  // Django admin helpers
  checkDjangoAdminSession: async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/admin/', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });
      return !response.url.includes('/login');
    } catch (error) {
      console.error('Error checking Django admin session:', error);
      return false;
    }
  },

  loginToDjangoAdmin: async (username: string, password: string) => {
    try {
      // Get CSRF token first
      const csrfResponse = await fetch('http://127.0.0.1:8000/admin/login/', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      });
      
      const csrfText = await csrfResponse.text();
      const csrfMatch = csrfText.match(/name='csrfmiddlewaretoken' value='([^']+)'/);
      
      if (!csrfMatch) {
        throw new Error('Could not retrieve CSRF token');
      }
      
      const csrfToken = csrfMatch[1];
      
      // Login to Django admin
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('csrfmiddlewaretoken', csrfToken);
      formData.append('next', '/admin/');
      
      const loginResponse = await fetch('http://127.0.0.1:8000/admin/login/', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        mode: 'cors',
      });
      
      return loginResponse.ok && !loginResponse.url.includes('/login');
    } catch (error) {
      console.error('Error logging into Django admin:', error);
      return false;
    }
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

export const activityAPI = {
  list: async (params?: any) => {
    const response = await api.get('/breed-activities/', { params });
    return response.data;
  },

  create: async (activityData: any) => {
    const response = await api.post('/breed-activities/', activityData);
    return response.data;
  },

  update: async (activityID: number, activityData: any) => {
    const response = await api.patch(`/breed-activities/${activityID}/`, activityData);
    return response.data;
  },

  delete: async (activityID: number) => {
    await api.delete(`/breed-activities/${activityID}/`);
  },
};

export const activityTypeAPI = {
  list: async (params?: any) => {
    const response = await api.get('/activity-types/', { params });
    return response.data;
  },

  create: async (activityTypeData: any) => {
    const response = await api.post('/activity-types/', activityTypeData);
    return response.data;
  },

  update: async (activityTypeID: number, activityTypeData: any) => {
    const response = await api.patch(`/activity-types/${activityTypeID}/`, activityTypeData);
    return response.data;
  },

  delete: async (activityTypeID: number) => {
    await api.delete(`/activity-types/${activityTypeID}/`);
  },
};

export const sensorReadingAPI = {
  list: async (params?: any) => {
    const response = await api.get('/readings/', { params });
    return response.data;
  },

  create: async (readingData: any) => {
    const response = await api.post('/readings/', readingData);
    return response.data;
  },

  update: async (readingID: number, readingData: any) => {
    const response = await api.patch(`/readings/${readingID}/`, readingData);
    return response.data;
  },

  delete: async (readingID: number) => {
    await api.delete(`/readings/${readingID}/`);
  },
};

export const sensorTypeAPI = {
  list: async (params?: any) => {
    const response = await api.get('/sensor-types/', { params });
    return response.data;
  },

  create: async (sensorTypeData: any) => {
    const response = await api.post('/sensor-types/', sensorTypeData);
    return response.data;
  },

  update: async (sensorTypeID: number, sensorTypeData: any) => {
    const response = await api.patch(`/sensor-types/${sensorTypeID}/`, sensorTypeData);
    return response.data;
  },

  delete: async (sensorTypeID: number) => {
    await api.delete(`/sensor-types/${sensorTypeID}/`);
  },
};

// Mock alerts API - replace with real backend when available
export const alertAPI = {
  list: async (params?: any) => {
    // Mock data for demonstration - in real implementation, use params for filtering
    console.log('Alert list params:', params);
    return {
      results: [
        {
          alertID: 1,
          title: 'High Temperature Alert',
          message: 'Temperature in Coop A has exceeded 35°C',
          severity: 'high',
          farm_details: { name: 'Green Valley Farm' },
          device_details: { name: 'Temperature Sensor 1' },
          timestamp: new Date().toISOString(),
          is_read: false,
          alert_type: 'Temperature'
        },
        {
          alertID: 2,
          title: 'Feeding Reminder',
          message: 'Batch #3 is due for feeding at 2:00 PM',
          severity: 'medium',
          farm_details: { name: 'Sunrise Poultry' },
          batch_details: { batch_name: 'Batch #3' },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_read: true,
          alert_type: 'Feeding'
        },
        {
          alertID: 3,
          title: 'Low Humidity Warning',
          message: 'Humidity in Coop B has dropped below 60%',
          severity: 'low',
          farm_details: { name: 'Mountain View Farm' },
          device_details: { name: 'Humidity Sensor 2' },
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          is_read: false,
          alert_type: 'Humidity'
        }
      ]
    };
  },

  create: async (alertData: any) => {
    // Mock creation
    return {
      alertID: Date.now(),
      ...alertData,
      timestamp: new Date().toISOString(),
      is_read: false
    };
  },

  update: async (alertID: number, alertData: any) => {
    // Mock update
    return { alertID, ...alertData };
  },

  delete: async (alertID: number) => {
    // Mock deletion - in real implementation, would make actual API call
    console.log('Deleting alert:', alertID);
    return { success: true };
  },

  markAsRead: async (alertID: number) => {
    // Mock mark as read
    return { alertID, is_read: true };
  },
};

export const breedAPI = {
  list: async (params?: any) => {
    const response = await api.get('/breeds/', { params });
    return response.data;
  },

  breedTypes: {
    list: async () => {
      const response = await api.get('/breed-types/');
      return response.data;
    },
  },
};

// Master Data APIs
export const masterDataAPI = {
  // Breed-related endpoints
  breedTypes: {
    list: async (params?: any) => {
      const response = await api.get('/breed-types/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/breed-types/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/breed-types/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/breed-types/${id}/`);
    },
  },

  breeds: {
    list: async (params?: any) => {
      const response = await api.get('/breeds/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/breeds/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/breeds/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/breeds/${id}/`);
    },
  },

  activityTypes: {
    list: async (params?: any) => {
      const response = await api.get('/activity-types/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/activity-types/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/activity-types/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/activity-types/${id}/`);
    },
  },

  breedActivities: {
    list: async (params?: any) => {
      const response = await api.get('/breed-activities/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/breed-activities/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/breed-activities/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/breed-activities/${id}/`);
    },
  },

  conditionTypes: {
    list: async (params?: any) => {
      const response = await api.get('/condition-types/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/condition-types/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/condition-types/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/condition-types/${id}/`);
    },
  },

  breedConditions: {
    list: async (params?: any) => {
      const response = await api.get('/breed-conditions/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/breed-conditions/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/breed-conditions/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/breed-conditions/${id}/`);
    },
  },

  foodTypes: {
    list: async (params?: any) => {
      const response = await api.get('/food-types/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/food-types/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/food-types/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/food-types/${id}/`);
    },
  },

  breedFeedings: {
    list: async (params?: any) => {
      const response = await api.get('/breed-feedings/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/breed-feedings/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/breed-feedings/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/breed-feedings/${id}/`);
    },
  },

  breedGrowths: {
    list: async (params?: any) => {
      const response = await api.get('/breed-growths/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/breed-growths/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/breed-growths/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/breed-growths/${id}/`);
    },
  },

  // Knowledge base endpoints
  patientHealths: {
    list: async (params?: any) => {
      const response = await api.get('/patient-healths/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/patient-healths/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/patient-healths/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/patient-healths/${id}/`);
    },
  },

  recommendations: {
    list: async (params?: any) => {
      const response = await api.get('/recommendations/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/recommendations/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/recommendations/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/recommendations/${id}/`);
    },
  },

  exceptionDiseases: {
    list: async (params?: any) => {
      const response = await api.get('/exception-diseases/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/exception-diseases/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/exception-diseases/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/exception-diseases/${id}/`);
    },
  },

  anomalies: {
    list: async (params?: any) => {
      const response = await api.get('/anomalies/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/anomalies/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/anomalies/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/anomalies/${id}/`);
    },
  },

  medications: {
    list: async (params?: any) => {
      const response = await api.get('/medications/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/medications/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/medications/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/medications/${id}/`);
    },
  },

  // Subscription endpoints
  subscriptionTypes: {
    list: async (params?: any) => {
      const response = await api.get('/subscription-types/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/subscription-types/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/subscription-types/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/subscription-types/${id}/`);
    },
  },

  resources: {
    list: async (params?: any) => {
      const response = await api.get('/resources/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/resources/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/resources/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/resources/${id}/`);
    },
  },

  // Sensor endpoints
  sensorTypes: {
    list: async (params?: any) => {
      const response = await api.get('/sensor-types/', { params });
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/sensor-types/', data);
      return response.data;
    },
    update: async (id: number, data: any) => {
      const response = await api.patch(`/sensor-types/${id}/`, data);
      return response.data;
    },
    delete: async (id: number) => {
      await api.delete(`/sensor-types/${id}/`);
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
