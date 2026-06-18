import React, { useState, useEffect } from 'react';
import {
  BookOpen, Users, ClipboardList, FileText, TrendingUp, Calendar,
  CheckCircle, AlertCircle, Clock, Plus, BarChart3, GraduationCap,
  ChevronRight, Zap, Award, Star, Target, UserCheck
} from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import FacultyAttendanceOverview from './FacultyAttendanceOverview';
import FacultyClassStatistics from './FacultyClassStatistics';
import FacultyStudentAnalytics from './FacultyStudentAnalytics';

interface Course {
  id: string;
  code: string;
  name: string;
  students: number;
  schedule: string;
  room: string;
  progress: number;
  subject: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  assignment_type: string;
  priority: string;
  submissions: number;
  total: number;
}

interface AtRiskStudent {
  id: string;
  name: string;
  course: string;
  grade: string;
  attendance: number;
  status: string;
  avatar: string;
}

const MOCK_COURSES: Course[] = [
  { id: '1', code: 'CS401', name: 'Advanced Algorithms', students: 48, schedule: 'Mon/Wed 10-11:30', room: 'Tech 204', progress: 72, subject: 'Advanced Algorithms' },
  { id: '2', code: 'CS302', name: 'Database Systems', students: 62, schedule: 'Tue/Thu 14-15:30', room: 'Lab 108', progress: 58, subject: 'Database Systems' },
  { id: '3', code: 'CS501', name: 'Machine Learning', students: 35, schedule: 'Fri 09-12:00', room: 'AI Lab', progress: 45, subject: 'Machine Learning' },
];

const MOCK_AT_RISK: AtRiskStudent[] = [
  { id: '1', name: 'Sofia Patel', course: 'CS501', grade: 'C+', attendance: 68, status: 'at-risk', avatar: 'SP' },
  { id: '2', name: 'Ryan Kim', course: 'CS302', grade: 'D+', attendance: 55, status: 'critical', avatar: 'RK' },
  { id: '3', name: 'Aisha Khan', course: 'CS401', grade: 'C', attendance: 72, status: 'at-risk', avatar: 'AK' },
];

export default function FacultyDashboard() {
  const { profile, user } = useAuthContext();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateCharts, setAnimateCharts] = useState(false);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Professor';

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('faculty_id', user.id)
          .order('due_date', { ascending: true });
        if (error) throw error;
        setAssignments((data || []).map((a: any) => ({
          id: a.id,
          title: a.title,
          subject: a.subject,
          due_date: a.due_date,
          assignment_type: a.assignment_type,
          priority: a.priority,
          submissions: Math.floor(Math.random() * a.max_score) + 10,
          total: a.max_score || 40,
        })));
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setAssignments([
          { id: '1', title: 'Graph Traversal Problem Set', subject: 'CS401', due_date: '2026-06-20', assignment_type: 'homework', priority: 'high', submissions: 38, total: 48 },
          { id: '2', title: 'SQL Query Optimization', subject: 'CS302', due_date: '2026-06-22', assignment_type: 'project', priority: 'medium', submissions: 55, total: 62 },
          { id: '3', title: 'Neural Network Implementation', subject: 'CS501', due_date: '2026-06-18', assignment_type: 'project', priority: 'high', submissions: 20, total: 35 },
          { id: '4', title: 'Midterm Exam Review', subject: 'CS401', due_date: '2026-06-25', assignment_type: 'quiz', priority: 'low', submissions: 0, total: 48 },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => setAnimateCharts(true), 100);
      }
    })();
  }, [user?.id]);

  const totalStudents = MOCK_COURSES.reduce((s, c) => s + c.students, 0);
  const pendingGrades = assignments.reduce((s, a) => s + Math.max(a.total - a.submissions, 0), 0);
  const gradedThisWeek = 23;

  const stats = [
    { label: 'Active Courses', value: MOCK_COURSES.length, icon: BookOpen, gradient: 'from-emerald-500 to-teal-500', bgGlow: 'shadow-emerald-500/20', trend: '+1 new' },
    { label: 'Total Students', value: totalStudents, icon: Users, gradient: 'from-blue-500 to-cyan-500', bgGlow: 'shadow-blue-500/20', trend: '145 enrolled' },
    { label: 'Assignments', value: assignments.length, icon: ClipboardList, gradient: 'from-violet-500 to-purple-500', bgGlow: 'shadow-violet-500/20', trend: `${pendingGrades} pending` },
    { label: 'Graded This Week', value: gradedThisWeek, icon: FileText, gradient: 'from-orange-500 to-amber-500', bgGlow: 'shadow-orange-500/20', trend: '+18% vs last' },
  ];

  const quickActions = [
    { label: 'Create Assignment', icon: Plus, color: 'from-emerald-500 to-teal-500' },
    { label: 'Take Attendance', icon: UserCheck, color: 'from-blue-500 to-cyan-500' },
    { label: 'Grade Submissions', icon: FileText, color: 'from-violet-500 to-purple-500' },
    { label: 'Send Announcement', icon: Zap, color: 'from-orange-500 to-amber-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {firstName}!</h1>
            <p className="text-slate-400 text-sm">You have <span className="text-emerald-400 font-medium">{pendingGrades}</span> submissions to review and <span className="text-amber-400 font-medium">{MOCK_AT_RISK.length}</span> students needing attention.</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <BookOpen size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const SIcon = s.icon;
          return (
            <div
              key={s.label}
              className="glass-card rounded-2xl p-5 border border-white/8 hover:border-emerald-500/20 transition-all duration-300 scale-hover"
              style={animateCharts ? { animation: `slideUp 0.5s ease-out ${i * 80}ms both` } : undefined}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg ${s.bgGlow}`}>
                  <SIcon size={18} className="text-white" />
                </div>
                <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">{s.trend}</span>
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-2xl p-5 border border-white/8">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(action => {
            const AIcon = action.icon;
            return (
              <button
                key={action.label}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/8 hover:border-emerald-500/20 hover:bg-white/8 transition-all group"
              >
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <AIcon size={16} className="text-white" />
                </div>
                <span className="text-sm text-slate-300 font-medium group-hover:text-white transition-colors">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses */}
        <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-400" />
              My Courses
            </h3>
            <span className="text-xs text-slate-500">{MOCK_COURSES.length} active</span>
          </div>
          <div className="space-y-3">
            {MOCK_COURSES.map((course, i) => (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-all group cursor-pointer"
                style={animateCharts ? { animation: `slideUp 0.5s ease-out ${(i + 4) * 80}ms both` } : undefined}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                  <BookOpen size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white truncate">{course.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{course.progress}%</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-emerald-400 font-mono">{course.code}</span>
                    <span className="text-xs text-slate-500">{course.students} students</span>
                    <span className="text-xs text-slate-500">{course.schedule}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ClipboardList size={18} className="text-violet-400" />
              Recent Assignments
            </h3>
            <span className="text-xs text-slate-500">{assignments.length} total</span>
          </div>
          <div className="space-y-3">
            {assignments.slice(0, 5).map((a, i) => {
              const pct = a.total > 0 ? Math.round((a.submissions / a.total) * 100) : 0;
              const isOverdue = new Date(a.due_date) < new Date();
              const statusColor = isOverdue ? 'text-red-400 bg-red-500/10 border-red-500/20' : pct >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20';
              const statusLabel = isOverdue ? 'overdue' : pct >= 80 ? 'near complete' : 'in progress';
              return (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-all group cursor-pointer"
                  style={animateCharts ? { animation: `slideUp 0.5s ease-out ${(i + 7) * 80}ms both` } : undefined}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-white leading-tight block truncate">{a.title}</span>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="text-emerald-400 font-mono">{a.subject}</span>
                        <span>Due {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${statusColor}`}>{statusLabel}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-500">{a.submissions}/{a.total} submitted</span>
                    <span className="text-xs text-slate-400">{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className={`h-full rounded-full transition-all duration-1000 ${isOverdue ? 'bg-gradient-to-r from-red-500 to-rose-400' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attendance Overview + Class Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FacultyAttendanceOverview />
        <FacultyClassStatistics courses={MOCK_COURSES} />
      </div>

      {/* Student Performance Analytics */}
      <FacultyStudentAnalytics />

      {/* At-Risk Students */}
      <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-emerald-500/20 transition-all duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-400" />
            Students Needing Attention
          </h3>
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">{MOCK_AT_RISK.length} flagged</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-white/5">
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Student</th>
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Course</th>
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Grade</th>
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Attendance</th>
                <th className="text-xs text-slate-500 font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_AT_RISK.map(s => {
                const statusStyles: Record<string, string> = {
                  'at-risk': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
                  critical: 'bg-red-500/15 text-red-400 border-red-500/20',
                };
                return (
                  <tr key={s.id} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                          {s.avatar}
                        </div>
                        <span className="text-sm text-white font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-emerald-400 font-mono">{s.course}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-white">{s.grade}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${s.attendance < 60 ? 'text-red-400' : 'text-amber-400'}`}>{s.attendance}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-white/10">
                          <div className={`h-full rounded-full ${s.attendance < 60 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${s.attendance}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-lg border capitalize ${statusStyles[s.status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
                        {s.status === 'at-risk' ? 'At Risk' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
