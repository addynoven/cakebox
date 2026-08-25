import { storage } from '../core/storage/mmkv';
import { CakeItem, CartItem, Order, UserProfile } from '../types';
import { INITIAL_CAKES } from '../data/cakes';

const STORAGE_KEYS = {
  CAKES: '@cakebox_cached_catalog',
  CART: '@cakebox_cart_items',
  ORDERS: '@cakebox_orders',
  PENDING_ORDERS: '@cakebox_pending_offline_orders',
  USER: '@cakebox_user_profile',
  WISHLIST: '@cakebox_wishlist',
  OFFLINE_OVERRIDE: '@cakebox_simulated_offline'
};

const DEFAULT_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  isLoggedIn: false,
  savedAddresses: [],
  wishlist: []
};

// Fast Synchronous Initializer
export const initAsyncStorage = async (): Promise<void> => {
  // MMKV reads synchronously without async loading delay
};

// Synchronous fast getters from MMKV
export const getCachedCakes = (): CakeItem[] => {
  const raw = storage.getString(STORAGE_KEYS.CAKES);
  if (!raw) return INITIAL_CAKES;
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_CAKES;
  }
};

export const saveCachedCakes = (cakes: CakeItem[]): void => {
  storage.set(STORAGE_KEYS.CAKES, JSON.stringify(cakes));
};

export const getCart = (): CartItem[] => {
  const raw = storage.getString(STORAGE_KEYS.CART);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveCart = (items: CartItem[]): void => {
  storage.set(STORAGE_KEYS.CART, JSON.stringify(items));
};

export const getOrders = (): Order[] => {
  const raw = storage.getString(STORAGE_KEYS.ORDERS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveOrders = (orders: Order[]): void => {
  storage.set(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const addOrder = (order: Order, isOffline: boolean): Order => {
  const currentOrders = getOrders();
  const updatedOrder = {
    ...order,
    isOfflineOrder: isOffline,
    synced: !isOffline
  };

  const updated = [updatedOrder, ...currentOrders];
  saveOrders(updated);

  if (isOffline) {
    const pending = getPendingOfflineOrders();
    const updatedPending = [updatedOrder, ...pending];
    storage.set(STORAGE_KEYS.PENDING_ORDERS, JSON.stringify(updatedPending));
  }

  return updatedOrder;
};

export const getPendingOfflineOrders = (): Order[] => {
  const raw = storage.getString(STORAGE_KEYS.PENDING_ORDERS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const syncPendingOrders = (): { syncedCount: number } => {
  const pending = getPendingOfflineOrders();
  if (pending.length === 0) return { syncedCount: 0 };

  const syncedOrders = getOrders().map((ord) => {
    if (pending.some((p) => p.id === ord.id)) {
      return { ...ord, synced: true, status: 'Received' as const };
    }
    return ord;
  });

  saveOrders(syncedOrders);
  storage.remove(STORAGE_KEYS.PENDING_ORDERS);
  return { syncedCount: pending.length };
};

export const getUserProfile = (): UserProfile => {
  const raw = storage.getString(STORAGE_KEYS.USER);
  if (!raw) return DEFAULT_USER;
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
};

export const saveUserProfile = (user: UserProfile): void => {
  storage.set(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getWishlist = (): string[] => {
  return getUserProfile().wishlist || [];
};

export const toggleWishlistItem = (cakeId: string): string[] => {
  const user = getUserProfile();
  const exists = (user.wishlist || []).includes(cakeId);
  const updatedWishlist = exists
    ? user.wishlist.filter((id) => id !== cakeId)
    : [...(user.wishlist || []), cakeId];

  saveUserProfile({ ...user, wishlist: updatedWishlist });
  return updatedWishlist;
};

export const getSimulatedOffline = (): boolean => {
  const raw = storage.getString(STORAGE_KEYS.OFFLINE_OVERRIDE);
  return raw === 'true';
};

export const setSimulatedOffline = (offline: boolean): void => {
  storage.set(STORAGE_KEYS.OFFLINE_OVERRIDE, offline ? 'true' : 'false');
};

export const clearUserData = async (): Promise<void> => {
  storage.remove(STORAGE_KEYS.USER);
  storage.remove(STORAGE_KEYS.CART);
  storage.remove(STORAGE_KEYS.ORDERS);
  storage.remove(STORAGE_KEYS.PENDING_ORDERS);
  storage.remove(STORAGE_KEYS.WISHLIST);
};
