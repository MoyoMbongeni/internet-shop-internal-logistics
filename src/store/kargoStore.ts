import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KargoRecord, FetchState, CachedData } from '../types/kargo';
import { fetchKargoRecords } from '../services/sheetService';

const CACHE_KEY = 'kropp_sheet_cache_v1';

// Parses DD-MM-YYYY into a timestamp for sorting
const parseDate = (d: string): number => {
  const parts = d.split('-');
  if (parts.length !== 3) return 0;
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
};

// Sorts records descending: newest date first, then highest isNo as tiebreaker
const sortDescending = (data: KargoRecord[]): KargoRecord[] =>
  [...data].sort((a, b) => {
    const dateDiff = parseDate(b.tarih) - parseDate(a.tarih);
    if (dateDiff !== 0) return dateDiff;
    return Number(b.isNo) - Number(a.isNo);
  });

interface KargoStore {
  records: KargoRecord[];
  fetchState: FetchState;
  error: string | null;
  lastSynced: string | null;
  isOffline: boolean;

  syncRecords: () => Promise<void>;
  loadFromCache: () => Promise<void>;
  setOffline: (offline: boolean) => void;
  clearError: () => void;
}

export const useKargoStore = create<KargoStore>((set, get) => ({
  records: [],
  fetchState: 'idle',
  error: null,
  lastSynced: null,
  isOffline: false,

  loadFromCache: async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const cached: CachedData = JSON.parse(raw);
      set({
        records: cached.records, // already sorted when cached
        lastSynced: cached.lastSynced,
        fetchState: 'success',
      });
    } catch {
      // Non-fatal — app will fetch live data
    }
  },

  syncRecords: async () => {
    set({ fetchState: 'loading', error: null });

    const result = await fetchKargoRecords();

    if (!result.ok) {
      set({ fetchState: 'error', error: result.error });
      const { records } = get();
      if (records.length > 0) {
        set({ fetchState: 'success' });
      }
      return;
    }

    const sorted = sortDescending(result.data);
    const now = new Date().toISOString();

    const cachePayload: CachedData = {
      records: sorted,
      lastSynced: now,
    };

    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
    } catch {
      // Non-fatal — data still renders from memory
    }

    set({
      records: sorted,
      lastSynced: now,
      fetchState: 'success',
      error: null,
    });
  },

  setOffline: (offline: boolean) => set({ isOffline: offline }),
  clearError: () => set({ error: null }),
}));
