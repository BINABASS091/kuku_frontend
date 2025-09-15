import { Box, useColorModeValue } from '@chakra-ui/react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, type UserRole } from './context/AuthContext';
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FarmerDashboard from './pages/FarmerDashboard';
import NotFound from './pages/NotFound';
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
import HealthConditionsPage from './pages/admin/knowledge/HealthConditionsPage';
import RecommendationsPage from './pages/admin/knowledge/RecommendationsPage';
import DiseaseExceptionsPage from './pages/admin/knowledge/DiseaseExceptionsPage';
import AnomaliesPage from './pages/admin/knowledge/AnomaliesPage';
import MedicationsPage from './pages/admin/knowledge/MedicationsPage';
import SettingsPage from './pages/admin/SettingsPage';
import ReportsPage from './pages/admin/ReportsPage';
import DjangoAdmin from './pages/admin/DjangoAdmin';
import SystemAdministration from './pages/admin/SystemAdministration';
import SubscriptionsBilling from './pages/admin/SubscriptionsBilling';

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
          <Route 
            path="farmer" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          />
        </Route>

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
          <Route path="subscription-types" element={<SubscriptionTypesPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="health-conditions" element={<HealthConditionsPage />} />
          <Route path="recommendations" element={<RecommendationsPage />} />
          <Route path="disease-exceptions" element={<DiseaseExceptionsPage />} />
          <Route path="anomalies" element={<AnomaliesPage />} />
          <Route path="medications" element={<MedicationsPage />} />
          <Route path="subscriptions-billing" element={<SubscriptionsBilling />} />
          <Route path="system-administration" element={<SystemAdministration />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<ReportsPage />} />
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
