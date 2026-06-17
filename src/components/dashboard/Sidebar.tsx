import React from 'react';
import {
  LayoutDashboard, BarChart3, Brain, CalendarCheck, ClipboardList, Wallet,
  Users, BookOpen, Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, GraduationCap, Shield, FileText, Activity, Database, UserCircle
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { UserRole } from '../../types/database';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  section?: string;
}

const STUDENT_NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'ai-insights', label: 'AI Insights', icon: Brain },
  { id: 'attendance-management', label: 'Attendance', icon: CalendarCheck },
  { id: 'assignment-management', label: 'Assignments', icon: ClipboardList },
  { id: 'expense-management', label: 'Expenses', icon: Wallet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'My Profile', icon: UserCircle },
];

const FACULTY_NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'my-courses', label: 'My Courses', icon: BookOpen },
  { id: 'students', label: 'Students', icon: GraduationCap },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'My Profile', icon: UserCircle },
];

const ADMIN_NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'departments', label: 'Departments', icon: Database },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: Activity },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'My Profile', icon: UserCircle },
];

const ROLE_CONFIG: Record<UserRole, {
  nav: NavItem[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
  label: string;
  icon: React.ElementType;
}> = {
  student: { nav: STUDENT_NAV, color: 'blue', gradientFrom: 'from-blue-500', gradientTo: 'to-cyan-500', label: 'Student', icon: GraduationCap },
  faculty: { nav: FACULTY_NAV, color: 'emerald', gradientFrom: 'from-emerald-500', gradientTo: 'to-teal-500', label: 'Faculty', icon: BookOpen },
  admin: { nav: ADMIN_NAV, color: 'orange', gradientFrom: 'from-orange-500', gradientTo: 'to-amber-500', label: 'Admin', icon: Shield },
};

export default function Sidebar({ activeSection, onSectionChange, collapsed, onToggle }: SidebarProps) {
  const { profile, role, signOut } = useAuthContext();

  const config = ROLE_CONFIG[role ?? 'student'];
  const RoleIcon = config.icon;

  const initials = (profile?.full_name || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside
      className={`fixed left-0 top-0 h-full glass border-r border-white/10 flex flex-col z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
    >
      {/* Logo / brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center flex-shrink-0 shadow-md`}>
          <RoleIcon size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-white font-bold text-sm leading-none">StudySphere</p>
            <p className="text-xs text-slate-400 mt-0.5">{config.label} Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="space-y-1 px-2">
          {config.nav.map(item => {
            const NavIcon = item.icon;
            const active = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                    active
                      ? `bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} text-white shadow-md`
                      : 'text-slate-400 hover:text-white hover:bg-white/8'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <NavIcon size={17} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User profile + actions */}
      <div className="border-t border-white/10 p-3 space-y-1">
        {/* Settings */}
        <button
          title={collapsed ? 'Settings' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/8 transition-all text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <Settings size={17} />
          {!collapsed && <span className="font-medium">Settings</span>}
        </button>

        {/* Sign out */}
        <button
          onClick={signOut}
          title={collapsed ? 'Sign Out' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={17} />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>

        {/* Profile card */}
        {!collapsed && (
          <div className="flex items-center gap-3 p-3 mt-1 rounded-xl bg-white/5 border border-white/8">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.email || ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-all z-50 shadow-md"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
