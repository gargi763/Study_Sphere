import AttendanceCard from './AttendanceCard';
import AssignmentsCard from './AssignmentsCard';
import NotificationsCard from './NotificationsCard';
import ExpenseCard from './ExpenseCard';
import StudyPlanner from './StudyPlanner';
import AnalyticsCard from './AnalyticsCard';
import { student, productivityData, attendanceData, assignments } from '../../data/studentData';
import { BookOpen, Target, Zap, Award } from 'lucide-react';

const quickStats = [
  { label: 'GPA', value: student.gpa.toString(), sub: 'Current semester', icon: Award, color: 'from-blue-600/30 to-blue-500/20', iconColor: 'text-blue-400', trend: '+0.2', trendUp: true },
  { label: 'Attendance', value: `${attendanceData.overall}%`, sub: 'Overall', icon: Target, color: 'from-green-600/30 to-green-500/20', iconColor: 'text-green-400', trend: '+2.3%', trendUp: true },
  { label: 'Study Streak', value: `${productivityData.streakDays}d`, sub: 'Consecutive days', icon: Zap, color: 'from-orange-600/30 to-orange-500/20', iconColor: 'text-orange-400', trend: 'Keep it up!', trendUp: true },
  { label: 'Assignments', value: `${assignments.filter(a => a.status !== 'completed').length}`, sub: 'Pending', icon: BookOpen, color: 'from-red-600/30 to-red-500/20', iconColor: 'text-red-400', trend: `${assignments.filter(a => a.status === 'completed').length} done`, trendUp: true },
];

export default function OverviewSection() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <div key={stat.label} className="glass-card-hover rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/8 hover:shadow-lg scale-hover animate-slide-up group cursor-default" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><stat.icon size={20} className={stat.iconColor} /></div>
              <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${stat.trendUp ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/15' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15'} transition-colors`}>{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{stat.value}</p>
            <p className="text-slate-600 dark:text-blue-200/40 text-sm mt-2 transition-colors">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/8 flex items-center gap-4 smooth-hover">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">{student.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap"><h2 className="text-slate-900 dark:text-white font-semibold text-lg transition-colors">{student.name}</h2><span className="text-xs text-slate-600 dark:text-blue-300/50 glass rounded-lg px-3 py-1 transition-colors">{student.year}</span></div>
          <div className="flex items-center gap-4 mt-2 flex-wrap"><span className="text-slate-600 dark:text-blue-300/50 text-xs transition-colors">{student.major}</span><span className="text-slate-600 dark:text-blue-300/30 text-xs transition-colors">{student.university}</span><span className="text-slate-600 dark:text-blue-300/30 text-xs font-mono transition-colors">{student.id}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '100ms' }}><AttendanceCard /></div>
        <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '150ms' }}><AssignmentsCard /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '200ms' }}><StudyPlanner /></div>
        <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '250ms' }}><AnalyticsCard /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}><ExpenseCard /></div>
        <div className="animate-slide-up" style={{ animationDelay: '350ms' }}><NotificationsCard /></div>
      </div>
    </div>
  );
}
