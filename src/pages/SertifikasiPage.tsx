import { useState } from 'react';
import { Award, Search, Users } from 'lucide-react';

interface CertComplianceItem {
  name: string;
  total: number;
  sudah: number;
  belum: number;
  compliance: number;
}

interface SertifikasiPageProps {
  certCompliance: CertComplianceItem[];
  onCertClick: (certName: string) => void;
}

type SortType = 'highest' | 'lowest' | 'most' | 'az';

export function SertifikasiPage({ certCompliance, onCertClick }: SertifikasiPageProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('highest');

  const filtered = certCompliance
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      switch (sort) {
        case 'highest': return b.compliance - a.compliance;
        case 'lowest': return a.compliance - b.compliance;
        case 'most': return b.total - a.total;
        case 'az': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const getColorClass = (compliance: number) => {
    if (compliance >= 80) return 'bg-[#4A7C59]';
    if (compliance >= 50) return 'bg-[#E09F3E]';
    return 'bg-[#B84A3E]';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#2C3531]">Daftar Sertifikasi</h2>
          <p className="text-[12px] text-[#8A938B] mt-0.5">Semua jenis sertifikasi K3 dan tingkat capaiannya</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-5 h-5 text-[#D9A443]" />
          <span className="text-[24px] font-bold text-[#2C3531]">{certCompliance.length}</span>
        </div>
        <p className="text-[12px] text-[#8A938B]">jenis sertifikasi</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A938B]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama sertifikasi..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#E0E8E3] bg-white text-[13px] text-[#2C3531] placeholder:text-[#8A938B] focus:outline-none focus:border-[#3D6B56] focus:ring-2 focus:ring-[#3D6B56]/20 transition-all" />
        </div>
        <div className="flex items-center gap-2">
          {([
            { key: 'highest' as SortType, label: 'Capaian Tertinggi' },
            { key: 'lowest' as SortType, label: 'Capaian Terendah' },
            { key: 'most' as SortType, label: 'Peserta Terbanyak' },
            { key: 'az' as SortType, label: 'A - Z' },
          ]).map((s) => (
            <button key={s.key} onClick={() => setSort(s.key)}
              className={`px-3 py-2 rounded-lg text-[12px] font-medium transition-all border ${sort === s.key ? 'bg-[#2C3531] text-white border-[#2C3531]' : 'bg-white text-[#566A7F] border-[#E0E8E3] hover:border-[#3D6B56]'}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
        {filtered.map((cert) => (
          <button
            key={cert.name}
            onClick={() => onCertClick(cert.name)}
            className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] hover:shadow-[0px_8px_32px_rgba(60,107,86,0.12)] hover:-translate-y-0.5 transition-all duration-300 text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-[13px] font-semibold text-[#2C3531] line-clamp-2 min-h-[40px] flex-1" title={cert.name}>
                {cert.name.replace('SERTIFIKASI - ', '')}
              </h3>
              <div className="w-8 h-8 rounded-lg bg-[#3D6B56]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                <Users className="w-4 h-4 text-[#3D6B56]" />
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-[20px] font-bold text-[#2C3531]">{cert.sudah}</span>
              <span className="text-[12px] text-[#8A938B]">/ {cert.total} sudah</span>
            </div>

            <div className="h-2 bg-[#F0F4F1] rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full transition-all duration-500 ${getColorClass(cert.compliance)}`} style={{ width: `${cert.compliance}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#8A938B]">Compliance: <span className="font-semibold text-[#2C3531]">{cert.compliance}%</span></span>
              <span className="text-[11px] text-[#8A938B]">{cert.belum} belum</span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[13px] text-[#8A938B]">Tidak ada sertifikasi yang sesuai dengan pencarian</div>
      )}
    </div>
  );
}
