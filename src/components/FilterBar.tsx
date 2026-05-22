import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/colors';

export type FilterKey = 'all' | 'Tamamlandı' | 'Beklemede' | 'İşlemde' | 'İade' | 'Değişim' | 'Tamir';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',         label: 'Tümü'       },
  { key: 'Tamamlandı',  label: 'Tamamlandı' },
  { key: 'Beklemede',   label: 'Beklemede'  },
  { key: 'İşlemde',     label: 'İşlemde'    },
  { key: 'İade',        label: 'İade'       },
  { key: 'Değişim',     label: 'Değişim'    },
  { key: 'Tamir',       label: 'Tamir'      },
];

interface Props {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

export const FilterBar: React.FC<Props> = ({ active, onChange }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scroll}
      >
        {FILTERS.map(f => {
          const isActive = active === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => onChange(f.key)}
              style={[styles.pill, isActive && styles.pillActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const PILL_HEIGHT = 32;

const styles = StyleSheet.create({
  wrapper: {
    height: PILL_HEIGHT + 16,
    backgroundColor: Colors.canvas,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    justifyContent: 'center',
  },
  scroll: {
    flexGrow: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 7,
  },
  pill: {
    height: PILL_HEIGHT,
    paddingHorizontal: 14,
    borderRadius: PILL_HEIGHT / 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',          // Explicit light gray border
    backgroundColor: '#FFFFFF',      // Pure white background for high contrast
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  pillActive: {
    backgroundColor: Colors.dark,
    borderColor: Colors.dark,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',                // Crisp charcoal text for clear visibility
    includeFontPadding: false,
  },
  labelActive: {
    color: Colors.teal,
  },
});