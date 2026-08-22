// Small fetch wrapper shared by every API call in the app, so auth headers,
// JSON parsing, and error handling only need to be written once.
export async function apiRequest(path, options = {}) {
  const { method = 'GET', token, body } = options;

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const responseBody = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    // Token expired/invalid on a protected request - force back to login
    // instead of showing a confusing error on a broken page.
    if (response.status === 401 && token) {
      localStorage.removeItem('clinicAuth');
      window.location.href = '/login';
    }

    throw new Error(buildErrorMessage(responseBody, response.status));
  }

  return responseBody;
}

// The backend's GlobalExceptionHandler returns a generic top-level "message"
// (e.g. "Validation failed") PLUS a detailed "errors" array with the actual
// per-field reason (e.g. "Appointment date/time must be in the future").
// Using only the top-level message hides the real reason from the user -
// this builds the specific, readable version instead.
function buildErrorMessage(responseBody, status) {
  if (responseBody?.errors?.length > 0) {
    return responseBody.errors.map((e) => e.message).join('; ');
  }

  if (responseBody?.message) {
    return responseBody.message;
  }

  return `Request failed with status ${status}`;
}

// Builds a "?key=value&..." string from a params object, skipping any
// key with an empty/undefined value - shared by every paginated list call.
export function buildQuery(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
  ).toString();

  return query ? `?${query}` : '';
}
