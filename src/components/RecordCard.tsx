import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { KargoRecord, DurumTipi } from '../types/kargo';
import { Colors } from '../../constants/colors';

interface Props {
  record: KargoRecord;
  onPress?: (record: KargoRecord) => void;
}

const statusStyle = (durum: string): { bg: string; text: string } => {
  if (durum === 'Tamamlandı') return Colors.statusDone;
  if (durum === 'Beklemede') return Colors.statusWaiting;
  return Colors.statusActive;
};

export const RecordCard: React.FC<Props> = ({ record, onPress }) => {
  const status = statusStyle(record.durum);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress?.(record)}
    >
      <View style={styles.topRow}>
        <Text style={styles.idText}>
          {record.isNo} · {record.tarih}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.text }]}>
            {record.durum}
          </Text>
        </View>
      </View>

      <Text style={styles.nameText}>{record.musteriAdi}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📞 {record.telefon}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{record.islemTipi}</Text>
        </View>
      </View>

      <Text style={styles.productText}>👟 {record.gelenUrun}</Text>

      {!!record.notlar && (
        <Text style={styles.notlarText}>{record.notlar}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 9,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  idText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  typeBadge: {
    backgroundColor: Colors.canvas,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  productText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  notlarText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 5,
  },
});
