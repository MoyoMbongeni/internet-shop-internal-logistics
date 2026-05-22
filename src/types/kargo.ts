export type IslemTipi = 'İade' | 'Değişim' | 'Tamir';
export type DurumTipi = 'Tamamlandı' | 'Beklemede' | 'İşlemde';

export interface KargoRecord {
  isNo: string;
  tarih: string;
  musteriAdi: string;
  telefon: string;
  islemTipi: IslemTipi | string;
  gelenUrun: string;
  durum: DurumTipi | string;
  notlar: string;
}

export type FetchState = 'idle' | 'loading' | 'success' | 'error';

export interface CachedData {
  records: KargoRecord[];
  lastSynced: string; // ISO timestamp
}
