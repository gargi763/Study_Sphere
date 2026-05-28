import { attendanceData } from '../../data/studentData';
import { TrendingUp, TrendingDown, Users } from 'lucide-react';

function CircularProgress({ percentage, size = 80 }: { percentage: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;
  const color = percentage >= 85 ? '#22c55e' : percentage >= 75 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${strokeDash} ${circumference}`} style={{ filter: `drop-shadow(0 0 6px ${color}60)`, transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-white font-bold text-lg leading-none">{percentage}%</span></div>
    </div>
  );
}

export default function AttendanceCard() {
  const overall = attendanceData.overall;
  const trend = overall >= 85;
  return (
    <div className="glass-card rounded-2xl p-6 h-full border border-white/8 hover:border-blue-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20">
      <div className="flex items-center justify-between mb-6">
        <div><h3 className="text-white font-semibold text-lg">Attendance</h3><p className="text-blue-300/50 text-xs mt-0.5">Current semester</p></div>
        <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${trend ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>{trend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{trend ? '+2.3%' : '-1.5%'}</div>
      </div>
      <div className="flex items-center gap-6 mb-6">
        <CircularProgress percentage={overall} size={90} />
        <div><p className="text-3xl font-bold text-white">{overall}%</p><p className="text-blue-200/50 text-sm">Overall attendance</p><div className={`inline-flex items-center gap-1.5 mt-2 text-xs px-2.5 py-1 rounded-full font-medium ${overall >= 85 ? 'bg-green-500/15 text-green-400' : overall >= 75 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'}`}><Users size={11} />{overall >= 85 ? 'Excellent' : overall >= 75 ? 'Average' : 'Low — Take action'}</div></div>
      </div>
      <div className="space-y-3">
        {attendanceData.subjects.map(subject => (
          <div key={subject.name}>
            <div className="flex items-center justify-between mb-1"><span className="text-blue-200/60 text-xs truncate max-w-[60%]">{subject.name}</span><span className={`text-xs font-semibold ${subject.percentage >= 85 ? 'text-green-400' : subject.percentage >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>{subject.percentage}%</span></div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000" style={{ width: `${subject.percentage}%`, background: subject.percentage >= 85 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : subject.percentage >= 75 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)' }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
