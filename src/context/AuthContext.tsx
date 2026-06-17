import React, { createContext, useContext, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { useAuth, useUserProfile, useStudentProfile } from '../hooks/useData';
import { UserProfile, UserRole } from '../types/database';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  studentProfile: any | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>;
  updateStudentProfile: (updates: Record<string, unknown>) => Promise<any>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, refetch: refetchProfile } = useUserProfile(user?.id);
  const { profile: studentProfile, updateProfile: updateStudentProfile } = useStudentProfile(user?.id);

  const loading = authLoading || (!!user && profileLoading);

  const value: AuthContextValue = {
    user,
    profile,
    studentProfile,
    role: profile?.role ?? null,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateStudentProfile,
    refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
