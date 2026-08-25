import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '../types';
import { mmkvStateStorage } from './mmkvStorage';

interface UserState {
  user: UserProfile;
  wishlist: string[];
  isOffline: boolean;
  notificationToast: string | null;
  setUser: (user: UserProfile) => void;
  setWishlist: (wishlist: string[]) => void;
  toggleWishlist: (cakeId: string) => void;
  setOffline: (isOffline: boolean) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;
  logout: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  isLoggedIn: false,
  savedAddresses: [],
  wishlist: []
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      wishlist: [],
      isOffline: false,
      notificationToast: null,

      setUser: (user) => set({ user }),
      
      setWishlist: (wishlist) => set({ wishlist }),

      toggleWishlist: (cakeId) => {
        const current = get().wishlist;
        const exists = current.includes(cakeId);
        const updated = exists
          ? current.filter((id) => id !== cakeId)
          : [...current, cakeId];
        set({ wishlist: updated });
      },

      setOffline: (isOffline) => set({ isOffline }),

      showToast: (msg) => {
        set({ notificationToast: msg });
        setTimeout(() => {
          if (get().notificationToast === msg) {
            set({ notificationToast: null });
          }
        }, 3500);
      },

      clearToast: () => set({ notificationToast: null }),

      logout: () => {
        set({
          user: DEFAULT_USER,
          wishlist: [],
          notificationToast: null
        });
      }
    }),
    {
      name: 'cakebox-user-storage',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
