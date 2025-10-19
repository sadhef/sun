import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      set({
        user: data.data,
        token: data.data.token,
        isAuthenticated: true,
        loading: false
      });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      set({
        user: data.data,
        token: data.data.token,
        isAuthenticated: true,
        loading: false
      });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    });
  },

  switchRole: (newRole) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) {
      currentUser.role = newRole;
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('userRole', newRole);
      set((state) => ({
        user: { ...state.user, role: newRole }
      }));
    }
  },

  updateUser: (userData) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      set((state) => ({
        user: { ...state.user, ...userData }
      }));
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
