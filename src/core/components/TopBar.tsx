import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles, MapPin } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { shadows } from '../theme/shadows';
import { FeatureGate } from './FeatureGate';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenAIChef?: () => void;
  onOpenBakeryMap?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'CakeBox',
  showBack = false,
  onBack,
  onOpenAIChef,
  onOpenBakeryMap,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.contentRow}>
        {/* Left Section: Back Button + Title or Logo */}
        <View style={styles.leftSection}>
          {showBack ? (
            <View style={styles.backRow}>
              <TouchableOpacity
                onPress={onBack}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <ArrowLeft size={18} color={colors.darkChocolate} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>{title}</Text>
            </View>
          ) : (
            <View style={styles.logoRow}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>CakeBox</Text>
            </View>
          )}
        </View>

        {/* Right Section: Core Shortcuts gated by FeatureFlags */}
        <View style={styles.rightSection}>
          {/* AI Chef Button */}
          {onOpenAIChef && (
            <FeatureGate flag="enableAIChef">
              <TouchableOpacity
                onPress={onOpenAIChef}
                style={styles.aiChefButton}
                activeOpacity={0.8}
              >
                <Sparkles size={13} color={colors.white} />
                <Text style={styles.aiChefText}>AI Chef</Text>
              </TouchableOpacity>
            </FeatureGate>
          )}

          {/* Bakery Map Pickup Locator */}
          {onOpenBakeryMap && (
            <FeatureGate flag="enableBakeryMap">
              <TouchableOpacity
                onPress={onOpenBakeryMap}
                style={styles.mapIconButton}
                activeOpacity={0.7}
              >
                <MapPin size={17} color={colors.primaryDark} />
              </TouchableOpacity>
            </FeatureGate>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.bgCream,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderPink,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.darkChocolate,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 28,
    height: 28,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primaryDark,
    letterSpacing: -0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiChefButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    ...shadows.pink,
  },
  aiChefText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  mapIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.pinkSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderPink,
  },
});
