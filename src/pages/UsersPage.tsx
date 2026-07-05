import { UserCog, Shield, Eye, CheckCircle, Minus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Permission {
  action: string;
  label: string;
  admin: boolean;
  viewer: boolean;
}

const permissions: Permission[] = [
  { action: 'view_dashboard', label: 'Melihat dashboard', admin: true, viewer: true },
  { action: 'view_reports', label: 'Melihat laporan', admin: true, viewer: true },
  { action: 'filter_data', label: 'Filter data', admin: true, viewer: true },
  { action: 'export_reports', label: 'Export laporan', admin: true, viewer: true },
  { action: 'add_data', label: 'Tambah data manual', admin: true, viewer: false },
  { action: 'edit_data', label: 'Edit data', admin: true, viewer: false },
  { action: 'delete_data', label: 'Hapus data', admin: true, viewer: false },
  { action: 'upload_excel', label: 'Upload Excel', admin: true, viewer: false },
  { action: 'bulk_import', label: 'Bulk Import', admin: true, viewer: false },
  { action: 'manage_users', label: 'Kelola user', admin: true, viewer: false },
  { action: 'manage_master_data', label: 'Kelola master data', admin: true, viewer: false },
  { action: 'manage_notifications', label: 'Kelola notifikasi', admin: true, viewer: false },
];

export function UsersPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#3D6B56]/10 flex items-center justify-center">
          <UserCog className="w-5 h-5 text-[#3D6B56]" />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-[#2C3531]">User &amp; Role</h2>
          <p className="text-[12px] text-[#8A938B]">Manajemen pengguna dan hak akses</p>
        </div>
      </div>


      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <h3 className="font-semibold mb-2">Manajemen Pengguna</h3>
        <p className="text-sm text-gray-500">
          Halaman ini telah disiapkan untuk daftar akun, tambah user, tambah role,
          dan pengaturan hak akses. Integrasi database (Supabase) direkomendasikan
          agar data user tersimpan permanen.
        </p>
      </div>

      {/* Current User Card */}
      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center">
            <span className="text-[18px] font-bold text-white">{user?.avatar}</span>
          </div>
          <div>
            <div className="text-[16px] font-semibold text-[#2C3531]">{user?.name}</div>
            <div className="text-[13px] text-[#8A938B]">{user?.email}</div>
            <div className="flex items-center gap-2 mt-1.5">
              {user?.role === 'admin' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#3D6B56]/10 text-[#3D6B56]">
                  <Shield className="w-3 h-3" /> ADMIN
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#5B8BA0]/10 text-[#5B8BA0]">
                  <Eye className="w-3 h-3" /> VIEWER
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Role Permission Matrix */}
      <div className="bg-white rounded-xl shadow-[0px_4px_24px_rgba(60,107,86,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E0E8E3] flex items-center justify-between">
          <h3 className="text-[14px] font-semibold text-[#2C3531]">Matriks Hak Akses</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F0F4F1]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8A938B] uppercase w-[50%]">Aksi</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-[#8A938B] uppercase w-[25%]">
                  <div className="flex items-center justify-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#3D6B56]" /> ADMIN
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-[#8A938B] uppercase w-[25%]">
                  <div className="flex items-center justify-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#5B8BA0]" /> VIEWER
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, idx) => (
                <tr key={idx} className="border-b border-[#E0E8E3]/50 hover:bg-[#F0F4F1]/30 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-[#2C3531]">{perm.label}</td>
                  <td className="px-4 py-3 text-center">
                    {perm.admin ? (
                      <CheckCircle className="w-5 h-5 text-[#4A7C59] mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-[#D0D5D2] mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.viewer ? (
                      <CheckCircle className="w-5 h-5 text-[#4A7C59] mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-[#D0D5D2] mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo Login Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] border border-[#3D6B56]/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#3D6B56]/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#3D6B56]" />
            </div>
            <span className="text-[14px] font-semibold text-[#2C3531]">Admin</span>
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[#8A938B]">Email</span>
              <span className="text-[#2C3531] font-medium">admin@triputra.co.id</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A938B]">Password</span>
              <span className="text-[#2C3531] font-medium">admin123</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#8A938B]">
            Memiliki akses penuh: CRUD data, import/export, kelola user
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_24px_rgba(60,107,86,0.06)] border border-[#5B8BA0]/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#5B8BA0]/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-[#5B8BA0]" />
            </div>
            <span className="text-[14px] font-semibold text-[#2C3531]">Viewer</span>
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex items-center justify-between">
              <span className="text-[#8A938B]">Email</span>
              <span className="text-[#2C3531] font-medium">viewer@triputra.co.id</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A938B]">Password</span>
              <span className="text-[#2C3531] font-medium">viewer123</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#8A938B]">
            Akses terbatas: hanya melihat dashboard, filter, dan export
          </div>
        </div>
      </div>
    </div>
  );
}
