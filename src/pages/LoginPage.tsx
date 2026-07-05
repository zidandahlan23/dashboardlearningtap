import { useState } from 'react';
import { BarChart3, Download, Filter, Shield, TreePalm, Eye, LockKeyhole } from 'lucide-react';
import type { UserRole } from '@/hooks/useAuth';

interface LoginPageProps {
  onLogin: (role: UserRole, name?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<UserRole>('viewer');
  const [name, setName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    setError('');

    if (role === 'viewer') {
      onLogin('viewer', name);
      return;
    }

    const password = adminPassword.trim();
    if (!password) {
      setError('Password admin wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/.netlify/functions/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dashboard-password': password,
        },
        body: JSON.stringify({ action: 'authAdmin' }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || !body.success) {
        setError(body.message || 'Password admin tidak valid.');
        return;
      }
      sessionStorage.setItem('sertifik3_admin_password', password);
      onLogin('admin', name);
    } catch {
      setError('Tidak dapat memvalidasi password admin. Periksa koneksi atau Netlify Function.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF4EF] via-white to-[#F7EFE0] flex items-center justify-center p-4">
      <div className="w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] bg-white rounded-[28px] shadow-[0_24px_80px_rgba(44,53,49,0.14)] overflow-hidden border border-[#E0E8E3]">
        <div className="p-8 lg:p-10 bg-[#2F5B47] text-white relative overflow-hidden">
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute right-8 bottom-8 w-32 h-32 rounded-full bg-[#D9A443]/20" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D9A443] to-[#E9C972] flex items-center justify-center mb-6">
              <TreePalm className="w-7 h-7 text-white" />
            </div>
            <p className="text-[12px] uppercase tracking-[0.24em] text-white/70 mb-2">SERTIFIK3 TAP</p>
            <h1 className="text-[30px] lg:text-[36px] font-bold leading-tight">Operations Dashboard Sertifikasi K3</h1>
            <p className="text-[14px] text-white/75 mt-4 max-w-[420px]">
              Pantau compliance, sertifikat expired, gap sertifikasi, dan export laporan sesuai PT dalam satu dashboard operasional.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <BarChart3 className="w-5 h-5 mb-3 text-[#E9C972]" />
                <div className="text-[12px] font-semibold">Melihat dashboard</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <Filter className="w-5 h-5 mb-3 text-[#E9C972]" />
                <div className="text-[12px] font-semibold">Filter data</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <Download className="w-5 h-5 mb-3 text-[#E9C972]" />
                <div className="text-[12px] font-semibold">Export laporan</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <div className="mb-7">
            <h2 className="text-[22px] font-bold text-[#2C3531]">Masuk Dashboard</h2>
            <p className="text-[13px] text-[#7B877F] mt-1">Pilih mode akses sesuai kebutuhan penggunaan.</p>
          </div>

          <label className="block text-[12px] font-semibold text-[#566A7F] mb-2">Nama pengguna</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Admin Sertifikasi / Viewer SHE"
            className="w-full h-11 rounded-xl border border-[#DDE8E1] px-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#3D6B56]/20 focus:border-[#3D6B56] mb-5"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('viewer')}
              className={`text-left rounded-2xl border p-4 transition-all ${role === 'viewer' ? 'border-[#3D6B56] bg-[#3D6B56]/7 shadow-sm' : 'border-[#E0E8E3] hover:bg-[#F5F8F6]'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#5B8BA0]/12 flex items-center justify-center mb-3"><Eye className="w-5 h-5 text-[#5B8BA0]" /></div>
              <div className="font-semibold text-[#2C3531] text-[14px]">Viewer</div>
              <p className="text-[11px] text-[#7B877F] mt-1">Dashboard, laporan, filter, dan export.</p>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`text-left rounded-2xl border p-4 transition-all ${role === 'admin' ? 'border-[#3D6B56] bg-[#3D6B56]/7 shadow-sm' : 'border-[#E0E8E3] hover:bg-[#F5F8F6]'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#3D6B56]/12 flex items-center justify-center mb-3"><Shield className="w-5 h-5 text-[#3D6B56]" /></div>
              <div className="font-semibold text-[#2C3531] text-[14px]">Admin</div>
              <p className="text-[11px] text-[#7B877F] mt-1">Akses penuh termasuk tambah, edit, import.</p>
            </button>
          </div>

          {role === 'admin' && (
            <div className="mb-5">
              <label className="block text-[12px] font-semibold text-[#566A7F] mb-2">Password admin</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleLogin(); }}
                placeholder="Masukkan password admin"
                className="w-full h-11 rounded-xl border border-[#DDE8E1] px-4 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#3D6B56]/20 focus:border-[#3D6B56]"
              />
              <p className="text-[11px] text-[#8A938B] mt-2">Password ini memakai Environment Variable Netlify: DASHBOARD_ADMIN_PASSWORD.</p>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-[#F0C9C1] bg-[#FFF4F2] px-4 py-3 text-[12px] text-[#B94A3E]">
              {error}
            </div>
          )}

          <button
            onClick={() => void handleLogin()}
            disabled={submitting}
            className="w-full h-11 rounded-xl bg-[#3D6B56] hover:bg-[#2f5a48] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <LockKeyhole className="w-4 h-4" />
            {submitting ? 'Memvalidasi...' : `Masuk sebagai ${role === 'admin' ? 'Admin' : 'Viewer'}`}
          </button>
          <p className="text-[11px] text-[#8A938B] mt-4 leading-relaxed">
            Catatan: Viewer hanya dapat melihat dashboard, laporan, filter, dan export. Admin wajib login dengan password untuk tambah, edit, import, dan hapus data.
          </p>
        </div>
      </div>
    </div>
  );
}
