import { BookOpen, LayoutDashboard, Calendar, Bell, Wallet, BarChart2, ClipboardList, Settings, LogOut, ChevronLeft, ChevronRight, GraduationCap, FileText, CreditCard, Brain } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: (page: 'landing' | 'login' | 'dashboard') => void;
  unreadCount: number;
}

const navItems = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
  { id: 'student-analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'ai-recommendations', icon: Brain, label: 'AI Insights' },
  { id: 'attendance-mgmt', icon: GraduationCap, label: 'Attendance Mgmt' },
  { id: 'assignment-mgmt', icon: FileText, label: 'Assignments Mgmt' },
  { id: 'expense-mgmt', icon: CreditCard, label: 'Expense Mgmt' },
  { id: 'attendance', icon: GraduationCap, label: 'Attendance' },
  { id: 'assignments', icon: ClipboardList, label: 'Assignments' },
  { id: 'planner', icon: Calendar, label: 'Study Planner' },
  { id: 'expenses', icon: Wallet, label: 'Expenses' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

export default function Sidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse, onNavigate, unreadCount }: SidebarProps) {
  const { profile, signOut } = useAuthContext();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('login');
    } catch {}
  };

  return (
    <aside className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 glass-dark border-r transition-theme border-slate-300/20 dark:border-white/8 shadow-lg ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className={`flex items-center gap-3 px-4 py-6 border-b transition-theme border-slate-300/20 dark:border-white/8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 glow-blue"><BookOpen size={16} className="text-white" /></div>
        {!collapsed && <span className="text-slate-900 dark:text-white font-bold text-base tracking-tight transition-colors">StudySphere</span>}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeSection === item.id;
          return (
            <button key={item.id} onClick={() => onSectionChange(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative smooth-hover ${isActive ? 'nav-active text-blue-300 dark:text-blue-300 bg-blue-50/20 dark:bg-white/10' : 'text-slate-600 dark:text-blue-200/40 hover:text-slate-900 dark:hover:text-blue-200/80 hover:bg-slate-100 dark:hover:bg-white/5'} ${collapsed ? 'justify-center' : ''}`} title={collapsed ? item.label : undefined}>
              <item.icon size={19} className={`shrink-0 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-current'}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {item.id === 'notifications' && unreadCount > 0 && (<span className={`bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ${collapsed ? 'absolute -top-1 -right-1 w-4 h-4 text-[10px]' : 'ml-auto w-5 h-5'}`}>{unreadCount}</span>)}
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 dark:bg-blue-400 rounded-full" />}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 py-4 border-t transition-theme border-slate-300/20 dark:border-white/8">
          <div className="glass rounded-lg px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{profile?.avatar || '??'}</div>
            <div className="flex-1 min-w-0"><p className="text-slate-900 dark:text-white text-sm font-medium transition-colors truncate">{profile?.name || 'Student'}</p><p className="text-slate-600 dark:text-blue-300/40 text-xs transition-colors truncate">{profile?.major || 'Undeclared'}</p></div>
          </div>
        </div>
      )}

      <div className={`px-2 py-4 border-t transition-theme border-slate-300/20 dark:border-white/8 flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'}`}>
        {collapsed ? (<button className="text-slate-600 dark:text-blue-300/40 hover:text-slate-900 dark:hover:text-blue-200 transition-colors p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 smooth-hover"><Settings size={18} /></button>) : (<button className="flex items-center gap-2 text-slate-600 dark:text-blue-300/40 hover:text-slate-900 dark:hover:text-blue-200 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-medium smooth-hover"><Settings size={16} />Settings</button>)}
        <button onClick={handleSignOut} className="flex items-center gap-2 text-slate-600 dark:text-blue-300/40 hover:text-red-600 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium smooth-hover" title="Sign Out"><LogOut size={collapsed ? 18 : 16} />{!collapsed && 'Sign Out'}</button>
      </div>

      <button onClick={onToggleCollapse} className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full glass-dark border transition-theme border-slate-300/30 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-blue-300/60 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110 smooth-hover">{collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}</button>
    </aside>
  );
}
