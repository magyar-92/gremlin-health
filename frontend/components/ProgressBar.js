import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

export const ProgressBar = ({
  progress = 0,
  color = 'primary',
  height = 12,
  showLabel = true,
  label = ''
}) => {
  const colorMap = {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    accent: colors.accent,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.background, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(progress, 100)}%`,
              backgroundColor: colorMap[color],
              height,
            },
          ]}
        />
      </View>
      {showLabel && label && (
        <Text style={styles.label}>{label}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  background: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  fill: {
    borderRadius: borderRadius.full,
  },
  label: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
