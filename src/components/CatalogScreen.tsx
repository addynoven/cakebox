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
  Heart,
  Plus,
  Star,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react-native';

interface CatalogScreenProps {
  cakes: CakeItem[];
  initialCategory?: string;
  onSelectCake: (cake: CakeItem) => void;
  onAddToCart: (cake: CakeItem) => void;
  wishlist: string[];
  onToggleWishlist: (cakeId: string) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  cakes,
  initialCategory = 'all',
  onSelectCake,
  onAddToCart,
  wishlist,
  onToggleWishlist
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  const categories = [
    { id: 'all', label: 'All Joy 🍰' },
    { id: 'birthdays', label: 'Birthdays 🎁' },
    { id: 'weddings', label: 'Weddings 🎂' },
    { id: 'custom', label: 'Artisan Custom ✨' },
    { id: 'cupcakes', label: 'Cupcakes 🧁' },
    { id: 'treats', label: 'Sweet Treats 🍪' }
  ];

  let filtered = cakes.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.flavor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

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
            placeholder="Search our delicious bakery menu..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Horizontal Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipSelected
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextSelected
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sort & Count Row */}
        <View style={styles.metaRow}>
          <Text style={styles.countText}>{filtered.length} Delicious Treats</Text>

          <View style={styles.sortChips}>
            <TouchableOpacity
              onPress={() =>
                setSortBy((prev) =>
                  prev === 'featured'
                    ? 'price-low'
                    : prev === 'price-low'
                    ? 'price-high'
                    : prev === 'price-high'
                    ? 'rating'
                    : 'featured'
                )
              }
              style={styles.sortBtn}
              activeOpacity={0.7}
            >
              <SlidersHorizontal size={12} color={COLORS.darkChocolate} />
              <Text style={styles.sortBtnText}>
                {sortBy === 'featured'
                  ? 'Featured'
                  : sortBy === 'price-low'
                  ? 'Price: Low'
                  : sortBy === 'price-high'
                  ? 'Price: High'
                  : 'Top Rated'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cake Grid */}
        <View style={styles.grid}>
          {filtered.map((cake) => {
            const isWishlisted = wishlist.includes(cake.id);
            return (
              <TouchableOpacity
                key={cake.id}
                onPress={() => onSelectCake(cake)}
                style={styles.card}
                activeOpacity={0.9}
              >
                <View style={styles.imageContainer}>
                  <Image source={{ uri: cake.image }} style={styles.image} />
                  {cake.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cake.badge}</Text>
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

                <View style={styles.info}>
                  <View style={styles.ratingRow}>
                    <Star size={11} color={COLORS.gold} fill={COLORS.gold} />
                    <Text style={styles.rating}>{cake.rating.toFixed(1)}</Text>
                    <Text style={styles.reviews}>({cake.reviewsCount})</Text>
                  </View>

                  <Text style={styles.name} numberOfLines={1}>
                    {cake.name}
                  </Text>
                  <Text style={styles.flavor} numberOfLines={1}>
                    {cake.flavor}
                  </Text>

                  <View style={styles.bottomRow}>
                    <Text style={styles.price}>${cake.price.toFixed(2)}</Text>
                    <TouchableOpacity
                      onPress={() => onAddToCart(cake)}
                      style={styles.addBtn}
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
    gap: 14
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderPink,
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
    ...SHADOWS.soft
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.darkChocolate,
    fontWeight: '600'
  },
  clearText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2
  },
  categoryChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    ...SHADOWS.soft
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.borderDark
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  categoryChipTextSelected: {
    color: COLORS.white
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  sortChips: {
    flexDirection: 'row'
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.pinkSoft,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
    ...SHADOWS.soft
  },
  imageContainer: {
    width: '100%',
    height: 125,
    position: 'relative',
    backgroundColor: COLORS.bgCream
  },
  image: {
    width: '100%',
    height: '100%'
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  badgeText: {
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
  info: {
    padding: 10,
    gap: 3
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  rating: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  reviews: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  name: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  flavor: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  price: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pink
  }
});
