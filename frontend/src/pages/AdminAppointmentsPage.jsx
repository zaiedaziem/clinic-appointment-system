import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchAllAppointments, updateAppointmentStatus, cancelAppointment } from '../services/api.js';
import PaginationControls from '../components/PaginationControls.jsx';

const PAGE_SIZE = 5;

const STATUS_CLASS = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  CANCELLED: 'badge-cancelled',
};

export default function AdminAppointmentsPage() {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    loadAppointments();
  }, [status, page]);

  async function loadAppointments() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchAllAppointments(token, { status, page, size: PAGE_SIZE });
      setAppointments(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  }

  function handleStatusFilterChange(value) {
    setStatus(value);
    setPage(0); // reset to page 1 whenever the filter changes
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

  return (
    <div>
      <div className="page-header">
        <h1>All Appointments</h1>
      </div>

      <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <label>
          Filter by status
          <select value={status} onChange={(event) => handleStatusFilterChange(event.target.value)}>
            <option value="">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>

      {loading && <p>Loading appointments...</p>}
      {error && <p className="error-message">{error}</p>}
      {actionError && <p className="error-message">{actionError}</p>}

      {!loading && !error && appointments.length === 0 && (
        <p className="empty-state">No appointments match this filter.</p>
      )}

      {!loading && appointments.length > 0 && (
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

      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
