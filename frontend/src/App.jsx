import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import ResetPassword from './pages/auth/ResetPassword.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ModuleSelect from './pages/dashboard/ModuleSelect.jsx';
import ComingSoon from './pages/dashboard/ComingSoon.jsx';
import { SkinFlowLayout, RequireSkinType, RequireImage } from './pages/skin/SkinFlowContext.jsx';
import SkinDashboard from './pages/skin/SkinDashboard.jsx';
import SkinPersona from './pages/skin/SkinPersona.jsx';
import SkinUpload from './pages/skin/SkinUpload.jsx';
import SkinProcessing from './pages/skin/SkinProcessing.jsx';
import SkinResults from './pages/skin/SkinResults.jsx';
import SkinGradCam from './pages/skin/SkinGradCam.jsx';
import SkinGuidance from './pages/skin/SkinGuidance.jsx';
import SkinKnowledge from './pages/skin/SkinKnowledge.jsx';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" subtitle="Our terms will be published here soon." />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" subtitle="Our privacy policy will be published here soon." />} />

          {/* Private: login zaroori. Sab sidebar + topbar wale DashboardLayout ke andar khulte hain */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<ModuleSelect />} />
            {/* Phase 1: ye pages abhi placeholder hain, agle steps me asli pages aayenge */}
            <Route path="/dashboard/skin" element={<SkinFlowLayout />}>
              <Route index element={<SkinDashboard />} />
              <Route path="new" element={<Navigate to="/dashboard/skin/persona" replace />} />
              <Route path="persona" element={<SkinPersona />} />
              <Route path="upload" element={<RequireSkinType><SkinUpload /></RequireSkinType>} />
              <Route path="processing" element={<RequireImage><SkinProcessing /></RequireImage>} />
              <Route path="results" element={<SkinResults />} />
              <Route path="gradcam" element={<SkinGradCam />} />
              <Route path="guidance" element={<SkinGuidance />} />
              <Route path="knowledge" element={<SkinKnowledge />} />
            </Route>
            <Route path="/dashboard/hair" element={<ComingSoon module="hair" />} />
            <Route path="/history" element={<ComingSoon title="My Analysis History" />} />
            <Route path="/assistant" element={<ComingSoon title="AI Wellness Assistant" />} />
            <Route path="/profile" element={<ComingSoon title="My Profile" />} />
            <Route path="/settings" element={<ComingSoon title="Settings" />} />
          </Route>

          <Route path="*" element={<PlaceholderPage title="Page not found" subtitle="The page you're looking for doesn't exist." />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
