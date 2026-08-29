import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCakeCatalogStore, useCakesQuery } from '../../features/catalog';
import { useCartStore } from '../../features/cart';
import { useAuthStore } from '../../features/auth';
import { CatalogScreen } from '../../features/catalog';
import { TopBar } from '../../core/components';
import { GeminiChefChatModal } from '../../features/ai_chef';
import { BakeryMapModal } from '../../features/map';
import { colors } from '../../core/theme';

export default function MenuTabScreen() {
  const router = useRouter();
  const { catalogCategory, setSelectedCake, cakes: storeCakes } = useCakeCatalogStore();
  const { data: queryCakes } = useCakesQuery(catalogCategory);
  const { addToCart } = useCartStore();
  const { wishlist, toggleWishlist, showToast } = useAuthStore();

  const cakes = queryCakes || storeCakes;

  const [showAIChef, setShowAIChef] = useState(false);
  const [showMap, setShowMap] = useState(false);

  return (
    <View style={styles.container}>
      <TopBar
        title="Our Menu"
        onOpenAIChef={() => setShowAIChef(true)}
        onOpenBakeryMap={() => setShowMap(true)}
      />

      <CatalogScreen
        cakes={cakes}
        initialCategory={catalogCategory}
        onSelectCake={(cake) => {
          setSelectedCake(cake);
          router.push(`/cake/${cake.id}` as any);
        }}
        onAddToCart={(cake) => {
          addToCart(cake);
          showToast(`🍰 Added ${cake.name} to cart!`);
        }}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
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
