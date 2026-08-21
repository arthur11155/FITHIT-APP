import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, radii } from '../theme';

export default function AppHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="pulse" size={16} color={colors.white} />
          </View>
          <Text style={styles.title}>FITHIT</Text>
        </View>
        <Text style={styles.tagline}>Seu companheiro de saúde</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.white,
  },
  tagline: {
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
