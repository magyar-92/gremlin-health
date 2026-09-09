import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

export const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
    },
    tertiary: {
      backgroundColor: colors.tertiary,
      borderColor: colors.tertiary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colors.primary,
      borderWidth: 2,
    },
  };

  const sizeStyles = {
    sm: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    md: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    lg: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[
        styles.text,
        variant === 'outline' ? styles.outlineText : styles.solidText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  solidText: {
    color: '#000',
  },
  outlineText: {
    color: colors.primary,
  },
});
