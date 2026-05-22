import axios, { AxiosError } from 'axios';
import { KargoRecord } from '../types/kargo';

const SPREADSHEET_ID = process.env.EXPO_PUBLIC_SPREADSHEET_ID ?? '';
const API_KEY = process.env.EXPO_PUBLIC_SHEETS_API_KEY ?? '';

// Open-ended range — no artificial row ceiling
const RANGE = encodeURIComponent("'Kargo Takip'!A2:H");
const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

export type ServiceResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const rowToRecord = (row: string[]): KargoRecord => ({
  isNo: row[0] ?? '',
  tarih: row[1] ?? '',
  musteriAdi: row[2] ?? '',
  telefon: row[3] ?? '',
  islemTipi: row[4] ?? '',
  gelenUrun: row[5] ?? '',
  durum: row[6] ?? 'Beklemede',
  notlar: row[7] ?? '',
});

export const fetchKargoRecords = async (
  signal?: AbortSignal
): Promise<ServiceResult<KargoRecord[]>> => {
  if (!SPREADSHEET_ID || !API_KEY) {
    return {
      ok: false,
      error: 'API credentials are not configured. Check your .env file.',
    };
  }

  const url = `${BASE_URL}/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  try {
    const response = await axios.get(url, {
      signal,
      timeout: 10_000, // 10s timeout — no indefinite hangs on mobile
    });

    const rows: string[][] = response.data?.values ?? [];
    const records = rows.map(rowToRecord);

    return { ok: true, data: records };
  } catch (err) {
    const axiosErr = err as AxiosError;

    if (axiosErr.code === 'ERR_CANCELED') {
      return { ok: false, error: 'Request cancelled.' };
    }

    if (axiosErr.response?.status === 403) {
      return { ok: false, error: 'API key is invalid or Sheets API is not enabled.' };
    }

    if (axiosErr.response?.status === 404) {
      return { ok: false, error: 'Spreadsheet not found. Check your SPREADSHEET_ID.' };
    }

    return {
      ok: false,
      error: axiosErr.message ?? 'An unknown network error occurred.',
    };
  }
};
