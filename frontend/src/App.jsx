import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<PlaceholderPage title="Welcome back" subtitle="Your personal wellness journey continues here." />} />
        <Route path="/signup" element={<PlaceholderPage title="Let's get started" subtitle="Create your DermaCare AI account in the next step." />} />
        <Route path="*" element={<PlaceholderPage title="Page not found" subtitle="The page you're looking for doesn't exist." />} />
      </Routes>
    </BrowserRouter>
  );
}
