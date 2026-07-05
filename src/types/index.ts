export type ComputedCertificationStatus =
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'EXPIRED'
  | 'BELUM_SERTIFIKASI';

export interface CertificationRecord {
  id: string;
  nik: string;
  nama: string;
  jabatan: string;
  lokasi: string;
  pt: string;
  region: string;
  sertifikasi: string;
  status_cert: 'SUDAH' | 'BELUM' | string;
  no_sertifikat: string;
  tanggal_terbit: string;
  tanggal_expired: string;
  budget_estimasi: number;
  budget_actual: number;
  link_sertifikat: string;
  computed_status: ComputedCertificationStatus;
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  search: string;
  region: string;
  pt: string;
  lokasi: string;
  sertifikasi: string;
  status: string;
  jabatan: string;
}

export interface KPICard {
  title: string;
  value: number | string;
  subtitle: string;
  icon: string;
  trend?: number;
  color: 'green' | 'yellow' | 'red' | 'blue' | 'purple';
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface NotificationItem {
  id: string;
  type: 'expired' | 'expiring_soon' | 'success' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

export type PageType = 'dashboard' | 'peserta' | 'sertifikasi' | 'statistik' | 'export' | 'import' | 'users';
