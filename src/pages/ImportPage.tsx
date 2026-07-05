import { useCallback, useState } from 'react';
import { AlertCircle, CheckCircle, FileSpreadsheet, LoaderCircle, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useToast } from '@/components/ToastProvider';
import type { CertificationRecord } from '@/types';

interface ImportPageProps {
  onImport: (records: CertificationRecord[]) => Promise<void>;
}

interface PreviewRow extends CertificationRecord {
  valid: boolean;
  error?: string;
}

const blankRecord: CertificationRecord = {
  id: '', nik: '', nama: '', jabatan: '', lokasi: 'EST', pt: '', region: '', sertifikasi: '', status_cert: 'BELUM',
  no_sertifikat: '', tanggal_terbit: '', tanggal_expired: '', budget_estimasi: 0, budget_actual: 0,
  link_sertifikat: '', computed_status: 'BELUM_SERTIFIKASI', created_at: '', updated_at: '',
};

const aliases: Record<string, string[]> = {
  nik: ['NIK'], nama: ['NAMA'], jabatan: ['JABATAN'], lokasi: ['LOKASI'], pt: ['PT'], region: ['REGION'],
  sertifikasi: ['NAMA SERTIFIKASI', 'NAMA_SERTIFIKASI', 'SERTIFIKASI'], status_cert: ['STATUS', 'STATUS SERTIFIKASI', 'STATUS_CERT'],
  tanggal_terbit: ['TANGGAL TERBIT', 'TANGGAL_TERBIT'], tanggal_expired: ['TANGGAL EXPIRED', 'TANGGAL_EXPIRED'],
  budget_estimasi: ['BUDGET ESTIMASI', 'BUDGET_ESTIMASI'], budget_actual: ['BUDGET ACTUAL', 'BUDGET_ACTUAL'],
  no_sertifikat: ['NOMOR SERTIFIKASI', 'NOMOR_SERTIFIKASI', 'NO SERTIFIKAT', 'NO_SERTIFIKAT'],
  link_sertifikat: ['LINK DOWNLOAD', 'LINK DOKUMEN', 'LINK SERTIFIKAT', 'LINK_SERTIFIKAT'],
};

function normalHeader(value: unknown) { return String(value || '').toUpperCase().replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function asText(value: unknown) { return value === undefined || value === null ? '' : String(value).trim(); }
function asMoney(value: unknown) { const result = Number(asText(value).replace(/[^0-9.-]/g, '')); return Number.isFinite(result) ? result : 0; }
function asDate(value: unknown) {
  if (!value) return '';
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const text = asText(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}` : '';
}

export function ImportPage({ onImport }: ImportPageProps) {
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [importing, setImporting] = useState(false);

  const readWorkbook = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target?.result, { type: 'binary', cellDates: true });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
        if (!rows.length) throw new Error('File kosong atau header tidak terbaca.');

        const mapped = rows.map((row) => {
          const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [normalHeader(key), value]));
          const pick = (field: string) => {
            const header = aliases[field].map(normalHeader).find((candidate) => Object.prototype.hasOwnProperty.call(normalized, candidate));
            return header ? normalized[header] : '';
          };
          const status = asText(pick('status_cert')).toUpperCase() === 'SUDAH' ? 'SUDAH' : 'BELUM';
          const candidate: PreviewRow = {
            ...blankRecord,
            nik: asText(pick('nik')), nama: asText(pick('nama')), jabatan: asText(pick('jabatan')), lokasi: asText(pick('lokasi')) || 'EST',
            pt: asText(pick('pt')), region: asText(pick('region')), sertifikasi: asText(pick('sertifikasi')), status_cert: status,
            tanggal_terbit: asDate(pick('tanggal_terbit')), tanggal_expired: asDate(pick('tanggal_expired')),
            budget_estimasi: asMoney(pick('budget_estimasi')), budget_actual: asMoney(pick('budget_actual')),
            no_sertifikat: asText(pick('no_sertifikat')), link_sertifikat: asText(pick('link_sertifikat')),
            valid: true,
          };
          const required = [candidate.nik, candidate.nama, candidate.jabatan, candidate.pt, candidate.region, candidate.sertifikasi];
          candidate.valid = required.every(Boolean);
          candidate.error = candidate.valid ? undefined : 'NIK, Nama, Jabatan, PT, Region, dan Sertifikasi wajib diisi.';
          return candidate;
        });

        setPreview(mapped);
        showToast(`${mapped.length.toLocaleString('id-ID')} baris berhasil dibaca.`, 'success');
      } catch (error) {
        showToast(error instanceof Error ? error.message : 'Gagal membaca file.', 'error');
        setPreview([]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) readWorkbook(file);
  }, []);

  const importRows = async () => {
    const validRows = preview.filter((row) => row.valid);
    if (!validRows.length) return showToast('Tidak ada data valid untuk diimport.', 'error');
    setImporting(true);
    try {
      await onImport(validRows);
      showToast(`${validRows.length.toLocaleString('id-ID')} record berhasil ditambahkan ke Google Sheets.`, 'success');
      setPreview([]);
      setFileName('');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal mengimport data.', 'error');
    } finally {
      setImporting(false);
    }
  };

  const validCount = preview.filter((row) => row.valid).length;
  return <div className="space-y-6">
    <div><h2 className="text-[18px] font-bold text-[#2C3531]">Import Data</h2><p className="text-[12px] text-[#8A938B] mt-0.5">Import record baru langsung ke Google Sheets. Baris dengan ID akan dibuat sebagai record baru.</p></div>
    <div onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop} className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${isDragging ? 'border-[#3D6B56] bg-[#3D6B56]/5' : 'border-[#E0E8E3] bg-white hover:border-[#3D6B56]/50'}`}>
      <div className="w-16 h-16 rounded-full bg-[#3D6B56]/10 flex items-center justify-center mx-auto mb-4"><Upload className="w-7 h-7 text-[#3D6B56]" /></div>
      <p className="text-[14px] font-medium text-[#2C3531] mb-1">Drag & drop file Excel di sini</p><p className="text-[12px] text-[#8A938B] mb-4">atau</p>
      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white bg-[#3D6B56] hover:bg-[#2d5444] cursor-pointer"><FileSpreadsheet className="w-4 h-4" />Pilih File<input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => event.target.files?.[0] && readWorkbook(event.target.files[0])} className="hidden" /></label>
      <p className="text-[11px] text-[#8A938B] mt-3">Format mengikuti header spreadsheet: NIK, NAMA, JABATAN, PT, REGION, NAMA_SERTIFIKASI, dan seterusnya.</p>
    </div>
    {fileName && <div className="bg-white rounded-xl p-4 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] flex items-center gap-3"><FileSpreadsheet className="w-5 h-5 text-[#4A7C59]" /><div><p className="text-[13px] font-medium text-[#2C3531]">{fileName}</p><p className="text-[11px] text-[#8A938B]">{preview.length.toLocaleString('id-ID')} baris ditemukan · {validCount.toLocaleString('id-ID')} valid</p></div></div>}
    {preview.length > 0 && <div className="bg-white rounded-xl shadow-[0px_4px_24px_rgba(60,107,86,0.06)] overflow-hidden"><div className="px-5 py-4 border-b border-[#E0E8E3] flex items-center justify-between gap-3"><div><h3 className="text-[14px] font-semibold text-[#2C3531]">Preview (20 baris pertama)</h3><p className="text-[11px] text-[#8A938B] mt-0.5">Data valid akan ditambah sebagai record baru.</p></div><button onClick={() => void importRows()} disabled={!validCount || importing} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12px] font-medium text-white bg-[#3D6B56] hover:bg-[#2d5444] disabled:opacity-50">{importing && <LoaderCircle className="w-4 h-4 animate-spin" />}{importing ? 'Mengimport...' : `Import ${validCount.toLocaleString('id-ID')} Data`}</button></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-[#F0F4F1]">{['Status','Nama','NIK','Jabatan','PT','Region','Sertifikasi'].map((label) => <th key={label} className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase">{label}</th>)}</tr></thead><tbody>{preview.slice(0, 20).map((row, index) => <tr key={index} className="border-b border-[#E0E8E3]/50"><td className="px-4 py-2.5">{row.valid ? <CheckCircle className="w-4 h-4 text-[#4A7C59]" /> : <span title={row.error}><AlertCircle className="w-4 h-4 text-[#B84A3E]" /></span>}</td><td className="px-4 py-2.5 text-[12px] text-[#2C3531]">{row.nama}</td><td className="px-4 py-2.5 text-[12px] text-[#566A7F]">{row.nik}</td><td className="px-4 py-2.5 text-[12px] text-[#566A7F]">{row.jabatan}</td><td className="px-4 py-2.5 text-[12px] text-[#566A7F]">{row.pt}</td><td className="px-4 py-2.5 text-[12px] text-[#566A7F]">{row.region}</td><td className="px-4 py-2.5 text-[12px] text-[#566A7F]">{row.sertifikasi}</td></tr>)}</tbody></table></div></div>}
  </div>;
}
