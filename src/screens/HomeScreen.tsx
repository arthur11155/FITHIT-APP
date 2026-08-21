import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, fontSize, radii } from '../theme';

interface QuickStat {
  label: string;
  value: string;
  color: string;
}

interface AlertItem {
  message: string;
  time: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: 'Home' | 'Hospitals' | 'Exams' | 'Nutrition' | 'Glucose';
  label: string;
}

const quickStats: QuickStat[] = [
  { label: 'Glicose Atual', value: '126 mg/dL', color: colors.green600 },
  { label: 'Última Medição', value: 'Hoje, 08:30', color: colors.gray500 },
  { label: 'Meta Mensal', value: '85%', color: colors.green600 },
  { label: 'Consultas', value: '3 agend.', color: colors.blue600 },
];

const alerts: AlertItem[] = [
  { message: 'Hora de medir sua glicose', time: 'Agora' },
  { message: 'Consulta amanhã às 14h', time: '1 dia' },
];

const quickActions: QuickAction[] = [
  { title: 'Registrar Glicose', description: 'Nova medição', icon: 'pulse', path: 'Glucose', label: 'Medir Agora' },
  { title: 'Plano Alimentar', description: 'Refeições de hoje', icon: 'heart', path: 'Nutrition', label: 'Ver Plano' },
  { title: 'Próximos Exames', description: 'Agende e acompanhe', icon: 'calendar', path: 'Exams', label: 'Ver Agenda' },
  { title: 'Hospitais', description: 'Perto de você', icon: 'trending-up', path: 'Hospitals', label: 'Buscar' },
];

type Navigation = {
  navigate: (screen: QuickAction['path']) => void;
};

export default function HomeScreen() {
  const navigation = useNavigation<Navigation>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Olá, Maria! 👋</Text>
        <Text style={styles.greetingSub}>Como está se sentindo hoje?</Text>
      </View>

      <View style={styles.grid}>
        {quickStats.map((stat, index) => (
          <Card key={index} style={styles.gridItem}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
          </Card>
        ))}
      </View>

      <Card variant="green" style={styles.alertsCard}>
        <View style={styles.alertsHeader}>
          <Ionicons name="alert-circle" size={16} color={colors.green800} />
          <Text style={styles.alertsTitle}>Lembretes</Text>
        </View>
        {alerts.map((alert, index) => (
          <View
            key={index}
            style={[styles.alertRow, index < alerts.length - 1 && styles.alertRowBorder]}
          >
            <Text style={styles.alertMessage}>{alert.message}</Text>
            <Text style={styles.alertTime}>{alert.time}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.grid}>
        {quickActions.map((action) => (
          <Card key={action.path} style={styles.gridItem}>
            <View style={styles.actionIcon}>
              <Ionicons name={action.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionDescription}>{action.description}</Text>
            <Button
              title={action.label}
              size="sm"
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.path)}
            />
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.gray800,
  },
  greetingSub: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  gridItem: {
    width: '47%',
    flexGrow: 1,
    padding: 12,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray400,
    marginBottom: 4,
  },
  statValue: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  alertsCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  alertsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.green800,
  },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  alertRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.green200,
  },
  alertMessage: {
    fontSize: fontSize.xs,
    color: colors.gray700,
    flex: 1,
  },
  alertTime: {
    fontSize: 11,
    color: colors.gray400,
    marginLeft: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: colors.green100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray800,
  },
  actionDescription: {
    fontSize: 11,
    color: colors.gray400,
    marginVertical: 8,
  },
  actionButton: {
    width: '100%',
  },
});
