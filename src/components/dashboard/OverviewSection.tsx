import { useEffect, useState } from 'react';
import AttendanceCard from './AttendanceCard';
import AssignmentsCard from './AssignmentsCard';
import NotificationsCard from './NotificationsCard';
import ExpenseCard from './ExpenseCard';
import StudyPlanner from './StudyPlanner';
import AnalyticsCard from './AnalyticsCard';
import { useAuthContext } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useAttendance, useSubmissions } from '../../hooks/useData';
import { BookOpen, Target, Zap, Award } from 'lucide-react';
import type { Tables } from '../../types/database';

type Assignment = Tables<'assignments'>;

export default function OverviewSection() {
  const { profile, studentProfile, user } = useAuthContext();
  const { getOverallPercentage } = useAttendance(user?.id);
  const { submissions } = useSubmissions(user?.id);

  const [, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .order('due_date', { ascending: true });
        if (error) throw error;
        setAssignments(data || []);
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const pendingCount = submissions.filter(s => s.status === 'pending' || s.status === 'submitted').length;
  const completedCount = submissions.filter(s => s.status === 'graded').length;
  const overallAttendance = getOverallPercentage();
  const gpa = studentProfile?.gpa ?? 0;

  const quickStats = [
    { label: 'GPA', value: gpa.toFixed(1), sub: 'Current semester', icon: Award, color: 'from-blue-600/30 to-blue-500/20', iconColor: 'text-blue-400', trend: gpa >= 3.5 ? 'Excellent' : 'Good', trendUp: true },
    { label: 'Attendance', value: `${overallAttendance}%`, sub: 'Overall', icon: Target, color: 'from-green-600/30 to-green-500/20', iconColor: 'text-green-400', trend: overallAttendance >= 85 ? '+2.3%' : `${overallAttendance}%`, trendUp: overallAttendance >= 75 },
    { label: 'Study Streak', value: '14d', sub: 'Consecutive days', icon: Zap, color: 'from-orange-600/30 to-orange-500/20', iconColor: 'text-orange-400', trend: 'Keep it up!', trendUp: true },
    { label: 'Assignments', value: `${pendingCount}`, sub: 'Pending', icon: BookOpen, color: 'from-red-600/30 to-red-500/20', iconColor: 'text-red-400', trend: `${completedCount} done`, trendUp: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

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
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shrink-0">{(profile?.full_name?.[0] ?? '?').toUpperCase()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap"><h2 className="text-slate-900 dark:text-white font-semibold text-lg transition-colors">{profile?.full_name || 'Student'}</h2><span className="text-xs text-slate-600 dark:text-blue-300/50 glass rounded-lg px-3 py-1 transition-colors">{studentProfile?.year || 'Student'}</span></div>
          <div className="flex items-center gap-4 mt-2 flex-wrap"><span className="text-slate-600 dark:text-blue-300/50 text-xs transition-colors">{studentProfile?.major || profile?.department || 'Undeclared'}</span><span className="text-slate-600 dark:text-blue-300/30 text-xs transition-colors">{studentProfile?.university || 'University'}</span><span className="text-slate-600 dark:text-blue-300/30 text-xs font-mono transition-colors">{studentProfile?.student_id || ''}</span></div>
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
