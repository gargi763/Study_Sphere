import { Search, Sun } from 'lucide-react';
import { student, notifications } from '../../data/studentData';
import NotificationCenter from './NotificationCenter';

interface TopBarProps {
  onSectionChange: (section: string) => void;
}

export default function TopBar({ onSectionChange }: TopBarProps) {
  const unread = notifications.filter(n => !n.read).length;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="glass-dark border-b border-white/8 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-0.5"><Sun size={14} className="text-yellow-400" /><p className="text-blue-300/50 text-xs">{greeting},</p></div>
        <h2 className="text-white font-semibold text-base leading-tight">{student.name}</h2>
      </div>
      <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2 border border-white/8 w-64 group focus-within:border-blue-500/40 transition-all">
        <Search size={14} className="text-blue-300/40 shrink-0 group-focus-within:text-blue-400 transition-colors" />
        <input type="text" placeholder="Search anything..." className="bg-transparent text-white text-sm placeholder-blue-300/30 outline-none w-full" />
      </div>
      <NotificationCenter />
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:scale-105 transition-transform">{student.avatar}</div>
    </header>
  );
}
