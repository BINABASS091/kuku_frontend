import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useApi = <T>(
  key: string,
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useQuery<T, AxiosError>(
    [key],
    async () => {
      try {
        const response = await api.get<T>(url);
        return response.data;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          logout();
          navigate('/login');
        }
        throw error;
      }
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const usePostApi = <T, V = any>(
  url: string,
  options?: {
    onSuccess?: (data: AxiosResponse<T>) => void;
    onError?: (error: AxiosError) => void;
  }
) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation<AxiosResponse<T>, AxiosError, V>(
    async (data) => {
      try {
        return await api.post<T>(url, data);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          logout();
          navigate('/login');
        }
        throw error;
      }
    },
    {
      onSuccess: options?.onSuccess,
      onError: (error) => {
        options?.onError?.(error);
      },
    }
  );
};

export const usePutApi = <T, V = any>(
  url: string,
  options?: {
    onSuccess?: (data: AxiosResponse<T>) => void;
    onError?: (error: AxiosError) => void;
  }
) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation<AxiosResponse<T>, AxiosError, V>(
    async (data) => {
      try {
        return await api.put<T>(url, data);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          logout();
          navigate('/login');
        }
        throw error;
      }
    },
    {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
};

export const useDeleteApi = <T>(
  url: string,
  options?: {
    onSuccess?: (data: AxiosResponse<T>) => void;
    onError?: (error: AxiosError) => void;
  }
) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return useMutation<AxiosResponse<T>, AxiosError, void>(
    async () => {
      try {
        return await api.delete<T>(url);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          logout();
          navigate('/login');
        }
        throw error;
      }
    },
    {
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  );
};
