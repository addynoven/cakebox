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

  if (!user.isLoggedIn) {
    return (
      <View style={styles.container}>
        <TopBar
          title="Profile & Account"
          onOpenAIChef={() => setShowAIChef(true)}
          onOpenBakeryMap={() => setShowMap(true)}
        />

        <View style={styles.guestContainer}>
          <View style={styles.guestCard}>
            <View style={styles.guestAvatar}>
              <Text style={{ fontSize: 36 }}>🍰</Text>
            </View>
            <Text style={styles.guestTitle}>Welcome to CakeBox!</Text>
            <Text style={styles.guestSubtitle}>
              Sign in to track your live orders, save delivery addresses, and sync your favorite cake wishlist across devices.
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/auth/login' as any)}
              style={styles.signInButton}
              activeOpacity={0.85}
            >
              <Text style={styles.signInButtonText}>Sign In / Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

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
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  guestCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderPink,
    ...shadows.medium,
  },
  guestAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.borderPink,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.darkChocolate,
    textAlign: 'center',
    marginBottom: 8,
  },
  guestSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    ...shadows.pink,
  },
  signInButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '900',
  },
});
