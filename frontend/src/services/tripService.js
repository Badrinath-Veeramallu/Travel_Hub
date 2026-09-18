import api from './api';

export const tripService = {
  getAll: async (userId) => {
    const params = userId ? { userId } : {};
    const response = await api.get('/trips', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  create: async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  update: async (id, updates) => {
    const response = await api.put(`/trips/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  }
};

export default tripService;
