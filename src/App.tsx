import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileSidebar } from '@/components/MobileSidebar';
import { Topbar } from '@/components/Topbar';
import { ToastProvider, useToast } from '@/components/ToastProvider';
import { SkeletonKPI, SkeletonTable } from '@/components/Skeleton';
import { DashboardPage } from '@/pages/DashboardPage';
import { DataPesertaPage } from '@/pages/DataPesertaPage';
import { SertifikasiPage } from '@/pages/SertifikasiPage';
import { StatistikPage } from '@/pages/StatistikPage';
import { ExportPage } from '@/pages/ExportPage';
import { ImportPage } from '@/pages/ImportPage';
import { UsersPage } from '@/pages/UsersPage';
import { LoginPage } from '@/pages/LoginPage';
import { useCertificationData } from '@/hooks/useCertificationData';
import { useDarkMode } from '@/hooks/useDarkMode';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import type { PageType } from '@/types';
import './App.css';

const pageConfig: Record<PageType, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard Monitoring Sertifikasi K3',
    subtitle: 'Triputra Agro Persada · Monitoring sertifikasi keselamatan kerja seluruh region',
  },
  peserta: {
    title: 'Data Peserta',
    subtitle: 'Daftar karyawan unik & ringkasan sertifikasi yang dimiliki',
  },
  sertifikasi: {
    title: 'Daftar Sertifikasi',
    subtitle: 'Semua jenis sertifikasi K3 dan tingkat capaiannya',
  },
  statistik: {
    title: 'Statistik Mendalam',
    subtitle: 'Analisis tren & dimensi capaian sertifikasi',
  },
  export: {
    title: 'Export Data',
    subtitle: 'Export data sertifikasi ke berbagai format',
  },
  import: {
    title: 'Import Data',
    subtitle: 'Upload file Excel untuk import data',
  },
  users: {
    title: 'User & Role',
    subtitle: 'Manajemen pengguna dan hak akses',
  },
};

function AuthenticatedApp() {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { showToast } = useToast();

  const {
    records,
    filteredRecords,
    filters,
    kpi,
    chartData,
    certCompliance,
    insights,
    expiryWarnings,
    filterOptions,
    loading,
    updateFilters,
    resetFilters,
    updateRecord,
    deleteRecord,
    addRecord,
    importData,
    getRecordBudget,
    lastSynced,
  } = useCertificationData();

  // Auth
  const { user, hasPermission, isAuthenticated, login } = useAuth();
  const isAdmin = user?.role === 'admin';

  const handlePageChange = useCallback(
    (page: PageType) => {
      if (page === 'peserta' && !hasPermission('view_participants')) {
        showToast('Mode viewer dapat melihat dashboard, data peserta, laporan, filter, dan export laporan', 'warning');
        return;
      }
      if (page === 'users' && !hasPermission('manage_users')) {
        showToast('Anda tidak memiliki akses ke halaman ini', 'warning');
        return;
      }
      if (page === 'import' && !hasPermission('upload_excel')) {
        showToast('Anda tidak memiliki akses ke halaman ini', 'warning');
        return;
      }
      setActivePage(page);
    },
    [hasPermission, showToast]
  );

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      updateFilters({ search: value });
    },
    [updateFilters]
  );

  const handleCertClick = useCallback(
    (certName: string) => {
      updateFilters({ sertifikasi: certName });
      if (hasPermission('view_participants')) {
        setActivePage('peserta');
      } else {
        showToast('Filter sertifikasi diterapkan. Mode viewer dapat melihat data peserta tanpa mengubah data.', 'info');
        setActivePage('dashboard');
      }
    },
    [updateFilters, hasPermission, showToast]
  );

  const expiringRecords = records.filter((r) => r.computed_status === 'EXPIRING_SOON');
  const config = pageConfig[activePage];

  const breadcrumbs = [
    { label: 'Dashboard', page: 'dashboard' as PageType },
    { label: config.title, page: activePage },
  ];

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark bg-[#232333]' : 'bg-[#F0F4F1]'}`}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activePage={activePage}
          onPageChange={handlePageChange}
          complianceRate={kpi.complianceRate}
          sudahSertifikasi={kpi.sudahSertifikasi}
          totalRecords={kpi.totalRecords}
          isAdmin={isAdmin}
          hasPermission={hasPermission}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <MobileSidebar
        activePage={activePage}
        onPageChange={handlePageChange}
        complianceRate={kpi.complianceRate}
        sudahSertifikasi={kpi.sudahSertifikasi}
        totalRecords={kpi.totalRecords}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isAdmin={isAdmin}
        hasPermission={hasPermission}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:ml-[260px]">
        <Topbar
          title={config.title}
          subtitle={config.subtitle}
          searchValue={filters.search}
          onSearchChange={handleSearchChange}
          expiringRecords={expiringRecords}
          isDark={isDark}
          onToggleDark={toggleDark}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
          lastSynced={lastSynced}
        />

        {/* Breadcrumb */}
        <div className="px-4 lg:px-6 pt-3 lg:pt-4 pb-0">
          <nav className="flex items-center gap-2 text-[11px] lg:text-[12px] overflow-x-auto">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-2 flex-shrink-0">
                {idx > 0 && <span className="text-[#8A938B]">›</span>}
                <button
                  onClick={() => handlePageChange(crumb.page)}
                  className={`transition-colors whitespace-nowrap ${
                    idx === breadcrumbs.length - 1
                      ? 'text-[#3D6B56] font-medium'
                      : 'text-[#8A938B] hover:text-[#3D6B56]'
                  }`}
                >
                  {crumb.label}
                </button>
              </span>
            ))}
          </nav>
        </div>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {loading ? (
            <div className="space-y-6">
              <SkeletonKPI />
              <SkeletonTable />
            </div>
          ) : (
            <>
              {activePage === 'dashboard' && (
                <DashboardPage
                  kpi={kpi}
                  chartData={chartData}
                  expiryWarnings={expiryWarnings}
                  insights={insights}
                  filters={filters}
                  filterOptions={filterOptions}
                  onFilterChange={updateFilters}
                  onResetFilters={resetFilters}
                  records={records}
                  lastSynced={lastSynced}
                />
              )}
              {activePage === 'peserta' && (
                <DataPesertaPage
                  records={filteredRecords}
                  filterOptions={{
                    ...filterOptions,
                    sertifikasis: filterOptions.sertifikasis,
                  }}
                  onUpdateRecord={updateRecord}
                  onDeleteRecord={deleteRecord}
                  onAddRecord={addRecord}
                  filters={filters}
                  onFilterChange={updateFilters}
                  onResetFilters={resetFilters}
                  getRecordBudget={getRecordBudget}
                  canEdit={isAdmin}
                />
              )}
              {activePage === 'sertifikasi' && (
                <SertifikasiPage
                  certCompliance={certCompliance}
                  onCertClick={handleCertClick}
                />
              )}
              {activePage === 'statistik' && <StatistikPage chartData={chartData} />}
              {activePage === 'export' && (
                <ExportPage
                  records={filteredRecords.length > 0 ? filteredRecords : records}
                  allRecords={records}
                  filterOptions={filterOptions}
                />
              )}
              {activePage === 'import' && <ImportPage onImport={importData} />}
              {activePage === 'users' && <UsersPage />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AuthenticatedApp />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
