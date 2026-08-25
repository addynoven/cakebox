import { CakeItem, CartItem, Order, UserProfile } from '../types';
import { INITIAL_CAKES } from '../data/cakes';

const STORAGE_KEYS = {
  CAKES: 'cakebox_cached_catalog',
  CART: 'cakebox_cart_items',
  ORDERS: 'cakebox_orders',
  PENDING_ORDERS: 'cakebox_pending_offline_orders',
  USER: 'cakebox_user_profile',
  WISHLIST: 'cakebox_wishlist',
  SAVED_CUSTOMS: 'cakebox_custom_cakes',
  OFFLINE_OVERRIDE: 'cakebox_simulated_offline'
};

const DEFAULT_USER: UserProfile = {
  id: 'usr-sweet-01',
  name: 'Sweet Tooth',
  email: 'baker@cakebox.sweet',
  phone: '+1 (555) 234-5678',
  isLoggedIn: true,
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home 🏡',
      address: '742 Evergreen Terrace, Springfield',
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Office 🏢',
      address: '456 Innovation Blvd, Suite 200',
      isDefault: false
    }
  ],
  wishlist: ['rainbow-layer-cake', 'strawberry-shortcake']
};

export const getCachedCakes = (): CakeItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CAKES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read cached cakes', e);
  }
  // Initialize default
  localStorage.setItem(STORAGE_KEYS.CAKES, JSON.stringify(INITIAL_CAKES));
  return INITIAL_CAKES;
};

export const getCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read cart', e);
  }
  // Default cart items matching Image 10
  const initialCart: CartItem[] = [
    {
      id: 'cart-init-1',
      cakeId: 'strawberry-shortcake',
      name: 'Strawberry Shortcake',
      price: 28.0,
      quantity: 1,
      size: '8"',
      image: 'https://images.unsplash.com/photo-1568827999250-3f044aa10fe6?auto=format&fit=crop&w=800&q=80',
      notes: 'Please add birthday candles'
    },
    {
      id: 'cart-init-2',
      cakeId: 'chocolate-hazelnut-crunch',
      name: 'Chocolate Hazelnut Crunch Cake',
      price: 35.0,
      quantity: 1,
      size: '8"',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
    }
  ];
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(initialCart));
  return initialCart;
};

export const saveCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
};

export const getOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read orders', e);
  }
  const defaultOrders: Order[] = [
    {
      id: 'ord-9821',
      orderNumber: '#CB-9821',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      items: [
        {
          id: 'item-1',
          cakeId: 'rainbow-layer-cake',
          name: 'Rainbow Layer Cake',
          price: 45.0,
          quantity: 1,
          size: '8"',
          image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80'
        }
      ],
      subtotal: 45.0,
      deliveryFee: 5.0,
      tax: 3.6,
      discount: 0,
      total: 53.6,
      status: 'Decorating',
      estimatedDelivery: 'Today, 3:30 PM - 4:30 PM',
      deliveryAddress: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        recipientName: 'Sweet Tooth',
        phone: '+1 (555) 234-5678',
        deliveryDate: 'Today',
        deliveryTimeSlot: '3:30 PM - 4:30 PM'
      },
      isOfflineOrder: false,
      synced: true
    }
  ];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(defaultOrders));
  return defaultOrders;
};

export const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
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
    try {
      const rawPending = localStorage.getItem(STORAGE_KEYS.PENDING_ORDERS);
      const pending: Order[] = rawPending ? JSON.parse(rawPending) : [];
      pending.push(updatedOrder);
      localStorage.setItem(STORAGE_KEYS.PENDING_ORDERS, JSON.stringify(pending));
    } catch (e) {
      console.error('Failed to queue offline order', e);
    }
  }

  return updatedOrder;
};

export const getPendingOfflineOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PENDING_ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const syncPendingOrders = (): { syncedCount: number } => {
  const pending = getPendingOfflineOrders();
  if (pending.length === 0) return { syncedCount: 0 };

  const orders = getOrders();
  const syncedOrders = orders.map((ord) => {
    if (pending.some((p) => p.id === ord.id)) {
      return { ...ord, synced: true, status: 'Received' as const };
    }
    return ord;
  });

  saveOrders(syncedOrders);
  localStorage.removeItem(STORAGE_KEYS.PENDING_ORDERS);
  return { syncedCount: pending.length };
};

export const getUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read user', e);
  }
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
  return DEFAULT_USER;
};

export const saveUserProfile = (user: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
};

export const getWishlist = (): string[] => {
  const user = getUserProfile();
  return user.wishlist || [];
};

export const toggleWishlistItem = (cakeId: string): string[] => {
  const user = getUserProfile();
  const exists = user.wishlist.includes(cakeId);
  const updatedWishlist = exists
    ? user.wishlist.filter((id) => id !== cakeId)
    : [...user.wishlist, cakeId];

  user.wishlist = updatedWishlist;
  saveUserProfile(user);
  return updatedWishlist;
};

export const getSimulatedOffline = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_OVERRIDE) === 'true';
  } catch {
    return false;
  }
};

export const setSimulatedOffline = (offline: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_OVERRIDE, offline ? 'true' : 'false');
  } catch {}
};
