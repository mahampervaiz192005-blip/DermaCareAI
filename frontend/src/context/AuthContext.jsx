import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Page load par check: cookie valid hai to user mil jata hai (backend /auth/me)
  useEffect(() => {
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login: async (payload) => { const r = await api.post('/auth/login', payload); setUser(r.data.user); return r.data.user; },
    signup: async (payload) => { const r = await api.post('/auth/signup', payload); setUser(r.data.user); return r.data.user; },
    logout: async () => { await api.post('/auth/logout').catch(() => {}); setUser(null); },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
