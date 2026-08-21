import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

// The shared layout (nav bar + logout) for every logged-in page.
// <Outlet /> renders whichever nested route matched - see App.jsx.
export default function AppShell() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-title">Clinic Appointment System</span>
          <nav className="app-nav">
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/my-appointments">My Appointments</NavLink>
            {isAdmin && <NavLink to="/admin/services">Manage Services</NavLink>}
            {isAdmin && <NavLink to="/admin/appointments">All Appointments</NavLink>}
          </nav>
        </div>

        <div className="app-header-right">
          <span className="app-user">
            {user?.name} ({user?.role})
          </span>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
