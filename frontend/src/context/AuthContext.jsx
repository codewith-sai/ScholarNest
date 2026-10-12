<<<<<<< HEAD
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
=======
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session once on app load (cookie-based)
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const { data } = await api.get("/auth/me");
        if (active) setUser(data?.data?.user || null);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((loggedInUser) => {
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore: clear local state anyway
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};

export default AuthContext;
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
