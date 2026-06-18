import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Award, Star, Target, Users, BarChart3,
  Activity, Zap, GraduationCap, CheckCircle, AlertTriangle, ChevronRight
} from 'lucide-react';

const STUDENT_PERFORMANCE_DATA = [
  { name: 'Advanced Algorithms', excellent: 18, good: 22, average: 8, atRisk: 0, total: 48 },
  { name: 'Database Systems', excellent: 20, good: 28, average: 12, atRisk: 2, total: 62 },
  { name: 'Machine Learning', excellent: 8, good: 15, average: 10, atRisk: 2, total: 35 },
];

const TOP_PERFORMERS = [
  { name: 'Emma Wilson', course: 'CS401', score: 98, trend: 'up', avatar: 'EW' },
  { name: 'Liam Chen', course: 'CS302', score: 95, trend: 'up', avatar: 'LC' },
  { name: 'Sophia Martinez', course: 'CS501', score: 94, trend: 'stable', avatar: 'SM' },
  { name: 'Noah Anderson', course: 'CS401', score: 92, trend: 'up', avatar: 'NA' },
  { name: 'Olivia Taylor', course: 'CS302', score: 91, trend: 'up', avatar: 'OT' },
];

const SUBMISSION_TRENDS = [
  { week: 'W1', onTime: 85, late: 12 },
  { week: 'W2', onTime: 88, late: 10 },
  { week: 'W3', onTime: 82, late: 18 },
  { week: 'W4', onTime: 90, late: 8 },
  { week: 'W5', onTime: 92, late: 6 },
  { week: 'W6', onTime: 89, late: 9 },
];

const PERFORMANCE_CATEGORIES = [
  { label: 'Excellent', count: 46, color: '#34d399', icon: Award, desc: '90-100%' },
  { label: 'Good', count: 65, color: '#60a5fa', icon: Star, desc: '75-89%' },
  { label: 'Average', count: 30, color: '#fbbf24', icon: Target, desc: '60-74%' },
  { label: 'At Risk', count: 4, color: '#f87171', icon: AlertTriangle, desc: '<60%' },
];

export default function FacultyStudentAnalytics() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalExcellent = PERFORMANCE_CATEGORIES[0].count;
  const totalStudents = PERFORMANCE_CATEGORIES.reduce((s, c) => s + c.count, 0);

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity size={18} className="text-violet-400" />
          Student Performance Analytics
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {totalExcellent} top performers
          </span>
        </div>
      </div>

      {/* Performance Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {PERFORMANCE_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.label}
              className="p-4 rounded-xl bg-white/5 border border-white/8 hover:border-violet-500/20 transition-all"
              style={animated ? { animation: `slideUp 0.5s ease-out ${i * 80}ms both` } : undefined}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                  <Icon size={14} style={{ color: cat.color }} />
                </div>
                <span className="text-lg font-bold text-white">{cat.count}</span>
              </div>
              <p className="text-xs text-slate-400">{cat.label}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{cat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Performance by Course */}
      <div className="mb-6">
        <p className="text-xs text-slate-400 mb-3">Performance Distribution by Course</p>
        <div className="space-y-3">
          {STUDENT_PERFORMANCE_DATA.map((course, i) => {
            const excellentPct = (course.excellent / course.total) * 100;
            const goodPct = (course.good / course.total) * 100;
            const avgPct = (course.average / course.total) * 100;
            const riskPct = (course.atRisk / course.total) * 100;

            return (
              <div key={course.name} className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white">{course.name}</span>
                  <span className="text-xs text-slate-500">{course.total} students</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                  {animated && (
                    <>
                      <div
                        className="h-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${excellentPct}%`, transitionDelay: `${i * 100}ms` }}
                      />
                      <div
                        className="h-full bg-blue-500 transition-all duration-700"
                        style={{ width: `${goodPct}%`, transitionDelay: `${i * 100 + 50}ms` }}
                      />
                      <div
                        className="h-full bg-amber-500 transition-all duration-700"
                        style={{ width: `${avgPct}%`, transitionDelay: `${i * 100 + 100}ms` }}
                      />
                      {course.atRisk > 0 && (
                        <div
                          className="h-full bg-red-500 transition-all duration-700"
                          style={{ width: `${riskPct}%`, transitionDelay: `${i * 100 + 150}ms` }}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Excellent {course.excellent}</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Good {course.good}</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Avg {course.average}</span>
                  {course.atRisk > 0 && <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Risk {course.atRisk}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-column layout for trends and top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Trends */}
        <div>
          <p className="text-xs text-slate-400 mb-3">Submission Timeliness Trend</p>
          <div className="flex items-end gap-2 h-24">
            {SUBMISSION_TRENDS.map((w, i) => {
              const total = w.onTime + w.late;
              const onTimePct = animated ? (w.onTime / total) * 100 : 0;
              const latePct = animated ? (w.late / total) * 100 : 0;

              return (
                <div key={w.week} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full h-16 bg-white/5 rounded-t overflow-hidden flex flex-col">
                    <div
                      className="w-full bg-emerald-500/80 transition-all duration-700"
                      style={{ height: `${onTimePct}%`, transitionDelay: `${i * 80}ms` }}
                    />
                    <div
                      className="w-full bg-amber-500/80 transition-all duration-700"
                      style={{ height: `${latePct}%`, transitionDelay: `${i * 80 + 40}ms` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500">{w.week}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-emerald-500" /> On-time</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-500" /> Late</span>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <p className="text-xs text-slate-400 mb-3">Top Performers</p>
          <div className="space-y-2">
            {TOP_PERFORMERS.slice(0, 4).map((student, i) => (
              <div
                key={student.name}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/8 transition-all cursor-pointer group"
                style={animated ? { animation: `slideUp 0.4s ease-out ${i * 60}ms both` } : undefined}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                  {student.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-white block truncate">{student.name}</span>
                  <span className="text-[10px] text-violet-400">{student.course}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{student.score}%</span>
                  {student.trend === 'up' && <TrendingUp size={12} className="text-emerald-400" />}
                </div>
                <ChevronRight size={12} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
