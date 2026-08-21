import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../theme';

interface ProgressBarProps {
  /** Progress value 0-100 */
  value: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ProgressBar({
  value,
  height = 6,
  trackColor = colors.gray200,
  fillColor = colors.primary,
  style,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
