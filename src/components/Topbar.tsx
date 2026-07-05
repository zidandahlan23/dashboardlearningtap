import { useState } from 'react';
import { Search, Bell, ChevronDown, Moon, Sun, Menu, LogOut, Shield, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { CertificationRecord } from '@/types';

interface TopbarProps {
  title: string;
  subtitle: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  expiringRecords: CertificationRecord[];
  isDark: boolean;
  onToggleDark: () => void;
  onOpenSidebar: () => void;
  lastSynced?: Date | null;
}

export function Topbar({ title, subtitle, searchValue, onSearchChange, expiringRecords, isDark, onToggleDark, onOpenSidebar, lastSynced }: TopbarProps) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadCount = expiringRecords.filter(r => r.computed_status === 'EXPIRING_SOON').length;

  return (
    <header className="h-auto min-h-[72px] bg-white/80 backdrop-blur-sm border-b border-[#E0E8E3] sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6 py-3 lg:py-0">
      {/* Left - Hamburger (mobile) + Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden w-10 h-10 rounded-lg border border-[#E0E8E3] flex items-center justify-center hover:bg-[#F0F4F1] transition-colors flex-shrink-0"
        >
          <Menu className="w-5 h-5 text-[#566A7F]" />
        </button>

        <div className="min-w-0">
          <h1 className="text-[16px] lg:text-[18px] font-bold text-[#2C3531] truncate">{title}</h1>
          <p className="text-[11px] lg:text-[12px] text-[#8A938B] truncate hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A938B]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama, NIK..."
            className="w-[200px] lg:w-[280px] h-9 lg:h-10 pl-10 pr-4 rounded-lg border border-[#E0E8E3] bg-[#F0F4F1] text-[13px] text-[#2C3531] placeholder:text-[#8A938B] focus:outline-none focus:border-[#3D6B56] focus:ring-2 focus:ring-[#3D6B56]/20 transition-all"
          />
          <kbd className="hidden lg:block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#8A938B] bg-white px-1.5 py-0.5 rounded border border-[#E0E8E3]">
            Ctrl K
          </kbd>
        </div>

        <div className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F0F4F1] border border-[#E0E8E3]">
          <RefreshCw className="w-3.5 h-3.5 text-[#3D6B56]" />
          <div className="leading-tight">
            <div className="text-[9px] uppercase font-bold tracking-wider text-[#8A938B]">Last Sync</div>
            <div className="text-[11px] font-medium text-[#2C3531]">{lastSynced ? lastSynced.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}</div>
          </div>
        </div>

        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-lg border border-[#E0E8E3] flex items-center justify-center hover:bg-[#F0F4F1] transition-colors"
          >
            <Bell className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] text-[#566A7F]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-[#B84A3E] text-white text-[9px] lg:text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 w-[320px] lg:w-[360px] bg-white rounded-xl shadow-lg border border-[#E0E8E3] z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#E0E8E3] flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#2C3531]">Notifikasi</span>
                  <span className="text-[11px] text-[#8A938B]">{unreadCount} baru</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {expiringRecords.slice(0, 5).map((record) => {
                    const daysLeft = Math.ceil(
                      (new Date(record.tanggal_expired).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={record.id} className="px-4 py-3 hover:bg-[#F0F4F1] transition-colors border-b border-[#E0E8E3]/50">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#E09F3E] mt-1.5 flex-shrink-0" />
                          <div>
                            <p className="text-[12px] text-[#2C3531]">
                              <span className="font-medium">{record.nama}</span> - {record.sertifikasi}
                            </p>
                            <p className="text-[11px] text-[#8A938B] mt-0.5">
                              Akan expired dalam {daysLeft} hari
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {expiringRecords.length === 0 && (
                    <div className="px-4 py-8 text-center text-[12px] text-[#8A938B]">Tidak ada notifikasi baru</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDark}
          className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg border border-[#E0E8E3] flex items-center justify-center hover:bg-[#F0F4F1] transition-colors"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] text-[#D9A443]" />
          ) : (
            <Moon className="w-[16px] h-[16px] lg:w-[18px] lg:h-[18px] text-[#566A7F]" />
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-[#E0E8E3]"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] lg:text-[12px] font-bold text-white">{user?.avatar || 'DU'}</span>
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-[12px] font-medium text-[#2C3531]">{user?.name || 'Demo User'}</div>
              <div className="flex items-center gap-1">
                {user?.role === 'admin' ? (
                  <Shield className="w-3 h-3 text-[#3D6B56]" />
                ) : (
                  <Eye className="w-3 h-3 text-[#5B8BA0]" />
                )}
                <span className={`text-[10px] font-medium uppercase ${user?.role === 'admin' ? 'text-[#3D6B56]' : 'text-[#5B8BA0]'}`}>
                  {user?.role}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#8A938B] hidden lg:block" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-12 w-[240px] bg-white rounded-xl shadow-lg border border-[#E0E8E3] z-50 overflow-hidden">
                <div className="px-4 py-4 border-b border-[#E0E8E3]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3D6B56] to-[#D9A443] flex items-center justify-center">
                      <span className="text-[13px] font-bold text-white">{user?.avatar}</span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#2C3531]">{user?.name}</div>
                      <div className="text-[11px] text-[#8A938B]">{user?.email}</div>
                      <span className={`inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${user?.role === 'admin' ? 'bg-[#3D6B56]/10 text-[#3D6B56]' : 'bg-[#5B8BA0]/10 text-[#5B8BA0]'}`}>
                        {user?.role === 'admin' ? <Shield className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                        {user?.role?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setShowProfile(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-[12px] text-[#B84A3E] hover:bg-[#B84A3E]/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
