import { Users, CheckCircle, Clock, AlertTriangle, Award, Banknote, Wallet } from 'lucide-react';
import { formatRupiah } from '@/hooks/useCertificationData';

interface KPICardsProps {
  kpi: {
    totalRecords: number;
    sudahSertifikasi: number;
    belumSertifikasi: number;
    expired: number;
    uniqueCerts: number;
    complianceRate: number;
    totalBudget: number;
    totalBudgetActual: number;
    budgetPerEmployee: number;
  };
}

export function KPICards({ kpi }: KPICardsProps) {
  const cards = [
    {
      key: 'totalRecords',
      label: 'TOTAL PESERTA',
      subtitle: 'record sertifikasi',
      value: kpi.totalRecords.toLocaleString('id-ID'),
      icon: Users,
      color: '#3D6B56',
    },
    {
      key: 'sudahSertifikasi',
      label: 'SUDAH SERTIFIKASI',
      subtitle: 'dari total record',
      value: kpi.sudahSertifikasi.toLocaleString('id-ID'),
      icon: CheckCircle,
      color: '#4A7C59',
    },
    {
      key: 'belumSertifikasi',
      label: 'BELUM SERTIFIKASI',
      subtitle: 'perlu tindak lanjut',
      value: kpi.belumSertifikasi.toLocaleString('id-ID'),
      icon: Clock,
      color: '#E09F3E',
    },
    {
      key: 'expired',
      label: 'SERTIFIKAT EXPIRED',
      subtitle: 'perlu re-sertifikasi',
      value: kpi.expired.toLocaleString('id-ID'),
      icon: AlertTriangle,
      color: '#B84A3E',
    },
    {
      key: 'uniqueCerts',
      label: 'JENIS SERTIFIKASI',
      subtitle: 'jenis sertifikasi aktif',
      value: kpi.uniqueCerts.toLocaleString('id-ID'),
      icon: Award,
      color: '#5B8BA0',
    },
    {
      key: 'totalBudget',
      label: 'BUDGET ESTIMASI',
      subtitle: 'total estimasi sertifikasi',
      value: formatRupiah(kpi.totalBudget),
      icon: Banknote,
      color: '#8B5CF6',
    },
    {
      key: 'totalBudgetActual',
      label: 'BUDGET AKTUAL',
      subtitle: 'biaya aktual tercatat',
      value: formatRupiah(kpi.totalBudgetActual),
      icon: Wallet,
      color: '#D9A443',
    },
    {
      key: 'complianceRate',
      label: 'COMPLIANCE RATE',
      subtitle: 'tingkat kepatuhan',
      value: `${kpi.complianceRate}%`,
      icon: Banknote,
      color: '#3D6B56',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="bg-white rounded-xl p-4 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] hover:shadow-[0px_8px_32px_rgba(60,107,86,0.12)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-semibold text-[#8A938B] uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: card.color + '18' }}
              >
                <Icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-[22px] font-bold text-[#2C3531] leading-tight truncate">
              {card.value}
            </div>
            <div className="text-[11px] text-[#8A938B] mt-1">{card.subtitle}</div>
            <div className="mt-3 flex items-end gap-0.5 h-6">
              {Array.from({ length: 8 }).map((_, i) => {
                const height = 20 + Math.sin(i * 1.2 + card.key.length) * 50 + 30;
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${Math.max(15, Math.min(100, height))}%`,
                      backgroundColor: card.color,
                      opacity: 0.3 + (i / 8) * 0.7,
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
