import api from '../utils/api';

const enquiryService = {
  getEnquiries: async (params = {}) => {
    const { data } = await api.get('/enquiries', { params });
    return data;
  },

  getAllEnquiries: async (params = {}) => {
    const { data } = await api.get('/enquiries', { params });
    return data;
  },

  getEnquiryById: async (id) => {
    const { data } = await api.get(`/enquiries/${id}`);
    return data;
  },

  createEnquiry: async (enquiryData) => {
    const { data } = await api.post('/enquiries', enquiryData);
    return data;
  },

  updateEnquiry: async (id, enquiryData) => {
    const { data } = await api.put(`/enquiries/${id}`, enquiryData);
    return data;
  },

  updateEnquiryStatus: async (id, status, details = '') => {
    const { data } = await api.put(`/enquiries/${id}/status`, { status, details });
    return data;
  },

  addNoteToEnquiry: async (id, content) => {
    const { data } = await api.post(`/enquiries/${id}/notes`, { content });
    return data;
  },

  deleteEnquiry: async (id) => {
    const { data } = await api.delete(`/enquiries/${id}`);
    return data;
  },

  getEnquiryStats: async () => {
    const { data } = await api.get('/enquiries/stats');
    return data;
  }
};

export default enquiryService;
