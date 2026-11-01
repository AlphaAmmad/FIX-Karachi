import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { endpoints } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('fixkarachi_token');
    const savedUser = localStorage.getItem('fixkarachi_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (_e) {
        localStorage.removeItem('fixkarachi_token');
        localStorage.removeItem('fixkarachi_user');
      }
    }
    setReady(true);
  }, []);

  // Keep axios header in sync with token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem('fixkarachi_token', nextToken);
    localStorage.setItem('fixkarachi_user', JSON.stringify(nextUser));
  }, []);

  const login = useCallback(async ({ role, email, password }) => {
    // Pick correct endpoint based on role
    const url =
      role === 'authority'
        ? endpoints.auth.authorityLogin
        : role === 'admin'
          ? endpoints.auth.adminLogin
          : endpoints.auth.citizenLogin;

    const response = await api.post(url, { email, password });
    const data = response.data?.data || response.data;

    // Backend returns different keys per role
    let nextUser;
    if (role === 'authority') {
      nextUser = { ...data.authority, role: 'authority' };
    } else if (role === 'admin') {
      nextUser = { ...data.admin, role: 'admin' };
    } else {
      nextUser = data.user || data;
    }

    persist(data.token, nextUser);
    return data;
  }, [persist]);

  const register = useCallback(async (payload) => {
    const response = await api.post(endpoints.auth.citizenRegister, payload);
    const data = response.data?.data || response.data;
    persist(data.token, data.user);
    return data;
  }, [persist]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fixkarachi_token');
    localStorage.removeItem('fixkarachi_user');
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, ready, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};