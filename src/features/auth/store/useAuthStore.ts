import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '../models/user.model';
import { mmkvStateStorage } from '../../../core/storage';
import { addBreadcrumb, captureError } from '../../../core/errors';
import { AuthRepository } from '../repositories/auth.repository';

interface AuthState {
  user: UserProfile;
  wishlist: string[];
  isOffline: boolean;
  notificationToast: string | null;
  setUser: (user: UserProfile) => void;
  setWishlist: (wishlist: string[]) => void;
  toggleWishlist: (cakeId: string) => Promise<void>;
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

      setUser: (user) => {
        addBreadcrumb('auth', `User profile updated (${user.email || 'anonymous'})`);
        set({ user, wishlist: user.wishlist || get().wishlist });
      },

      setWishlist: (wishlist) => set({ wishlist }),

      /**
       * Optimistic Wishlist Update with automatic rollback and breadcrumb tracking
       */
      toggleWishlist: async (cakeId: string) => {
        const previousWishlist = get().wishlist;
        const exists = previousWishlist.includes(cakeId);
        const updatedWishlist = exists
          ? previousWishlist.filter((id) => id !== cakeId)
          : [...previousWishlist, cakeId];

        // 1. Optimistic Update (Instant 0ms UI feedback)
        set({ wishlist: updatedWishlist });
        addBreadcrumb('ui', `${exists ? 'Removed' : 'Added'} cake from wishlist`, { cakeId });

        // 2. Background Cloud Synchronization
        const user = get().user;
        if (user.id && !get().isOffline) {
          try {
            await AuthRepository.syncWishlist(user.id, updatedWishlist);
          } catch (error) {
            // 3. Rollback to previous state on server failure
            set({ wishlist: previousWishlist });
            get().showToast('⚠️ Could not sync wishlist to cloud. Reverted.');
            captureError(error, {
              source: 'useAuthStore',
              action: 'toggleWishlist_optimistic_rollback',
              metadata: { cakeId },
            });
          }
        }
      },

      setOffline: (isOffline) => {
        addBreadcrumb('network', `Network state changed: ${isOffline ? 'OFFLINE' : 'ONLINE'}`);
        set({ isOffline });
      },

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
        addBreadcrumb('auth', 'User initiated logout');
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
