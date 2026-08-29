import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Order } from '../models/cart.model';
import { CakeItem } from '../../catalog/models/cake.model';
import { mmkvStateStorage } from '../../../core/storage';
import { OrderRepository } from '../repositories/order.repository';

interface CartState {
  cart: CartItem[];
  orders: Order[];
  pendingSyncCount: number;
  checkoutDiscount: number;
  checkoutPromo: string;
  addToCart: (cake: CakeItem, size?: string, price?: number) => void;
  addCustomCakeToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order, isOffline: boolean) => void;
  setCheckoutDiscount: (discount: number) => void;
  setCheckoutPromo: (promo: string) => void;
  setPendingSyncCount: (count: number) => void;
  syncAllOrders: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      pendingSyncCount: 0,
      checkoutDiscount: 0,
      checkoutPromo: '',

      addToCart: (cake, size, price) => {
        const chosenSize = size || (cake.sizes[0]?.size ?? '8"');
        const chosenPrice = price || cake.price;
        const cartItemId = `${cake.id}-${chosenSize}`;
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex((item) => item.id === cartItemId);

        if (existingIndex > -1) {
          const updated = currentCart.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
          );
          set({ cart: updated });
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            cakeId: cake.id,
            name: `${cake.name} (${chosenSize})`,
            price: chosenPrice,
            quantity: 1,
            size: chosenSize,
            image: cake.image,
          };
          set({ cart: [newItem, ...currentCart] });
        }
      },

      addCustomCakeToCart: (item) => {
        set({ cart: [item, ...get().cart] });
      },

      updateQuantity: (id, delta) => {
        const updated = get()
          .cart.map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[];
        set({ cart: updated });
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      setOrders: (orders) => {
        set({ orders });
      },

      addOrder: (order, isOffline) => {
        const currentOrders = get().orders;
        const updatedOrder: Order = {
          ...order,
          isOfflineOrder: isOffline,
          synced: !isOffline,
        };
        set({
          orders: [updatedOrder, ...currentOrders],
          pendingSyncCount: isOffline ? get().pendingSyncCount + 1 : get().pendingSyncCount,
        });
      },

      setCheckoutDiscount: (checkoutDiscount) => set({ checkoutDiscount }),
      setCheckoutPromo: (checkoutPromo) => set({ checkoutPromo }),
      setPendingSyncCount: (pendingSyncCount) => set({ pendingSyncCount }),

      syncAllOrders: async (userId: string) => {
        if (!userId) return;
        const orders = get().orders;
        for (const ord of orders) {
          if (!ord.synced || ord.isOfflineOrder) {
            const success = await OrderRepository.saveOrder(ord, userId);
            if (success) {
              ord.synced = true;
              ord.isOfflineOrder = false;
            }
          }
        }
        set({ orders: [...orders], pendingSyncCount: 0 });
      },
    }),
    {
      name: 'cakebox-cart-storage',
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
