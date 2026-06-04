import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';

type Page = 'landing' | 'login' | 'dashboard';

function AppContent() {
  const [page, setPage] = useState<Page>('landing');
  const { user, loading } = useAuthContext();
  const navigate = (target: Page) => setPage(target);

  useEffect(() => {
    if (!loading && user && page !== 'dashboard') setPage('dashboard');
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <p className="text-slate-600 dark:text-blue-200/50 text-sm animate-pulse-subtle">Loading StudySphere...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {page === 'login' && <LoginPage onNavigate={navigate} />}
      {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
    </>
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
