import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, radii } from '../theme';
import Button from '../components/Button';
import { readJSON, writeJSON, STORAGE_KEYS } from '../storage/localStorage';
import type { User } from '../data/types';

interface Props {
  onBack: () => void;
  onSuccess: () => void;
  onRegister: () => void;
}

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

// Stub validation - implementar quando tiver backend
function validateLogin(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.password) {
    errors.password = 'Senha é obrigatória';
  }

  return errors;
}

// Stub API call - implementar quando tiver backend
async function loginUser(data: FormData): Promise<{ success: boolean; error?: string }> {
  console.log('Login stub called with:', data);
  // TODO: Implementar chamada real à API
  return { success: true };
}

export default function LoginScreen({ onBack, onSuccess, onRegister }: Props) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateLogin(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser(formData);
      if (result.success) {
        const stored = readJSON<User | null>(STORAGE_KEYS.user, null);
        writeJSON(STORAGE_KEYS.user, {
          name: stored?.name ?? '',
          email: formData.email.trim(),
        });
        onSuccess();
      } else {
        setErrors({ email: result.error || 'Credenciais inválidas' });
      }
    } catch (error) {
      setErrors({ email: 'Erro inesperado. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Button
            title=""
            variant="outline"
            onPress={onBack}
            icon={<Ionicons name="arrow-back" size={18} color={colors.gray600} />}
            style={styles.backButton}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.gray400}
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                  placeholder="Sua senha"
                  placeholderTextColor={colors.gray400}
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry={!showPassword}
                />
                <Button
                  title=""
                  variant="outline"
                  onPress={() => setShowPassword(!showPassword)}
                  icon={
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={colors.gray400}
                    />
                  }
                  style={styles.eyeButton}
                />
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>

            <Button
              title={loading ? 'Entrando...' : 'Entrar'}
              onPress={handleSubmit}
              style={styles.submitButton}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta?</Text>
              <Button title="Criar conta" variant="outline" onPress={onRegister} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.gray400,
    marginBottom: 40,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray700,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    fontSize: fontSize.sm,
    color: colors.gray800,
    backgroundColor: colors.gray50,
  },
  inputError: {
    borderColor: colors.red600,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radii.md,
  },
  errorText: {
    fontSize: 11,
    color: colors.red600,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
  registerContainer: {
    marginTop: 24,
    gap: 12,
    alignItems: 'center',
  },
  registerText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
});
