
import axios from 'axios';

const API_URL =
  process.env.REACT_APP_API_URL ||
  'https://travelhub-backend-6h6d.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        `Server error (${error.response.status})`;

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error('Unable to connect to the backend server.')
      );
    }

    return Promise.reject(error);
  }
);

export default api;