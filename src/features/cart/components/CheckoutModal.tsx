import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { CartItem, Order, UserProfile } from '../../../types';
import { COLORS, SHADOWS } from '../../../core/theme';
import {
  X,
  MapPin,
  Clock,
  CreditCard,
  Sparkles,
  CheckCircle,
  Truck
} from 'lucide-react-native';

interface CheckoutModalProps {
  cart: CartItem[];
  discount: number;
  promoCode?: string;
  user: UserProfile;
  isOffline: boolean;
  onCompleteOrder: (order: Order) => void;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  cart,
  discount,
  promoCode,
  user,
  isOffline,
  onCompleteOrder,
  onClose
}) => {
  const defaultAddress = user.savedAddresses?.[0];

  const [recipientName, setRecipientName] = useState(user.name || '');
  const [streetAddress, setStreetAddress] = useState(defaultAddress?.address || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [deliveryDate, setDeliveryDate] = useState('Today');
  const [deliverySlot, setDeliverySlot] = useState('3:00 PM - 5:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'cod'>('apple_pay');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 5.0;
  const tax = subtotal * 0.08;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `#CB-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      status: 'Received',
      estimatedDelivery: `${deliveryDate}, ${deliverySlot}`,
      deliveryAddress: {
        street: streetAddress,
        city: 'Springfield',
        recipientName,
        phone,
        deliveryDate,
        deliveryTimeSlot: deliverySlot
      },
      isOfflineOrder: isOffline,
      synced: !isOffline
    };

    onCompleteOrder(newOrder);
  };

  return (
    <Modal
      visible
      animationType="slide"
      transparent
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Truck size={18} color={COLORS.primary} />
              <Text style={styles.title}>Checkout & Delivery</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={COLORS.darkChocolate} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollBody}
          >
            {/* Delivery Address Section */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <MapPin size={15} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Delivery Address</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Recipient Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  placeholder="e.g. Maya Sweet"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Street & Apt</Text>
                <TextInput
                  style={styles.textInput}
                  value={streetAddress}
                  onChangeText={setStreetAddress}
                  placeholder="e.g. 742 Evergreen Terrace"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Phone</Text>
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="+1 (555) 234-5678"
                />
              </View>
            </View>

            {/* Delivery Time Selector */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Clock size={15} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Delivery Time</Text>
              </View>

              <View style={styles.dateRow}>
                {['Today', 'Tomorrow', 'Saturday'].map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDeliveryDate(d)}
                    style={[
                      styles.choiceChip,
                      deliveryDate === d && styles.choiceChipSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        deliveryDate === d && styles.choiceTextSelected
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.dateRow}>
                {['11 AM - 1 PM', '3 PM - 5 PM', '6 PM - 8 PM'].map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => setDeliverySlot(slot)}
                    style={[
                      styles.choiceChip,
                      deliverySlot === slot && styles.choiceChipSelected
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceText,
                        deliverySlot === slot && styles.choiceTextSelected
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <CreditCard size={15} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Payment Method</Text>
              </View>

              <View style={styles.paymentOptions}>
                {[
                  { id: 'apple_pay', label: 'Pay / Google Pay', emoji: '⚡' },
                  { id: 'card', label: 'Credit / Debit Card', emoji: '💳' },
                  { id: 'cod', label: 'Cash on Delivery', emoji: '💵' }
                ].map((pay) => (
                  <TouchableOpacity
                    key={pay.id}
                    onPress={() => setPaymentMethod(pay.id as any)}
                    style={[
                      styles.payOption,
                      paymentMethod === pay.id && styles.payOptionSelected
                    ]}
                  >
                    <Text style={{ fontSize: 16 }}>{pay.emoji}</Text>
                    <Text
                      style={[
                        styles.payLabel,
                        paymentMethod === pay.id && styles.payLabelSelected
                      ]}
                    >
                      {pay.label}
                    </Text>
                    {paymentMethod === pay.id && (
                      <CheckCircle size={15} color={COLORS.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Order Total & Confirmation */}
            <View style={styles.totalBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total to Pay</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handlePlaceOrder}
              style={styles.placeOrderBtn}
              activeOpacity={0.85}
            >
              <Sparkles size={18} color={COLORS.white} />
              <Text style={styles.placeOrderText}>Confirm & Place Order</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(59, 44, 48, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.bgCream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    maxHeight: '90%',
    padding: 16,
    gap: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderPink
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollBody: {
    gap: 12,
    paddingBottom: 24
  },
  card: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 18,
    padding: 12,
    gap: 10
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  inputGroup: {
    gap: 4
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textSecondary,
    textTransform: 'uppercase'
  },
  textInput: {
    backgroundColor: COLORS.bgCream,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
    color: COLORS.darkChocolate,
    fontWeight: '600'
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8
  },
  choiceChip: {
    flex: 1,
    backgroundColor: COLORS.bgCream,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center'
  },
  choiceChipSelected: {
    backgroundColor: COLORS.pinkSoft,
    borderColor: COLORS.primary
  },
  choiceText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.darkChocolate
  },
  choiceTextSelected: {
    color: COLORS.primary,
    fontWeight: '900'
  },
  paymentOptions: {
    gap: 6
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCream,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 14,
    padding: 10,
    gap: 10
  },
  payOptionSelected: {
    backgroundColor: COLORS.pinkSoft,
    borderColor: COLORS.primary
  },
  payLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.darkChocolate
  },
  payLabelSelected: {
    color: COLORS.primary,
    fontWeight: '900'
  },
  totalBox: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 16,
    padding: 12
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary
  },
  placeOrderBtn: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.pink
  },
  placeOrderText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900'
  }
});
