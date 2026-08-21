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
import Badge from '../components/Badge';
import SegmentedTabs from '../components/SegmentedTabs';
import ScreenHeader from '../components/ScreenHeader';
import { colors, fontSize, radii } from '../theme';
import { seedUpcomingExams, seedExamInfo, examResults } from '../data/seedData';
import type { UpcomingExam } from '../data/seedData';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../storage/localStorage';

type Tab = 'upcoming' | 'results' | 'info';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function sortExams(exams: UpcomingExam[]): UpcomingExam[] {
  return exams.slice().sort((a, b) => {
    const aKey = `${a.date}T${a.time}`;
    const bKey = `${b.date}T${b.time}`;
    if (aKey === bKey) return 0;
    return aKey < bKey ? -1 : 1;
  });
}

export default function ExamsScreen() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const [upcomingExams, setUpcomingExams] = useStoredState<UpcomingExam[]>(
    STORAGE_KEYS.upcomingExams,
    seedUpcomingExams
  );
  const [examInfo] = useStoredState(STORAGE_KEYS.examInfo, seedExamInfo);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [preparacao, setPreparacao] = useState('');
  const [error, setError] = useState('');

  const openNewExamModal = () => {
    setEditingId(null);
    setName('');
    setDate('');
    setTime('');
    setLocation('');
    setPreparacao('');
    setError('');
    setModalOpen(true);
  };

  const openRescheduleModal = (exam: UpcomingExam) => {
    setEditingId(exam.id);
    setName(exam.name);
    setDate(exam.date);
    setTime(exam.time);
    setLocation(exam.location);
    setPreparacao(exam.preparacao);
    setError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setName('');
    setDate('');
    setTime('');
    setLocation('');
    setPreparacao('');
    setError('');
  };

  const saveExam = () => {
    if (!name.trim()) {
      setError('Informe o nome do exame.');
      return;
    }
    if (!DATE_REGEX.test(date)) {
      setError('Data inválida. Use o formato AAAA-MM-DD.');
      return;
    }
    if (!TIME_REGEX.test(time)) {
      setError('Hora inválida. Use o formato HH:MM.');
      return;
    }

    if (editingId !== null) {
      setUpcomingExams((prev) =>
        sortExams(
          prev.map((exam) =>
            exam.id === editingId
              ? {
                  ...exam,
                  name: name.trim(),
                  date,
                  time,
                  location: location.trim(),
                  preparacao: preparacao.trim(),
                }
              : exam
          )
        )
      );
    } else {
      const newExam: UpcomingExam = {
        id: Date.now(),
        name: name.trim(),
        date,
        time,
        location: location.trim() || 'A definir',
        preparacao: preparacao.trim() || 'Sem preparação específica',
      };
      setUpcomingExams((prev) => sortExams([newExam, ...prev]));
    }
    closeModal();
  };

  const cancelExam = (id: number) => {
    setUpcomingExams((prev) => prev.filter((exam) => exam.id !== id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title="Exames" subtitle="Acompanhe seus exames e resultados" />

      <SegmentedTabs<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'upcoming', label: 'Agendados' },
          { value: 'results', label: 'Resultados' },
          { value: 'info', label: 'Informações' },
        ]}
      />

      <View style={styles.tabBody}>
        {tab === 'upcoming' ? (
          <>
            <Button
              title="Agendar Novo Exame"
              size="sm"
              icon={<Ionicons name="calendar" size={14} color={colors.white} />}
              style={styles.newExamButton}
              onPress={openNewExamModal}
            />
            {upcomingExams.length === 0 ? (
              <Card style={styles.emptyCard}>
                <Text style={styles.emptyText}>Nenhum exame agendado.</Text>
              </Card>
            ) : null}
            {upcomingExams.map((exam) => (
              <Card key={exam.id} style={styles.examCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{exam.name}</Text>
                  <Badge label="Agendado" variant="blue" />
                </View>

                <View style={styles.metaList}>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar" size={14} color={colors.green500} />
                    <Text style={styles.metaText}>{formatDate(exam.date)}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="time" size={14} color={colors.green500} />
                    <Text style={styles.metaText}>{exam.time}</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Ionicons name="document-text" size={14} color={colors.green500} />
                    <Text style={styles.metaText}>{exam.location}</Text>
                  </View>
                </View>

                <View style={styles.preparationBox}>
                  <Ionicons name="alert-circle" size={14} color={colors.yellow700} />
                  <View style={styles.preparationTextWrap}>
                    <Text style={styles.preparationTitle}>Preparação</Text>
                    <Text style={styles.preparationText}>{exam.preparacao}</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <Button
                    title="Reagendar"
                    size="sm"
                    variant="outline"
                    style={styles.cardActionButton}
                    onPress={() => openRescheduleModal(exam)}
                  />
                  <Button
                    title="Cancelar"
                    size="sm"
                    variant="outlineDanger"
                    style={styles.cardActionButton}
                    onPress={() => cancelExam(exam.id)}
                  />
                </View>
              </Card>
            ))}
          </>
        ) : null}

        {tab === 'results' ? (
          examResults.map((exam) => (
            <Card key={exam.id} style={styles.examCard}>
              <View style={styles.cardHeader}>
                <View style={styles.resultInfo}>
                  <Text style={styles.cardTitle}>{exam.name}</Text>
                  <Text style={styles.resultDate}>{formatDate(exam.date)}</Text>
                </View>
                <Badge
                  label="Normal"
                  icon={<Ionicons name="checkmark-circle" size={10} color={colors.green700} />}
                />
              </View>

              <View style={styles.resultBox}>
                <View>
                  <Text style={styles.resultLabel}>Resultado</Text>
                  <Text style={styles.resultValue}>{exam.result}</Text>
                </View>
                <View style={styles.referenceWrap}>
                  <Text style={styles.resultLabel}>Referência</Text>
                  <Text style={styles.referenceText}>{exam.reference}</Text>
                </View>
              </View>

              <Button
                title="Baixar Resultado"
                size="sm"
                variant="outline"
                icon={<Ionicons name="download" size={14} color={colors.green700} />}
                style={styles.downloadButton}
              />
            </Card>
          ))
        ) : null}

        {tab === 'info' ? (
          examInfo.map((info, index) => (
            <Card key={index} style={styles.examCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{info.name}</Text>
              </View>
              <View style={styles.infoRows}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Frequência:</Text>
                  <Text style={styles.infoValue}>{info.frequency}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Importância:</Text>
                  <Badge
                    label={info.importance}
                    variant={info.importance === 'Alta' ? 'red' : 'yellow'}
                  />
                </View>
              </View>
              <Text style={styles.infoDescription}>{info.description}</Text>
            </Card>
          ))
        ) : null}
      </View>

      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId !== null ? 'Reagendar Exame' : 'Agendar Novo Exame'}
              </Text>
              <Pressable onPress={closeModal} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.gray500} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalScroll} bounces={false}>
              <Text style={styles.fieldLabel}>Nome do Exame</Text>
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                placeholder="Ex: Hemoglobina Glicada (HbA1c)"
                placeholderTextColor={colors.gray400}
                style={styles.input}
              />
              <View style={styles.suggestionWrap}>
                {examInfo.map((info) => (
                  <Pressable
                    key={info.name}
                    onPress={() => setName(info.name)}
                    style={[
                      styles.suggestionChip,
                      name === info.name && styles.suggestionChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.suggestionChipText,
                        name === info.name && styles.suggestionChipTextActive,
                      ]}
                    >
                      {info.name}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Data</Text>
                  <TextInput
                    value={date}
                    onChangeText={(text) => {
                      setDate(text);
                      setError('');
                    }}
                    placeholder="AAAA-MM-DD"
                    placeholderTextColor={colors.gray400}
                    keyboardType="numbers-and-punctuation"
                    maxLength={10}
                    style={styles.input}
                  />
                </View>
                <View style={styles.fieldColumn}>
                  <Text style={styles.fieldLabel}>Hora</Text>
                  <TextInput
                    value={time}
                    onChangeText={(text) => {
                      setTime(text);
                      setError('');
                    }}
                    placeholder="HH:MM"
                    placeholderTextColor={colors.gray400}
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                    style={styles.input}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Local</Text>
              <TextInput
                value={location}
                onChangeText={(text) => {
                  setLocation(text);
                  setError('');
                }}
                placeholder="Ex: Lab Diagnóstico - Centro"
                placeholderTextColor={colors.gray400}
                style={styles.input}
              />

              <Text style={styles.fieldLabel}>Preparação</Text>
              <TextInput
                value={preparacao}
                onChangeText={(text) => {
                  setPreparacao(text);
                  setError('');
                }}
                placeholder="Ex: Jejum de 8 horas"
                placeholderTextColor={colors.gray400}
                style={styles.input}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title={editingId !== null ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                size="md"
                style={styles.saveButton}
                onPress={saveExam}
              />
            </ScrollView>
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
  tabBody: {
    marginTop: 16,
  },
  newExamButton: {
    marginBottom: 12,
  },
  emptyCard: {
    paddingVertical: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.xs,
    color: colors.gray400,
  },
  examCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray800,
    flex: 1,
  },
  metaList: {
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  preparationBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.yellow50,
    borderWidth: 1,
    borderColor: colors.yellow200,
    borderRadius: radii.md,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  preparationTextWrap: {
    flex: 1,
  },
  preparationTitle: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.yellow800,
  },
  preparationText: {
    fontSize: fontSize.xs,
    color: colors.yellow700,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardActionButton: {
    flex: 1,
  },
  resultInfo: {
    flex: 1,
  },
  resultDate: {
    fontSize: 11,
    color: colors.gray400,
    marginTop: 4,
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.green50,
    borderWidth: 1,
    borderColor: colors.green200,
    borderRadius: radii.md,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 11,
    color: colors.gray500,
  },
  resultValue: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.green700,
  },
  referenceWrap: {
    alignItems: 'flex-end',
  },
  referenceText: {
    fontSize: fontSize.xs,
    color: colors.gray600,
  },
  downloadButton: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoRows: {
    paddingHorizontal: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  infoValue: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray700,
  },
  infoDescription: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    maxHeight: '85%',
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray800,
    flex: 1,
  },
  modalScroll: {
    flexGrow: 0,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldColumn: {
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
  suggestionWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.gray300,
    backgroundColor: colors.gray50,
  },
  suggestionChipActive: {
    backgroundColor: colors.green50,
    borderColor: colors.primary,
  },
  suggestionChipText: {
    fontSize: fontSize.xxs,
    color: colors.gray600,
  },
  suggestionChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: fontSize.xs,
    color: colors.red700,
    marginTop: 12,
  },
  saveButton: {
    marginTop: 20,
    height: 40,
    marginBottom: 4,
  },
});
