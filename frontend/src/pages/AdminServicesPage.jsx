import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchServices, createService, updateService, deactivateService, deleteServicePermanently } from '../services/api.js';
import BackButton from '../components/BackButton.jsx';
import PaginationControls from '../components/PaginationControls.jsx';

const EMPTY_FORM = { name: '', description: '', durationMinutes: 30, active: true };
const PAGE_SIZE = 5;

export default function AdminServicesPage() {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // null = form closed. "new" = creating. An id string = editing that service.
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadServices();
  }, [page]);

  async function loadServices() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchServices(token, { page, size: PAGE_SIZE });
      setServices(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId('new');
    setForm(EMPTY_FORM);
    setFormError('');
  }

  function openEditForm(service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      active: service.active,
    });
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    try {
      if (editingId === 'new') {
        await createService(token, form);
      } else {
        await updateService(token, editingId, form);
      }

      setEditingId(null);
      await loadServices();
    } catch (err) {
      setFormError(err.message || 'Save failed.');
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateService(token, id);
      await loadServices();
    } catch (err) {
      setError(err.message || 'Deactivate failed.');
    }
  }

  async function handleDelete(id, name) {
    // Native confirm() is fine here - this is a genuinely destructive,
    // irreversible action (unlike deactivate, which can be undone via Edit).
    if (!window.confirm(`Permanently delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteServicePermanently(token, id);
      await loadServices();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Manage Services</h1>
        {editingId === null && <button onClick={openCreateForm}>Add Service</button>}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="card auth-form">
          <BackButton onClick={() => setEditingId(null)} />

          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </label>

          <label>
            Description
            <input
              type="text"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>

          <label>
            Duration (minutes)
            <input
              type="number"
              min={5}
              value={form.durationMinutes}
              onChange={(event) => setForm({ ...form, durationMinutes: Number(event.target.value) })}
              required
            />
          </label>

          {/* Only shown when editing - a brand new service always starts active */}
          {editingId !== 'new' && (
            <label style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              Active
            </label>
          )}

          {formError && <p className="error-message">{formError}</p>}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit">{editingId === 'new' ? 'Create' : 'Save Changes'}</button>
            <button type="button" className="secondary" onClick={() => setEditingId(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <p>Loading services...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && services.length === 0 && <p className="empty-state">No services yet.</p>}

      {!loading && services.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.durationMinutes} min</td>
                <td>
                  <span className={`badge ${service.active ? 'badge-confirmed' : 'badge-cancelled'}`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="secondary" onClick={() => openEditForm(service)}>
                    Edit
                  </button>
                  {service.active && (
                    <button className="danger" onClick={() => handleDeactivate(service.id)}>
                      Deactivate
                    </button>
                  )}
                  {!service.active && (
                    <button
                      className="danger"
                      onClick={() => handleDelete(service.id, service.name)}
                      aria-label={`Delete ${service.name}`}
                      title="Delete permanently"
                      style={{ display: 'inline-flex', alignItems: 'center', padding: '0.55rem' }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
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
