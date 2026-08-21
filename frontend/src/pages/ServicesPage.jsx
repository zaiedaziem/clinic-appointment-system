import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchServices, createAppointment } from '../services/api.js';

export default function ServicesPage() {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Which service's inline booking form is currently open (only one at a time)
  const [bookingServiceId, setBookingServiceId] = useState(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchServices(token);
      setServices(data);
    } catch (err) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  }

  function openBookingForm(serviceId) {
    setBookingServiceId(serviceId);
    setAppointmentDateTime('');
    setNotes('');
    setBookingError('');
    setBookingMessage('');
  }

  async function handleBookSubmit(event, serviceId) {
    event.preventDefault();
    setBookingError('');

    try {
      await createAppointment(token, { serviceId, appointmentDateTime, notes });
      setBookingMessage('Appointment booked successfully.');
      setBookingServiceId(null);
    } catch (err) {
      // Business rule violations (double-booking, past date, inactive
      // service) surface here as readable error messages from the backend.
      setBookingError(err.message || 'Booking failed.');
    }
  }

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Services</h1>
      </div>

      {bookingMessage && <p style={{ color: 'var(--color-success)' }}>{bookingMessage}</p>}

      {services.length === 0 && <p className="empty-state">No services available yet.</p>}

      {services.map((service) => (
        <div className="card" key={service.id}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <p>Duration: {service.durationMinutes} minutes</p>

          {!service.active && <span className="badge badge-cancelled">Inactive</span>}

          {service.active && bookingServiceId !== service.id && (
            <button type="button" onClick={() => openBookingForm(service.id)}>
              Book Appointment
            </button>
          )}

          {bookingServiceId === service.id && (
            <form onSubmit={(event) => handleBookSubmit(event, service.id)} className="auth-form">
              <label>
                Date &amp; Time
                <input
                  type="datetime-local"
                  value={appointmentDateTime}
                  onChange={(event) => setAppointmentDateTime(event.target.value)}
                  required
                />
              </label>

              <label>
                Notes (optional)
                <input
                  type="text"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>

              {bookingError && <p className="error-message">{bookingError}</p>}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit">Confirm Booking</button>
                <button type="button" className="secondary" onClick={() => setBookingServiceId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}
