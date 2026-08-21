import { createContext, useContext, useMemo, useState } from 'react';
import { loginRequest, registerRequest } from '../services/api.js';

const STORAGE_KEY = 'clinicAuth';
const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Wraps the whole app (see main.jsx) so any component can read who's
// logged in via useAuth(), without prop-drilling the user/token everywhere.
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  function persist(response) {
    const nextAuth = {
      token: response.token,
      user: {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
    return nextAuth;
  }

  async function login(email, password) {
    const response = await loginRequest(email, password);
    return persist(response);
  }

  async function register(name, email, password) {
    const response = await registerRequest(name, email, password);
    return persist(response);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }

  // useMemo avoids recreating this object (and re-rendering every consumer)
  // on every render - only when `auth` itself actually changes.
  const value = useMemo(
    () => ({
      token: auth?.token ?? '',
      user: auth?.user ?? null,
      isAuthenticated: Boolean(auth?.token),
      isAdmin: auth?.user?.role === 'ADMIN',
      login,
      register,
      logout,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return value;
}
