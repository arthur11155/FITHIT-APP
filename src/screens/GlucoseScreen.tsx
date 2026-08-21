import React from 'react';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import GlucoseChart, { GlucoseChartPoint } from '../components/GlucoseChart';
import { colors, fontSize, radii } from '../theme';
import { seedReadings } from '../data/seedData';
import type { GlucoseReading, GlucoseStatus } from '../data/seedData';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../storage/localStorage';

const periods = ['Jejum', 'Pós-Café', 'Pós-Almoço', 'Pós-Jantar', 'Antes de Dormir'];

const statusColor: Record<GlucoseStatus, { bg: string; fg: string }> = {
  normal: { bg: colors.green100, fg: colors.green700 },
  high: { bg: colors.red100, fg: colors.red700 },
  low: { bg: colors.yellow100, fg: colors.yellow700 },
};

const statusLabel: Record<GlucoseStatus, string> = {
  normal: 'Normal',
  high: 'Alto',
  low: 'Baixo',
};

function getStatus(value: number): GlucoseStatus {
  if (value > 150) return 'high';
  if (value < 70) return 'low';
  return 'normal';
}

function formatDayMonth(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}`;
}

function formatPtBr(date: string) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export default function GlucoseScreen() {
  const [readings, setReadings] = useStoredState<GlucoseReading[]>(
    STORAGE_KEYS.glucoseReadings,
    seedReadings
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const [period, setPeriod] = useState(periods[0]);
  const [notes, setNotes] = useState('');

  const chartData: GlucoseChartPoint[] = readings
    .slice()
    .reverse()
    .slice(0, 7)
    .reverse()
    .map((reading) => ({ date: formatDayMonth(reading.date), value: reading.value }));

  const lastSeven = readings.slice(0, 7);
  const average =
    lastSeven.length > 0
      ? Math.round(lastSeven.reduce((sum, r) => sum + r.value, 0) / lastSeven.length)
      : 0;
  const inRangeCount = lastSeven.filter((r) => r.status === 'normal').length;
  const inRangePct = lastSeven.length > 0
    ? Math.round((inRangeCount / lastSeven.length) * 100)
    : 0;
  const latest = readings[0];

  const saveReading = () => {
    const numeric = parseInt(value, 10);
    if (isNaN(numeric) || numeric <= 0) return;

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const newReading: GlucoseReading = {
      id: Date.now(),
      value: numeric,
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      period,
      status: getStatus(numeric),
    };

    setReadings([newReading, ...readings]);
    setModalOpen(false);
    setValue('');
    setNotes('');
    setPeriod(periods[0]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title="Monitor de Glicose" subtitle="Acompanhe seus níveis de glicemia" />

      <Button
        title="Registrar Nova Medição"
        size="md"
        icon={<Ionicons name="add" size={16} color={colors.white} />}
        style={styles.newButton}
        onPress={() => setModalOpen(true)}
      />

      <View style={styles.grid}>
        <Card style={styles.gridItem}>
          <View style={styles.statHeader}>
            <Ionicons name="pulse" size={14} color={colors.green600} />
            <Text style={styles.statLabel}>Média 7 dias</Text>
          </View>
          <Text style={styles.statValue}>
            {average} <Text style={styles.statUnit}>mg/dL</Text>
          </Text>
        </Card>
        <Card style={styles.gridItem}>
          <View style={styles.statHeader}>
            <Ionicons name="trending-up" size={14} color={colors.blue600} />
            <Text style={styles.statLabel}>Tendência</Text>
          </View>
          <Text style={[styles.statValue, { color: colors.blue700 }]}>Estável</Text>
        </Card>
        <Card style={styles.gridItem}>
          <View style={styles.statHeader}>
            <Ionicons name="trending-down" size={14} color={colors.green600} />
            <Text style={styles.statLabel}>No Alvo</Text>
          </View>
          <Text style={styles.statValue}>
            {inRangePct} <Text style={styles.statUnit}>%</Text>
          </Text>
        </Card>
        <Card style={styles.gridItem}>
          <View style={styles.statHeader}>
            <Ionicons name="pulse" size={14} color={colors.gray500} />
            <Text style={styles.statLabel}>Última</Text>
          </View>
          <Text style={styles.statValue}>
            {latest ? latest.value : '—'} <Text style={styles.statUnit}>mg/dL</Text>
          </Text>
        </Card>
      </View>

      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>Histórico (7 dias)</Text>
        {readings.length === 0 ? (
          <Text style={styles.emptyChartText}>Sem dados. Registre uma medição para começar.</Text>
        ) : (
          <GlucoseChart data={chartData} minRef={100} maxRef={140} yDomain={[60, 200]} height={176} />
        )}
      </Card>

      <Card style={styles.listCard}>
        <Text style={styles.listTitle}>Medições Recentes</Text>
        {readings.length === 0 ? (
          <Text style={styles.emptyChartText}>Nenhuma medição registrada.</Text>
        ) : null}
        {readings.map((reading) => {
          const palette = statusColor[reading.status];
          return (
            <View key={reading.id} style={styles.measurementRow}>
              <View style={styles.measurementLeft}>
                <View style={[styles.valuePill, { backgroundColor: palette.bg }]}>
                  <Text style={[styles.valueText, { color: palette.fg }]}>{reading.value}</Text>
                  <Text style={[styles.valueUnit, { color: palette.fg }]}> mg/dL</Text>
                </View>
                <View>
                  <Text style={styles.periodText}>{reading.period}</Text>
                  <Text style={styles.dateText}>
                    {formatPtBr(reading.date)} · {reading.time}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusPill, { backgroundColor: palette.bg }]}>
                <Text style={[styles.statusText, { color: palette.fg }]}>
                  {statusLabel[reading.status]}
                </Text>
              </View>
            </View>
          );
        })}
      </Card>

      <Card variant="green" style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Dica</Text>
        <Text style={styles.tipText}>
          Medir a glicose regularmente ajuda a identificar padrões. Registre sempre antes e após as
          refeições principais.
        </Text>
      </Card>

      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Medição de Glicose</Text>
              <Pressable onPress={() => setModalOpen(false)} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.gray500} />
              </Pressable>
            </View>

            <Text style={styles.fieldLabel}>Valor (mg/dL)</Text>
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              placeholder="Ex: 120"
              placeholderTextColor={colors.gray400}
              style={styles.input}
            />

            <Text style={styles.fieldLabel}>Período</Text>
            <View style={styles.periodWrap}>
              {periods.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setPeriod(item)}
                  style={[styles.periodChip, item === period && styles.periodChipActive]}
                >
                  <Text
                    style={[styles.periodChipText, item === period && styles.periodChipTextActive]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Observações (opcional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ex: Após exercício"
              placeholderTextColor={colors.gray400}
              style={styles.input}
            />

            <Button
              title="Salvar Medição"
              size="md"
              style={styles.saveButton}
              onPress={saveReading}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  newButton: {
    marginBottom: 16,
    height: 40,
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
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray500,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.green700,
  },
  statUnit: {
    fontSize: fontSize.xs,
    fontWeight: '400',
    color: colors.gray400,
  },
  chartCard: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 8,
  },
  listCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 8,
  },
  emptyChartText: {
    fontSize: fontSize.xs,
    color: colors.gray400,
    paddingVertical: 12,
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray50,
    borderRadius: radii.lg,
    padding: 10,
    marginBottom: 8,
  },
  measurementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  valuePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  valueUnit: {
    fontSize: 10,
  },
  periodText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray800,
  },
  dateText: {
    fontSize: 10,
    color: colors.gray400,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  tipCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tipTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.green800,
    marginBottom: 4,
  },
  tipText: {
    fontSize: fontSize.xs,
    color: colors.green700,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray800,
    flex: 1,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    color: colors.gray700,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    fontSize: fontSize.sm,
    color: colors.gray800,
    backgroundColor: colors.white,
  },
  periodWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  periodChipActive: {
    backgroundColor: colors.green50,
    borderColor: colors.primary,
  },
  periodChipText: {
    fontSize: fontSize.xs,
    color: colors.gray600,
  },
  periodChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 20,
    height: 40,
  },
});
