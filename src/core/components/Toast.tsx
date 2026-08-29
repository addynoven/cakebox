import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radius } from '../theme/spacing';
import { shadows } from '../theme/shadows';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.card}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.darkChocolate,
    borderWidth: 1,
    borderColor: colors.borderPink,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    ...shadows.medium,
  },
  text: {
    ...typography.bodySm,
    color: colors.white,
    fontWeight: '800',
    textAlign: 'center',
  },
});
