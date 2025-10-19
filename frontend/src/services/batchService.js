import api from '../utils/api';

const batchService = {
  getAllBatches: async (params = {}) => {
    const { data } = await api.get('/batches', { params });
    return data;
  },

  getBatchById: async (id) => {
    const { data } = await api.get(`/batches/${id}`);
    return data;
  },

  createBatch: async (batchData) => {
    const { data } = await api.post('/batches', batchData);
    return data;
  },

  updateBatch: async (id, batchData) => {
    const { data } = await api.put(`/batches/${id}`, batchData);
    return data;
  },

  addNomineesToBatch: async (id, nominationData) => {
    const { data} = await api.post(`/batches/${id}/nominees`, nominationData);
    return data;
  },

  getAvailableBatches: async (courseName) => {
    const { data } = await api.get('/batches/available', { params: { courseName } });
    return data;
  },

  deleteBatch: async (id) => {
    const { data } = await api.delete(`/batches/${id}`);
    return data;
  }
};

export default batchService;
