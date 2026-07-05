
import { KPICards } from '@/components/KPICards';
import { DashboardCharts } from '@/components/DashboardCharts';
import { QuickFilters } from '@/components/QuickFilters';
import { ExpiryWarnings } from '@/components/ExpiryWarnings';
import { AIInsights } from '@/components/AIInsights';
import { AlertTriangle, CheckCircle2, Clock3, Target, TrendingUp, Download } from 'lucide-react';
import type { FilterState, CertificationRecord } from '@/types';

interface DashboardPageProps {
  kpi: {
    totalRecords: number;
    sudahSertifikasi: number;
    belumSertifikasi: number;
    active: number;
    expiringSoon: number;
    expired: number;
    uniqueEmployees: number;
    uniqueCerts: number;
    complianceRate: number;
    totalBudget: number;
    totalBudgetActual: number;
    budgetPerEmployee: number;
  };
  chartData: {
    regionData: { name: string; value: number }[];
    statusData: { name: string; value: number; fill: string }[];
  };
  expiryWarnings: {
    exp30: number;
    exp60: number;
    exp90: number;
    exp30Records: CertificationRecord[];
    exp60Records: CertificationRecord[];
    exp90Records: CertificationRecord[];
  };
  insights: { type: 'warning' | 'info' | 'success'; message: string }[];
  filters: FilterState;
  filterOptions: {
    regions: string[];
    pts: string[];
    lokasis: string[];
    sertifikasis: string[];
    jabatans: string[];
  };
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  records: CertificationRecord[];
  lastSynced: Date | null;
}

export function DashboardPage({
  kpi,
  chartData,
  expiryWarnings,
  insights,
  filters,
  filterOptions,
  onFilterChange,
  onResetFilters,
  records,
  lastSynced,
}: DashboardPageProps) {


  const urgentCerts = Object.values(records.reduce((acc, record) => {
    if (!record.sertifikasi) return acc;
    if (!acc[record.sertifikasi]) acc[record.sertifikasi] = { name: record.sertifikasi, belum: 0, expired: 0, total: 0 };
    acc[record.sertifikasi].total += 1;
    if (record.status_cert === 'BELUM') acc[record.sertifikasi].belum += 1;
    if (record.computed_status === 'EXPIRED') acc[record.sertifikasi].expired += 1;
    return acc;
  }, {} as Record<string, { name: string; belum: number; expired: number; total: number }>))
    .sort((a, b) => (b.belum + b.expired) - (a.belum + a.expired))
    .slice(0, 4);

  const actionItems = [
    { label: 'Expired', value: kpi.expired, color: 'text-[#B84A3E]', bg: 'bg-[#B84A3E]/10', icon: AlertTriangle, status: 'EXPIRED' },
    { label: 'Akan Expired ≤30 hari', value: expiryWarnings.exp30, color: 'text-[#C77920]', bg: 'bg-[#E09F3E]/12', icon: Clock3, status: 'EXPIRING_SOON' },
    { label: 'Akan Expired 31–90 hari', value: expiryWarnings.exp60 + expiryWarnings.exp90, color: 'text-[#A7791D]', bg: 'bg-[#D9A443]/12', icon: TrendingUp, status: 'EXPIRING_SOON' },
    { label: 'Belum Sertifikasi', value: kpi.belumSertifikasi, color: 'text-[#566A7F]', bg: 'bg-[#566A7F]/10', icon: Target, status: 'BELUM_SERTIFIKASI' },
  ];

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-[#2F5B47] via-[#3D6B56] to-[#25483A] p-5 lg:p-6 text-white shadow-[0_16px_48px_rgba(47,91,71,0.22)] overflow-hidden relative">
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute right-10 bottom-0 w-36 h-36 rounded-full bg-[#D9A443]/20" />
        <div className="relative grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/12 text-[11px] font-semibold tracking-wide">OPERATIONS DASHBOARD</span>
              <span className="px-3 py-1 rounded-full bg-[#D9A443]/25 text-[11px] font-semibold">Target compliance 80%</span>
            </div>
            <h2 className="text-[24px] lg:text-[30px] font-bold leading-tight">Action Center Sertifikasi K3</h2>
            <p className="mt-2 text-[13px] text-white/75 max-w-[760px]">
              Fokus utama hari ini: tindak lanjuti sertifikat expired, masa berlaku mendekat, dan gap peserta yang belum tersertifikasi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
              {actionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => onFilterChange({ status: item.status })}
                    className="text-left bg-white rounded-2xl p-4 text-[#2C3531] hover:-translate-y-0.5 transition-all shadow-[0_10px_26px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase ${item.color}`}>Need Action</span>
                    </div>
                    <div className="text-[28px] font-bold mt-3">{item.value.toLocaleString('id-ID')}</div>
                    <div className="text-[12px] text-[#6A756E]">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur border border-white/15">
            <div className="flex items-center justify-between">
              <span className="text-[12px] uppercase tracking-wider text-white/65">Compliance</span>
              <CheckCircle2 className="w-5 h-5 text-[#E9C972]" />
            </div>
            <div className="text-[52px] font-bold leading-none mt-4">{kpi.complianceRate}%</div>
            <div className="mt-4 h-3 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full rounded-full bg-[#E9C972]" style={{ width: `${Math.min(100, kpi.complianceRate)}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-white/65 mt-2">
              <span>{kpi.sudahSertifikasi.toLocaleString('id-ID')} sudah</span>
              <span>{kpi.totalRecords.toLocaleString('id-ID')} total</span>
            </div>
            <div className="mt-5 text-[12px] text-white/70">
              Last sync: {lastSynced ? lastSynced.toLocaleString('id-ID') : 'Belum tersedia'}
            </div>
          </div>
        </div>
      </section>

      <KPICards kpi={kpi} />

      <QuickFilters
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
        records={records}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-[#2C3531]">Top Prioritas Sertifikasi</h3>
              <p className="text-[12px] text-[#8A938B]">Jenis sertifikasi dengan gap terbesar</p>
            </div>
            <button onClick={() => onFilterChange({ status: 'BELUM_SERTIFIKASI' })} className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#3D6B56]/10 text-[#3D6B56] text-[12px] font-semibold">
              <Download className="w-4 h-4" /> Filter gap
            </button>
          </div>
          <div className="space-y-3">
            {urgentCerts.map((item, idx) => {
              const value = item.belum + item.expired;
              const max = Math.max(...urgentCerts.map((x) => x.belum + x.expired), 1);
              return (
                <div key={item.name} className="grid grid-cols-[28px_1fr_80px] gap-3 items-center">
                  <span className="w-7 h-7 rounded-lg bg-[#F0F4F1] flex items-center justify-center text-[12px] font-bold text-[#3D6B56]">{idx + 1}</span>
                  <div className="min-w-0">
                    <div className="flex justify-between gap-3 mb-1">
                      <span className="text-[12px] font-semibold text-[#2C3531] truncate">{item.name.replace('SERTIFIKASI - ', '')}</span>
                      <span className="text-[12px] text-[#8A938B] flex-shrink-0">{item.total} total</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F0F4F1] overflow-hidden">
                      <div className="h-full rounded-full bg-[#B84A3E]" style={{ width: `${(value / max) * 100}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[16px] font-bold text-[#B84A3E]">{value}</div>
                    <div className="text-[10px] text-[#8A938B]">gap</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <AIInsights insights={insights} />
      </div>

      <ExpiryWarnings warnings={expiryWarnings} />
      <DashboardCharts
        regionData={chartData.regionData}
        statusData={chartData.statusData}
        complianceRate={kpi.complianceRate}
        sudahCount={kpi.sudahSertifikasi}
        belumCount={kpi.belumSertifikasi}
        records={records}
      />
    </div>
  );
}
