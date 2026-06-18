import { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { ThemeProvider } from './context/ThemeContext';

type Page = 'landing' | 'login' | 'dashboard';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const navigate = (target: Page) => setPage(target);

  return (
    <ThemeProvider>
      <>
        {page === 'landing' && <LandingPage onNavigate={navigate} />}
        {page === 'login' && <LoginPage onNavigate={navigate} />}
        {page === 'dashboard' && <Dashboard onNavigate={navigate} />}
      </>
    </ThemeProvider>
  );
}
