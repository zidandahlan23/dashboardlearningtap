import { X, AlertTriangle, Calendar } from 'lucide-react';
import type { CertificationRecord } from '@/types';

interface ExpiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: CertificationRecord[];
  title: string;
  daysLabel: string;
  color: string;
}

export function ExpiryDetailModal({ isOpen, onClose, records, title, daysLabel, color }: ExpiryDetailModalProps) {
  if (!isOpen) return null;

  const sorted = [...records].sort((a, b) => {
    if (!a.tanggal_expired || !b.tanggal_expired) return 0;
    return new Date(a.tanggal_expired).getTime() - new Date(b.tanggal_expired).getTime();
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[800px] max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E8E3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
              <AlertTriangle className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#2C3531]">{title}</h2>
              <p className="text-[12px] text-[#8A938B]">{records.length} karyawan · {daysLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] hover:text-[#2C3531] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#F0F4F1] z-10">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase">Nama / NIK</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase">Jabatan</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase">Sertifikasi</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase">PT</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase">Region</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase">Tgl Expired</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const daysLeft = r.tanggal_expired
                  ? Math.ceil((new Date(r.tanggal_expired).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                  : 0;
                return (
                  <tr key={r.id} className="border-b border-[#E0E8E3]/50 hover:bg-[#F0F4F1]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {r.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[12px] font-medium text-[#2C3531]">{r.nama}</div>
                          <div className="text-[11px] text-[#8A938B]">{r.nik}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#566A7F]">{r.jabatan}</td>
                    <td className="px-4 py-3 text-[11px] text-[#566A7F] max-w-[180px] truncate" title={r.sertifikasi}>
                      {r.sertifikasi.replace('SERTIFIKASI - ', '')}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[#566A7F]">{r.pt}</td>
                    <td className="px-4 py-3 text-[12px] text-[#566A7F]">{r.region}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" style={{ color }} />
                        <span className="text-[11px] font-medium" style={{ color }}>
                          {daysLeft} hari
                        </span>
                      </div>
                      {r.tanggal_expired && (
                        <div className="text-[10px] text-[#8A938B] mt-0.5">
                          {new Date(r.tanggal_expired).toLocaleDateString('id-ID')}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[13px] text-[#8A938B]">
                    Tidak ada data yang akan expired dalam periode ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
