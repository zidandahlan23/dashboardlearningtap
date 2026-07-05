import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Award,
  BarChart3,
  Download,
  Upload,
  UserCog,
  ChevronLeft,
  ChevronRight,
  TreePalm,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { PageType } from '@/types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activePage: PageType;
  onPageChange: (page: PageType) => void;
  complianceRate: number;
  sudahSertifikasi: number;
  totalRecords: number;
  isAdmin: boolean;
}

interface MenuItem {
  id: PageType;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: 'MENU UTAMA',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'peserta', label: 'Data Peserta', icon: Users },
      { id: 'sertifikasi', label: 'Daftar Sertifikasi', icon: Award },
    ],
  },
  {
    label: 'LAPORAN',
    items: [
      { id: 'statistik', label: 'Statistik', icon: BarChart3 },
      { id: 'export', label: 'Export Data', icon: Download },
    ],
  },
  {
    label: 'SISTEM',
    items: [
      { id: 'import', label: 'Import Data', icon: Upload, adminOnly: true },
      { id: 'users', label: 'User & Role', icon: UserCog, adminOnly: true },
    ],
  },
];

export function Sidebar({ activePage, onPageChange, complianceRate, sudahSertifikasi, totalRecords, isAdmin }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-[#E0E8E3] z-50 flex flex-col transition-all duration-300',
        collapsed ? 'w-[80px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="h-[72px] flex items-center px-5 border-b border-[#E0E8E3]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center flex-shrink-0">
            <TreePalm className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#2C3531] truncate">
                Dashboard Monitoring
              </div>
              <div className="text-[10px] text-[#8A938B] truncate">
                Sertifikasi K3 · Triputra Agro Persada
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-semibold text-[#8A938B] uppercase tracking-wider">
                {group.label}
              </div>
            )}
            <div className="space-y-1">
              {group.items
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => {
                  const isActive = activePage === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 group',
                        isActive
                          ? 'bg-[#3D6B56]/10 text-[#3D6B56] border-l-[3px] border-[#3D6B56]'
                          : 'text-[#566A7F] hover:bg-[#F0F4F1] hover:text-[#2C3531] border-l-[3px] border-transparent'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-[18px] h-[18px] flex-shrink-0',
                          isActive ? 'text-[#3D6B56]' : 'text-[#8A938B] group-hover:text-[#2C3531]'
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </nav>

      {/* Compliance Meter */}
      {!collapsed && (
        <div className="px-5 py-4 border-t border-[#E0E8E3]">
          <div className="text-[10px] font-semibold text-[#8A938B] uppercase tracking-wider mb-3">
            Compliance Rate
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#E0E8E3"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="#4A7C59"
                  strokeWidth="6"
                  strokeLinecap="round"
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
              <div className="text-[11px] text-[#8A938B]">
                {sudahSertifikasi} dari {totalRecords}
              </div>
              <div className="text-[10px] text-[#8A938B]">sudah tercapai</div>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[84px] w-6 h-6 bg-white border border-[#E0E8E3] rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-[#8A938B]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#8A938B]" />
        )}
      </button>
    </aside>
  );
}
