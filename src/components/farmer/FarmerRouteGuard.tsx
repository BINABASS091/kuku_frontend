import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface FarmerRouteGuardProps {
  children: React.ReactNode;
}

const FarmerRouteGuard: React.FC<FarmerRouteGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if farmer needs to complete onboarding
    const checkOnboardingStatus = () => {
      if (user?.role === 'farmer') {
        // Mock check - replace with actual API call
        const isProfileComplete = user?.profile_completed || false;
        const hasCompletedOnboarding = localStorage.getItem('farmer_onboarding_complete') === 'true';
        
        // If it's their first time or profile is incomplete, redirect to onboarding
        if (!isProfileComplete && !hasCompletedOnboarding) {
          // Only redirect if not already on onboarding page
          if (!window.location.pathname.includes('/onboarding')) {
            navigate('/farmer/onboarding', { replace: true });
          }
        }
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);

  return <>{children}</>;
};

export default FarmerRouteGuard;
