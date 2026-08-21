import React from 'react';
import { StyleSheet, View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { colors, radii, shadows } from '../theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'green';
  style?: StyleProp<ViewStyle>;
}

export default function Card({ variant = 'default', style, ...rest }: CardProps) {
  return (
    <View
      style={[styles.base, variant === 'green' && styles.green, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.green100,
    borderRadius: radii.lg,
    ...shadows.card,
  },
  green: {
    backgroundColor: colors.green50,
    borderColor: colors.green200,
  },
});
