import { RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import type { FilterState, CertificationRecord } from '@/types';

interface QuickFiltersProps {
  filters: FilterState;
  filterOptions: {
    regions: string[];
    pts: string[];
    lokasis: string[];
  };
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  records: CertificationRecord[];
}

export function QuickFilters({ filters, filterOptions, onFilterChange, onReset, records }: QuickFiltersProps) {
  // Count data per category from actual records
  const counts = useMemo(() => {
    const byRegion = records.reduce((acc, r) => {
      acc[r.region] = (acc[r.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPT = records.reduce((acc, r) => {
      acc[r.pt] = (acc[r.pt] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byLokasi = records.reduce((acc, r) => {
      acc[r.lokasi] = (acc[r.lokasi] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { byRegion, byPT, byLokasi };
  }, [records]);

  return (
    <div className="space-y-3">
      {/* Region Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-[#8A938B] uppercase tracking-wider mr-1">
          FILTER CEPAT — REGION
        </span>
        <button
          onClick={() => onFilterChange({ region: '' })}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
            !filters.region
              ? 'bg-[#3D6B56] text-white border-[#3D6B56]'
              : 'bg-transparent text-[#566A7F] border-[#E0E8E3] hover:border-[#3D6B56] hover:text-[#3D6B56]'
          }`}
        >
          Semua
        </button>
        {filterOptions.regions.map((region) => (
          <button
            key={region}
            onClick={() => onFilterChange({ region: filters.region === region ? '' : region })}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border flex items-center gap-1.5 ${
              filters.region === region
                ? 'bg-[#3D6B56] text-white border-[#3D6B56]'
                : 'bg-transparent text-[#566A7F] border-[#E0E8E3] hover:border-[#3D6B56] hover:text-[#3D6B56]'
            }`}
          >
            {region}
            <span className={`text-[10px] px-1 py-0.5 rounded ${filters.region === region ? 'bg-white/20' : 'bg-[#F0F4F1]'}`}>
              {counts.byRegion[region] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* PT Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-[#8A938B] uppercase tracking-wider mr-1">
          FILTER CEPAT — PT
        </span>
        <button
          onClick={() => onFilterChange({ pt: '' })}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
            !filters.pt
              ? 'bg-[#3D6B56] text-white border-[#3D6B56]'
              : 'bg-transparent text-[#566A7F] border-[#E0E8E3] hover:border-[#3D6B56] hover:text-[#3D6B56]'
          }`}
        >
          Semua
        </button>
        {filterOptions.pts.slice(0, 12).map((pt) => (
          <button
            key={pt}
            onClick={() => onFilterChange({ pt: filters.pt === pt ? '' : pt })}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border flex items-center gap-1.5 ${
              filters.pt === pt
                ? 'bg-[#3D6B56] text-white border-[#3D6B56]'
                : 'bg-transparent text-[#566A7F] border-[#E0E8E3] hover:border-[#3D6B56] hover:text-[#3D6B56]'
            }`}
          >
            {pt}
            <span className={`text-[10px] px-1 py-0.5 rounded ${filters.pt === pt ? 'bg-white/20' : 'bg-[#F0F4F1]'}`}>
              {counts.byPT[pt] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Lokasi Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-[#8A938B] uppercase tracking-wider mr-1">
          FILTER CEPAT — LOKASI
        </span>
        <button
          onClick={() => onFilterChange({ lokasi: '' })}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
            !filters.lokasi
              ? 'bg-[#3D6B56] text-white border-[#3D6B56]'
              : 'bg-transparent text-[#566A7F] border-[#E0E8E3] hover:border-[#3D6B56] hover:text-[#3D6B56]'
          }`}
        >
          Semua
        </button>
        {filterOptions.lokasis.map((lokasi) => (
          <button
            key={lokasi}
            onClick={() => onFilterChange({ lokasi: filters.lokasi === lokasi ? '' : lokasi })}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border flex items-center gap-1.5 ${
              filters.lokasi === lokasi
                ? 'bg-[#3D6B56] text-white border-[#3D6B56]'
                : 'bg-transparent text-[#566A7F] border-[#E0E8E3] hover:border-[#3D6B56] hover:text-[#3D6B56]'
            }`}
          >
            {lokasi === 'EST' ? 'Estate' : 'Mill'}
            <span className={`text-[10px] px-1 py-0.5 rounded ${filters.lokasi === lokasi ? 'bg-white/20' : 'bg-[#F0F4F1]'}`}>
              {counts.byLokasi[lokasi] || 0}
            </span>
          </button>
        ))}
        <button
          onClick={onReset}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#8A938B] hover:text-[#B84A3E] hover:bg-[#B84A3E]/10 transition-all border border-transparent hover:border-[#B84A3E]/20"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>
    </div>
  );
}
