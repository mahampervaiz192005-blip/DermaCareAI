import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import DashboardPage from './pages/auth/DashboardPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" subtitle="Our terms will be published here soon." />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" subtitle="Our privacy policy will be published here soon." />} />
          <Route path="*" element={<PlaceholderPage title="Page not found" subtitle="The page you're looking for doesn't exist." />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
