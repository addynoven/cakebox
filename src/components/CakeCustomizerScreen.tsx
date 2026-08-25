import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { CustomCakeConfig, CartItem, CakeItem } from '../types';
import { BASE_SPONGES, FROSTING_OPTIONS, DRIP_OPTIONS, TOPPER_STYLES } from '../data/cakes';
import { CakeVisualizer } from './CakeVisualizer';
import { CakeDoodles } from './CakeDoodles';
import { COLORS, SHADOWS } from '../utils/theme';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
  Sparkles
} from 'lucide-react-native';
import Svg, { Path, Circle, Ellipse } from 'react-native-svg';

interface CakeCustomizerScreenProps {
  baseCake?: CakeItem | null;
  onAddToCart: (cartItem: CartItem) => void;
  onCancel: () => void;
}

export const CakeCustomizerScreen: React.FC<CakeCustomizerScreenProps> = ({
  baseCake,
  onAddToCart,
  onCancel
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Customizer state
  const [selectedBase, setSelectedBase] = useState(BASE_SPONGES[0]);
  const [selectedFrosting, setSelectedFrosting] = useState(FROSTING_OPTIONS[1]);
  const [selectedDrip, setSelectedDrip] = useState(DRIP_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState<'6"' | '8"' | '10"'>('8"');

  const [toppings, setToppings] = useState({
    sprinkles: true,
    fruits: true,
    topper: true,
    topperText: 'Happy Birthday'
  });

  const [customTopperText, setCustomTopperText] = useState('Happy Birthday');
  const [specialRequests, setSpecialRequests] = useState('');

  // Calculated Price
  const basePrice = selectedSize === '6"' ? 35 : selectedSize === '8"' ? 45 : 58;
  const toppingsPrice = (toppings.fruits ? 3 : 0) + (toppings.topper ? 2 : 0);
  const totalPrice = basePrice + toppingsPrice;

  const currentConfig: CustomCakeConfig = {
    base: selectedBase,
    frosting: selectedFrosting,
    drip: selectedDrip,
    toppings: {
      ...toppings,
      topperText: customTopperText
    },
    size: selectedSize,
    servings: selectedSize === '6"' ? '4-6' : selectedSize === '8"' ? '8-10' : '12-15',
    price: totalPrice,
    messageOnCake: customTopperText,
    specialRequests: specialRequests
  };

  const handleFinishAndAdd = () => {
    const customCartItem: CartItem = {
      id: `custom-${Date.now()}`,
      name: `Custom ${selectedBase.name} (${selectedSize})`,
      price: totalPrice,
      quantity: 1,
      size: selectedSize,
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
      isCustom: true,
      customConfig: currentConfig,
      notes: `${selectedFrosting.name} frosting, ${selectedDrip.name}, Inscription: "${customTopperText}" ${
        specialRequests ? `| Note: ${specialRequests}` : ''
      }`
    };

    onAddToCart(customCartItem);
  };

  return (
    <View style={styles.container}>
      <CakeDoodles density="low" />

      {/* Top Header & Progress Bar */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={step === 1 ? onCancel : () => setStep((s) => (s - 1) as any)}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft size={18} color={COLORS.primary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>CakeBox Studio</Text>

          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step {step} of 4</Text>
          </View>
        </View>

        {/* Progress Track */}
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressBar, { width: `${(step / 4) * 100}%` }]}
          />
        </View>

        <Text style={styles.stepSubtitle}>
          {step === 1 && 'Step 1: Choose Your Sponge Base'}
          {step === 2 && 'Step 2: Pick Frosting Swirl'}
          {step === 3 && 'Step 3: Drip Glaze & Cake Size'}
          {step === 4 && 'Step 4: Special Toppings & Live Preview'}
        </Text>
      </View>

      {/* Main Body */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= STEP 1: SPONGE BASE ================= */}
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.sectionTitle}>Choose Your Base</Text>
            <Text style={styles.sectionDesc}>
              Freshly baked gourmet sponge layers prepared from scratch
            </Text>

            <View style={styles.spongeGrid}>
              {BASE_SPONGES.map((sponge) => {
                const isSelected = selectedBase.id === sponge.id;
                return (
                  <TouchableOpacity
                    key={sponge.id}
                    onPress={() => setSelectedBase(sponge)}
                    style={[
                      styles.spongeCard,
                      isSelected && styles.spongeCardSelected
                    ]}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.spongeDisc,
                        { backgroundColor: sponge.spongeColor }
                      ]}
                    >
                      <View
                        style={[
                          styles.spongeCrust,
                          { backgroundColor: sponge.color }
                        ]}
                      />
                      <View style={styles.creamStripe} />
                    </View>

                    {isSelected && (
                      <View style={styles.checkPill}>
                        <Check size={11} color={COLORS.white} strokeWidth={3} />
                      </View>
                    )}

                    <Text style={styles.spongeName}>{sponge.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Selected Flavor Profile:</Text>
              <Text style={styles.infoText}>{selectedBase.flavorDesc}</Text>
            </View>

            <TouchableOpacity
              onPress={() => setStep(2)}
              style={styles.nextBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.nextBtnText}>Next: Pick Frosting ✨</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 2: FROSTING ================= */}
        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.sectionTitle}>Pick Your Frosting</Text>
            <Text style={styles.sectionDesc}>
              Whipped Swiss meringue & rich silky frostings
            </Text>

            <View style={styles.frostingGrid}>
              {FROSTING_OPTIONS.map((f) => {
                const isSelected = selectedFrosting.id === f.id;
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => setSelectedFrosting(f)}
                    style={[
                      styles.frostingCard,
                      isSelected && styles.frostingCardSelected
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.bowlWrapper}>
                      <Svg viewBox="0 0 100 100" width={70} height={70}>
                        {/* Frosting Swirl */}
                        <Path
                          d="M25,50 C20,30 35,15 50,15 C65,15 80,30 75,50 Z"
                          fill={f.color}
                          stroke="#3B2C30"
                          strokeWidth="2.5"
                        />
                        {/* Smiling Bowl */}
                        <Path
                          d="M20,50 L25,75 C25,85 75,85 75,75 L80,50 Z"
                          fill={f.bowlColor}
                          stroke="#3B2C30"
                          strokeWidth="2.5"
                        />
                        {/* Kawaii Face */}
                        <Circle cx="42" cy="66" r="2" fill="#3B2C30" />
                        <Circle cx="58" cy="66" r="2" fill="#3B2C30" />
                        <Ellipse cx="36" cy="68" rx="2" ry="1.2" fill="#FB7185" />
                        <Ellipse cx="64" cy="68" rx="2" ry="1.2" fill="#FB7185" />
                      </Svg>
                    </View>

                    {isSelected && (
                      <View style={styles.checkPill}>
                        <Check size={11} color={COLORS.white} strokeWidth={3} />
                      </View>
                    )}

                    <Text style={styles.frostingName}>{f.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Frosting Notes:</Text>
              <Text style={styles.infoText}>{selectedFrosting.desc}</Text>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setStep(1)}
                style={styles.prevBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStep(3)}
                style={[styles.nextBtn, { flex: 1 }]}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>Next: Drip & Size</Text>
                <ChevronRight size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= STEP 3: DRIP & SIZE ================= */}
        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.sectionTitle}>Drip & Cake Size</Text>
            <Text style={styles.sectionDesc}>
              Add an indulgent cascading drizzle & choose your portions
            </Text>

            <Text style={styles.subHeading}>Cascading Drip Glaze</Text>
            <View style={styles.dripGrid}>
              {DRIP_OPTIONS.map((drip) => {
                const isSelected = selectedDrip.id === drip.id;
                return (
                  <TouchableOpacity
                    key={drip.id}
                    onPress={() => setSelectedDrip(drip)}
                    style={[
                      styles.dripCard,
                      isSelected && styles.dripCardSelected
                    ]}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.dripColorDot,
                        {
                          backgroundColor:
                            drip.color === 'transparent' ? '#FFFFFF' : drip.color
                        }
                      ]}
                    />
                    <Text
                      style={[
                        styles.dripName,
                        isSelected && styles.dripNameSelected
                      ]}
                    >
                      {drip.name}
                    </Text>
                    {isSelected && (
                      <Check size={14} color={COLORS.white} strokeWidth={3} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.subHeading}>Cake Size & Servings</Text>
            <View style={styles.sizeRow}>
              {[
                { size: '6"', label: 'Feeds 4-6', price: 35 },
                { size: '8"', label: 'Feeds 8-10', price: 45 },
                { size: '10"', label: 'Feeds 12-15', price: 58 }
              ].map((s) => {
                const isSelected = selectedSize === s.size;
                return (
                  <TouchableOpacity
                    key={s.size}
                    onPress={() => setSelectedSize(s.size as any)}
                    style={[
                      styles.sizeOption,
                      isSelected && styles.sizeOptionSelected
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.sizeOptionText,
                        isSelected && styles.sizeOptionTextSelected
                      ]}
                    >
                      {s.size}
                    </Text>
                    <Text
                      style={[
                        styles.sizeOptionLabel,
                        isSelected && styles.sizeOptionLabelSelected
                      ]}
                    >
                      {s.label}
                    </Text>
                    <Text
                      style={[
                        styles.sizeOptionPrice,
                        isSelected && styles.sizeOptionPriceSelected
                      ]}
                    >
                      ${s.price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity
                onPress={() => setStep(2)}
                style={styles.prevBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.prevBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setStep(4)}
                style={[styles.nextBtn, { flex: 1 }]}
                activeOpacity={0.85}
              >
                <Text style={styles.nextBtnText}>Finalize & Preview</Text>
                <ChevronRight size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= STEP 4: TOPPINGS & PREVIEW ================= */}
        {step === 4 && (
          <View style={styles.stepBox}>
            {/* Live Cake Visualizer Container */}
            <View style={styles.previewContainer}>
              <View style={styles.previewTag}>
                <Text style={styles.previewTagText}>LIVE PREVIEW</Text>
              </View>
              <CakeVisualizer config={currentConfig} size="md" />
            </View>

            {/* Special Toppings Toggles */}
            <Text style={styles.subHeading}>Special Toppings</Text>
            <View style={styles.toppingsGrid}>
              {/* Sprinkles */}
              <TouchableOpacity
                onPress={() =>
                  setToppings((prev) => ({ ...prev, sprinkles: !prev.sprinkles }))
                }
                style={[
                  styles.toppingCard,
                  toppings.sprinkles && styles.toppingCardSelected
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.toppingEmoji}>✨</Text>
                <Text style={styles.toppingLabel}>Sprinkles</Text>
                {toppings.sprinkles && (
                  <View style={styles.toppingCheck}>
                    <Check size={10} color={COLORS.white} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Fruits */}
              <TouchableOpacity
                onPress={() =>
                  setToppings((prev) => ({ ...prev, fruits: !prev.fruits }))
                }
                style={[
                  styles.toppingCard,
                  toppings.fruits && styles.toppingCardSelected
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.toppingEmoji}>🍓</Text>
                <Text style={styles.toppingLabel}>Fruits (+$3)</Text>
                {toppings.fruits && (
                  <View style={styles.toppingCheck}>
                    <Check size={10} color={COLORS.white} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Topper Sign */}
              <TouchableOpacity
                onPress={() =>
                  setToppings((prev) => ({ ...prev, topper: !prev.topper }))
                }
                style={[
                  styles.toppingCard,
                  toppings.topper && styles.toppingCardSelected
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.toppingEmoji}>👑</Text>
                <Text style={styles.toppingLabel}>Topper (+$2)</Text>
                {toppings.topper && (
                  <View style={styles.toppingCheck}>
                    <Check size={10} color={COLORS.white} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Inscription Text */}
            {toppings.topper && (
              <View style={styles.inputBox}>
                <Text style={styles.inputHeading}>
                  Cake Inscription / Topper Sign
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={customTopperText}
                  onChangeText={setCustomTopperText}
                  maxLength={24}
                  placeholder="e.g. Happy Birthday Maya!"
                />
                <View style={styles.presetRow}>
                  {TOPPER_STYLES.slice(0, 3).map((sty) => (
                    <TouchableOpacity
                      key={sty}
                      onPress={() => setCustomTopperText(sty)}
                      style={styles.presetChip}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.presetChipText}>{sty}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Special Requests */}
            <View style={styles.inputBox}>
              <Text style={styles.inputHeading}>Special Requests?</Text>
              <TextInput
                style={styles.textInput}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                placeholder="e.g. Less sugar, 5 candles, extra ribbon"
              />
            </View>

            {/* Add to Cart Button */}
            <TouchableOpacity
              onPress={handleFinishAndAdd}
              style={styles.addToCartCta}
              activeOpacity={0.85}
            >
              <View style={styles.ctaLeft}>
                <ShoppingBag size={18} color={COLORS.white} />
                <Text style={styles.ctaText}>Add Custom Cake to Cart</Text>
              </View>
              <Text style={styles.ctaPrice}>${totalPrice.toFixed(2)}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgCream
  },
  header: {
    backgroundColor: COLORS.pinkSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderPink,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    gap: 6
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  stepBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderPink
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.white,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.borderPink,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3
  },
  stepSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate,
    textAlign: 'center'
  },
  scrollContent: {
    padding: 16
  },
  stepBox: {
    gap: 14
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.darkChocolate,
    textAlign: 'center'
  },
  sectionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '600'
  },
  spongeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  spongeCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.soft
  },
  spongeCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.pinkSoft
  },
  spongeDisc: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.borderDark,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  spongeCrust: {
    width: '100%',
    height: '50%'
  },
  creamStripe: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.white
  },
  spongeName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkChocolate,
    marginTop: 8,
    textAlign: 'center'
  },
  checkPill: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 16,
    padding: 12,
    gap: 4
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary
  },
  infoText: {
    fontSize: 12,
    color: COLORS.darkMuted,
    fontWeight: '600'
  },
  nextBtn: {
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
  nextBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900'
  },
  frostingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10
  },
  frostingCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.soft
  },
  frostingCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.pinkSoft
  },
  bowlWrapper: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  frostingName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkChocolate,
    marginTop: 4,
    textAlign: 'center'
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  prevBtn: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    paddingHorizontal: 20,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  prevBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  subHeading: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.darkChocolate,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4
  },
  dripGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  },
  dripCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dripCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.borderDark
  },
  dripColorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLORS.borderDark
  },
  dripName: {
    flex: 1,
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  dripNameSelected: {
    color: COLORS.white
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 8
  },
  sizeOption: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderPink,
    borderRadius: 16,
    padding: 10,
    alignItems: 'center'
  },
  sizeOptionSelected: {
    backgroundColor: COLORS.peach,
    borderColor: COLORS.borderDark
  },
  sizeOptionText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  sizeOptionTextSelected: {
    color: COLORS.darkChocolate
  },
  sizeOptionLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontWeight: '700'
  },
  sizeOptionLabelSelected: {
    color: COLORS.darkChocolate
  },
  sizeOptionPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 2
  },
  sizeOptionPriceSelected: {
    color: COLORS.darkChocolate
  },
  previewContainer: {
    backgroundColor: COLORS.pinkMuted,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    position: 'relative'
  },
  previewTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.peach,
    borderWidth: 1,
    borderColor: COLORS.borderDark,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  previewTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  toppingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  toppingCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.borderPink,
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative'
  },
  toppingCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.pinkSoft
  },
  toppingEmoji: {
    fontSize: 22,
    marginBottom: 4
  },
  toppingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.darkChocolate
  },
  toppingCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputBox: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    borderRadius: 16,
    padding: 12,
    gap: 6
  },
  inputHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkChocolate
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
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4
  },
  presetChip: {
    backgroundColor: COLORS.pinkSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10
  },
  presetChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary
  },
  addToCartCta: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.borderDark,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    ...SHADOWS.pink
  },
  ctaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900'
  },
  ctaPrice: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900'
  }
});
