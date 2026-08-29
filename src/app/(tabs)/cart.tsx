import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../features/cart/store/useCartStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { CartScreen } from '../../features/cart/screens/CartScreen';
import { CheckoutModal } from '../../features/cart/components/CheckoutModal';
import { TopBar } from '../../core/components/TopBar';
import { Order } from '../../features/cart/models/cart.model';
import { OrderRepository } from '../../features/cart/repositories/order.repository';
import { colors } from '../../core/theme/colors';

export default function CartTabScreen() {
  const router = useRouter();
  const {
    cart,
    checkoutDiscount,
    checkoutPromo,
    updateQuantity,
    removeFromCart,
    clearCart,
    addOrder,
    setCheckoutDiscount,
    setCheckoutPromo,
  } = useCartStore();

  const { user, isOffline, showToast } = useAuthStore();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleStartCheckout = (discount: number, promo: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromo(promo);
    setShowCheckoutModal(true);
  };

  const handleCompleteOrder = async (newOrder: Order) => {
    addOrder(newOrder, isOffline);
    clearCart();
    setShowCheckoutModal(false);

    if (!isOffline && user.id) {
      await OrderRepository.saveOrder(newOrder, user.id);
      showToast('🎉 Order placed and synced to Firestore!');
    } else {
      showToast('📡 Order saved offline! Will sync on reconnect.');
    }

    router.push('/(tabs)/orders' as any);
  };

  return (
    <View style={styles.container}>
      <TopBar title="Sweet Cart" />

      <CartScreen
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleStartCheckout}
        onContinueShopping={() => router.push('/(tabs)' as any)}
      />

      {showCheckoutModal && (
        <CheckoutModal
          cart={cart}
          discount={checkoutDiscount}
          promoCode={checkoutPromo}
          user={user}
          isOffline={isOffline}
          onCompleteOrder={handleCompleteOrder}
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
});
