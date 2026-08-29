import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    if (size === 'sm') list.push(styles.sizeSm);
    else if (size === 'lg') list.push(styles.sizeLg);
    else list.push(styles.sizeMd);

    switch (variant) {
      case 'primary':
        list.push(styles.primary);
        break;
      case 'secondary':
        list.push(styles.secondary);
        break;
      case 'dark':
        list.push(styles.dark);
        break;
      case 'outline':
        list.push(styles.outline);
        break;
      case 'ghost':
        list.push(styles.ghost);
        break;
    }

    if (fullWidth) list.push(styles.fullWidth);
    if (disabled || loading) list.push(styles.disabled);
    if (style) list.push(style);

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.baseText];

    if (size === 'sm') list.push(styles.textSm);
    else if (size === 'lg') list.push(styles.textLg);
    else list.push(styles.textMd);

    switch (variant) {
      case 'primary':
      case 'dark':
        list.push(styles.textLight);
        break;
      case 'secondary':
      case 'outline':
      case 'ghost':
        list.push(styles.textDark);
        break;
    }

    if (textStyle) list.push(textStyle);
    return list;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'dark' ? colors.white : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    gap: spacing.xs,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  sizeSm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 34,
  },
  sizeMd: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
    minHeight: 44,
  },
  sizeLg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.pink,
  },
  secondary: {
    backgroundColor: colors.pinkSoft,
    borderWidth: 1.5,
    borderColor: colors.borderPink,
  },
  dark: {
    backgroundColor: colors.darkChocolate,
    ...shadows.soft,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.borderPink,
    ...shadows.soft,
  },
  ghost: {
    backgroundColor: colors.transparent,
  },
  baseText: {
    fontWeight: '800',
  },
  textSm: {
    ...typography.bodySm,
    fontWeight: '800',
  },
  textMd: {
    ...typography.bodyMd,
    fontWeight: '800',
  },
  textLg: {
    ...typography.titleMd,
    fontWeight: '800',
  },
  textLight: {
    color: colors.white,
  },
  textDark: {
    color: colors.darkChocolate,
  },
});
