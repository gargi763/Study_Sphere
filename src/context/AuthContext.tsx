import { createContext, useContext, ReactNode } from 'react';
import { useAuth, useStudentProfile } from '../hooks/useData';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signUp: (email: string, password: string, metadata: Record<string, string>) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useStudentProfile(user?.id ?? null);

  const loading = authLoading || profileLoading;

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}
