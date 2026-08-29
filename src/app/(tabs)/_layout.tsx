import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, BookOpen, ShoppingBag, User } from 'lucide-react-native';
import { colors } from '../../core/theme/colors';
import { shadows } from '../../core/theme/shadows';
import { useFeatureFlag } from '../../core/config';
import { useCartStore } from '../../features/cart/store/useCartStore';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const cart = useCartStore((state) => state.cart);
  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);
  const isCustomizerEnabled = useFeatureFlag('enable3DCustomizer');

  const bottomInset = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.borderPink,
          borderTopWidth: 1.5,
          height: 56 + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          ...shadows.medium,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, focused }) => (
            <BookOpen size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="custom"
        options={{
          title: 'Custom',
          href: isCustomizerEnabled ? '/(tabs)/custom' : null,
          tabBarIcon: () => (
            <View style={styles.customCircle}>
              <Text style={{ fontSize: 18 }}>🎂</Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View>
              <ShoppingBag size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
              {totalCartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {totalCartCount > 99 ? '99+' : totalCartCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    marginTop: -4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.primaryDark,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
  },
});
