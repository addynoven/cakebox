import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ArrowLeft, Sparkles, MapPin } from 'lucide-react-native';
import { COLORS, SHADOWS } from '../utils/theme';

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
  onOpenBakeryMap
}) => {
  return (
    <View style={styles.headerContainer}>
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
                <ArrowLeft size={18} color={COLORS.darkChocolate} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>{title}</Text>
            </View>
          ) : (
            <View style={styles.logoRow}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.logoText}>CakeBox</Text>
            </View>
          )}
        </View>

        {/* Right Section: Core Shortcuts */}
        <View style={styles.rightSection}>
          {/* AI Chef Button */}
          {onOpenAIChef && (
            <TouchableOpacity
              onPress={onOpenAIChef}
              style={styles.aiChefButton}
              activeOpacity={0.8}
            >
              <Sparkles size={13} color={COLORS.white} />
              <Text style={styles.aiChefText}>AI Chef</Text>
            </TouchableOpacity>
          )}

          {/* Bakery Map Button */}
          {onOpenBakeryMap && (
            <TouchableOpacity
              onPress={onOpenBakeryMap}
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <MapPin size={16} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.bgCream,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.borderPink,
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 30
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.darkChocolate
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 14
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.darkChocolate,
    letterSpacing: -0.5
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.borderPink,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft
  },
  aiChefButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.darkChocolate,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    ...SHADOWS.soft
  },
  aiChefText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800'
  }
});
