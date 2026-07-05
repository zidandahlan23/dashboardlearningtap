import { useState } from 'react';
import { AlertTriangle, Clock, Timer } from 'lucide-react';
import { ExpiryDetailModal } from './ExpiryDetailModal';
import type { CertificationRecord } from '@/types';

interface ExpiryWarningsProps {
  warnings: {
    exp30: number;
    exp60: number;
    exp90: number;
    exp30Records: CertificationRecord[];
    exp60Records: CertificationRecord[];
    exp90Records: CertificationRecord[];
  };
}

export function ExpiryWarnings({ warnings }: ExpiryWarningsProps) {
  const [modalOpen, setModalOpen] = useState<'30' | '60' | '90' | null>(null);

  if (warnings.exp30 === 0 && warnings.exp60 === 0 && warnings.exp90 === 0) return null;

  const items = [
    {
      key: '30' as const,
      count: warnings.exp30,
      records: warnings.exp30Records,
      label: 'Expired ≤ 30 hari',
      color: '#B84A3E',
      icon: AlertTriangle,
    },
    {
      key: '60' as const,
      count: warnings.exp60,
      records: warnings.exp60Records,
      label: 'Expired 31–60 hari',
      color: '#E09F3E',
      icon: Clock,
    },
    {
      key: '90' as const,
      count: warnings.exp90,
      records: warnings.exp90Records,
      label: 'Expired 61–90 hari',
      color: '#D9A443',
      icon: Timer,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => {
          if (item.count === 0) return null;
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setModalOpen(item.key)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left hover:shadow-md"
              style={{
                backgroundColor: item.color + '10',
                borderColor: item.color + '20',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = item.color + '18';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = item.color + '10';
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: item.color + '20' }}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-[20px] font-bold" style={{ color: item.color }}>
                  {item.count}
                </div>
                <div className="text-[11px]" style={{ color: item.color + 'CC' }}>
                  {item.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Modals */}
      {modalOpen === '30' && (
        <ExpiryDetailModal
          isOpen
          onClose={() => setModalOpen(null)}
          records={warnings.exp30Records}
          title="Sertifikasi Expired ≤ 30 Hari"
          daysLabel="Segera perpanjang"
          color="#B84A3E"
        />
      )}
      {modalOpen === '60' && (
        <ExpiryDetailModal
          isOpen
          onClose={() => setModalOpen(null)}
          records={warnings.exp60Records}
          title="Sertifikasi Expired 31–60 Hari"
          daysLabel="Perlu perhatian"
          color="#E09F3E"
        />
      )}
      {modalOpen === '90' && (
        <ExpiryDetailModal
          isOpen
          onClose={() => setModalOpen(null)}
          records={warnings.exp90Records}
          title="Sertifikasi Expired 61–90 Hari"
          daysLabel="Monitor secara berkala"
          color="#D9A443"
        />
      )}
    </>
  );
}
