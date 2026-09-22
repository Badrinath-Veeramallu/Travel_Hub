import axios from 'axios';

const API_URL =  process.env.REACT_APP_API_URL ||
  'https://travelhub-backend-6h6d.onrender.com';

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
    console.error('API Error:', error);
    console.error('Request URL:', error.config?.url);
    console.error('Base URL:', error.config?.baseURL);

    if (error.response) {
      // Server responded with a non-2xx status
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        `Server error (${error.response.status})`;

      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request sent but no response received
      return Promise.reject(
        new Error(
          'Unable to reach the backend. Check the Render server, API URL, and CORS configuration.'
        )
      );
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;
