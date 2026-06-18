import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Award, Target, Users, BookOpen, PieChart } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  students: number;
  progress: number;
  subject: string;
}

interface ClassStatisticsProps {
  courses: Course[];
}

const GRADE_DISTRIBUTION = [
  { grade: 'A', count: 42, color: '#34d399', percentage: 26 },
  { grade: 'B', count: 58, color: '#60a5fa', percentage: 36 },
  { grade: 'C', count: 38, color: '#fbbf24', percentage: 24 },
  { grade: 'D', count: 16, color: '#f97316', percentage: 10 },
  { grade: 'F', count: 6, color: '#f87171', percentage: 4 },
];

const PERFORMANCE_METRICS = [
  { label: 'Avg Assignment Score', value: '82%', trend: 'up', change: '+4%' },
  { label: 'Avg Quiz Score', value: '78%', trend: 'up', change: '+2%' },
  { label: 'Completion Rate', value: '94%', trend: 'up', change: '+1%' },
  { label: 'Late Submissions', value: '8%', trend: 'down', change: '-3%' },
];

const COURSE_COMPARISON = [
  { course: 'CS401', name: 'Algorithms', avgScore: 84, students: 48, topper: 92 },
  { course: 'CS302', name: 'Databases', avgScore: 78, students: 62, topper: 95 },
  { course: 'CS501', name: 'ML', avgScore: 81, students: 35, topper: 98 },
];

export default function FacultyClassStatistics({ courses }: ClassStatisticsProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const avgProgress = courses.length > 0 ? Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length) : 0;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-400" />
          Class Statistics
        </h3>
        <span className="text-xs text-slate-500 bg-white/5 px-2.5 py-1 rounded-md">{totalStudents} total students</span>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {PERFORMANCE_METRICS.map((m, i) => (
          <div
            key={m.label}
            className="p-3.5 rounded-xl bg-white/5 border border-white/8 hover:border-emerald-500/20 transition-all"
            style={animated ? { animation: `slideUp 0.5s ease-out ${i * 80}ms both` } : undefined}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">{m.label}</span>
              {m.trend === 'up' ? (
                <TrendingUp size={12} className="text-emerald-400" />
              ) : (
                <TrendingDown size={12} className="text-red-400" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">{m.value}</span>
              <span className={`text-[10px] ${m.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>{m.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Distribution */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">Grade Distribution</span>
          <span className="text-xs text-blue-400">All courses</span>
        </div>
        <div className="flex items-end gap-2 h-28">
          {GRADE_DISTRIBUTION.map((g, i) => {
            const h = animated ? g.percentage : 0;
            return (
              <div key={g.grade} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                <div className="w-full h-20 bg-white/5 rounded-t overflow-hidden relative">
                  <div
                    className="absolute bottom-0 w-full rounded-t transition-all duration-700"
                    style={{
                      height: `${h}%`,
                      backgroundColor: g.color,
                      transitionDelay: `${i * 100}ms`,
                      boxShadow: `0 0 10px ${g.color}40`,
                    }}
                  />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {g.count} students ({g.percentage}%)
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{g.grade}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Comparison */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">Course Comparison</span>
          <span className="text-xs text-emerald-400">Avg: {avgProgress}% progress</span>
        </div>
        <div className="space-y-3">
          {COURSE_COMPARISON.map((c, i) => (
            <div key={c.course} className="p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs text-emerald-400 font-mono">{c.course}</span>
                  <span className="text-xs text-slate-400 ml-2">{c.name}</span>
                </div>
                <span className="text-sm font-bold text-white">{c.avgScore}%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
                    style={{ width: animated ? `${c.avgScore}%` : '0%', transitionDelay: `${i * 120}ms` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Award size={10} className="text-amber-400" />
                  Top: {c.topper}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pie Chart Legend */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {GRADE_DISTRIBUTION.slice(0, 3).map(g => (
            <div key={g.grade} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
              <span className="text-[10px] text-slate-400">{g.grade} ({g.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
