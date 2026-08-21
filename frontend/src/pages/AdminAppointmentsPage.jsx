import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchAllAppointments, updateAppointmentStatus, cancelAppointment } from '../services/api.js';

const STATUS_CLASS = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  CANCELLED: 'badge-cancelled',
};

export default function AdminAppointmentsPage() {
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
      const data = await fetchAllAppointments(token);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(id) {
    setActionError('');

    try {
      await updateAppointmentStatus(token, id, 'CONFIRMED');
      await loadAppointments();
    } catch (err) {
      setActionError(err.message || 'Confirm failed.');
    }
  }

  async function handleCancel(id) {
    setActionError('');

    try {
      await cancelAppointment(token, id);
      await loadAppointments();
    } catch (err) {
      setActionError(err.message || 'Cancel failed.');
    }
  }

  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>All Appointments</h1>
      </div>

      {actionError && <p className="error-message">{actionError}</p>}

      {appointments.length === 0 && <p className="empty-state">No appointments yet.</p>}

      {appointments.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Service</th>
              <th>Date &amp; Time</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patientName}</td>
                <td>{appointment.serviceName}</td>
                <td>{appointment.appointmentDateTime.replace('T', ' ')}</td>
                <td>
                  <span className={`badge ${STATUS_CLASS[appointment.status]}`}>
                    {appointment.status}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  {appointment.status === 'PENDING' && (
                    <button onClick={() => handleConfirm(appointment.id)}>Confirm</button>
                  )}
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