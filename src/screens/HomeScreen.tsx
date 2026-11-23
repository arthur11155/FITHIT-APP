import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, fontSize, radii } from '../theme';
import { defaultReadings, defaultUpcomingExams } from '../data/defaults';
import type { GlucoseReading, UpcomingExam, User } from '../data/types';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../storage/localStorage';

interface QuickAction {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: 'Home' | 'Hospitals' | 'Exams' | 'Nutrition' | 'Glucose';
  label: string;
}

const quickActions: QuickAction[] = [
  { title: 'Registrar Glicose', description: 'Nova medição', icon: 'pulse', path: 'Glucose', label: 'Medir Agora' },
  { title: 'Plano Alimentar', description: 'Refeições de hoje', icon: 'heart', path: 'Nutrition', label: 'Ver Plano' },
  { title: 'Próximos Exames', description: 'Agende e acompanhe', icon: 'calendar', path: 'Exams', label: 'Ver Agenda' },
  { title: 'Hospitais', description: 'Perto de você', icon: 'trending-up', path: 'Hospitals', label: 'Buscar' },
];

type Navigation = {
  navigate: (screen: QuickAction['path']) => void;
};

function todayKey() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function formatDatePtBr(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export default function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const [user] = useStoredState<User | null>(STORAGE_KEYS.user, null);
  const [readings] = useStoredState<GlucoseReading[]>(
    STORAGE_KEYS.glucoseReadings,
    defaultReadings
  );
  const [upcomingExams] = useStoredState<UpcomingExam[]>(
    STORAGE_KEYS.upcomingExams,
    defaultUpcomingExams
  );

  const latest = readings[0];
  const lastSeven = readings.slice(0, 7);
  const inRangePct =
    lastSeven.length > 0
      ? Math.round(
          (lastSeven.filter((r) => r.status === 'normal').length / lastSeven.length) * 100
        )
      : 0;

  const firstName = user?.name.trim().split(/\s+/)[0];

  const alerts: { message: string; time: string }[] = [];
  if (latest?.date !== todayKey()) {
    alerts.push({ message: 'Hora de medir sua glicose', time: 'Hoje' });
  }
  const nextExam = upcomingExams
    .slice()
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  if (nextExam) {
    alerts.push({
      message: `Consulta: ${nextExam.name}`,
      time: formatDatePtBr(nextExam.date),
    });
  }

  const quickStats = [
    {
      label: 'Glicose Atual',
      value: latest ? `${latest.value} mg/dL` : '—',
      color: colors.green600,
    },
    {
      label: 'Última Medição',
      value: latest ? `${formatDatePtBr(latest.date)} ${latest.time}` : 'Nenhuma',
      color: colors.gray500,
    },
    { label: 'No Alvo (7 dias)', value: `${inRangePct}%`, color: colors.green600 },
    {
      label: 'Consultas',
      value: `${upcomingExams.length} agend.`,
      color: colors.blue600,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>
          {firstName ? `Olá, ${firstName}!` : 'Olá!'} 👋
        </Text>
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
        {alerts.length === 0 ? (
          <Text style={styles.alertEmpty}>Nenhum lembrete no momento.</Text>
        ) : (
          alerts.map((alert, index) => (
            <View
              key={index}
              style={[styles.alertRow, index < alerts.length - 1 && styles.alertRowBorder]}
            >
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
          ))
        )}
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
  alertEmpty: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    paddingVertical: 8,
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
