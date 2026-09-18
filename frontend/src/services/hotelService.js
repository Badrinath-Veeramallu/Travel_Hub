import api from './api';

export const hotelService = {
  search: async (searchParams) => {
    const response = await api.post('/hotels/search', searchParams);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/hotels');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  }
};

export default hotelService;
