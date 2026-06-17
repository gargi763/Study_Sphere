import React from 'react';
import {
  Users, BookOpen, GraduationCap, Shield, Server,
  AlertTriangle, CheckCircle, Activity, BarChart3, Database, Globe
} from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';

const PLATFORM_STATS = [
  { label: 'Total Students', value: '12,847', change: '+234 this month', icon: GraduationCap, color: 'from-blue-500 to-cyan-500' },
  { label: 'Faculty Members', value: '384', change: '+12 this month', icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
  { label: 'Active Courses', value: '1,203', change: '+45 this semester', icon: BarChart3, color: 'from-violet-500 to-purple-500' },
  { label: 'System Uptime', value: '99.9%', change: 'Last 30 days', icon: Server, color: 'from-orange-500 to-amber-500' },
];

const DEPARTMENTS = [
  { name: 'Computer Science', students: 2840, faculty: 68, courses: 124, health: 96 },
  { name: 'Engineering', students: 3210, faculty: 82, courses: 156, health: 94 },
  { name: 'Business Admin', students: 2104, faculty: 54, courses: 98, health: 91 },
  { name: 'Life Sciences', students: 1890, faculty: 61, courses: 112, health: 88 },
  { name: 'Mathematics', students: 1203, faculty: 39, courses: 76, health: 97 },
];

const RECENT_ACTIVITY = [
  { action: 'New faculty member registered', user: 'Dr. Amara Nwosu', time: '2m ago', status: 'info' },
  { action: 'Attendance below threshold detected', user: 'CS-302 section B', time: '15m ago', status: 'warning' },
  { action: 'Database backup completed', user: 'Auto-scheduled', time: '1h ago', status: 'success' },
  { action: 'Student account suspended', user: 'Pending review', time: '2h ago', status: 'warning' },
  { action: 'Platform update deployed', user: 'v2.4.1', time: '4h ago', status: 'success' },
];

const SYSTEM_HEALTH = [
  { label: 'API Response Time', value: 124, max: 500, unit: 'ms', status: 'good' },
  { label: 'Database Load', value: 38, max: 100, unit: '%', status: 'good' },
  { label: 'Storage Used', value: 67, max: 100, unit: '%', status: 'warning' },
  { label: 'Active Sessions', value: 1847, max: 5000, unit: '', status: 'good' },
];

export default function AdminOverview() {
  const { profile } = useAuthContext();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Admin';

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="glass rounded-2xl p-6 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-amber-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, {firstName}. Platform is running smoothly.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">All Systems Operational</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORM_STATS.map((s) => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-5 border border-white/10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <SIcon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              <p className="text-xs text-emerald-400 mt-1">{s.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Departments Overview</h2>
          <div className="space-y-3">
            {DEPARTMENTS.map(dept => (
              <div key={dept.name} className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{dept.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${dept.health >= 95 ? 'text-emerald-400 bg-emerald-500/10' : dept.health >= 90 ? 'text-blue-400 bg-blue-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                    {dept.health}% health
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><GraduationCap size={11} /> {dept.students.toLocaleString()} students</span>
                  <span className="flex items-center gap-1"><BookOpen size={11} /> {dept.faculty} faculty</span>
                  <span className="flex items-center gap-1"><BarChart3 size={11} /> {dept.courses} courses</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full transition-all ${dept.health >= 95 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : dept.health >= 90 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                    style={{ width: `${dept.health}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System health */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">System Health</h2>
            <Activity size={16} className="text-emerald-400" />
          </div>
          <div className="space-y-4">
            {SYSTEM_HEALTH.map(metric => {
              const pct = Math.round((metric.value / metric.max) * 100);
              const barColor = metric.status === 'warning' ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-teal-500';
              return (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-300">{metric.label}</span>
                    <span className="text-sm font-semibold text-white">
                      {metric.value.toLocaleString()}{metric.unit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: 'System Logs', icon: Database, color: 'from-blue-500 to-cyan-500' },
              { label: 'User Management', icon: Users, color: 'from-violet-500 to-purple-500' },
              { label: 'Security Alerts', icon: AlertTriangle, color: 'from-red-500 to-rose-500' },
              { label: 'Audit Trail', icon: Globe, color: 'from-orange-500 to-amber-500' },
            ].map(action => {
              const AIcon = action.icon;
              return (
                <button key={action.label} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                    <AIcon size={13} className="text-white" />
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {RECENT_ACTIVITY.map((act, i) => {
            const StatusIcon = act.status === 'success' ? CheckCircle : act.status === 'warning' ? AlertTriangle : Activity;
            const statusColor = act.status === 'success' ? 'text-emerald-400' : act.status === 'warning' ? 'text-amber-400' : 'text-blue-400';
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                <StatusIcon size={16} className={`${statusColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{act.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{act.user}</p>
                </div>
                <span className="text-xs text-slate-500 flex-shrink-0">{act.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
