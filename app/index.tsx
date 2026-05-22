import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useKargoStore } from '../src/store/kargoStore';
import { useNetworkStatus } from '../src/hooks/useNetworkStatus';
import { RecordCard } from '../src/components/RecordCard';
import { SkeletonCard } from '../src/components/SkeletonCard';
import { OfflineSnackbar } from '../src/components/OfflineSnackbar';
import { FilterBar, FilterKey } from '../src/components/FilterBar';
import { StatsBar } from '../src/components/StatsBar';
import { KargoRecord } from '../src/types/kargo';
import { Colors } from '../constants/colors';

export default function RecordsScreen() {
  const { records, fetchState, lastSynced, isOffline, syncRecords, loadFromCache } =
    useKargoStore();

  useNetworkStatus(); // registers the network polling side-effect

  const [searchQuery, setSearchQuery]     = useState('');
  const [activeFilter, setActiveFilter]   = useState<FilterKey>('all');
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // Tracks whether the user manually dismissed the snackbar for the current
  // lastSynced value — resets automatically when a new sync completes
  const dismissedForRef = useRef<string | null>(null);

  // Bootstrap on mount
  useEffect(() => {
    (async () => {
      await loadFromCache();
      await syncRecords();
    })();
  }, []);

  // Show snackbar when offline (can be dismissed and stays dismissed while offline)
  useEffect(() => {
    if (isOffline) {
      setSnackbarVisible(true);
    } else {
      // Coming back online — let the sync effect handle showing the snackbar
      setSnackbarVisible(false);
    }
  }, [isOffline]);

  // Show snackbar briefly after a successful sync, unless already dismissed
  useEffect(() => {
    if (fetchState === 'success' && !isOffline && lastSynced) {
      if (dismissedForRef.current === lastSynced) return; // already dismissed this sync
      setSnackbarVisible(true);
      const timer = setTimeout(() => setSnackbarVisible(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [fetchState, lastSynced, isOffline]);

  const handleDismiss = () => {
    dismissedForRef.current = lastSynced; // remember which sync was dismissed
    setSnackbarVisible(false);
  };

  const filteredRecords = useMemo<KargoRecord[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    return records.filter(r => {
      const matchFilter =
        activeFilter === 'all' ||
        r.durum === activeFilter ||
        r.islemTipi === activeFilter;
      const matchSearch =
        !q ||
        r.musteriAdi.toLowerCase().includes(q) ||
        r.isNo.toLowerCase().includes(q) ||
        r.gelenUrun.toLowerCase().includes(q) ||
        r.notlar.toLowerCase().includes(q) ||
        r.telefon.includes(q);
      return matchFilter && matchSearch;
    });
  }, [records, activeFilter, searchQuery]);

  const isFirstLoad = fetchState === 'loading' && records.length === 0;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>K</Text>
            </View>
            <Text style={styles.logoText}>
              Kropp <Text style={styles.logoAccent}>| Sheet</Text>
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.syncBtn, pressed && { opacity: 0.7 }]}
            onPress={syncRecords}
            disabled={fetchState === 'loading'}
            accessibilityLabel="Verileri senkronize et"
          >
            {fetchState === 'loading' ? (
              <ActivityIndicator size="small" color={Colors.teal} />
            ) : (
              <Text style={styles.syncBtnText}>↻ Sync</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Müşteri, ürün veya iş no ara..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            returnKeyType="search"
            accessibilityLabel="Kayıt ara"
          />
        </View>
      </View>

      <StatsBar records={records} />
      <FilterBar active={activeFilter} onChange={setActiveFilter} />

      {isFirstLoad ? (
        <View style={styles.skeletonList}>
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          // index tiebreaker guarantees unique keys even when isNo values repeat
          keyExtractor={(item, index) => `${item.isNo}-${index}`}
          renderItem={({ item }) => <RecordCard record={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={fetchState === 'loading'}
              onRefresh={syncRecords}
              tintColor={Colors.teal}
              colors={[Colors.teal]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>Kayıt bulunamadı</Text>
            </View>
          }
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
        />
      )}

      <OfflineSnackbar
        visible={snackbarVisible}
        isOffline={isOffline}
        lastSynced={lastSynced}
        onDismiss={handleDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    backgroundColor: Colors.dark,
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 28,
    height: 28,
    backgroundColor: Colors.teal,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMarkText: {
    color: Colors.dark,
    fontSize: 14,
    fontWeight: '700',
  },
  logoText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  logoAccent: {
    color: Colors.teal,
  },
  syncBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minWidth: 68,
    alignItems: 'center',
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.4)',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    padding: 0,
  },
  skeletonList: {
    flex: 1,
    paddingTop: 12,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 90,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyIcon: { fontSize: 32 },
  emptyText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
