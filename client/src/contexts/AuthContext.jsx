import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios for better error handling
axios.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.message, error.config?.url);
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - server might not be running');
    }
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      console.log('Fetching user data...');
      const response = await axios.get('/api/auth/me');
      console.log('User data received:', response.data);
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to fetch user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login for:', email);
      
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login successful:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      console.error('Login failed:', err);
      console.error('Login error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Login failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting registration for:', userData.email);
      
      const response = await axios.post('/api/auth/register', userData);
      console.log('Registration successful:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      console.error('Registration failed:', err);
      console.error('Registration error details:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Updating profile...');
      const response = await axios.put('/api/auth/profile', userData);
      console.log('Profile updated successfully:', response.data);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err.response?.data?.message || 'Profile update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    currentUser: user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 