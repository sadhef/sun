import api from '../utils/api';

const clientService = {
  getAllClients: async (params = {}) => {
    const { data } = await api.get('/clients', { params });
    return data;
  },

  getClientById: async (id) => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
  },

  createClient: async (clientData) => {
    const { data } = await api.post('/clients', clientData);
    return data;
  },

  updateClient: async (id, clientData) => {
    const { data } = await api.put(`/clients/${id}`, clientData);
    return data;
  },

  deleteClient: async (id) => {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  }
};

export default clientService;
