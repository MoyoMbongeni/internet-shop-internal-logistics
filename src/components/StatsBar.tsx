import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { KargoRecord } from '../types/kargo';
import { Colors } from '../../constants/colors';

interface Props {
  records: KargoRecord[];
}

export const StatsBar: React.FC<Props> = ({ records }) => {
  const stats = useMemo(() => ({
    total: records.length,
    done: records.filter(r => r.durum === 'Tamamlandı').length,
    waiting: records.filter(r => r.durum === 'Beklemede').length,
    active: records.filter(r => r.durum === 'İşlemde').length,
  }), [records]);

  return (
    <View style={styles.bar}>
      <StatChip label="Toplam" value={stats.total} valueColor={Colors.textPrimary} />
      <StatChip label="Tamamlandı" value={stats.done} valueColor={Colors.statusDone.text} />
      <StatChip label="Beklemede" value={stats.waiting} valueColor={Colors.statusWaiting.text} />
      <StatChip label="İşlemde" value={stats.active} valueColor={Colors.statusActive.text} />
    </View>
  );
};

const StatChip = ({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: number;
  valueColor: string;
}) => (
  <View style={styles.chip}>
    <Text style={[styles.num, { color: valueColor }]}>{value}</Text>
    <Text style={styles.lbl}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    backgroundColor: Colors.canvas,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  num: {
    fontSize: 18,
    fontWeight: '500',
  },
  lbl: {
    fontSize: 9,
    color: Colors.textMuted,
    marginTop: 1,
    textAlign: 'center',
  },
});
