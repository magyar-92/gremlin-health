import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../theme';

export const Card = ({ children, style, variant = 'default' }) => {
  const variantStyles = {
    default: {
      backgroundColor: colors.surface,
    },
    elevated: {
      backgroundColor: colors.surfaceLight,
      ...shadows.md,
    },
    bordered: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.primary,
    },
  };

  return (
    <View style={[styles.card, variantStyles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
