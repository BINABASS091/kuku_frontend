import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../services/api';

export type UserRole = 'admin' | 'farmer' | 'viewer';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface AuthContextType {
  user: User | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Get user profile
          const response = await api.get('users/me/');
          const data = response.data as any;
          const normalizedRole = (data?.role || '').toString().toLowerCase();
          setUser({ ...data, role: normalizedRole } as User);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      // Create a new axios instance for the token endpoint to avoid baseURL issues
      const authApi = axios.create({
        baseURL: import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // The token endpoint expects 'username' and 'password' fields
      const response = await authApi.post('/api/token/', { 
        username: usernameOrEmail, // Using the input as username (could be username or email)
        password: password 
      });
      const { access, refresh } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Get user profile
      const userResponse = await api.get('users/me/');
      const userData = userResponse.data as any;
      
      if (!userData.role) {
        throw new Error('User role not found. Please contact support.');
      }
      
      const normalizedRole = (userData?.role || '').toString().toLowerCase();
      setUser({ ...userData, role: normalizedRole } as User);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // Split the full name into first and last name
      const nameParts = data.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ';
      
      // Prepare user data according to the UserCreateSerializer
      const userData = {
        username: data.email, // Using email as username
        email: data.email,
        password: data.password,
        first_name: firstName,
        last_name: lastName,
        role: 'FARMER' // Must match the role_choices in the User model exactly (uppercase)
      };
      
      console.log('Sending registration data:', JSON.stringify(userData, null, 2));
      
      try {
        // Send the registration request
        const response = await api.post('users/', userData);
        console.log('Registration successful:', response.data);
      } catch (error: any) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorDetails = {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers
          };
          console.error('Registration API error response:', JSON.stringify(errorDetails, null, 2));
          
          // Show detailed error message if available
          if (error.response.data) {
            const errorMessages = [];
            
            // Handle different error response formats
            if (typeof error.response.data === 'string') {
              errorMessages.push(error.response.data);
            } else if (error.response.data.detail) {
              errorMessages.push(error.response.data.detail);
            } else if (error.response.data.non_field_errors) {
              errorMessages.push(...error.response.data.non_field_errors);
            } else {
              // Handle field-specific errors
              for (const [field, errors] of Object.entries(error.response.data)) {
                if (Array.isArray(errors)) {
                  errorMessages.push(`${field}: ${errors.join(', ')}`);
                } else {
                  errorMessages.push(`${field}: ${errors}`);
                }
              }
            }
            
            if (errorMessages.length > 0) {
              // Show the first error message in an alert
              alert(`Registration failed: ${errorMessages[0]}`);
            }
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          alert('No response received from the server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Request setup error:', error.message);
          alert(`Request error: ${error.message}`);
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    queryClient.clear();
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
