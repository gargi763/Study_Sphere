import React, { useState } from 'react';
import {
  BookOpen, Users, ClipboardList, TrendingUp, Bell, Calendar, ChevronRight,
  Clock, CheckCircle, AlertCircle, BarChart3, FileText, Star, Award
} from 'lucide-react';
import { useAuthContext } from '../../../context/AuthContext';

const MOCK_COURSES = [
  { id: '1', code: 'CS401', name: 'Advanced Algorithms', students: 48, schedule: 'Mon/Wed 10–11:30', room: 'Tech 204', progress: 72 },
  { id: '2', code: 'CS302', name: 'Database Systems', students: 62, schedule: 'Tue/Thu 14–15:30', room: 'Lab 108', progress: 58 },
  { id: '3', code: 'CS501', name: 'Machine Learning', students: 35, schedule: 'Fri 09–12:00', room: 'AI Lab', progress: 45 },
];

const MOCK_ASSIGNMENTS = [
  { id: '1', title: 'Graph Traversal Problem Set', course: 'CS401', due: '2026-06-20', submissions: 38, total: 48, status: 'active' },
  { id: '2', title: 'SQL Query Optimization', course: 'CS302', due: '2026-06-22', submissions: 55, total: 62, status: 'active' },
  { id: '3', title: 'Neural Network Implementation', course: 'CS501', due: '2026-06-18', submissions: 20, total: 35, status: 'urgent' },
  { id: '4', title: 'Midterm Exam Review', course: 'CS401', due: '2026-06-25', submissions: 0, total: 48, status: 'upcoming' },
];

const MOCK_STUDENTS = [
  { name: 'Emma Wilson', course: 'CS401', grade: 'A', attendance: 94, status: 'excellent' },
  { name: 'James Lee', course: 'CS302', grade: 'B+', attendance: 82, status: 'good' },
  { name: 'Sofia Patel', course: 'CS501', grade: 'C+', attendance: 68, status: 'at-risk' },
  { name: 'Liam Chen', course: 'CS401', grade: 'A-', attendance: 91, status: 'good' },
  { name: 'Maya Johnson', course: 'CS302', grade: 'B', attendance: 75, status: 'good' },
];

const STAT_COLORS = ['from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500', 'from-violet-500 to-purple-500', 'from-orange-500 to-amber-500'];

export default function FacultyOverview() {
  const { profile } = useAuthContext();
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Faculty';

  const totalStudents = MOCK_COURSES.reduce((s, c) => s + c.students, 0);
  const pendingGrades = MOCK_ASSIGNMENTS.reduce((s, a) => s + (a.total - a.submissions), 0);

  const stats = [
    { label: 'Active Courses', value: MOCK_COURSES.length, icon: BookOpen, color: STAT_COLORS[0] },
    { label: 'Total Students', value: totalStudents, icon: Users, color: STAT_COLORS[1] },
    { label: 'Assignments', value: MOCK_ASSIGNMENTS.length, icon: ClipboardList, color: STAT_COLORS[2] },
    { label: 'Pending Grades', value: pendingGrades, icon: FileText, color: STAT_COLORS[3] },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="glass rounded-2xl p-6 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Good morning, {firstName}!</h1>
            <p className="text-slate-400 text-sm">You have {pendingGrades} pending submissions to review.</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
            <BookOpen size={24} className="text-white" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const SIcon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-2xl p-5 border border-white/10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <SIcon size={18} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Courses */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">My Courses</h2>
          <div className="space-y-3">
            {MOCK_COURSES.map(course => (
              <div key={course.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white truncate">{course.name}</span>
                    <span className="text-xs text-slate-400 ml-2">{course.progress}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-emerald-400 font-mono">{course.code}</span>
                    <span className="text-xs text-slate-500">{course.students} students</span>
                    <span className="text-xs text-slate-500">{course.room}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        {/* Assignments */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Recent Assignments</h2>
          <div className="space-y-3">
            {MOCK_ASSIGNMENTS.map(a => {
              const pct = Math.round((a.submissions / a.total) * 100);
              const statusColor = a.status === 'urgent' ? 'text-red-400 bg-red-500/10' : a.status === 'upcoming' ? 'text-slate-400 bg-white/5' : 'text-emerald-400 bg-emerald-500/10';
              return (
                <div key={a.id} className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-white leading-tight">{a.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize flex-shrink-0 ${statusColor}`}>{a.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="text-emerald-400 font-mono">{a.course}</span>
                    <span>Due {new Date(a.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>{a.submissions}/{a.total} submitted</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Students at risk */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Student Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Student</th>
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Course</th>
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Grade</th>
                <th className="text-xs text-slate-500 font-medium pb-3 pr-4">Attendance</th>
                <th className="text-xs text-slate-500 font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_STUDENTS.map(s => {
                const statusStyles: Record<string, string> = {
                  excellent: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
                  good: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
                  'at-risk': 'bg-red-500/15 text-red-400 border-red-500/20',
                };
                return (
                  <tr key={s.name} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                          {s.name[0]}
                        </div>
                        <span className="text-sm text-white">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs text-emerald-400 font-mono">{s.course}</td>
                    <td className="py-3 pr-4 text-sm font-semibold text-white">{s.grade}</td>
                    <td className="py-3 pr-4 text-sm text-slate-300">{s.attendance}%</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-lg border capitalize ${statusStyles[s.status]}`}>
                        {s.status === 'at-risk' ? 'At Risk' : s.status}
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
