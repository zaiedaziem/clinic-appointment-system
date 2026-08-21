import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchMyAppointments, cancelAppointment } from '../services/api.js';

const STATUS_CLASS = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  CANCELLED: 'badge-cancelled',
};

export default function MyAppointmentsPage() {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchMyAppointments(token);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load your appointments.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id) {
    setActionError('');

    try {
      await cancelAppointment(token, id);
      // Re-fetch instead of patching local state, so the list always
      // reflects exactly what the backend has (simpler, fewer bugs).
      await loadAppointments();
    } catch (err) {
      setActionError(err.message || 'Cancel failed.');
    }
  }

  if (loading) return <p>Loading your appointments...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>My Appointments</h1>
      </div>

      {actionError && <p className="error-message">{actionError}</p>}

      {appointments.length === 0 && (
        <p className="empty-state">You have no appointments yet. Go to Services to book one.</p>
      )}

      {appointments.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Date &amp; Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.serviceName}</td>
                <td>{appointment.appointmentDateTime.replace('T', ' ')}</td>
                <td>
                  <span className={`badge ${STATUS_CLASS[appointment.status]}`}>
                    {appointment.status}
                  </span>
                </td>
                <td>{appointment.notes || '-'}</td>
                <td>
                  {appointment.status !== 'CANCELLED' && (
                    <button className="danger" onClick={() => handleCancel(appointment.id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}