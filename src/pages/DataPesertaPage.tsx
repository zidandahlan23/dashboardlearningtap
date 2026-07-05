import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Plus, RotateCcw, Users } from 'lucide-react';
import { DataTable } from '@/components/DataTable';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { EditModal } from '@/components/EditModal';
import { useToast } from '@/components/ToastProvider';
import type { CertificationRecord, FilterState } from '@/types';

interface DataPesertaPageProps {
  records: CertificationRecord[];
  filterOptions: { regions: string[]; pts: string[]; lokasis: string[]; jabatans: string[]; sertifikasis: string[] };
  onUpdateRecord: (id: string, data: Partial<CertificationRecord>) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
  onAddRecord: (record: CertificationRecord) => Promise<void>;
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  getRecordBudget: (record: CertificationRecord) => number;
}

const emptyRecord: CertificationRecord = {
  id: '', nik: '', nama: '', jabatan: '', lokasi: 'EST', pt: '', region: '', sertifikasi: '',
  status_cert: 'BELUM', no_sertifikat: '', tanggal_terbit: '', tanggal_expired: '', budget_estimasi: 0, budget_actual: 0,
  link_sertifikat: '', computed_status: 'BELUM_SERTIFIKASI', created_at: '', updated_at: '',
};

export function DataPesertaPage({ records, filterOptions, onUpdateRecord, onDeleteRecord, onAddRecord, filters, onFilterChange, onResetFilters, getRecordBudget }: DataPesertaPageProps) {
  const { showToast } = useToast();
  const [editRecord, setEditRecord] = useState<CertificationRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<CertificationRecord | null>(null);

  const employeeStats = useMemo(() => {
    const employees = new Map<string, { total: number; sudah: number; belum: number }>();
    records.forEach((record) => {
      const key = record.nik || record.nama;
      const current = employees.get(key) || { total: 0, sudah: 0, belum: 0 };
      current.total += 1;
      if (record.status_cert === 'SUDAH') current.sudah += 1;
      else current.belum += 1;
      employees.set(key, current);
    });
    return [...employees.values()];
  }, [records]);

  const participantKpi = useMemo(() => ({
    total: employeeStats.length,
    complete: employeeStats.filter((person) => person.sudah > 0 && person.belum === 0).length,
    partial: employeeStats.filter((person) => person.sudah > 0 && person.belum > 0).length,
    none: employeeStats.filter((person) => person.sudah === 0).length,
  }), [employeeStats]);

  const filterEntries: Array<{ key: keyof FilterState; label: string; values: string[] }> = [
    { key: 'region', label: 'Semua Region', values: filterOptions.regions },
    { key: 'pt', label: 'Semua PT', values: filterOptions.pts },
    { key: 'lokasi', label: 'Semua Lokasi', values: filterOptions.lokasis },
    { key: 'status', label: 'Semua Status', values: ['ACTIVE', 'EXPIRING_SOON', 'EXPIRED', 'BELUM_SERTIFIKASI'] },
  ];

  const saveRecord = async (id: string, data: Partial<CertificationRecord>) => {
    if (id) {
      await onUpdateRecord(id, data);
      showToast('Data sertifikasi berhasil diperbarui di Google Sheets.', 'success');
    } else {
      await onAddRecord({ ...emptyRecord, ...data } as CertificationRecord);
      showToast('Data sertifikasi baru berhasil ditambahkan.', 'success');
    }
  };

  const confirmDelete = async () => {
    if (!deleteRecord) return;
    try {
      await onDeleteRecord(deleteRecord.id);
      showToast('Data sertifikasi berhasil dihapus dari Google Sheets.', 'success');
      setDeleteRecord(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal menghapus data.', 'error');
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: 'TOTAL PESERTA UNIK', value: participantKpi.total, subtitle: 'karyawan terdata', icon: Users, color: '#3D6B56' },
          { label: 'TUNTAS', value: participantKpi.complete, subtitle: 'semua sertifikasi terpenuhi', icon: CheckCircle, color: '#4A7C59' },
          { label: 'SEBAGIAN BELUM', value: participantKpi.partial, subtitle: 'perlu dilengkapi', icon: Clock, color: '#E09F3E' },
          { label: 'BELUM SAMA SEKALI', value: participantKpi.none, subtitle: 'belum memiliki sertifikasi', icon: AlertCircle, color: '#B84A3E' },
        ].map((card) => {
          const Icon = card.icon;
          return <div key={card.label} className="bg-white rounded-xl p-4 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]"><div className="flex items-start justify-between mb-3"><span className="text-[10px] font-semibold text-[#8A938B] uppercase tracking-wider">{card.label}</span><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}18` }}><Icon className="w-4 h-4" style={{ color: card.color }} /></div></div><div className="text-[28px] font-bold text-[#2C3531] leading-tight">{card.value.toLocaleString('id-ID')}</div><div className="text-[11px] text-[#8A938B] mt-1">{card.subtitle}</div></div>;
        })}
      </div>

      <section className="bg-white rounded-xl p-4 lg:p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div><h2 className="text-[15px] font-semibold text-[#2C3531]">Kelola Data Sertifikasi</h2><p className="text-[12px] text-[#8A938B] mt-0.5">Filter data, kemudian tambah atau edit record yang perlu diperbarui.</p></div>
          <div className="flex gap-2"><button onClick={onResetFilters} className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-[12px] font-medium text-[#566A7F] bg-[#F0F4F1] hover:bg-[#E0E8E3]"><RotateCcw className="w-3.5 h-3.5" /> Reset</button><button onClick={() => setEditRecord({ ...emptyRecord })} className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-[12px] font-medium text-white bg-[#3D6B56] hover:bg-[#2d5444]"><Plus className="w-4 h-4" /> Tambah Data</button></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {filterEntries.map((filter) => <select key={filter.key} value={filters[filter.key]} onChange={(event) => onFilterChange({ [filter.key]: event.target.value })} className="h-10 px-3 rounded-lg border border-[#E0E8E3] text-[12px] text-[#566A7F] bg-white focus:outline-none focus:border-[#3D6B56]"><option value="">{filter.label}</option>{filter.values.map((value) => <option key={value} value={value}>{value.replaceAll('_', ' ')}</option>)}</select>)}
        </div>
      </section>

      <DataTable data={records} onEdit={setEditRecord} onDelete={(id) => setDeleteRecord(records.find((record) => record.id === id) || null)} getBudget={getRecordBudget} />

      <EditModal record={editRecord} isOpen={!!editRecord} onClose={() => setEditRecord(null)} onSave={saveRecord} filterOptions={filterOptions} />
      <DeleteConfirmModal isOpen={!!deleteRecord} onClose={() => setDeleteRecord(null)} onConfirm={() => void confirmDelete()} nama={deleteRecord?.nama || ''} />
    </div>
  );
}
