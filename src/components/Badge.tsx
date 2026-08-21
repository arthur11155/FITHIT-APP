import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors, fontSize, radii } from '../theme';

export type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'gray';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const palette: Record<BadgeVariant, { bg: string; fg: string }> = {
  green: { bg: colors.green100, fg: colors.green700 },
  red: { bg: colors.red100, fg: colors.red700 },
  yellow: { bg: colors.yellow100, fg: colors.yellow700 },
  blue: { bg: colors.blue100, fg: colors.blue700 },
  gray: { bg: colors.gray100, fg: colors.gray600 },
};

export default function Badge({ label, variant = 'green', icon, style }: BadgeProps) {
  const { bg, fg } = palette[variant];
  return (
    <View style={[styles.base, { backgroundColor: bg }, style]}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  icon: {
    marginRight: 3,
  },
  label: {
    fontSize: fontSize.xxs,
    fontWeight: '500',
  },
});
