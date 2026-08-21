import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  StyleProp,
  PressableProps,
} from 'react-native';
import { colors, radii, fontSize } from '../theme';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'outline' | 'outlineDanger';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  style,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        size === 'sm' ? styles.sm : styles.md,
        pressed && styles.pressed,
        style,
      ]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text style={[styles.label, labelStyles[variant]]}>{title}</Text>
    </Pressable>
  );
}

type Variant = 'primary' | 'outline' | 'outlineDanger';

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
  },
  md: {
    height: 40,
    paddingHorizontal: 16,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.green200,
  },
  outlineDanger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.red200,
  },
  pressed: {
    opacity: 0.8,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  primaryLabel: {
    color: colors.white,
  },
  outlineLabel: {
    color: colors.green700,
  },
  outlineDangerLabel: {
    color: colors.red700,
  },
});

const labelStyles: Record<Variant, StyleProp<TextStyle>> = {
  primary: styles.primaryLabel,
  outline: styles.outlineLabel,
  outlineDanger: styles.outlineDangerLabel,
};
