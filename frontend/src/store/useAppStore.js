import { create } from 'zustand';

const useAppStore = create((set) => ({
  globalSearch: '',
  setGlobalSearch: (searchTerm) => set({ globalSearch: searchTerm }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), ...notification }]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
}));

export default useAppStore;
