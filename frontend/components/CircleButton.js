import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

export const CircleButton = ({
  label,
  onPress,
  color = 'primary',
  size = 100
}) => {
  const colorMap = {
    primary: colors.primary,
    secondary: colors.secondary,
    tertiary: colors.tertiary,
    accent: colors.accent,
  };

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: colorMap[color],
        },
      ]}
      onTouchEnd={onPress}
    >
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
});
