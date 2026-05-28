import { useEffect, useState } from 'react';
import { productivityData } from '../../data/studentData';
import { Zap, Flame, Clock, CheckSquare, TrendingUp } from 'lucide-react';

export default function AnalyticsCard() {
  const { weekly, streakDays, totalHoursThisWeek, tasksCompleted, focusScore } = productivityData;
  const [animated, setAnimated] = useState(false);

  useEffect(() => { const timer = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(timer); }, []);
  const maxHours = Math.max(...weekly.map(d => d.hours));
  const stats = [
    { icon: Clock, label: 'Study Hours', value: `${totalHoursThisWeek}h`, color: 'text-blue-400', bg: 'bg-blue-500/15' },
    { icon: CheckSquare, label: 'Tasks Done', value: tasksCompleted, color: 'text-green-400', bg: 'bg-green-500/15' },
    { icon: Flame, label: 'Day Streak', value: streakDays, color: 'text-orange-400', bg: 'bg-orange-500/15' },
    { icon: Zap, label: 'Focus Score', value: `${focusScore}%`, color: 'text-yellow-400', bg: 'bg-yellow-500/15' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/8 hover:border-blue-500/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-5">
        <div><h3 className="text-white font-semibold text-lg">Productivity</h3><p className="text-blue-300/50 text-xs mt-0.5">This week's analytics</p></div>
        <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/15 px-2.5 py-1 rounded-full"><TrendingUp size={12} />+12% this week</div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(stat => (
          <div key={stat.label} className="glass rounded-xl p-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}><stat.icon size={15} className={stat.color} /></div>
            <div><p className="text-white text-base font-bold leading-tight">{stat.value}</p><p className="text-blue-300/40 text-[10px] mt-0.5">{stat.label}</p></div>
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3"><p className="text-blue-300/50 text-xs">Daily Study Hours</p><p className="text-blue-300/30 text-xs">This week</p></div>
        <div className="flex items-end gap-2 h-24">
          {weekly.map((day, i) => {
            const h = animated ? (day.hours / maxHours) * 100 : 0;
            const isToday = i === new Date().getDay() - 1 || (new Date().getDay() === 0 && i === 6);
            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5 group cursor-default relative">
                <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">{day.hours}h - {day.tasks} tasks</div>
                <div className="w-full rounded-t overflow-hidden" style={{ height: 72 }}><div className="w-full rounded-t transition-all duration-1000 group-hover:opacity-100" style={{ height: `${h}%`, marginTop: 'auto', background: isToday ? 'linear-gradient(180deg, #60a5fa, #2563eb)' : 'linear-gradient(180deg, rgba(99,179,237,0.4), rgba(59,130,246,0.2))', transitionDelay: `${i * 80}ms`, boxShadow: isToday ? '0 0 12px rgba(96, 165, 250, 0.4)' : 'none' }} /></div>
                <span className={`text-[10px] ${isToday ? 'text-blue-400 font-semibold' : 'text-blue-300/30'}`}>{day.day}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between mb-2"><span className="text-blue-300/50 text-xs flex items-center gap-1.5"><Zap size={11} className="text-yellow-400" />Focus Score</span><span className="text-yellow-400 text-xs font-semibold">{focusScore}/100</span></div>
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{ width: animated ? `${focusScore}%` : '0%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', boxShadow: '0 0 8px rgba(251, 191, 36, 0.4)' }} /></div>
        <div className="flex justify-between mt-1"><span className="text-blue-300/20 text-[9px]">Needs work</span><span className="text-blue-300/20 text-[9px]">Excellent</span></div>
      </div>
    </div>
  );
}
