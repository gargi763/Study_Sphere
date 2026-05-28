import { BookOpen, LayoutDashboard, Calendar, Bell, Wallet, BarChart2, ClipboardList, Settings, LogOut, ChevronLeft, ChevronRight, GraduationCap, FileText, CreditCard, Brain } from 'lucide-react';
import { student } from '../../data/studentData';

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
  { id: 'ai-recommendations', icon: Brain, label: 'AI Insights' },
  { id: 'attendance-mgmt', icon: GraduationCap, label: 'Attendance Mgmt' },
  { id: 'assignment-mgmt', icon: FileText, label: 'Assignments Mgmt' },
  { id: 'expense-mgmt', icon: CreditCard, label: 'Expense Mgmt' },
  { id: 'attendance', icon: GraduationCap, label: 'Attendance' },
  { id: 'assignments', icon: ClipboardList, label: 'Assignments' },
  { id: 'planner', icon: Calendar, label: 'Study Planner' },
  { id: 'expenses', icon: Wallet, label: 'Expenses' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
];

export default function Sidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse, onNavigate, unreadCount }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 glass-dark border-r border-white/8 shadow-2xl shadow-black/40 ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/8 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 glow-blue"><BookOpen size={15} className="text-white" /></div>
        {!collapsed && <span className="text-white font-semibold text-base tracking-tight">StudySphere</span>}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = activeSection === item.id;
          return (
            <button key={item.id} onClick={() => onSectionChange(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive ? 'nav-active text-blue-300' : 'text-blue-200/40 hover:text-blue-200/80 hover:bg-white/5'} ${collapsed ? 'justify-center' : ''}`} title={collapsed ? item.label : undefined}>
              <item.icon size={18} className={`shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-current'}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {item.id === 'notifications' && unreadCount > 0 && (<span className={`bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ${collapsed ? 'absolute -top-1 -right-1 w-4 h-4 text-[10px]' : 'ml-auto w-5 h-5'}`}>{unreadCount}</span>)}
              {isActive && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-400 rounded-full" />}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 py-3 border-t border-white/8">
          <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">{student.avatar}</div>
            <div className="flex-1 min-w-0"><p className="text-white text-xs font-medium truncate">{student.name}</p><p className="text-blue-300/40 text-[10px] truncate">{student.major}</p></div>
          </div>
        </div>
      )}

      <div className={`px-2 py-3 border-t border-white/8 flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'}`}>
        {collapsed ? (<button className="text-blue-300/40 hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/5"><Settings size={16} /></button>) : (<button className="flex items-center gap-2 text-blue-300/40 hover:text-blue-200 transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5 text-xs"><Settings size={14} />Settings</button>)}
        <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-blue-300/40 hover:text-red-400 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/10 text-xs" title="Sign Out"><LogOut size={collapsed ? 16 : 14} />{!collapsed && 'Sign Out'}</button>
      </div>

      <button onClick={onToggleCollapse} className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full glass-dark border border-white/20 flex items-center justify-center text-blue-300/60 hover:text-white transition-all hover:scale-110">{collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}</button>
    </aside>
  );
}
