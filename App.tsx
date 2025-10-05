import React from 'react';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext'; // Import the provider
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import DeliveryDashboardPage from './pages/DeliveryDashboardPage';
import PostFoodPage from './pages/PostFoodPage';
import MyClaimsPage from './pages/MyClaimsPage';
import CommunityFeedPage from './pages/CommunityFeedPage';
import Layout from './components/layout/Layout';
import { UserRole } from './types';
import ChatPage from './pages/ChatPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <NotificationProvider> {/* Add the provider here */}
          <HashRouter>
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/community" element={<CommunityFeedPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/delivery-dashboard" element={<ProtectedRoute roles={[UserRole.DeliveryPartner]}><DeliveryDashboardPage /></ProtectedRoute>} />
                <Route path="/my-claims" element={<ProtectedRoute><MyClaimsPage /></ProtectedRoute>} />
                <Route path="/post-food" element={<ProtectedRoute roles={[UserRole.VerifiedMember, UserRole.Admin]}><PostFoodPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute roles={[UserRole.Admin]}><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
                <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </HashRouter>
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;