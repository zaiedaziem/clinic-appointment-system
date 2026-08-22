import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchDashboard } from '../services/api.js';

export default function AdminDashboardPage() {
  const { token, user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard(token)
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <p style={{ color: 'var(--color-muted)', marginTop: '-1rem', marginBottom: '2rem' }}>
        Welcome back, {user?.name}.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard label="Active Services" value={data.activeServices} />
        <StatCard label="Inactive Services" value={data.inactiveServices} />
        <StatCard label="Total Patients" value={data.totalPatients} />
        <StatCard label="Upcoming Appointments" value={data.upcomingAppointments} />
      </div>

      <div className="card">
        <h3>Appointments Breakdown</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <BreakdownItem label="Total" value={data.totalAppointments} />
          <BreakdownItem label="Pending" value={data.pendingAppointments} badgeClass="badge-pending" />
          <BreakdownItem label="Confirmed" value={data.confirmedAppointments} badgeClass="badge-confirmed" />
          <BreakdownItem label="Cancelled" value={data.cancelledAppointments} badgeClass="badge-cancelled" />
        </div>
      </div>

      <div className="card">
        <h3>Most Booked Services</h3>

        {data.topServices.length === 0 && (
          <p className="empty-state" style={{ marginTop: '1rem' }}>
            No appointments booked yet.
          </p>
        )}

        {data.topServices.length > 0 && (
          <table style={{ marginTop: '1rem' }}>
            <thead>
              <tr>
                <th>Service</th>
                <th>Appointments Booked</th>
              </tr>
            </thead>
            <tbody>
              {data.topServices.map((row) => (
                <tr key={row.serviceName}>
                  <td>{row.serviceName}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card" style={{ textAlign: 'center', marginBottom: 0 }}>
      <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-hover)' }}>
        {value}
      </div>
      <div style={{ color: 'var(--color-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
        {label}
      </div>
    </div>
  );
}

function BreakdownItem({ label, value, badgeClass }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {badgeClass ? (
        <span className={`badge ${badgeClass}`}>{label}</span>
      ) : (
        <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{label}</span>
      )}
      <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>{value}</span>
    </div>
  );
}
