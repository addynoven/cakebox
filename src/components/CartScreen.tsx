import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { CartItem } from '../types';
import { CakeDoodles } from './CakeDoodles';
import { COLORS, SHADOWS } from '../utils/theme';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle
} from 'lucide-react-native';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (discount: number, promo: string) => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 5.0;
  const tax = subtotal * 0.08;
  const discountAmount = subtotal * (discountPercent / 100);
  const finalTotal = Math.max(0, subtotal + deliveryFee + tax - discountAmount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'SWEET20' || code === 'CAKEBOX20') {
      setDiscountPercent(20);
      setAppliedPromo(code);
      setPromoInput('');
    } else if (code === 'SWEET10' || code === 'YUMMY') {
      setDiscountPercent(10);
      setAppliedPromo(code);
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <CakeDoodles density="low" />
        <Text style={styles.emptyEmoji}>🧁</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>
          Looks like you haven't added any sweet treats yet!
        </Text>
        <TouchableOpacity
          onPress={onContinueShopping}
          style={styles.exploreBtn}
          activeOpacity={0.85}
        >
          <ShoppingBag size={18} color={COLORS.white} />
          <Text style={styles.exploreBtnText}>Explore Delicious Cakes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CakeDoodles density="low" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Your Sweet Cart ({cart.length})</Text>

        {/* Cart Items List */}
        <View style={styles.itemsList}>
          {cart.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />

              <View style={styles.itemDetails}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onRemoveItem(item.id)}
                    style={styles.trashBtn}
                  >
                    <Trash2 size={15} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>

                {item.notes ? (
                  <Text style={styles.itemNotes} numberOfLines={2}>
                    {item.notes}
                  </Text>
                ) : null}

                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>

                  {/* Quantity Controls */}
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      onPress={() => onUpdateQuantity(item.id, -1)}
                      style={styles.qtyBtn}
                    >
                      <Minus size={12} color={COLORS.darkChocolate} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => onUpdateQuantity(item.id, 1)}
                      style={styles.qtyBtn}
                    >
                      <Plus size={12} color={COLORS.darkChocolate} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code Input */}
        <View style={styles.promoCard}>
          <View style={styles.promoHeader}>
            <Tag size={15} color={COLORS.primary} />
            <Text style={styles.promoTitle}>Have a Sweet Promo Code?</Text>
          </View>

          {appliedPromo ? (
            <View style={styles.appliedRow}>
              <CheckCircle size={15} color={COLORS.success} />
              <Text style={styles.appliedText}>
                {appliedPromo} applied ({discountPercent}% OFF!)
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setAppliedPromo(null);
                  setDiscountPercent(0);
                }}
              >
                <Text style={styles.removePromoText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputRow}>
              <TextInput
                style={styles.promoInput}
                placeholder="Try SWEET20 or YUMMY"
                placeholderTextColor={COLORS.textSecondary}
                value={promoInput}
                onChangeText={setPromoInput}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                onPress={handleApplyPromo}
                style={styles.applyBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Order Bill Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Bill Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Courier</Text>
            <Text style={styles.summaryVal}>
              {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated Tax (8%)</Text>
            <Text style={styles.summaryVal}>${tax.toFixed(2)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: COLORS.success }]}>
                Promo Discount ({discountPercent}%)
              </Text>
              <Text style={[styles.summaryVal, { color: COLORS.success }]}>
                -${discountAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalVal}>${finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          onPress={() => onCheckout(discountAmount, appliedPromo || '')}
          style={styles.checkoutBtn}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          <ArrowRight size={18} color={COLORS.white} />
        </TouchableOpacity>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: COLORS.bgCream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10
  },
  emptyEmoji: {
    fontSize: 54
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    maxWidth: 240,
    fontWeight: '500'
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    ...SHADOWS.pink
  },
  exploreBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900'
  },
  heading: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  itemsList: {
    gap: 10
  },
  cartCard: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    gap: 12,
    ...SHADOWS.soft
  },
  itemImage: {
    width: 75,
    height: 75,
    borderRadius: 14,
    backgroundColor: COLORS.bgCream
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between'
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  trashBtn: {
    padding: 4
  },
  itemNotes: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.pinkSoft,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 8
  },
  qtyBtn: {
    padding: 4
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  promoCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 18,
    padding: 12,
    gap: 8
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  promoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8
  },
  promoInput: {
    flex: 1,
    backgroundColor: COLORS.bgCream,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
    color: COLORS.darkChocolate,
    fontWeight: '700'
  },
  applyBtn: {
    backgroundColor: COLORS.darkChocolate,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  applyBtnText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800'
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.greenSoft,
    padding: 8,
    borderRadius: 10
  },
  appliedText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  removePromoText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.danger
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    padding: 14,
    gap: 8,
    ...SHADOWS.soft
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.darkChocolate,
    marginBottom: 4
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600'
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderPink,
    marginVertical: 4
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
    ...SHADOWS.pink
  },
  checkoutBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900'
  }
});
