import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCakeCatalogStore, useCakeDetailQuery, ProductDetailScreen } from '../../features/catalog';
import { useCartStore } from '../../features/cart';
import { useAuthStore } from '../../features/auth';
import { TopBar } from '../../core/components';
import { GeminiChefChatModal } from '../../features/ai_chef';
import { BakeryMapModal } from '../../features/map';
import { colors } from '../../core/theme';

export default function DynamicCakeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const cakeId = Array.isArray(id) ? id[0] : id || '';

  const { data: queryCake } = useCakeDetailQuery(cakeId);
  const { cakes, selectedCake, setSelectedCake } = useCakeCatalogStore();
  const { addToCart } = useCartStore();
  const { wishlist, toggleWishlist, showToast } = useAuthStore();

  const [showAIChef, setShowAIChef] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const cake = queryCake || (selectedCake?.id === cakeId ? selectedCake : cakes.find((c) => c.id === cakeId));

  if (!cake) {
    return (
      <View style={styles.notFoundContainer}>
        <TopBar title="Cake Details" showBack onBack={() => router.back()} />
        <View style={styles.centerBox}>
          <Text style={{ fontSize: 36, marginBottom: 8 }}>🍰</Text>
          <Text style={styles.notFoundText}>Cake not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Cake Details"
        showBack
        onBack={() => router.back()}
        onOpenAIChef={() => setShowAIChef(true)}
        onOpenBakeryMap={() => setShowMap(true)}
      />

      <ProductDetailScreen
        cake={cake}
        onAddToCart={(item, size, price) => {
          addToCart(item, size, price);
          showToast(`🍰 Added ${item.name} (${size}) to cart!`);
        }}
        onCustomize={(item) => {
          setSelectedCake(item);
          router.push('/(tabs)/custom' as any);
        }}
        isWishlisted={wishlist.includes(cake.id)}
        onToggleWishlist={() => toggleWishlist(cake.id)}
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
  notFoundContainer: {
    flex: 1,
    backgroundColor: colors.bgCream,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.darkChocolate,
  },
});
