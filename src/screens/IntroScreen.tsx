import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radii } from '../theme';
import Button from '../components/Button';

interface Props {
  onRegister: () => void;
  onLogin: () => void;
}

export default function IntroScreen({ onRegister, onLogin }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Ionicons name="fitness" size={80} color={colors.primary} />
        </View>

        <Text style={styles.title}>FITHIT</Text>
        <Text style={styles.subtitle}>Gestão de Diabetes</Text>
        <Text style={styles.description}>
          Cuide da sua saúde de forma simples e eficiente. Acompanhe sua glicose,
          organize seus exames e mantenha uma alimentação equilibrada.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Criar Conta"
          onPress={onRegister}
          style={styles.registerButton}
        />
        <Button
          title="Já tenho conta"
          variant="outline"
          onPress={onLogin}
          style={styles.loginButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.green50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.lg,
    fontWeight: '500',
    color: colors.gray600,
    marginBottom: 16,
  },
  description: {
    fontSize: fontSize.sm,
    color: colors.gray400,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
  registerButton: {
    width: '100%',
  },
  loginButton: {
    width: '100%',
  },
});
