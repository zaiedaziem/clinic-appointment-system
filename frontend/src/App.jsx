import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AppShell from './components/AppShell.jsx';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import MyAppointmentsPage from './pages/MyAppointmentsPage.jsx';
import AdminServicesPage from './pages/AdminServicesPage.jsx';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

// Bare "/" sends admins to their dashboard and patients to the services list.
function RootRedirect() {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? '/admin/dashboard' : '/services'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Everything below requires login (ProtectedRoute), rendered inside
          the shared nav/header layout (AppShell) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />

          {/* Admin-only pages get an extra AdminRoute guard nested inside */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
