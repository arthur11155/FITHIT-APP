import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import ScreenHeader from '../components/ScreenHeader';
import { colors, fontSize, radii } from '../theme';
import { defaultHospitals } from '../data/defaults';
import type { Hospital } from '../data/types';
import { useStoredState } from '../hooks/useStoredState';
import { STORAGE_KEYS } from '../storage/localStorage';

export default function HospitalsScreen() {
  const [hospitals] = useStoredState<Hospital[]>(STORAGE_KEYS.hospitals, defaultHospitals);
  const openDirections = () => {
    Linking.openURL(
      'https://www.google.com/maps/search/?api=1&query=Av.+Boa+Viagem+100,+Recife,+PE'
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader title="Hospitais Próximos" subtitle="Atendimento especializado perto de você" />

      <Card variant="green" style={styles.locationCard}>
        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <Ionicons name="navigate" size={16} color={colors.white} />
          </View>
          <View>
            <Text style={styles.locationTitle}>Sua Localização</Text>
            <Text style={styles.locationSub}>Av. Boa Viagem, 100 - Recife, PE</Text>
          </View>
        </View>
      </Card>

      {hospitals.map((hospital) => (
        <Card key={hospital.id} style={styles.hospitalCard}>
          <View style={styles.hospitalHeader}>
            <View style={styles.hospitalInfo}>
              <Text style={styles.hospitalName}>{hospital.name}</Text>
              <Text style={styles.hospitalSpecialty}>{hospital.specialty}</Text>
              <View style={styles.badgeRow}>
                {hospital.open ? (
                  <Badge label="Aberto" icon={<Ionicons name="time" size={10} color={colors.green700} />} />
                ) : (
                  <Badge label="Fechado" variant="gray" />
                )}
                {hospital.emergencyAvailable ? (
                  <Badge label="Emergência 24h" variant="red" />
                ) : null}
              </View>
            </View>
            <View style={styles.distanceWrap}>
              <View style={styles.distancePill}>
                <Text style={styles.distanceText}>{hospital.distance}</Text>
              </View>
              <Text style={styles.rating}>⭐ {hospital.rating}</Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={14} color={colors.green500} />
              <Text style={styles.detailText}>{hospital.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call" size={14} color={colors.green500} />
              <Text style={styles.detailText}>{hospital.phone}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title="Como Chegar"
              size="sm"
              icon={<Ionicons name="navigate" size={14} color={colors.white} />}
              style={styles.actionButton}
              onPress={openDirections}
            />
            <Button
              title="Ligar"
              size="sm"
              variant="outline"
              icon={<Ionicons name="call" size={14} color={colors.green700} />}
              style={styles.actionButton}
              onPress={() => Linking.openURL(`tel:${hospital.phone.replace(/[^0-9]/g, '')}`)}
            />
          </View>
        </Card>
      ))}
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
  locationCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray800,
  },
  locationSub: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  hospitalCard: {
    marginBottom: 12,
  },
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 8,
  },
  hospitalInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray800,
    marginBottom: 4,
  },
  hospitalSpecialty: {
    fontSize: fontSize.xs,
    color: colors.green600,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  distanceWrap: {
    alignItems: 'flex-end',
  },
  distancePill: {
    backgroundColor: colors.green100,
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  distanceText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  rating: {
    fontSize: 11,
    color: colors.gray400,
    marginTop: 4,
  },
  details: {
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    flex: 1,
  },
});
