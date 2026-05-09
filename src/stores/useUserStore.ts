import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DemoUser } from '../api/users.api';

interface UserStore {
  currentUser: DemoUser | null;
  setCurrentUser: (user: DemoUser | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (currentUser) => set({ currentUser }),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'sneaker-drop-user', // localStorage key
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
