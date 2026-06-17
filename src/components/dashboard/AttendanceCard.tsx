import { TrendingUp, TrendingDown, Users, Loader2 } from 'lucide-react';
import { useAttendance } from '../../hooks/useData';
import { useAuthContext } from '../../context/AuthContext';

function CircularProgress({ percentage, size = 80 }: { percentage: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;
  const color = percentage >= 85 ? '#22c55e' : percentage >= 75 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={color} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)`, transition: 'stroke-dasharray 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white font-bold text-lg leading-none">{percentage}%</span>
      </div>
    </div>
  );
}

export default function AttendanceCard() {
  const { user } = useAuthContext();
  const { loading, getSubjectStats, getOverallPercentage } = useAttendance(user?.id);

  const overall = getOverallPercentage();
  const subjectStats = getSubjectStats();
  const trend = overall >= 85;

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 h-full border border-white/8 flex items-center justify-center min-h-[200px]">
        <Loader2 size={20} className="animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 h-full border transition-theme border-slate-300/20 dark:border-white/8 hover:border-slate-400/40 dark:hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg smooth-hover">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold text-lg transition-colors">Attendance</h3>
          <p className="text-slate-600 dark:text-blue-300/50 text-sm mt-1 transition-colors">Current semester</p>
        </div>
        <div className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold ${
          trend
            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/15'
            : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15'
        } transition-colors`}>
          {trend ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend ? 'Good' : 'Low'}
        </div>
      </div>

      <div className="flex items-center gap-8 mb-8">
        <CircularProgress percentage={overall} size={100} />
        <div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">{overall}%</p>
          <p className="text-slate-600 dark:text-blue-200/50 text-sm mt-1 transition-colors">Overall attendance</p>
          <div className={`inline-flex items-center gap-1.5 mt-3 text-xs px-3 py-1.5 rounded-lg font-semibold ${
            overall >= 85 ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/15'
            : overall >= 75 ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15'
            : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15'
          } transition-colors`}>
            <Users size={12} />
            {overall >= 85 ? 'Excellent' : overall >= 75 ? 'Average' : 'Low — Take action'}
          </div>
        </div>
      </div>

      {subjectStats.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-600 text-sm text-center py-4">
          No records yet. Mark your first attendance.
        </p>
      ) : (
        <div className="space-y-3">
          {subjectStats.slice(0, 5).map(subject => (
            <div key={subject.subject}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 dark:text-blue-200/60 text-xs font-medium transition-colors truncate max-w-[70%]">
                  {subject.subject}
                </span>
                <span className={`text-xs font-bold ${
                  subject.percentage >= 85 ? 'text-green-600 dark:text-green-400'
                  : subject.percentage >= 75 ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
                } transition-colors`}>
                  {subject.percentage}%
                </span>
              </div>
              <div className="h-2 bg-slate-300 dark:bg-white/5 rounded-full overflow-hidden transition-colors">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${subject.percentage}%`,
                    background: subject.percentage >= 85
                      ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                      : subject.percentage >= 75
                        ? 'linear-gradient(90deg,#f59e0b,#fbbf24)'
                        : 'linear-gradient(90deg,#ef4444,#f87171)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
