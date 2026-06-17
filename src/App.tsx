import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

type Page = 'landing' | 'login' | 'dashboard';

function AppContent() {
  const { user, loading } = useAuthContext();
  const [page, setPage] = useState<Page>('landing');

  useEffect(() => {
    if (!loading) {
      if (user) {
        setPage('dashboard');
      } else if (page === 'dashboard') {
        setPage('landing');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg animate-pulse">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-slate-400 text-sm">Loading StudySphere...</p>
        </div>
      </div>
    );
  }

  if (user) return <Dashboard />;

  if (page === 'login') {
    return <LoginPage onBack={() => setPage('landing')} />;
  }

  return (
    <LandingPage
      onGetStarted={() => setPage('login')}
      onLogin={() => setPage('login')}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
