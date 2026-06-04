import { Search, Sun } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/useData';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from '../ThemeToggle';

interface TopBarProps {
  onSectionChange: (section: string) => void;
}

export default function TopBar({ onSectionChange: _onSectionChange }: TopBarProps) {
  const { user, profile } = useAuthContext();
  const { unreadCount } = useNotifications(user?.id ?? null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="glass-dark border-b transition-theme border-slate-200/20 dark:border-white/8 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5"><Sun size={14} className="text-yellow-400" /><p className="text-slate-500 dark:text-blue-300/50 text-xs transition-colors">{greeting},</p></div>
        <h2 className="text-slate-900 dark:text-white font-semibold text-base leading-tight transition-colors">{profile?.name || 'Student'}</h2>
      </div>
      <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2 border transition-theme border-slate-300/20 dark:border-white/8 w-64 group focus-within:border-blue-500/40 transition-all">
        <Search size={14} className="text-slate-400 dark:text-blue-300/40 shrink-0 group-focus-within:text-slate-600 dark:group-focus-within:text-blue-400 transition-colors" />
        <input type="text" placeholder="Search anything..." className="bg-transparent text-slate-900 dark:text-white text-sm placeholder-slate-400 dark:placeholder-blue-300/30 outline-none w-full transition-colors" />
      </div>
      <NotificationCenter unreadCount={unreadCount} />
      <ThemeToggle />
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform">{profile?.avatar || '??'}</div>
    </header>
  );
}
