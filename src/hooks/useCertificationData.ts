import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CertificationRecord, FilterState } from '@/types';

// Fallback untuk record baru yang belum memiliki angka estimasi pada spreadsheet.
export const CERT_BUDGET: Record<string, number> = {
  'SERTIFIKASI - PAA (Pesawat Angkat Angkut)': 2500000,
  'SERTIFIKASI - PETUGAS P3K (FIRST AID)': 1800000,
  'SERTIFIKASI - DAMKAR KELAS D': 2200000,
  'SERTIFIKASI - DAMKAR KELAS C': 2800000,
  'SERTIFIKASI - DAMKAR KELAS B': 3500000,
  'SERTIFIKASI - DAMKAR KELAS A': 4500000,
  'SERTIFIKASI - K3 PESAWAT TENAGA & PRODUKSI (PTP)': 3000000,
  'SERTIFIKASI - JURU LAS KELAS 2': 2000000,
  'SERTIFIKASI - JURU LAS KELAS 1': 2500000,
  'SERTIFIKASI - HIPERKES PARAMEDIS': 3200000,
  'SERTIFIKASI - HIPERKES DOKTER': 3500000,
  'SERTIFIKASI - OPERATOR BOILER KELAS I': 4000000,
  'SERTIFIKASI - OPERATOR BOILER KELAS II': 3500000,
  'SERTIFIKASI - PETUGAS P3K KIMIA': 2000000,
  'SERTIFIKASI - AHLI K3 UMUM': 8500000,
  'SERTIFIKASI - K3 TEKNISI LISTRIK': 3000000,
  'SERTIFIKASI - AUDITOR ISPO': 12000000,
  'SERTIFIKASI - AUDITOR SMK3': 10000000,
  'SERTIFIKASI - PLB3 (Pemantauan dan analisis Pengelolaan Limbah B3)': 5500000,
  'SERTIFIKASI - PCUA (Pengambilan Contoh Uji Air)': 2800000,
  'SERTIFIKASI - POPU (Penanggung Jawab Operasional Instalasi Pengendalian Pencemaran Udara)': 6000000,
  'SERTIFIKASI - PPPA (Penanggungjawab Pengendalian Pencemaran Air)': 5500000,
  'SERTIFIKASI - OPLB3 (Pengoperasian Instalasi Pengelolaan Limbah B3)': 4500000,
  'SERTIFIKASI - PPPU (Penanggung Jawab Pengendalian Pencemaran Udara)': 6000000,
  'SERTIFIKASI - K3 OPERATOR PENGGERAK MULA 1 GENSET (Permenaker 38/2016)': 3500000,
  'SERTIFIKASI - POPAL (Penanggung Jawab Operasional Pengolahan Air Limbah)': 5500000,
  'SERTIFIKASI - PETUGAS PERAN KEBAKARAN KEMANKER RI': 2500000,
  'SERTIFIKASI - PELAKSANA MADYA PENGOPERASIAN PLTD': 7500000,
  'SERTIFIKASI - PELAKSANA MADYA PENGOPERASIAN PLTU': 7500000,
  'SERTIFIKASI - Kompetensi Tenaga Teknis Ketenagalistrikan PLTD': 5000000,
  'SERTIFIKASI - Kompetensi Tenaga Teknis Ketenagalistrikan PLTU': 5000000,
  'SERTIFIKASI - AHLI K3 LISTRIK': 7500000,
  'SERTIFIKASI - AHLI K3 KIMIA': 8000000,
  'SERTIFIKASI - AHLI K3 KONSTRUKSI': 9000000,
  'SERTIFIKASI - AHLI K3 LINGKUNGAN KERJA MADYA': 8500000,
  'SERTIFIKASI - AHLI K3 LINGKUNGAN KERJA MUDA': 7500000,
  'SERTIFIKASI - AHLI K3 LINGKUNGAN KERJA UTAMA': 9500000,
  'SERTIFIKASI - IMDG': 3000000,
  'SERTIFIKASI - IMSBC': 3000000,
  'SERTIFIKASI - INSTALASI PEMANFAATAN TENAGA LISTRIK': 4500000,
  'SERTIFIKASI - K3 TENAGA KERJA BANGUNAN TINGGI TINGKAT 1 (TKBT-1)': 4000000,
  'SERTIFIKASI - OPERATOR CHAINSAW': 2200000,
  'SERTIFIKASI - Operator Water Treatmant': 3500000,
  'SERTIFIKASI - DASAR-DASAR AMDAL DAN ESIA': 5000000,
  'SERTIFIKASI - DUMP TRUCK': 2500000,
  'SERTIFIKASI - PLTBG': 5500000,
  'SERTIFIKASI - PLTD & PLTU': 6000000,
  'SERTIFIKASI - POLB3 (Pengelolaan Limbah B3)': 5000000,
  'SERTIFIKASI - PENGELOLAAN SAMPAH DOMESTIK': 2800000,
  'SERTIFIKASI - PETUGAS K3 MADYA RUANG TERBATAS': 4500000,
  'SERTIFIKASI - PETUGAS PEKERJAAN KETINGGIAN TINGKAT 1': 3500000,
  'SERTIFIKASI - PETUGAS PEKERJAAN KETINGGIAN TINGKAT 2': 4000000,
  'SERTIFIKASI - Pelaksana Madya Pengoperasian PLTD (ESDM)': 7500000,
  'SERTIFIKASI - Pelaksana Madya Pengoperasian PLTU (ESDM)': 7500000,
  'SERTIFIKASI - Pelaksana Tugas Pengoperasian Peralatan Bantu Turbin Uap': 7000000,
  'SERTIFIKASI - BASIC TRAUMA CARDIAC LIFE SUPPORT': 4000000,
  'SERTIFIKASI - TEKNISI K3 BEJANA TEKAN & TANGKI TIMBUN': 5000000,
  'SERTIFIKASI - OPERATOR BOILER ESDM': 4500000,
  'SERTIFIKASI - SERTIFIAKSI - K3 TEKNISI LISTRIK': 3000000,
};

export function getBudgetForCert(certName: string): number {
  return CERT_BUDGET[certName] || 2500000;
}

export function formatRupiah(amount: number): string {
  const safeAmount = Number(amount) || 0;
  if (safeAmount >= 1000000000) return `Rp ${(safeAmount / 1000000000).toFixed(1)} M`;
  if (safeAmount >= 1000000) return `Rp ${(safeAmount / 1000000).toFixed(1)} Jt`;
  return `Rp ${safeAmount.toLocaleString('id-ID')}`;
}

const API_URL = '/.netlify/functions/certifications';
const VIEW_PASSWORD_KEY = 'sertifik3_view_password';
const ADMIN_PASSWORD_KEY = 'sertifik3_admin_password';

const defaultFilters: FilterState = {
  search: '',
  region: '',
  pt: '',
  lokasi: '',
  sertifikasi: '',
  status: '',
  jabatan: '',
};

type ApiResponse<T> = { success: boolean; message?: string } & T;

function normalizeRecord(value: CertificationRecord): CertificationRecord {
  return {
    ...value,
    id: String(value.id || ''),
    nik: String(value.nik || ''),
    nama: String(value.nama || ''),
    jabatan: String(value.jabatan || ''),
    lokasi: String(value.lokasi || ''),
    pt: String(value.pt || ''),
    region: String(value.region || ''),
    sertifikasi: String(value.sertifikasi || ''),
    status_cert: String(value.status_cert || 'BELUM').toUpperCase(),
    no_sertifikat: String(value.no_sertifikat || ''),
    tanggal_terbit: String(value.tanggal_terbit || ''),
    tanggal_expired: String(value.tanggal_expired || ''),
    budget_estimasi: Number(value.budget_estimasi || 0),
    budget_actual: Number(value.budget_actual || 0),
    link_sertifikat: String(value.link_sertifikat || ''),
    computed_status: value.computed_status || 'BELUM_SERTIFIKASI',
    created_at: String(value.created_at || ''),
    updated_at: String(value.updated_at || ''),
  };
}

function makeError(message: string): Error {
  return new Error(message || 'Terjadi kesalahan saat menghubungi database.');
}

function askPassword(kind: 'view' | 'admin'): string {
  const key = kind === 'admin' ? ADMIN_PASSWORD_KEY : VIEW_PASSWORD_KEY;
  const label = kind === 'admin' ? 'Masukkan password admin untuk mengubah data:' : 'Masukkan password untuk membuka dashboard:';
  const existing = sessionStorage.getItem(key);
  if (existing) return existing;

  const password = window.prompt(label)?.trim() || '';
  if (!password) throw makeError('Akses dibatalkan. Password diperlukan untuk melanjutkan.');
  sessionStorage.setItem(key, password);
  return password;
}

async function requestApi<T>(
  method: 'GET' | 'POST',
  payload?: Record<string, unknown>,
  access: 'public' | 'view' | 'admin' = 'public',
  retried = false,
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = { Accept: 'application/json' };
  if (method === 'POST') headers['Content-Type'] = 'application/json';

  if (access === 'admin') {
    headers['x-dashboard-password'] = askPassword('admin');
  } else if (access === 'view') {
    headers['x-dashboard-password'] = askPassword('view');
  }

  let response: Response;
  try {
    response = await fetch(API_URL, {
      method,
      headers,
      body: method === 'POST' ? JSON.stringify(payload || {}) : undefined,
    });
  } catch {
    throw makeError('Tidak dapat terhubung ke API. Pastikan Netlify Function dan Apps Script sudah dikonfigurasi.');
  }

  let body: ApiResponse<T>;
  try {
    body = (await response.json()) as ApiResponse<T>;
  } catch {
    throw makeError('Respons API tidak valid. Periksa URL Apps Script dan Function Log Netlify.');
  }

  if (response.status === 401 && access === 'public' && !retried) {
    return requestApi<T>(method, payload, 'view', true);
  }

  if (!response.ok || !body.success) {
    const message = body.message || (response.status === 401 ? 'Password akses tidak valid.' : 'Permintaan ke database gagal.');
    if (response.status === 401) {
      if (access === 'admin') sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
      if (access === 'view') sessionStorage.removeItem(VIEW_PASSWORD_KEY);
    }
    throw makeError(message);
  }

  return body;
}

export function useCertificationData() {
  const [records, setRecords] = useState<CertificationRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await requestApi<{ records: CertificationRecord[] }>('GET', { action: 'records' });
      setRecords((response.records || []).map(normalizeRecord));
      setLastSynced(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const values = [r.nama, r.nik, r.jabatan, r.sertifikasi, r.pt, r.no_sertifikat];
        if (!values.some((value) => value.toLowerCase().includes(q))) return false;
      }
      if (filters.region && r.region !== filters.region) return false;
      if (filters.pt && r.pt !== filters.pt) return false;
      if (filters.lokasi && r.lokasi !== filters.lokasi) return false;
      if (filters.sertifikasi && r.sertifikasi !== filters.sertifikasi) return false;
      if (filters.status && r.computed_status !== filters.status) return false;
      if (filters.jabatan && r.jabatan !== filters.jabatan) return false;
      return true;
    });
  }, [records, filters]);

  const kpi = useMemo(() => {
    const data = filteredRecords;
    const totalRecords = data.length;
    const sudahSertifikasi = data.filter((r) => r.status_cert === 'SUDAH').length;
    const belumSertifikasi = data.filter((r) => r.status_cert === 'BELUM').length;
    const active = data.filter((r) => r.computed_status === 'ACTIVE').length;
    const expiringSoon = data.filter((r) => r.computed_status === 'EXPIRING_SOON').length;
    const expired = data.filter((r) => r.computed_status === 'EXPIRED').length;
    const uniqueEmployees = new Set(data.map((r) => r.nik).filter(Boolean)).size;
    const uniqueCerts = new Set(data.map((r) => r.sertifikasi).filter(Boolean)).size;
    const totalBudget = data.reduce((sum, r) => sum + (r.budget_estimasi || getBudgetForCert(r.sertifikasi)), 0);
    const totalBudgetActual = data.reduce((sum, r) => sum + (r.budget_actual || 0), 0);
    const budgetPerEmployee = uniqueEmployees > 0 ? Math.round(totalBudget / uniqueEmployees) : 0;
    const complianceRate = totalRecords > 0 ? Math.round((sudahSertifikasi / totalRecords) * 100) : 0;

    return {
      totalRecords,
      sudahSertifikasi,
      belumSertifikasi,
      active,
      expiringSoon,
      expired,
      uniqueEmployees,
      uniqueCerts,
      complianceRate,
      totalBudget,
      totalBudgetActual,
      budgetPerEmployee,
    };
  }, [filteredRecords]);

  const chartData = useMemo(() => {
    const data = filteredRecords;
    const byCount = (key: keyof CertificationRecord) => Object.entries(
      data.reduce((acc, record) => {
        const value = String(record[key] || 'Tidak diketahui');
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    );

    const regionData = byCount('region').map(([name, value]) => ({ name, value }));
    const ptData = byCount('pt').sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));
    const certData = byCount('sertifikasi').sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, value]) => ({ name, value }));
    const statusData = [
      { name: 'ACTIVE', value: kpi.active, fill: '#4A7C59' },
      { name: 'EXPIRING SOON', value: kpi.expiringSoon, fill: '#E09F3E' },
      { name: 'EXPIRED', value: kpi.expired, fill: '#B84A3E' },
      { name: 'BELUM', value: kpi.belumSertifikasi, fill: '#8A938B' },
    ];
    const ptCompliance = Object.entries(
      data.reduce((acc, record) => {
        if (!acc[record.pt]) acc[record.pt] = { total: 0, sudah: 0 };
        acc[record.pt].total += 1;
        if (record.status_cert === 'SUDAH') acc[record.pt].sudah += 1;
        return acc;
      }, {} as Record<string, { total: number; sudah: number }>),
    ).map(([name, value]) => ({
      name,
      total: value.total,
      compliance: Math.round((value.sudah / value.total) * 100),
    })).sort((a, b) => b.compliance - a.compliance).slice(0, 10);

    return { regionData, statusData, ptData, certData, ptCompliance };
  }, [filteredRecords, kpi]);

  const certCompliance = useMemo(() => Object.entries(
    filteredRecords.reduce((acc, record) => {
      if (!acc[record.sertifikasi]) acc[record.sertifikasi] = { total: 0, sudah: 0 };
      acc[record.sertifikasi].total += 1;
      if (record.status_cert === 'SUDAH') acc[record.sertifikasi].sudah += 1;
      return acc;
    }, {} as Record<string, { total: number; sudah: number }>),
  ).map(([name, value]) => ({
    name,
    total: value.total,
    sudah: value.sudah,
    belum: value.total - value.sudah,
    compliance: Math.round((value.sudah / value.total) * 100),
  })).sort((a, b) => b.total - a.total), [filteredRecords]);

  const insights = useMemo(() => {
    const data = filteredRecords;
    if (!data.length) return [{ type: 'info' as const, message: 'Tidak ada data yang sesuai dengan filter saat ini.' }];

    const result: { type: 'warning' | 'info' | 'success'; message: string }[] = [];
    const topGap = [...certCompliance].sort((a, b) => b.belum - a.belum)[0];
    if (topGap?.belum) result.push({ type: 'warning', message: `${topGap.name.replace('SERTIFIKASI - ', '')} memiliki gap terbesar: ${topGap.belum} peserta belum tersertifikasi.` });

    const byRegion = Object.entries(data.reduce((acc, record) => {
      if (!acc[record.region]) acc[record.region] = { total: 0, sudah: 0 };
      acc[record.region].total += 1;
      if (record.status_cert === 'SUDAH') acc[record.region].sudah += 1;
      return acc;
    }, {} as Record<string, { total: number; sudah: number }>))
      .map(([region, value]) => ({ region, rate: Math.round((value.sudah / value.total) * 100) }))
      .sort((a, b) => a.rate - b.rate)[0];
    if (byRegion) result.push({ type: 'info', message: `Region ${byRegion.region} memiliki compliance terendah: ${byRegion.rate}%.` });

    if (kpi.expired) result.push({ type: 'warning', message: `${kpi.expired} sertifikat sudah expired dan perlu diprioritaskan untuk resertifikasi.` });
    result.push({ type: 'success', message: `Compliance saat ini ${kpi.complianceRate}% dari ${kpi.totalRecords.toLocaleString('id-ID')} record pada filter aktif.` });
    return result;
  }, [filteredRecords, certCompliance, kpi]);

  const expiryWarnings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inRange = (min: number, max: number) => filteredRecords.filter((record) => {
      if (!record.tanggal_expired) return false;
      const expiry = new Date(`${record.tanggal_expired}T00:00:00`);
      if (Number.isNaN(expiry.getTime())) return false;
      const days = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
      return days >= min && days <= max;
    });
    const exp30Records = inRange(0, 30);
    const exp60Records = inRange(31, 60);
    const exp90Records = inRange(61, 90);
    return {
      exp30: exp30Records.length,
      exp60: exp60Records.length,
      exp90: exp90Records.length,
      exp30Records,
      exp60Records,
      exp90Records,
    };
  }, [filteredRecords]);

  const filterOptions = useMemo(() => {
    const unique = (field: keyof CertificationRecord) => [...new Set(records.map((record) => String(record[field] || '')).filter(Boolean))].sort();
    return {
      regions: unique('region'),
      pts: unique('pt'),
      lokasis: unique('lokasi'),
      sertifikasis: unique('sertifikasi'),
      jabatans: unique('jabatan'),
    };
  }, [records]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((previous) => ({ ...previous, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const runWrite = useCallback(async <T,>(payload: Record<string, unknown>): Promise<ApiResponse<T>> => {
    setSyncing(true);
    try {
      return await requestApi<T>('POST', payload, 'admin');
    } finally {
      setSyncing(false);
    }
  }, []);

  const updateRecord = useCallback(async (id: string, data: Partial<CertificationRecord>) => {
    const response = await runWrite<{ record: CertificationRecord }>({ action: 'update', id, record: data });
    const updated = normalizeRecord(response.record);
    setRecords((previous) => previous.map((record) => record.id === id ? updated : record));
    setLastSynced(new Date());
  }, [runWrite]);

  const deleteRecord = useCallback(async (id: string) => {
    await runWrite({ action: 'delete', id });
    setRecords((previous) => previous.filter((record) => record.id !== id));
    setLastSynced(new Date());
  }, [runWrite]);

  const addRecord = useCallback(async (record: CertificationRecord) => {
    const response = await runWrite<{ record: CertificationRecord }>({ action: 'create', record });
    setRecords((previous) => [...previous, normalizeRecord(response.record)]);
    setLastSynced(new Date());
  }, [runWrite]);

  const importData = useCallback(async (recordsToImport: CertificationRecord[]) => {
    const CHUNK_SIZE = 200;
    for (let start = 0; start < recordsToImport.length; start += CHUNK_SIZE) {
      const batch = recordsToImport.slice(start, start + CHUNK_SIZE);
      await runWrite({ action: 'bulkCreate', records: batch });
    }
    await refreshData();
  }, [refreshData, runWrite]);

  const getRecordBudget = useCallback((record: CertificationRecord) => record.budget_estimasi || getBudgetForCert(record.sertifikasi), []);

  return {
    records,
    filteredRecords,
    filters,
    kpi,
    chartData,
    certCompliance,
    insights,
    expiryWarnings,
    filterOptions,
    loading,
    syncing,
    lastSynced,
    refreshData,
    updateFilters,
    resetFilters,
    updateRecord,
    deleteRecord,
    addRecord,
    importData,
    getRecordBudget,
  };
}
