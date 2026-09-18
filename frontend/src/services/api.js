import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Handle errors gracefully
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Server responded with a non-2xx status
      const message = error.response.data?.error || error.response.data?.message || `Server error (${error.response.status})`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received (network/CORS issue)
      return Promise.reject(new Error('Unable to connect to the server. Please ensure the backend is running on port 5001.'));
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
