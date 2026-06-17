import React from 'react';
import { Search, GraduationCap, BookOpen, Shield } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import NotificationCenter from './NotificationCenter';
import ThemeToggle from '../ThemeToggle';
import { UserRole } from '../../types/database';

interface TopBarProps {
  sidebarCollapsed: boolean;
  onProfileClick: () => void;
}

const ROLE_BADGES: Record<UserRole, { label: string; icon: React.ElementType; color: string }> = {
  student: { label: 'Student', icon: GraduationCap, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  faculty: { label: 'Faculty', icon: BookOpen, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  admin: { label: 'Admin', icon: Shield, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
};

export default function TopBar({ sidebarCollapsed, onProfileClick }: TopBarProps) {
  const { user, profile, role } = useAuthContext();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  const badge = ROLE_BADGES[role ?? 'student'];
  const BadgeIcon = badge.icon;

  const initials = (profile?.full_name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const avatarGradient = role === 'faculty' ? 'from-emerald-500 to-teal-500' : role === 'admin' ? 'from-orange-500 to-amber-500' : 'from-blue-500 to-cyan-500';

  return (
    <header
      className={`fixed top-0 right-0 h-16 glass border-b border-white/10 flex items-center justify-between px-6 z-30 transition-all duration-300 ${sidebarCollapsed ? 'left-16' : 'left-60'}`}
    >
      {/* Greeting */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm font-semibold text-white leading-none">{greeting}, {firstName}!</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <BadgeIcon size={11} className={badge.color.split(' ')[0]} />
            <span className="text-xs text-slate-400">{badge.label} Portal</span>
          </div>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-52">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
          />
        </div>

        {/* Role badge */}
        <span className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
          <BadgeIcon size={11} />
          {badge.label}
        </span>

        <NotificationCenter />
        <ThemeToggle />

        {/* Avatar */}
        <button
          onClick={onProfileClick}
          className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition-all shadow-md`}
          title="My Profile"
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
