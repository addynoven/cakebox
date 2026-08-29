import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore, useOrdersQuery, OrdersProfileScreen } from '../../features/cart';
import { useAuthStore } from '../../features/auth';
import { useCakeCatalogStore } from '../../features/catalog';
import { TopBar } from '../../core/components';
import { GeminiChefChatModal } from '../../features/ai_chef';
import { BakeryMapModal } from '../../features/map';
import { colors, shadows } from '../../core/theme';

export default function OrdersTabScreen() {
  const router = useRouter();
  const { user, wishlist, isOffline, logout, showToast, setUser } = useAuthStore();
  const { orders: storeOrders, pendingSyncCount, syncAllOrders } = useCartStore();
  const { data: cloudOrders } = useOrdersQuery(user.isLoggedIn ? user.id : undefined);
  const { cakes, setSelectedCake } = useCakeCatalogStore();

  const orders = cloudOrders && cloudOrders.length > 0 ? cloudOrders : storeOrders;
  const wishlistCakes = cakes.filter((c) => wishlist.includes(c.id));

  const [showAIChef, setShowAIChef] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleManualSync = async () => {
    if (user.id) {
      await syncAllOrders(user.id);
      showToast('✨ Synchronized successfully!');
    }
  };

  const handleSignOut = async () => {
    await logout();
    showToast('👋 Signed out successfully');
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="My Orders & Profile"
        onOpenAIChef={() => setShowAIChef(true)}
        onOpenBakeryMap={() => setShowMap(true)}
      />

      <OrdersProfileScreen
        orders={orders}
        user={user}
        wishlistCakes={wishlistCakes}
        isOffline={isOffline}
        onSync={handleManualSync}
        pendingSyncCount={pendingSyncCount}
        onSelectCake={(cake) => {
          setSelectedCake(cake);
          router.push(`/cake/${cake.id}` as any);
        }}
        onSignOut={handleSignOut}
        onUpdateUser={setUser}
        onOpenAIChef={() => setShowAIChef(true)}
        onOpenBakeryMap={() => setShowMap(true)}
      />

      <GeminiChefChatModal
        isOpen={showAIChef}
        onClose={() => setShowAIChef(false)}
      />

      <BakeryMapModal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onSelectPickupLocation={(loc) => {
          showToast(`📍 Selected ${loc} for pickup!`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
});
