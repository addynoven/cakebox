import { collection, doc, setDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../../core/api/firebase';
import { mapOrderDoc } from '../../../core/api/firestoreMappers';
import { captureError } from '../../../core/errors';
import { Order } from '../models/cart.model';

export class OrderRepository {
  static async saveOrder(order: Order, userId: string): Promise<boolean> {
    try {
      const orderRef = doc(db, 'orders', order.id);
      await setDoc(orderRef, {
        ...order,
        userId: userId || 'anonymous',
        updatedAt: new Date().toISOString(),
      });
      return true;
    } catch (err: unknown) {
      captureError(err, { source: 'OrderRepository', action: 'saveOrder', metadata: { orderId: order.id } });
      return false;
    }
  }

  static async fetchOrders(userId: string): Promise<Order[]> {
    try {
      if (!userId) return [];
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const orders: Order[] = [];
      snap.forEach((d) => {
        orders.push(mapOrderDoc(d.id, d.data()));
      });
      return orders;
    } catch (err: unknown) {
      captureError(err, { source: 'OrderRepository', action: 'fetchOrders', metadata: { userId } });
      return [];
    }
  }
}
