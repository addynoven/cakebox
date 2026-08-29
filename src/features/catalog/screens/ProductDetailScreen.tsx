import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { CakeItem } from '../models/cake.model';
import { CakeDoodles } from '../components/CakeDoodles';
import { COLORS, SHADOWS } from '../../../core/theme';
import {
  Heart,
  Star,
  Sparkles,
  ShoppingBag,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react-native';

interface ProductDetailScreenProps {
  cake: CakeItem;
  onAddToCart: (cake: CakeItem, size: string, price: number) => void;
  onCustomize: (cake: CakeItem) => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  cake,
  onAddToCart,
  onCustomize,
  isWishlisted,
  onToggleWishlist
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const currentSizeObj = cake.sizes[selectedSizeIndex] || cake.sizes[0];
  const activePrice = currentSizeObj?.price || cake.price;

  return (
    <View style={styles.container}>
      <CakeDoodles density="low" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: cake.image }} style={styles.heroImage} />
          {cake.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cake.badge}</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={onToggleWishlist}
            style={styles.wishlistBtn}
            activeOpacity={0.8}
          >
            <Heart
              size={18}
              color={isWishlisted ? COLORS.primary : COLORS.darkChocolate}
              fill={isWishlisted ? COLORS.primary : 'none'}
            />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.detailsCard}>
          {/* Title & Rating */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cakeTitle}>{cake.name}</Text>
              <Text style={styles.cakeFlavor}>{cake.flavor}</Text>
            </View>
            <Text style={styles.priceHighlight}>${activePrice.toFixed(2)}</Text>
          </View>

          {/* Ratings & Dietary */}
          <View style={styles.tagRow}>
            <View style={styles.ratingChip}>
              <Star size={13} color={COLORS.gold} fill={COLORS.gold} />
              <Text style={styles.ratingVal}>{cake.rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({cake.reviewsCount} reviews)</Text>
            </View>

            {cake.dietary?.map((diet) => (
              <View key={diet} style={styles.dietChip}>
                <Text style={styles.dietText}>{diet}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.description}>{cake.description}</Text>

          {/* Size Selector */}
          <View style={styles.sizeSection}>
            <Text style={styles.sectionHeader}>Choose Size & Servings</Text>
            <View style={styles.sizeGrid}>
              {cake.sizes.map((s, idx) => {
                const isSelected = selectedSizeIndex === idx;
                return (
                  <TouchableOpacity
                    key={s.size}
                    onPress={() => setSelectedSizeIndex(idx)}
                    style={[
                      styles.sizeCard,
                      isSelected && styles.sizeCardSelected
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        isSelected && styles.sizeTextSelected
                      ]}
                    >
                      {s.size}
                    </Text>
                    <Text
                      style={[
                        styles.servingsText,
                        isSelected && styles.servingsTextSelected
                      ]}
                    >
                      {s.servings} servings
                    </Text>
                    <Text
                      style={[
                        styles.sizePriceText,
                        isSelected && styles.sizePriceTextSelected
                      ]}
                    >
                      ${s.price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Ingredients & Allergens */}
          <View style={styles.ingredientsBox}>
            <View style={styles.ingRow}>
              <ShieldCheck size={16} color={COLORS.primary} />
              <Text style={styles.ingTitle}>Artisan Ingredients</Text>
            </View>
            <Text style={styles.ingContent}>{cake.ingredients.join(' • ')}</Text>

            {cake.allergens.length > 0 && (
              <View style={styles.allergenRow}>
                <AlertCircle size={14} color={COLORS.danger} />
                <Text style={styles.allergenText}>
                  Allergens: {cake.allergens.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {/* Customize CTA */}
          {cake.isCustomizable !== false && (
            <TouchableOpacity
              onPress={() => onCustomize(cake)}
              style={styles.customizeBtn}
              activeOpacity={0.85}
            >
              <Sparkles size={16} color={COLORS.darkChocolate} />
              <Text style={styles.customizeBtnText}>
                Customize Colors, Drips & Inscription ✨
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Add to Cart Bar */}
      <View style={styles.stickyFooter}>
        <View>
          <Text style={styles.footerTotalLabel}>Total Price</Text>
          <Text style={styles.footerPrice}>${activePrice.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          onPress={() =>
            onAddToCart(cake, currentSizeObj.size, currentSizeObj.price)
          }
          style={styles.addToCartBtn}
          activeOpacity={0.85}
        >
          <ShoppingBag size={18} color={COLORS.white} />
          <Text style={styles.addToCartText}>Add to Sweet Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCream
  },
  scrollContent: {
    paddingBottom: 90
  },
  imageContainer: {
    width: '100%',
    height: 260,
    position: 'relative',
    backgroundColor: COLORS.bgCream
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  badge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900'
  },
  wishlistBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    marginTop: -20,
    padding: 20,
    gap: 14,
    ...SHADOWS.medium
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  cakeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  cakeFlavor: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2
  },
  priceHighlight: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.yellowSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  ratingCount: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  dietChip: {
    backgroundColor: COLORS.greenSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  dietText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.darkMuted,
    fontWeight: '500'
  },
  sizeSection: {
    gap: 8
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.darkChocolate,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sizeGrid: {
    flexDirection: 'row',
    gap: 8
  },
  sizeCard: {
    flex: 1,
    backgroundColor: COLORS.bgCream,
    borderWidth: 2,
    borderColor: COLORS.borderPink,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2
  },
  sizeCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.borderDark
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  sizeTextSelected: {
    color: COLORS.white
  },
  servingsText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '700'
  },
  servingsTextSelected: {
    color: COLORS.pinkSoft
  },
  sizePriceText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 2
  },
  sizePriceTextSelected: {
    color: COLORS.white
  },
  ingredientsBox: {
    backgroundColor: COLORS.pinkSoft,
    borderRadius: 16,
    padding: 12,
    gap: 6
  },
  ingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  ingTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  ingContent: {
    fontSize: 11,
    color: COLORS.darkMuted,
    lineHeight: 16,
    fontWeight: '500'
  },
  allergenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4
  },
  allergenText: {
    fontSize: 10,
    color: COLORS.danger,
    fontWeight: '700'
  },
  customizeBtn: {
    backgroundColor: COLORS.peach,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...SHADOWS.soft
  },
  customizeBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopWidth: 2,
    borderTopColor: COLORS.borderDark,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.medium
  },
  footerTotalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase'
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.pink
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900'
  }
});
