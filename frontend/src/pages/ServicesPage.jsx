import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchServices, createAppointment } from '../services/api.js';
import BackButton from '../components/BackButton.jsx';
import PaginationControls from '../components/PaginationControls.jsx';

const PAGE_SIZE = 5;

export default function ServicesPage() {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search/filter/sort/pagination controls
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [direction, setDirection] = useState('asc');
  const [page, setPage] = useState(0);

  // Which service's inline booking form is currently open (only one at a time)
  const [bookingServiceId, setBookingServiceId] = useState(null);
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  // Re-runs whenever any control changes - this is what makes search/sort/page live
  useEffect(() => {
    loadServices();
  }, [keyword, sortBy, direction, page]);

  async function loadServices() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchServices(token, {
        q: keyword,
        sortBy,
        direction,
        page,
        size: PAGE_SIZE,
      });
      setServices(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchChange(value) {
    setKeyword(value);
    setPage(0); // always jump back to page 1 when the search term changes
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
      setBookingError(err.message || 'Booking failed.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Services</h1>
      </div>

      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label>
          Search by name
          <input
            type="text"
            value={keyword}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="e.g. Consultation"
          />
        </label>

        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name">Name</option>
            <option value="durationMinutes">Duration</option>
          </select>
        </label>

        <label>
          Direction
          <select value={direction} onChange={(event) => setDirection(event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loading && <p>Loading services...</p>}
      {error && <p className="error-message">{error}</p>}
      {bookingMessage && <p style={{ color: 'var(--color-success)' }}>{bookingMessage}</p>}

      {!loading && !error && services.length === 0 && (
        <p className="empty-state">No services match your search.</p>
      )}

      {!loading && services.map((service) => (
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
              <BackButton onClick={() => setBookingServiceId(null)} />

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

      <PaginationControls page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}