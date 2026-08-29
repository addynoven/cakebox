import { describe, expect, it, beforeEach } from 'bun:test';
import { useCartStore } from '../store/useCartStore';
import { mapOrderDoc } from '../../../core/api/firestoreMappers';
import { INITIAL_CAKES } from '../../../data/cakes';
import { Order } from '../models/cart.model';

describe('Cart & Order Module Integration', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().setOrders([]);
  });

  it('should add standard cake to cart and increment quantity on duplicate', () => {
    const cake = INITIAL_CAKES[0];
    useCartStore.getState().addToCart(cake, '8"', 45);

    let cart = useCartStore.getState().cart;
    expect(cart.length).toBe(1);
    expect(cart[0].name).toBe(`${cake.name} (8")`);
    expect(cart[0].quantity).toBe(1);

    // Add again
    useCartStore.getState().addToCart(cake, '8"', 45);
    cart = useCartStore.getState().cart;
    expect(cart.length).toBe(1);
    expect(cart[0].quantity).toBe(2);
  });

  it('should handle order creation, offline tagging, and queueing', () => {
    const mockOrder: Order = {
      id: 'ord_test_1',
      orderNumber: 'CKB-TEST1',
      createdAt: new Date().toISOString(),
      items: [
        {
          id: 'item_1',
          name: 'Rainbow Cake (8")',
          price: 45,
          quantity: 1,
          size: '8"',
          image: '',
        },
      ],
      subtotal: 45,
      deliveryFee: 5,
      tax: 3,
      discount: 0,
      total: 53,
      status: 'Received',
      estimatedDelivery: '2 hours',
      deliveryAddress: {
        street: '123 Sweet Lane',
        city: 'Sugarland',
        recipientName: 'Jane Baker',
        phone: '555-0199',
        deliveryDate: '2026-08-30',
        deliveryTimeSlot: '14:00 - 16:00',
      },
    };

    useCartStore.getState().addOrder(mockOrder, true); // offline = true
    const orders = useCartStore.getState().orders;
    expect(orders.length).toBe(1);
    expect(orders[0].isOfflineOrder).toBe(true);
    expect(orders[0].synced).toBe(false);
    expect(useCartStore.getState().pendingSyncCount).toBe(1);
  });
});
