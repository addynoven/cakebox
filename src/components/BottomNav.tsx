import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  BookOpen,
  Sparkles,
  ShoppingBag,
  User
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '../utils/theme';

export type NavTab = 'home' | 'menu' | 'custom' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount = 0
}) => {
  const insets = useSafeAreaInsets();
  const tabs: { id: NavTab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'menu', label: 'Menu', icon: BookOpen },
    { id: 'custom', label: 'Custom', icon: Sparkles },
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'profile', label: 'Orders', icon: User }
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isCustomTab = tab.id === 'custom';

          if (isCustomTab) {
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onSelectTab(tab.id)}
                style={styles.customTabButton}
                activeOpacity={0.8}
              >
                <View style={styles.customTabCircle}>
                  <Text style={{ fontSize: 20 }}>🎂</Text>
                </View>
                <Text style={[styles.tabLabel, styles.customTabLabel]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onSelectTab(tab.id)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                <Icon
                  size={20}
                  color={isActive ? COLORS.primary : COLORS.textSecondary}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {tab.id === 'cart' && cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.borderPink,
    paddingTop: 6,
    ...SHADOWS.medium
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minWidth: 54
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  activeIconWrapper: {
    backgroundColor: COLORS.pinkSoft
  },
  customTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -12
  },
  customTabCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.pink
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 1,
    fontWeight: '700'
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: '900'
  },
  inactiveTabLabel: {
    color: COLORS.textSecondary
  },
  customTabLabel: {
    color: COLORS.darkChocolate,
    fontWeight: '900',
    marginTop: 2
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '900'
  }
});
