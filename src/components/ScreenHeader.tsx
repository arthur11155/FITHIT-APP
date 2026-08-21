import React from 'react';
import { StyleSheet, Text, View, ViewStyle, StyleProp } from 'react-native';
import { colors, fontSize } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ScreenHeader({ title, subtitle, style }: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray800,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginTop: 2,
  },
});
