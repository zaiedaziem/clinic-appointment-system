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

    const message = responseBody?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return responseBody;
}
