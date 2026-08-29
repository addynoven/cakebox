import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Home, BookOpen, Sparkles, ShoppingBag, User } from 'lucide-react-native';
import { colors } from '../../core/theme/colors';
import { shadows } from '../../core/theme/shadows';
import { useCartStore } from '../../features/cart/store/useCartStore';

export default function TabLayout() {
  const cart = useCartStore((state) => state.cart);
  const totalCartCount = cart.reduce((sum, it) => sum + it.quantity, 0);

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
          height: Platform.OS === 'ios' ? 84 : 66,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
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
          tabBarIcon: () => (
            <View style={styles.customCircle}>
              <Text style={{ fontSize: 18 }}>🎂</Text>
            </View>
          ),
          tabBarLabelStyle: {
            color: colors.darkChocolate,
            fontWeight: '900',
            fontSize: 10,
          },
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <ShoppingBag size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
              {totalCartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalCartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <User size={20} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 8,
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
  customCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    top: -10,
    ...shadows.pink,
  },
});
