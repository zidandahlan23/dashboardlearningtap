import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, name?: string) => boolean;
  logout: () => void;
  hasPermission: (action: string) => boolean;
}

const PERMISSIONS: Record<string, UserRole[]> = {
  view_dashboard: ['admin', 'viewer'],
  view_reports: ['admin', 'viewer'],
  filter_data: ['admin', 'viewer'],
  export_reports: ['admin', 'viewer'],
  view_participants: ['admin', 'viewer'],
  add_data: ['admin'],
  edit_data: ['admin'],
  delete_data: ['admin'],
  upload_excel: ['admin'],
  bulk_import: ['admin'],
  manage_users: ['admin'],
  manage_master_data: ['admin'],
  manage_notifications: ['admin'],
};

const ROLE_STORAGE_KEY = 'sertifik3_current_user';

function createUser(role: UserRole, name?: string): User {
  if (role === 'admin') {
    return {
      id: 'sertifik3-admin',
      name: name?.trim() || 'Admin Sertifikasi',
      email: 'admin-dashboard',
      role: 'admin',
      avatar: 'AS',
    };
  }
  return {
    id: 'sertifik3-viewer',
    name: name?.trim() || 'Viewer Laporan',
    email: 'viewer-dashboard',
    role: 'viewer',
    avatar: 'VW',
  };
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROLE_STORAGE_KEY);
      if (saved) setUser(JSON.parse(saved) as User);
    } catch {
      localStorage.removeItem(ROLE_STORAGE_KEY);
    }
  }, []);

  const login = useCallback((role: UserRole, name?: string) => {
    const nextUser = createUser(role, name);
    setUser(nextUser);
    localStorage.setItem(ROLE_STORAGE_KEY, JSON.stringify(nextUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(ROLE_STORAGE_KEY);
    sessionStorage.removeItem('sertifik3_view_password');
    sessionStorage.removeItem('sertifik3_admin_password');
  }, []);

  const hasPermission = useCallback((action: string) => {
    if (!user) return false;
    const allowedRoles = PERMISSIONS[action] || [];
    return allowedRoles.includes(user.role);
  }, [user]);

  const value = useMemo<AuthState>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login,
    logout,
    hasPermission,
  }), [user, login, logout, hasPermission]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
