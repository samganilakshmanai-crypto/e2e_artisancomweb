import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
    persist(
        (set) => ({
            userInfo: null,
            login: async (email, password) => {
                const { data } = await axios.post('/api/auth/login', { email, password });
                set({ userInfo: data });
                return data;
            },
            register: async (userData) => {
                const { data } = await axios.post('/api/auth/register', userData);
                set({ userInfo: data });
                return data;
            },
            logout: async () => {
                await axios.post('/api/auth/logout');
                set({ userInfo: null });
            },
        }),
        {
            name: 'auth-storage', // persists session UI state across browser refreshes
        }
    )
);

export default useAuthStore;
