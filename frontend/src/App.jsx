import { Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AppShell from './components/AppShell.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import MyAppointmentsPage from './pages/MyAppointmentsPage.jsx';
import AdminServicesPage from './pages/AdminServicesPage.jsx';
import AdminAppointmentsPage from './pages/AdminAppointmentsPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/services" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Everything below requires login (ProtectedRoute), rendered inside
          the shared nav/header layout (AppShell) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />

          {/* Admin-only pages get an extra AdminRoute guard nested inside */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/services" element={<AdminServicesPage />} />
            <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
