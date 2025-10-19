import api from '../utils/api';

const courseService = {
  getAllCourses: async (params = {}) => {
    const { data } = await api.get('/courses', { params });
    return data;
  },

  getCourseById: async (id) => {
    const { data } = await api.get(`/courses/${id}`);
    return data;
  },

  createCourse: async (courseData) => {
    const { data } = await api.post('/courses', courseData);
    return data;
  },

  updateCourse: async (id, courseData) => {
    const { data } = await api.put(`/courses/${id}`, courseData);
    return data;
  },

  deleteCourse: async (id) => {
    const { data } = await api.delete(`/courses/${id}`);
    return data;
  }
};

export default courseService;
