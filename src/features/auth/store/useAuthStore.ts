import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '../models/user.model';
import { mmkvStateStorage } from '../../../core/storage';
import { AuthRepository } from '../repositories/auth.repository';

interface AuthState {
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
  logout: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  isLoggedIn: false,
  savedAddresses: [],
  wishlist: [],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      wishlist: [],
      isOffline: false,
      notificationToast: null,

      setUser: (user) => set({ user, wishlist: user.wishlist || get().wishlist }),

      setWishlist: (wishlist) => set({ wishlist }),

      toggleWishlist: (cakeId) => {
        const current = get().wishlist;
        const exists = current.includes(cakeId);
        const updated = exists
          ? current.filter((id) => id !== cakeId)
          : [...current, cakeId];
        set({ wishlist: updated });

        const user = get().user;
        if (user.id && !get().isOffline) {
          AuthRepository.syncWishlist(user.id, updated);
        }
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

      logout: async () => {
        try {
          await AuthRepository.signOut();
        } catch {
          // Proceed with local logout
        }
        set({
          user: DEFAULT_USER,
          wishlist: [],
          notificationToast: null,
        });
      },
    }),
    {
      name: 'cakebox-user-storage',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
