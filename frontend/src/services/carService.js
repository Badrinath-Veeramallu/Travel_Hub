import api from './api';

export const carService = {
  search: async (searchParams) => {
    const response = await api.post('/cars/search', searchParams);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/cars');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  }
};

export default carService;
