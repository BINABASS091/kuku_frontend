import FarmerMyFarmsPage from './pages/FarmerMyFarmsPage';
import FarmerFarmDetailsPage from './pages/FarmerFarmDetailsPage';
import FarmerManageFarmPage from './pages/FarmerManageFarmPage';
import FarmerAddFarmPage from './pages/FarmerAddFarmPage';
import FarmerRecordActivityPage from './pages/FarmerRecordActivityPage';
import FarmerAddBatchPage from './pages/FarmerAddBatchPage';
                <Route path="batches/new" element={<FarmerAddBatchPage />} />
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from './context/AuthContext';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerOnboarding from './components/farmer/FarmerOnboarding';
import FarmerProfile from './pages/FarmerProfile';
import NotFound from './pages/NotFound';
import FarmerTasksPage from './pages/FarmerTasksPage';
import FarmerAlertsPage from './pages/FarmerAlertsPage';
import FarmerActivitiesPage from './pages/FarmerActivitiesPage';
import Home from './pages/Home.tsx';
import UserManagement from './pages/admin/UserManagement';
import FarmerManagement from './pages/admin/FarmerManagement';
import FarmOperations from './pages/admin/FarmOperations';
import DeviceManagement from './pages/admin/DeviceManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import MasterData from './pages/admin/MasterData';
import RelationalMasterData from './pages/admin/RelationalMasterData';
import BatchesPage from './pages/admin/operations/BatchesPage';
import ActivitiesPage from './pages/admin/operations/ActivitiesPage';
import ReadingsPage from './pages/admin/operations/ReadingsPage';
import SubscriptionTypesPage from './pages/admin/subscriptions/SubscriptionTypesPage';
import ResourcesPage from './pages/admin/subscriptions/ResourcesPage';
import PaymentsPage from './pages/admin/subscriptions/PaymentsPage';
import FarmerSubscriptionsPage from './pages/admin/subscriptions/FarmerSubscriptionsPage';
import HealthConditionsPage from './pages/admin/knowledge/HealthConditionsPage';
import RecommendationsPage from './pages/admin/knowledge/RecommendationsPage';
import DiseaseExceptionsPage from './pages/admin/knowledge/DiseaseExceptionsPage';
import AnomaliesPage from './pages/admin/knowledge/AnomaliesPage';
import MedicationsPage from './pages/admin/knowledge/MedicationsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import DjangoAdmin from './pages/admin/DjangoAdmin';
import SystemAdministration from './pages/admin/SystemAdministration';
import SubscriptionsBilling from './pages/admin/SubscriptionsBilling';
import BreedConfigurationManager from './components/admin/BreedConfigurationManager';

// This component is used to wrap protected routes
const ProtectedLayout = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// This component is used to wrap admin routes
const AdminProtectedLayout = () => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
};

// This component is used to wrap public routes
const PublicLayout = () => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box as="main">
        <Outlet />
      </Box>
    </Box>
  );
};

// Protected route component that checks authentication and role
const ProtectedRoute = ({ 
  allowedRoles,
  children 
}: { 
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        Loading...
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = user.role === 'admin' ? '/admin' : '/farmer';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Public route wrapper
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        Loading...
      </Box>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Main app component
function App() {
  const bg = useColorModeValue('gray.50', 'gray.900');
  
  return (
    <Box minH="100vh" bg={bg}>
      <Routes>
        {/* Public routes */}
        <Route element={
          <PublicRoute>
            <PublicLayout />
          </PublicRoute>
        }>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Protected routes - App layout for generic protected pages */}
        <Route element={
          <ProtectedRoute allowedRoles={['admin', 'farmer']}>
            <ProtectedLayout />
          </ProtectedRoute>
        }>
          <Route 
            path="dashboard" 
            element={<DashboardRedirect />}
          />
        </Route>

        {/* Farmer routes - use FarmerLayout */}
        <Route 
          path="farmer/*" 
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <Routes>
                <Route index element={<FarmerDashboard />} />
                <Route path="onboarding" element={<FarmerOnboarding />} />
                <Route path="profile" element={<FarmerProfile />} />
                <Route path="farms" element={<FarmerMyFarmsPage />} />
                <Route path="farms/add" element={<FarmerAddFarmPage />} />
                <Route path="farms/:farmId" element={<FarmerFarmDetailsPage />} />
                <Route path="farms/:farmId/manage" element={<FarmerManageFarmPage />} />
                <Route path="tasks" element={<FarmerTasksPage />} />
                <Route path="alerts" element={<FarmerAlertsPage />} />
                <Route path="activities" element={<FarmerActivitiesPage />} />
                <Route path="tasks/new" element={<FarmerRecordActivityPage />} />
                <Route path="batches/new" element={<FarmerAddBatchPage />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Admin routes - use AdminLayout only to avoid duplicate headers */}
        <Route 
          path="admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminProtectedLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="farmers" element={<FarmerManagement />} />
          <Route path="farms" element={<FarmOperations />} />
          <Route path="devices" element={<DeviceManagement />} />
          <Route path="master-data" element={<MasterData />} />
          <Route path="relational-master-data" element={<RelationalMasterData />} />
          <Route path="batches" element={<BatchesPage />} />
          <Route path="activities" element={<ActivitiesPage />} />
          <Route path="readings" element={<ReadingsPage />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          <Route path="farmer-subscriptions" element={<FarmerSubscriptionsPage />} />
          <Route path="subscription-types" element={<SubscriptionTypesPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="health-conditions" element={<HealthConditionsPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="breed-configuration" element={<BreedConfigurationManager />} />
          <Route path="disease-exceptions" element={<DiseaseExceptionsPage />} />
          <Route path="anomalies" element={<AnomaliesPage />} />
          <Route path="medications" element={<MedicationsPage />} />
          <Route path="subscriptions-billing" element={<SubscriptionsBilling />} />
          <Route path="system-administration" element={<SystemAdministration />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="django-admin" element={<DjangoAdmin />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;

// Helper component to redirect to dashboard based on current user role
const DashboardRedirect = () => {
  const { user } = useAuth();
  const role = user?.role;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return <Navigate to="/farmer" replace />;
};
