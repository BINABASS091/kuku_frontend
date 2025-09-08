import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useAuthCheck = (requireAuth = true) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        navigate('/login', { replace: true });
      } else if (!requireAuth && isAuthenticated) {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, requireAuth]);

  return { isAuthenticated, isLoading };
};
