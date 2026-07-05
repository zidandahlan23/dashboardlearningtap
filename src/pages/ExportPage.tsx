import { useMemo, useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileCode, Filter, Building2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/components/ToastProvider';
import type { CertificationRecord } from '@/types';

interface ExportPageProps {
  records: CertificationRecord[];
  allRecords?: CertificationRecord[];
  filterOptions?: { pts: string[] };
}

export function ExportPage({ records, allRecords, filterOptions }: ExportPageProps) {
  const { showToast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [selectedPt, setSelectedPt] = useState('');
  const pts = filterOptions?.pts || [...new Set((allRecords || records).map((r) => r.pt).filter(Boolean))].sort();
  const sourceRecords = allRecords?.length ? allRecords : records;
  const exportRecords = useMemo(
    () => selectedPt ? sourceRecords.filter((r) => r.pt === selectedPt) : records,
    [selectedPt, sourceRecords, records]
  );

  const exportLabel = selectedPt ? `PT ${selectedPt}` : 'filter aktif';
  const fileSuffix = selectedPt ? selectedPt.replace(/[^a-z0-9]+/gi, '_') : 'Filter_Aktif';

  const mappedData = () => exportRecords.map((r) => ({
    ID: r.id,
    NIK: r.nik,
    NAMA: r.nama,
    JABATAN: r.jabatan,
    LOKASI: r.lokasi,
    PT: r.pt,
    REGION: r.region,
    SERTIFIKASI: r.sertifikasi,
    STATUS_SERTIFIKASI: r.status_cert,
    NO_SERTIFIKAT: r.no_sertifikat,
    TANGGAL_TERBIT: r.tanggal_terbit,
    TANGGAL_EXPIRED: r.tanggal_expired,
    BUDGET_ESTIMASI: r.budget_estimasi,
    BUDGET_ACTUAL: r.budget_actual,
    LINK_SERTIFIKAT: r.link_sertifikat,
    STATUS: r.computed_status,
  }));

  const handleExportExcel = () => {
    setExporting(true);
    try {
      const ws = XLSX.utils.json_to_sheet(mappedData());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sertifikasi');
      XLSX.writeFile(wb, `Sertifikasi_${fileSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast(`Data ${exportLabel} berhasil diexport ke Excel`, 'success');
    } catch {
      showToast('Gagal export data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const data = mappedData();
      const headers = Object.keys(data[0] || { ID: '' });
      const rows = data.map((row) => headers.map((key) => `"${String((row as Record<string, unknown>)[key] ?? '').replace(/"/g, '""')}"`).join(','));
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sertifikasi_${fileSuffix}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Data ${exportLabel} berhasil diexport ke CSV`, 'success');
    } catch {
      showToast('Gagal export data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(16);
      doc.text('Dashboard Monitoring Sertifikasi K3', 14, 15);
      doc.setFontSize(10);
      doc.text(`PT Triputra Agro Persada - ${new Date().toLocaleDateString('id-ID')}`, 14, 22);
      doc.text(`Scope: ${selectedPt || 'Filter aktif'} | Total Data: ${exportRecords.length} records`, 14, 28);

      const tableData = exportRecords.slice(0, 500).map((r) => [
        r.nama,
        r.nik,
        r.jabatan,
        r.pt,
        r.region,
        r.sertifikasi.replace('SERTIFIKASI - ', '').slice(0, 30),
        r.status_cert,
        r.computed_status,
      ]);

      autoTable(doc, {
        head: [['Nama', 'NIK', 'Jabatan', 'PT', 'Region', 'Sertifikasi', 'Status', 'Computed']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [61, 107, 86], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 244, 241] },
      });

      doc.save(`Sertifikasi_${fileSuffix}_${new Date().toISOString().split('T')[0]}.pdf`);
      showToast(`Data ${exportLabel} berhasil diexport ke PDF`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal export PDF', 'error');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-bold text-[#2C3531]">Export Data</h2>
        <p className="text-[12px] text-[#8A938B] mt-0.5">
          Export laporan berdasarkan filter aktif atau pilih PT tertentu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#3D6B56]/10 flex items-center justify-center">
            <FileSpreadsheet className="w-6 h-6 text-[#3D6B56]" />
          </div>
          <div>
            <p className="text-[24px] font-bold text-[#2C3531]">{exportRecords.length.toLocaleString('id-ID')}</p>
            <p className="text-[12px] text-[#8A938B]">records tersedia untuk export: {exportLabel}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-[#3D6B56]" />
            <h3 className="text-[13px] font-bold text-[#2C3531]">Filter Export per PT</h3>
          </div>
          <select
            value={selectedPt}
            onChange={(e) => setSelectedPt(e.target.value)}
            className="w-full h-10 rounded-xl border border-[#E0E8E3] bg-[#F8FAF8] px-3 text-[13px] text-[#2C3531] focus:outline-none focus:ring-2 focus:ring-[#3D6B56]/20"
          >
            <option value="">Gunakan filter aktif / semua data terlihat</option>
            {pts.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
          </select>
          {selectedPt && (
            <button onClick={() => setSelectedPt('')} className="mt-2 text-[11px] text-[#3D6B56] font-semibold hover:underline">Reset pilihan PT</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {[
          { title: 'Export Excel', desc: 'Format .xlsx dengan semua kolom data', icon: FileSpreadsheet, color: '#4A7C59', action: handleExportExcel, label: 'Download Excel' },
          { title: 'Export CSV', desc: 'Format CSV untuk aplikasi lain', icon: FileCode, color: '#5B8BA0', action: handleExportCSV, label: 'Download CSV' },
          { title: 'Export PDF', desc: 'Format PDF untuk laporan (max 500 baris)', icon: FileText, color: '#B84A3E', action: handleExportPDF, label: 'Download PDF' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] border border-transparent hover:border-[#E0E8E3] transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: item.color + '15' }}>
                <Icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <h3 className="text-[15px] font-semibold text-[#2C3531] mb-2">{item.title}</h3>
              <p className="text-[12px] text-[#8A938B] mb-4">{item.desc}</p>
              <button
                onClick={item.action}
                disabled={exporting || exportRecords.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: item.color }}
              >
                <Download className="w-4 h-4" />
                {exporting ? 'Mengexport...' : item.label}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-[#3D6B56]/8 border border-[#3D6B56]/15 rounded-2xl p-4 flex gap-3 text-[12px] text-[#3D6B56]">
        <Building2 className="w-5 h-5 flex-shrink-0" />
        <div>
          <strong>Tips:</strong> pilih PT untuk download laporan khusus PT tersebut, atau kosongkan pilihan PT untuk export berdasarkan filter yang sedang aktif di dashboard.
        </div>
      </div>
    </div>
  );
}
