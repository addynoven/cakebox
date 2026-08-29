import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  const getStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];
    if (variant === 'elevated') list.push(styles.elevated);
    if (variant === 'outlined') list.push(styles.outlined);
    if (variant === 'flat') list.push(styles.flat);
    if (style) list.push(style);
    return list;
  };

  return <View style={getStyle()}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceCard,
    borderRadius: radius.lg,
    padding: spacing.base,
  },
  elevated: {
    borderWidth: 1.5,
    borderColor: colors.borderPink,
    ...shadows.soft,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: colors.borderPink,
  },
  flat: {
    backgroundColor: colors.pinkSoft,
  },
});
