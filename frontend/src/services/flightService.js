import api from './api';

export const flightService = {
  search: async (searchParams) => {
    const response = await api.post('/flights/search', searchParams);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/flights');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  }
};

export default flightService;
