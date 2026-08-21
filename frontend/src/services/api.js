import { apiRequest } from './httpClient.js';

// Every backend endpoint the frontend calls, in one place.
// Pages/components never call fetch() directly - they call these functions.

export function registerRequest(name, email, password) {
  return apiRequest('/api/auth/register', { method: 'POST', body: { name, email, password } });
}

export function loginRequest(email, password) {
  return apiRequest('/api/auth/login', { method: 'POST', body: { email, password } });
}

export function fetchServices(token) {
  return apiRequest('/api/services', { token });
}

export function createService(token, service) {
  return apiRequest('/api/services', { method: 'POST', token, body: service });
}

export function updateService(token, id, service) {
  return apiRequest(`/api/services/${id}`, { method: 'PUT', token, body: service });
}

export function deactivateService(token, id) {
  return apiRequest(`/api/services/${id}`, { method: 'DELETE', token });
}

export function createAppointment(token, appointment) {
  return apiRequest('/api/appointments', { method: 'POST', token, body: appointment });
}

export function fetchMyAppointments(token) {
  return apiRequest('/api/appointments/me', { token });
}

export function fetchAllAppointments(token) {
  return apiRequest('/api/appointments', { token });
}

export function cancelAppointment(token, id) {
  return apiRequest(`/api/appointments/${id}/cancel`, { method: 'PUT', token });
}

export function updateAppointmentStatus(token, id, status) {
  return apiRequest(`/api/appointments/${id}/status`, { method: 'PUT', token, body: { status } });
}
