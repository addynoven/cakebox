import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCakeCatalogStore } from '../../features/catalog/store/useCakeCatalogStore';
import { useCartStore } from '../../features/cart/store/useCartStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { CakeCustomizerScreen } from '../../features/customizer/screens/CakeCustomizerScreen';
import { TopBar } from '../../core/components/TopBar';
import { GeminiChefChatModal } from '../../features/ai_chef/components/GeminiChefChatModal';
import { BakeryMapModal } from '../../features/map/components/BakeryMapModal';
import { colors } from '../../core/theme/colors';

export default function CustomTabScreen() {
  const router = useRouter();
  const { selectedCake, setSelectedCake } = useCakeCatalogStore();
  const { addCustomCakeToCart } = useCartStore();
  const { showToast } = useAuthStore();

  const [showAIChef, setShowAIChef] = useState(false);
  const [showMap, setShowMap] = useState(false);

  return (
    <View style={styles.container}>
      <TopBar
        title="Custom Cake"
        onOpenAIChef={() => setShowAIChef(true)}
        onOpenBakeryMap={() => setShowMap(true)}
      />

      <CakeCustomizerScreen
        baseCake={selectedCake}
        onAddToCart={(customItem) => {
          addCustomCakeToCart(customItem);
          showToast('✨ Custom cake added to cart!');
          router.push('/(tabs)/cart' as any);
        }}
        onCancel={() => {
          setSelectedCake(null);
          router.push('/(tabs)' as any);
        }}
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
