import { useEffect, useState } from 'react';
import { AlertCircle, LoaderCircle, X } from 'lucide-react';
import type { CertificationRecord } from '@/types';

interface EditModalProps {
  record: CertificationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<CertificationRecord>) => Promise<void>;
  filterOptions: {
    regions: string[];
    pts: string[];
    lokasis: string[];
    jabatans: string[];
    sertifikasis?: string[];
  };
}

const blankForm: Partial<CertificationRecord> = {
  nama: '',
  nik: '',
  jabatan: '',
  lokasi: 'EST',
  pt: '',
  region: '',
  sertifikasi: '',
  status_cert: 'BELUM',
  no_sertifikat: '',
  tanggal_terbit: '',
  tanggal_expired: '',
  budget_estimasi: 0,
  budget_actual: 0,
  link_sertifikat: '',
};

export function EditModal({ record, isOpen, onClose, onSave, filterOptions }: EditModalProps) {
  const [formData, setFormData] = useState<Partial<CertificationRecord>>(blankForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData({ ...blankForm, ...record });
      setErrors({});
    }
  }, [record]);

  if (!isOpen || !record) return null;
  const isNew = !record.id;

  const handleChange = (field: keyof CertificationRecord, value: string | number) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field];
        return next;
      });
    }
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const required: Array<[keyof CertificationRecord, string]> = [
      ['nama', 'Nama wajib diisi'],
      ['nik', 'NIK wajib diisi'],
      ['jabatan', 'Jabatan wajib diisi'],
      ['pt', 'PT wajib diisi'],
      ['region', 'Region wajib diisi'],
      ['sertifikasi', 'Sertifikasi wajib diisi'],
    ];
    required.forEach(([field, message]) => {
      if (!String(formData[field] || '').trim()) nextErrors[field] = message;
    });
    if (formData.link_sertifikat && !String(formData.link_sertifikat).startsWith('https://')) {
      nextErrors.link_sertifikat = 'Link harus diawali dengan https://';
    }
    return nextErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setSaving(true);
    try {
      await onSave(record.id, formData);
      onClose();
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'Gagal menyimpan data.' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full h-10 px-3 rounded-lg border text-[13px] text-[#2C3531] bg-white focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-[#B84A3E] focus:ring-[#B84A3E]/20'
        : 'border-[#E0E8E3] focus:border-[#3D6B56] focus:ring-[#3D6B56]/20'
    }`;

  const SuggestionList = ({ id, values }: { id: string; values: string[] }) => (
    <datalist id={id}>{values.map((value) => <option key={value} value={value} />)}</datalist>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={saving ? undefined : onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[740px] max-h-[92vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E8E3]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#2C3531]">{isNew ? 'Tambah Data Sertifikasi' : 'Edit Data Sertifikasi'}</h2>
            <p className="text-[12px] text-[#8A938B] mt-0.5">Perubahan tersimpan langsung ke Google Sheets.</p>
          </div>
          <button disabled={saving} onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] hover:text-[#2C3531] disabled:opacity-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 overflow-y-auto max-h-[calc(92vh-150px)] space-y-4">
          {errors.form && <div className="flex items-center gap-2 rounded-lg border border-[#B84A3E]/20 bg-[#B84A3E]/10 px-3 py-2.5 text-[12px] text-[#B84A3E]"><AlertCircle className="w-4 h-4 shrink-0" />{errors.form}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nama" required error={errors.nama}><input value={formData.nama || ''} onChange={(event) => handleChange('nama', event.target.value)} className={inputClass('nama')} placeholder="Nama peserta" /></Field>
            <Field label="NIK" required error={errors.nik}><input value={formData.nik || ''} onChange={(event) => handleChange('nik', event.target.value)} className={inputClass('nik')} placeholder="NIK karyawan" /></Field>
            <Field label="Jabatan" required error={errors.jabatan}><input list="jabatan-options" value={formData.jabatan || ''} onChange={(event) => handleChange('jabatan', event.target.value)} className={inputClass('jabatan')} placeholder="Jabatan" /><SuggestionList id="jabatan-options" values={filterOptions.jabatans} /></Field>
            <Field label="Lokasi"><input list="lokasi-options" value={formData.lokasi || ''} onChange={(event) => handleChange('lokasi', event.target.value)} className={inputClass('lokasi')} placeholder="EST / MILL" /><SuggestionList id="lokasi-options" values={filterOptions.lokasis} /></Field>
            <Field label="PT" required error={errors.pt}><input list="pt-options" value={formData.pt || ''} onChange={(event) => handleChange('pt', event.target.value)} className={inputClass('pt')} placeholder="Nama PT" /><SuggestionList id="pt-options" values={filterOptions.pts} /></Field>
            <Field label="Region" required error={errors.region}><input list="region-options" value={formData.region || ''} onChange={(event) => handleChange('region', event.target.value)} className={inputClass('region')} placeholder="Region" /><SuggestionList id="region-options" values={filterOptions.regions} /></Field>
          </div>

          <Field label="Jenis Sertifikasi" required error={errors.sertifikasi}><input list="sertifikasi-options" value={formData.sertifikasi || ''} onChange={(event) => handleChange('sertifikasi', event.target.value)} className={inputClass('sertifikasi')} placeholder="Nama sertifikasi" /><SuggestionList id="sertifikasi-options" values={filterOptions.sertifikasis || []} /></Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status Sertifikasi"><select value={formData.status_cert || 'BELUM'} onChange={(event) => handleChange('status_cert', event.target.value)} className={inputClass('status_cert')}><option value="BELUM">BELUM</option><option value="SUDAH">SUDAH</option></select></Field>
            <Field label="Nomor Sertifikat"><input value={formData.no_sertifikat || ''} onChange={(event) => handleChange('no_sertifikat', event.target.value)} className={inputClass('no_sertifikat')} placeholder="Nomor sertifikat" /></Field>
            <Field label="Tanggal Terbit"><input type="date" value={formData.tanggal_terbit || ''} onChange={(event) => handleChange('tanggal_terbit', event.target.value)} className={inputClass('tanggal_terbit')} /></Field>
            <Field label="Tanggal Expired"><input type="date" value={formData.tanggal_expired || ''} onChange={(event) => handleChange('tanggal_expired', event.target.value)} className={inputClass('tanggal_expired')} /></Field>
            <Field label="Budget Estimasi"><input type="number" min="0" value={formData.budget_estimasi || 0} onChange={(event) => handleChange('budget_estimasi', Number(event.target.value))} className={inputClass('budget_estimasi')} placeholder="0" /></Field>
            <Field label="Budget Aktual"><input type="number" min="0" value={formData.budget_actual || 0} onChange={(event) => handleChange('budget_actual', Number(event.target.value))} className={inputClass('budget_actual')} placeholder="0" /></Field>
          </div>

          <Field label="Link Dokumen Sertifikat" error={errors.link_sertifikat}><input value={formData.link_sertifikat || ''} onChange={(event) => handleChange('link_sertifikat', event.target.value)} className={inputClass('link_sertifikat')} placeholder="https://drive.google.com/..." /></Field>
        </div>

        <div className="px-6 py-4 border-t border-[#E0E8E3] flex justify-end gap-3 bg-white">
          <button onClick={onClose} disabled={saving} className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-[#566A7F] hover:bg-[#F0F4F1] disabled:opacity-50">Batal</button>
          <button onClick={() => void handleSubmit()} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white bg-[#3D6B56] hover:bg-[#2d5444] disabled:opacity-60">
            {saving && <LoaderCircle className="w-4 h-4 animate-spin" />}{saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return <div>
    <label className="block text-[12px] font-medium text-[#566A7F] mb-1.5">{label}{required && <span className="text-[#B84A3E]"> *</span>}</label>
    {children}
    {error && <p className="flex items-center gap-1 mt-1 text-[11px] text-[#B84A3E]"><AlertCircle className="w-3 h-3" /> {error}</p>}
  </div>;
}
