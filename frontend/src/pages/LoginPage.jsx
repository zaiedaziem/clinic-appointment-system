import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { isAuthenticated, user, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Admins land on their dashboard, patients land on the services list -
  // unless ProtectedRoute sent them here from somewhere specific, in which
  // case they go back to exactly where they were trying to go.
  function resolveRedirect(role) {
    const fallback = role === 'ADMIN' ? '/admin/dashboard' : '/services';
    return location.state?.from?.pathname || fallback;
  }

  if (isAuthenticated) {
    return <Navigate to={resolveRedirect(user?.role)} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      navigate(resolveRedirect(result.user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Clinic Appointment System</h1>
        <p className="auth-subtitle">Log in to book or manage appointments</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Log In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <div className="auth-help">
          <strong>Seeded accounts</strong>
          <span>Admin: admin@example.com / Admin@12345</span>
          <span>Patient 1: alex.patient@example.com / Patient@12345</span>
          <span>Patient 2: ahmadfaiz@example.com / Patient@12345</span>
        </div>
      </section>
    </main>
  );
}
