import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileCode } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/components/ToastProvider';
import type { CertificationRecord } from '@/types';

interface ExportPageProps {
  records: CertificationRecord[];
}

export function ExportPage({ records }: ExportPageProps) {
  const { showToast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = () => {
    setExporting(true);
    try {
      const data = records.map((r) => ({
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

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sertifikasi');
      XLSX.writeFile(wb, `Sertifikasi_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast('Data berhasil diexport ke Excel', 'success');
    } catch {
      showToast('Gagal export data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const headers = [
        'ID', 'NIK', 'NAMA', 'JABATAN', 'LOKASI', 'PT', 'REGION',
        'SERTIFIKASI', 'STATUS_CERT', 'NO_SERTIFIKAT', 'TANGGAL_TERBIT',
        'TANGGAL_EXPIRED', 'BUDGET_ESTIMASI', 'BUDGET_ACTUAL', 'LINK_SERTIFIKAT', 'STATUS',
      ];
      const rows = records.map((r) =>
        [
          r.id, r.nik, r.nama, r.jabatan, r.lokasi, r.pt, r.region,
          r.sertifikasi, r.status_cert, r.no_sertifikat, r.tanggal_terbit,
          r.tanggal_expired, r.budget_estimasi, r.budget_actual, r.link_sertifikat, r.computed_status,
        ].map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(',')
      );
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Sertifikasi_Export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data berhasil diexport ke CSV', 'success');
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
      
      // Title
      doc.setFontSize(16);
      doc.text('Dashboard Monitoring Sertifikasi K3', 14, 15);
      doc.setFontSize(10);
      doc.text(`PT Triputra Agro Persada - ${new Date().toLocaleDateString('id-ID')}`, 14, 22);
      doc.text(`Total Data: ${records.length} records`, 14, 28);

      // Table
      const tableData = records.slice(0, 500).map((r) => [
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

      doc.save(`Sertifikasi_Export_${new Date().toISOString().split('T')[0]}.pdf`);
      showToast(`Data berhasil diexport ke PDF (${Math.min(records.length, 500)} baris)`, 'success');
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
        <h2 className="text-[18px] font-bold text-[#2C3531]">Export Data</h2>
        <p className="text-[12px] text-[#8A938B] mt-0.5">
          Export seluruh data sertifikasi ke berbagai format
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#3D6B56]/10 flex items-center justify-center">
          <FileSpreadsheet className="w-6 h-6 text-[#3D6B56]" />
        </div>
        <div>
          <p className="text-[20px] font-bold text-[#2C3531]">{records.length.toLocaleString('id-ID')}</p>
          <p className="text-[12px] text-[#8A938B]">total records tersedia untuk export</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {/* Excel Export */}
        <div className="bg-white rounded-xl p-6 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <div className="w-12 h-12 rounded-xl bg-[#4A7C59]/10 flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6 text-[#4A7C59]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#2C3531] mb-2">Export Excel</h3>
          <p className="text-[12px] text-[#8A938B] mb-4">
            Format .xlsx dengan semua kolom data
          </p>
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white bg-[#4A7C59] hover:bg-[#3a6347] transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Mengexport...' : 'Download Excel'}
          </button>
        </div>

        {/* CSV Export */}
        <div className="bg-white rounded-xl p-6 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <div className="w-12 h-12 rounded-xl bg-[#5B8BA0]/10 flex items-center justify-center mb-4">
            <FileCode className="w-6 h-6 text-[#5B8BA0]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#2C3531] mb-2">Export CSV</h3>
          <p className="text-[12px] text-[#8A938B] mb-4">
            Format CSV untuk aplikasi lain
          </p>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white bg-[#5B8BA0] hover:bg-[#4a7083] transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Mengexport...' : 'Download CSV'}
          </button>
        </div>

        {/* PDF Export */}
        <div className="bg-white rounded-xl p-6 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <div className="w-12 h-12 rounded-xl bg-[#B84A3E]/10 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-[#B84A3E]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#2C3531] mb-2">Export PDF</h3>
          <p className="text-[12px] text-[#8A938B] mb-4">
            Format PDF untuk laporan (max 500 baris)
          </p>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium text-white bg-[#B84A3E] hover:bg-[#9a3d33] transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Mengexport...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
