import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchServices, createService, updateService, deactivateService } from '../services/api.js';

const EMPTY_FORM = { name: '', description: '', durationMinutes: 30, active: true };

export default function AdminServicesPage() {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // null = form closed. "new" = creating. An id string = editing that service.
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

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

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Manage Services</h1>
        {editingId === null && <button onClick={openCreateForm}>Add Service</button>}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSubmit} className="card auth-form">
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

      {services.length === 0 && <p className="empty-state">No services yet.</p>}

      {services.length > 0 && (
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}