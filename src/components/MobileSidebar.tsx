import { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Award,
  BarChart3,
  Download,
  Upload,
  UserCog,
  X,
  TreePalm,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PageType } from '@/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MobileSidebarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
  complianceRate: number;
  sudahSertifikasi: number;
  totalRecords: number;
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  hasPermission?: (action: string) => boolean;
}

interface MenuItem {
  id: PageType;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
  permission?: string;
}

const menuGroups = [
  {
    label: 'MENU UTAMA',
    items: [
      { id: 'dashboard' as PageType, label: 'Dashboard', icon: LayoutDashboard },
      { id: 'peserta' as PageType, label: 'Data Peserta', icon: Users, permission: 'view_participants' },
      { id: 'sertifikasi' as PageType, label: 'Daftar Sertifikasi', icon: Award, permission: 'view_reports' },
    ],
  },
  {
    label: 'LAPORAN',
    items: [
      { id: 'statistik' as PageType, label: 'Statistik', icon: BarChart3, permission: 'view_reports' },
      { id: 'export' as PageType, label: 'Export Data', icon: Download, permission: 'export_reports' },
    ],
  },
  {
    label: 'SISTEM',
    items: [
      { id: 'import' as PageType, label: 'Import Data', icon: Upload, adminOnly: true, permission: 'upload_excel' },
      { id: 'users' as PageType, label: 'User & Role', icon: UserCog, adminOnly: true, permission: 'manage_users' },
    ],
  },
];

export function MobileSidebar({
  activePage,
  onPageChange,
  complianceRate,
  sudahSertifikasi,
  totalRecords,
  isOpen,
  onClose,
  isAdmin,
  hasPermission,
}: MobileSidebarProps) {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <aside className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="h-[72px] flex items-center justify-between px-5 border-b border-[#E0E8E3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center flex-shrink-0">
              <TreePalm className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#2C3531] truncate">Dashboard Monitoring</div>
              <div className="text-[10px] text-[#8A938B] truncate">Sertifikasi K3 · Triputra</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A938B] hover:bg-[#F0F4F1] hover:text-[#2C3531] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <div className="px-3 mb-2 text-[10px] font-semibold text-[#8A938B] uppercase tracking-wider">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.items
                  .filter((item) => (!(item as MenuItem).adminOnly || isAdmin) && (!(item as MenuItem).permission || !hasPermission || hasPermission((item as MenuItem).permission!)))
                  .map((item) => {
                    const isActive = activePage === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onPageChange(item.id);
                          onClose();
                        }}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200',
                          isActive
                            ? 'bg-[#3D6B56]/10 text-[#3D6B56] border-l-[3px] border-[#3D6B56]'
                            : 'text-[#566A7F] hover:bg-[#F0F4F1] hover:text-[#2C3531] border-l-[3px] border-transparent'
                        )}
                      >
                        <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', isActive ? 'text-[#3D6B56]' : 'text-[#8A938B]')} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        {/* Compliance Meter */}
        <div className="px-5 py-4 border-t border-[#E0E8E3]">
          <div className="text-[10px] font-semibold text-[#8A938B] uppercase tracking-wider mb-3">
            Compliance Rate
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="#E0E8E3" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26" fill="none" stroke="#4A7C59" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - complianceRate / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold text-[#2C3531]">{complianceRate}%</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#8A938B]">{sudahSertifikasi} dari {totalRecords}</div>
              <div className="text-[10px] text-[#8A938B]">sudah tercapai</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
