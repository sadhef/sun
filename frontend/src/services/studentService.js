import api from '../utils/api';

const studentService = {
  getAllStudents: async (params = {}) => {
    const { data } = await api.get('/students', { params });
    return data;
  },

  getStudentById: async (id) => {
    const { data } = await api.get(`/students/${id}`);
    return data;
  },

  getStudentByCivilId: async (civilId) => {
    const { data } = await api.get(`/students/civil/${civilId}`);
    return data;
  },

  createStudent: async (studentData) => {
    const { data } = await api.post('/students', studentData);
    return data;
  },

  updateStudent: async (id, studentData) => {
    const { data } = await api.put(`/students/${id}`, studentData);
    return data;
  },

  deleteStudent: async (id) => {
    const { data } = await api.delete(`/students/${id}`);
    return data;
  }
};

export default studentService;
