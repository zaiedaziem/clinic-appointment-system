import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

// Nested inside ProtectedRoute for admin-only pages (Admin Requirements
// section of the brief). A logged-in PATIENT is redirected away, not
// shown a login screen, since they ARE authenticated - just not authorized.
export default function AdminRoute() {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <Navigate to="/services" replace />;
  }

  return <Outlet />;
}
