import { createContext, useContext, useCallback, type ReactNode } from 'react';

export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthState {
  user: User;
  isAuthenticated: boolean;
  login: (_email: string, _password: string) => boolean;
  logout: () => void;
  hasPermission: (action: string) => boolean;
}

const PERMISSIONS: Record<string, UserRole[]> = {
  view_dashboard: ['admin', 'viewer'],
  view_reports: ['admin', 'viewer'],
  filter_data: ['admin', 'viewer'],
  export_reports: ['admin', 'viewer'],
  add_data: ['admin'],
  edit_data: ['admin'],
  delete_data: ['admin'],
  upload_excel: ['admin'],
  bulk_import: ['admin'],
  manage_users: ['admin'],
  manage_master_data: ['admin'],
  manage_notifications: ['admin'],
};

const SYSTEM_USER: User = {
  id: 'sertifik3-admin',
  name: 'Admin Sertifikasi',
  email: 'internal-dashboard',
  role: 'admin',
  avatar: 'AS',
};

const AuthContext = createContext<AuthState | null>(null);

/**
 * Akses baca/tulis sebenarnya dikontrol server-side oleh Netlify Function.
 * Context ini hanya menjaga kompatibilitas UI lama tanpa password client-side.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const login = useCallback(() => true, []);
  const logout = useCallback(() => undefined, []);
  const hasPermission = useCallback((action: string) => {
    const allowedRoles = PERMISSIONS[action] || [];
    return allowedRoles.includes(SYSTEM_USER.role);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: SYSTEM_USER,
        isAuthenticated: true,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
