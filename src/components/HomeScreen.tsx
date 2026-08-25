import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet
} from 'react-native';
import { CakeItem } from '../types';
import { CakeDoodles } from './CakeDoodles';
import { COLORS, SHADOWS } from '../utils/theme';
import {
  Search,
  Sparkles,
  Heart,
  Plus,
  ArrowRight,
  Star,
  ShoppingBag
} from 'lucide-react-native';

interface HomeScreenProps {
  cakes: CakeItem[];
  onSelectCake: (cake: CakeItem) => void;
  onAddToCart: (cake: CakeItem) => void;
  onSelectCategory: (category: string) => void;
  onOpenCustomizer: () => void;
  wishlist: string[];
  onToggleWishlist: (cakeId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  cakes,
  onSelectCake,
  onAddToCart,
  onSelectCategory,
  onOpenCustomizer,
  wishlist,
  onToggleWishlist
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCakes = searchQuery.trim()
    ? cakes.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cakes;

  const categories = [
    { id: 'birthdays', label: 'Birthday', emoji: '🎁', color: COLORS.yellowSoft },
    { id: 'weddings', label: 'Wedding', emoji: '🎂', color: COLORS.blueSoft },
    { id: 'custom', label: 'Custom', emoji: '✨', color: COLORS.pinkSoft },
    { id: 'cupcakes', label: 'Cupcakes', emoji: '🧁', color: COLORS.greenSoft }
  ];

  return (
    <View style={styles.container}>
      <CakeDoodles density="low" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search CakeBox for joy & treats..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Promo Hero Banner */}
        {!searchQuery && (
          <View style={styles.heroBanner}>
            <View style={styles.heroLeft}>
              <View style={styles.promoChip}>
                <Text style={styles.promoChipText}>✨ SPECIAL PROMO</Text>
              </View>
              <Text style={styles.heroTitle}>Premium Cake Delivery.</Text>
              <Text style={styles.heroSubtitle}>
                Sweetness to your door! Same-day baking.
              </Text>
              <TouchableOpacity
                onPress={onOpenCustomizer}
                style={styles.heroButton}
                activeOpacity={0.85}
              >
                <Text style={styles.heroButtonText}>Design Cake</Text>
                <ArrowRight size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroImageWrapper}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80'
                }}
                style={styles.heroImage}
              />
            </View>
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => onSelectCategory('all')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  if (cat.id === 'custom') {
                    onOpenCustomizer();
                  } else {
                    onSelectCategory(cat.id);
                  }
                }}
                style={[styles.categoryCard, { backgroundColor: cat.color }]}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Cakes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery ? 'Search Results' : 'Featured Cakes'}
            </Text>
            <TouchableOpacity onPress={() => onSelectCategory('all')}>
              <Text style={styles.seeAllText}>View menu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cakeGrid}>
            {filteredCakes.map((cake) => {
              const isWishlisted = wishlist.includes(cake.id);
              return (
                <TouchableOpacity
                  key={cake.id}
                  onPress={() => onSelectCake(cake)}
                  style={styles.cakeCard}
                  activeOpacity={0.9}
                >
                  {/* Cake Image with Badge & Wishlist */}
                  <View style={styles.cakeImageWrapper}>
                    <Image source={{ uri: cake.image }} style={styles.cakeImage} />
                    {cake.badge && (
                      <View style={styles.cakeBadge}>
                        <Text style={styles.cakeBadgeText}>{cake.badge}</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => onToggleWishlist(cake.id)}
                      style={styles.wishlistBtn}
                      activeOpacity={0.8}
                    >
                      <Heart
                        size={15}
                        color={isWishlisted ? COLORS.primary : COLORS.darkChocolate}
                        fill={isWishlisted ? COLORS.primary : 'none'}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Cake Details */}
                  <View style={styles.cakeDetails}>
                    <View style={styles.ratingRow}>
                      <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
                      <Text style={styles.ratingText}>{cake.rating.toFixed(1)}</Text>
                      <Text style={styles.reviewsText}>({cake.reviewsCount})</Text>
                    </View>

                    <Text style={styles.cakeName} numberOfLines={1}>
                      {cake.name}
                    </Text>
                    <Text style={styles.cakeFlavor} numberOfLines={1}>
                      {cake.flavor}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceText}>${cake.price.toFixed(2)}</Text>
                      <TouchableOpacity
                        onPress={() => onAddToCart(cake)}
                        style={styles.addCartBtn}
                        activeOpacity={0.8}
                      >
                        <Plus size={16} color={COLORS.white} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCream
  },
  scrollContent: {
    padding: 16,
    gap: 18
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderPink,
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    ...SHADOWS.soft
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.darkChocolate,
    fontWeight: '600'
  },
  clearBtn: {
    padding: 4
  },
  clearBtnText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '800'
  },
  heroBanner: {
    backgroundColor: COLORS.pinkMuted,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...SHADOWS.soft
  },
  heroLeft: {
    flex: 1,
    paddingRight: 12
  },
  promoChip: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6
  },
  promoChipText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.darkChocolate,
    lineHeight: 22
  },
  heroSubtitle: {
    fontSize: 11,
    color: COLORS.darkMuted,
    marginTop: 4,
    fontWeight: '600'
  },
  heroButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
    ...SHADOWS.pink
  },
  heroButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800'
  },
  heroImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
    backgroundColor: COLORS.white
  },
  heroImage: {
    width: '100%',
    height: '100%'
  },
  section: {
    gap: 10
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    ...SHADOWS.soft
  },
  categoryEmoji: {
    fontSize: 22,
    marginBottom: 4
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  cakeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  cakeCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
    ...SHADOWS.soft
  },
  cakeImageWrapper: {
    width: '100%',
    height: 125,
    position: 'relative',
    backgroundColor: COLORS.bgCream
  },
  cakeImage: {
    width: '100%',
    height: '100%'
  },
  cakeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  cakeBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '900'
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft
  },
  cakeDetails: {
    padding: 10,
    gap: 3
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  reviewsText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  cakeName: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  cakeFlavor: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  priceText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  addCartBtn: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pink
  }
});
