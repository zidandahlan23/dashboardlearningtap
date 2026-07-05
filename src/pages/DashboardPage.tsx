
import { KPICards } from '@/components/KPICards';
import { DashboardCharts } from '@/components/DashboardCharts';
import { QuickFilters } from '@/components/QuickFilters';
import { ExpiryWarnings } from '@/components/ExpiryWarnings';
import { AIInsights } from '@/components/AIInsights';
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
}: DashboardPageProps) {


  return (
    <div className="space-y-6">
      <KPICards kpi={kpi} />
      <ExpiryWarnings warnings={expiryWarnings} />
      <QuickFilters
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
        records={records}
      />
      <AIInsights insights={insights} />
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
