import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CourseCatalog from './pages/CourseCatalog';
import MyCourses from './pages/MyCourses';
import CoursePlayer from './pages/CoursePlayer';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Guest-only */}
      <Route path="/login" element={
        <GuestRoute><AuthPage /></GuestRoute>
      } />

      {/* Authenticated layout */}
      <Route element={
        <ProtectedRoute><AppLayout /></ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<CourseCatalog />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/course/:id" element={<CoursePlayer />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
