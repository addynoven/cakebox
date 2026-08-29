import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';

interface BadgeProps {
  label: string;
  variant?: 'hot' | 'new' | 'bestseller' | 'chef' | 'neutral' | 'success';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'hot',
  style,
}) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'hot':
        return { bg: colors.primary, text: colors.white };
      case 'new':
        return { bg: colors.greenSoft, text: '#065F46' };
      case 'bestseller':
        return { bg: colors.yellowSoft, text: '#92400E' };
      case 'chef':
        return { bg: colors.purpleSoft, text: '#5B21B6' };
      case 'success':
        return { bg: colors.greenSoft, text: colors.success };
      case 'neutral':
      default:
        return { bg: colors.pinkSoft, text: colors.darkChocolate };
    }
  };

  const c = getBadgeColors();

  return (
    <View style={[styles.container, { backgroundColor: c.bg }, style]}>
      <Text style={[styles.text, { color: c.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius.pill,
  },
  text: {
    ...typography.labelCaps,
    fontSize: 10,
    fontWeight: '900',
  },
});
