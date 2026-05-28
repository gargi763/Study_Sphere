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
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5 border border-white/8 hover:border-blue-500/20 transition-all duration-300 hover:scale-[1.02] animate-slide-up group cursor-default" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}><stat.icon size={18} className={stat.iconColor} /></div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stat.trendUp ? 'text-green-400 bg-green-500/15' : 'text-red-400 bg-red-500/15'}`}>{stat.trend}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-blue-200/40 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-4 border border-white/8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0">{student.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap"><h2 className="text-white font-semibold">{student.name}</h2><span className="text-xs text-blue-300/50 glass px-2 py-0.5 rounded-full">{student.year}</span></div>
          <div className="flex items-center gap-4 mt-1 flex-wrap"><span className="text-blue-300/50 text-xs">{student.major}</span><span className="text-blue-300/30 text-xs">{student.university}</span><span className="text-blue-300/30 text-xs font-mono">{student.id}</span></div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1"><AttendanceCard /></div>
        <div className="lg:col-span-2"><AssignmentsCard /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><StudyPlanner /></div>
        <div className="lg:col-span-1"><AnalyticsCard /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><ExpenseCard /><NotificationsCard /></div>
    </div>
  );
}
