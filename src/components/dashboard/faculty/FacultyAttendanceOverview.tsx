import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const ATTENDANCE_DATA = [
  { subject: 'Advanced Algorithms', present: 44, total: 48, percentage: 92, trend: 'up' },
  { subject: 'Database Systems', present: 53, total: 62, percentage: 85, trend: 'stable' },
  { subject: 'Machine Learning', present: 28, total: 35, percentage: 80, trend: 'down' },
];

const WEEKLY_TREND = [
  { week: 'W1', percentage: 88 },
  { week: 'W2', percentage: 91 },
  { week: 'W3', percentage: 87 },
  { week: 'W4', percentage: 93 },
  { week: 'W5', percentage: 89 },
  { week: 'W6', percentage: 92 },
  { week: 'W7', percentage: 90 },
  { week: 'W8', percentage: 94 },
];

const STATUS_DISTRIBUTION = [
  { status: 'Present', count: 125, color: '#34d399', percentage: 79 },
  { status: 'Late', count: 18, color: '#fbbf24', percentage: 11 },
  { status: 'Absent', count: 12, color: '#f87171', percentage: 8 },
  { status: 'Excused', count: 3, color: '#60a5fa', percentage: 2 },
];

export default function FacultyAttendanceOverview() {
  const [animated, setAnimated] = useState(false);
  const overallAttendance = Math.round(
    ATTENDANCE_DATA.reduce((sum, s) => sum + s.percentage, 0) / ATTENDANCE_DATA.length
  );

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const circumference = 2 * Math.PI * 56;
  const offset = circumference - (overallAttendance / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-emerald-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target size={18} className="text-emerald-400" />
          Attendance Overview
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <TrendingUp size={12} />
          +2.4%
        </div>
      </div>

      {/* Donut Chart + Stats */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative flex-shrink-0">
          <svg width="128" height="128" className="transform -rotate-90">
            <defs>
              <linearGradient id="attendanceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
            <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.06)" strokeWidth="10" fill="none" />
            <circle
              cx="64" cy="64" r="56"
              stroke="url(#attendanceGrad)"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? offset : circumference}
              className="transition-all duration-1000"
              style={{ filter: 'drop-shadow(0 0 6px rgba(52,211,153,0.4))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{overallAttendance}%</span>
            <span className="text-[10px] text-slate-400">Overall</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {STATUS_DISTRIBUTION.map(s => (
            <div key={s.status} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-slate-400 flex-1">{s.status}</span>
              <span className="text-xs text-white font-medium">{s.count}</span>
              <span className="text-xs text-slate-500 w-8 text-right">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Trend Bar Chart */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-slate-400">Weekly Trend</span>
          <span className="text-xs text-emerald-400">This semester</span>
        </div>
        <div className="flex items-end gap-1.5 h-20">
          {WEEKLY_TREND.map((w, i) => {
            const h = animated ? (w.percentage / 100) * 100 : 0;
            const isLatest = i === WEEKLY_TREND.length - 1;
            return (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-1 group cursor-default">
                <div className="w-full h-16 bg-white/5 rounded-t overflow-hidden relative">
                  <div
                    className="absolute bottom-0 w-full rounded-t transition-all duration-700"
                    style={{
                      height: `${h}%`,
                      background: isLatest ? 'linear-gradient(180deg, #34d399, #0d9488)' : 'linear-gradient(180deg, rgba(52,211,153,0.4), rgba(13,148,136,0.2))',
                      transitionDelay: `${i * 80}ms`,
                      boxShadow: isLatest ? '0 0 12px rgba(52,211,153,0.4)' : 'none',
                    }}
                  />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {w.percentage}%
                  </div>
                </div>
                <span className={`text-[9px] ${isLatest ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>{w.week}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Course Breakdown */}
      <div>
        <p className="text-xs text-slate-400 mb-3">Per-Course Breakdown</p>
        <div className="space-y-3">
          {ATTENDANCE_DATA.map(s => (
            <div key={s.subject} className="flex items-center gap-3">
              <span className="text-xs text-slate-300 w-40 truncate">{s.subject}</span>
              <div className="flex-1 h-2 rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${s.percentage >= 85 ? 'bg-emerald-500' : s.percentage >= 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: animated ? `${s.percentage}%` : '0%' }}
                />
              </div>
              <div className="flex items-center gap-2 w-20 justify-end">
                <span className={`text-xs font-semibold ${s.percentage >= 85 ? 'text-emerald-400' : s.percentage >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                  {s.percentage}%
                </span>
                {s.trend === 'up' && <TrendingUp size={10} className="text-emerald-400" />}
                {s.trend === 'down' && <AlertTriangle size={10} className="text-red-400" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
