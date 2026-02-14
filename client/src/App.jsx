import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BotHealth from './pages/BotHealth';
import ChatbotCreate from './pages/ChatbotCreate';
import ChatbotEdit from './pages/ChatbotEdit';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';

export default function App() {
  const location = useLocation();
  const showAuthModal = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {showAuthModal && <Landing />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="health" element={<BotHealth />} />
          <Route path="admin" element={<Admin />} />
        </Route>
        <Route path="/chatbots/new" element={<ProtectedRoute><ChatbotCreate /></ProtectedRoute>} />
        <Route path="/chatbots/:id" element={<ProtectedRoute><ChatbotEdit /></ProtectedRoute>} />
        <Route path="/chatbots/:id/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
