export * from '../core/api/firebase';
export { AuthRepository } from '../features/auth/repositories/auth.repository';
export {
  AuthRepository as firebaseAuth,
} from '../features/auth/repositories/auth.repository';
export { CakeRepository } from '../features/catalog/repositories/cake.repository';
export { OrderRepository } from '../features/cart/repositories/order.repository';

// Convenience aliases for backward compatibility
import { AuthRepository } from '../features/auth/repositories/auth.repository';
import { CakeRepository } from '../features/catalog/repositories/cake.repository';
import { OrderRepository } from '../features/cart/repositories/order.repository';
import { Order } from '../types';

export const signInWithGoogle = () => AuthRepository.signInWithGoogle();
export const signInWithEmail = (e: string, p: string) => AuthRepository.signInWithEmail(e, p);
export const registerWithEmail = (n: string, e: string, p: string) => AuthRepository.signUpWithEmail(n, e, p);
export const resetPassword = (e: string) => AuthRepository.resetPassword(e);
export const logoutFirebase = () => AuthRepository.signOut();
export const syncWishlistToFirestore = (uid: string, list: string[]) => AuthRepository.syncWishlist(uid, list);
export const fetchCakesFromFirestore = () => CakeRepository.fetchCakes();
export const subscribeCakesFromFirestore = (cb: any) => CakeRepository.subscribeCakes(cb);
export const saveOrderToFirestore = (order: Order, uid: string) => OrderRepository.saveOrder(order, uid);
export const fetchOrdersFromFirestore = (uid: string) => OrderRepository.fetchOrders(uid);
