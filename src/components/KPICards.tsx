import { Users, CheckCircle, Clock, AlertTriangle, Award, Banknote, Wallet, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '@/hooks/useCertificationData';

interface KPICardsProps {
  kpi: {
    totalRecords: number;
    sudahSertifikasi: number;
    belumSertifikasi: number;
    expiringSoon?: number;
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
      key: 'complianceRate',
      label: 'COMPLIANCE RATE',
      subtitle: `${kpi.sudahSertifikasi.toLocaleString('id-ID')} dari ${kpi.totalRecords.toLocaleString('id-ID')} sudah`,
      value: `${kpi.complianceRate}%`,
      icon: ShieldCheck,
      color: '#3D6B56',
      accent: 'bg-[#3D6B56]/8 border-[#3D6B56]/15',
    },
    {
      key: 'expired',
      label: 'SERTIFIKAT EXPIRED',
      subtitle: 'prioritas re-sertifikasi',
      value: kpi.expired.toLocaleString('id-ID'),
      icon: AlertTriangle,
      color: '#B84A3E',
      accent: 'bg-[#B84A3E]/8 border-[#B84A3E]/20',
    },
    {
      key: 'expiringSoon',
      label: 'AKAN EXPIRED',
      subtitle: 'dalam 90 hari',
      value: (kpi.expiringSoon || 0).toLocaleString('id-ID'),
      icon: Clock,
      color: '#E09F3E',
      accent: 'bg-[#E09F3E]/8 border-[#E09F3E]/20',
    },
    {
      key: 'belumSertifikasi',
      label: 'BELUM SERTIFIKASI',
      subtitle: 'perlu tindak lanjut',
      value: kpi.belumSertifikasi.toLocaleString('id-ID'),
      icon: Clock,
      color: '#566A7F',
      accent: 'bg-[#566A7F]/7 border-[#566A7F]/15',
    },
    {
      key: 'totalRecords',
      label: 'TOTAL RECORD',
      subtitle: 'data sertifikasi',
      value: kpi.totalRecords.toLocaleString('id-ID'),
      icon: Users,
      color: '#3D6B56',
      accent: 'bg-white border-transparent',
    },
    {
      key: 'sudahSertifikasi',
      label: 'SUDAH SERTIFIKASI',
      subtitle: 'record tercapai',
      value: kpi.sudahSertifikasi.toLocaleString('id-ID'),
      icon: CheckCircle,
      color: '#4A7C59',
      accent: 'bg-white border-transparent',
    },
    {
      key: 'uniqueCerts',
      label: 'JENIS SERTIFIKASI',
      subtitle: 'aktif dimonitor',
      value: kpi.uniqueCerts.toLocaleString('id-ID'),
      icon: Award,
      color: '#5B8BA0',
      accent: 'bg-white border-transparent',
    },
    {
      key: 'totalBudgetActual',
      label: 'BUDGET AKTUAL',
      subtitle: `estimasi ${formatRupiah(kpi.totalBudget)}`,
      value: formatRupiah(kpi.totalBudgetActual),
      icon: Wallet,
      color: '#D9A443',
      accent: 'bg-white border-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className={`${card.accent} border rounded-2xl p-4 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] hover:shadow-[0px_8px_32px_rgba(60,107,86,0.12)] hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-bold text-[#7B877F] uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: card.color + '18' }}
              >
                <Icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-[24px] font-bold text-[#2C3531] leading-tight truncate">
              {card.value}
            </div>
            <div className="text-[11px] text-[#7B877F] mt-1">{card.subtitle}</div>
            <div className="mt-3 h-2 rounded-full bg-[#E8EFEA] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  backgroundColor: card.color,
                  width: card.key === 'complianceRate' ? `${Math.min(100, kpi.complianceRate)}%` : '72%',
                  opacity: card.key === 'expired' ? 0.95 : 0.85,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
