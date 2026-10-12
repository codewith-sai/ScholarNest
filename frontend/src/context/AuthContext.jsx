import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('scholarnet_token');
    return Boolean(storedToken);
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('scholarnet_token');

    if (storedToken) {
      api.get('/auth/me')
        .then(res => {
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (emailOrPayload, passwordArg) => {
    let email, password;
    if (typeof emailOrPayload === 'object' && emailOrPayload !== null) {
      email = emailOrPayload.email;
      password = emailOrPayload.password;
    } else {
      email = emailOrPayload;
      password = passwordArg;
    }

    const response = await api.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return { ...userData, user: userData, token };
  };

  const register = async (nameOrPayload, emailArg, passwordArg, roleArg = 'STUDENT') => {
    let name, email, password, role;
    if (typeof nameOrPayload === 'object' && nameOrPayload !== null) {
      name = nameOrPayload.name;
      email = nameOrPayload.email;
      password = nameOrPayload.password;
      role = nameOrPayload.role || 'STUDENT';
    } else {
      name = nameOrPayload;
      email = emailArg;
      password = passwordArg;
      role = roleArg;
    }

    const response = await api.post('/auth/register', { name, email, password, role });
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return { ...userData, user: userData, token };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updated) => {
    setUser(prev => {
      const nextUser = { ...prev, ...updated };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
