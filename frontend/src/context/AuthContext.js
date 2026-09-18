import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Restore user session from localStorage
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('authToken');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err) {
      const errorMsg = err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      setError(null);
      const response = await authService.register(email, password, firstName, lastName);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error (ignored):', err.message);
    }
    setUser(null);
    setError(null);
    return { success: true };
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      setError(null);
      const response = await authService.updateProfile({ userId: user.id, ...updates });
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (err) {
      const errorMsg = err.message || 'Profile update failed.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
