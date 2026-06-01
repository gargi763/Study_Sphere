import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Award, Target, Zap, Clock, BookOpen,
  Calendar, CheckCircle2, AlertCircle, GraduationCap, BarChart3,
  PieChart, LineChart, Activity, Flame, Star, Heart, Brain, Cpu
} from 'lucide-react';

interface AnalyticsData {
  productivityScore: number;
  weeklyStudyHours: number[];
  attendancePercentage: number;
  assignmentCompletion: number;
  gpaScore: number;
  studyStreak: number;
}

interface PerformanceInsight {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'stable';
  color: string;
}

interface SubjectPerformance {
  subject: string;
  score: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
}

const subjectPerformances: SubjectPerformance[] = [
  { subject: 'Data Structures', score: 85, trend: 'up', icon: Brain },
  { subject: 'Operating Systems', score: 68, trend: 'down', icon: Cpu },
  { subject: 'Database Systems', score: 78, trend: 'up', icon: BarChart3 },
  { subject: 'Computer Networks', score: 72, trend: 'stable', icon: Activity },
  { subject: 'Software Engineering', score: 88, trend: 'up', icon: Award },
];

const performanceInsights: PerformanceInsight[] = [
  {
    id: '1',
    title: 'Study Consistency',
    description: '7-day streak maintained',
    value: '7 days',
    icon: Flame,
    trend: 'up',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: '2',
    title: 'Assignment Mastery',
    description: 'Above average completion',
    value: '87%',
    icon: CheckCircle2,
    trend: 'up',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: '3',
    title: 'Class Engagement',
    description: 'Attendance rate',
    value: '92%',
    icon: GraduationCap,
    trend: 'up',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: '4',
    title: 'Knowledge Retention',
    description: 'Learning efficiency',
    value: '8.2/10',
    icon: Brain,
    trend: 'up',
    color: 'from-purple-500 to-pink-500',
  },
];

const generateWeeklyData = () => [
  { day: 'Mon', hours: 4.5, planned: 5 },
  { day: 'Tue', hours: 5.2, planned: 5 },
  { day: 'Wed', hours: 3.8, planned: 5 },
  { day: 'Thu', hours: 6.1, planned: 5 },
  { day: 'Fri', hours: 4.3, planned: 5 },
  { day: 'Sat', hours: 7.5, planned: 6 },
  { day: 'Sun', hours: 3.2, planned: 4 },
];

const generateAttendanceData = () => [
  { week: 'Week 1', percentage: 88 },
  { week: 'Week 2', percentage: 92 },
  { week: 'Week 3', percentage: 95 },
  { week: 'Week 4', percentage: 91 },
  { week: 'Week 5', percentage: 96 },
  { week: 'Week 6', percentage: 93 },
];

const generateAssignmentData = () => {
  const assignments = [
    { name: 'Data Structures', submitted: true, graded: true, score: 92 },
    { name: 'Operating Systems', submitted: true, graded: false, score: null },
    { name: 'Database Project', submitted: true, graded: true, score: 88 },
    { name: 'Networks Lab', submitted: false, graded: false, score: null },
    { name: 'Software Design', submitted: true, graded: true, score: 95 },
    { name: 'Algorithm Quiz', submitted: true, graded: true, score: 78 },
    { name: 'Database Quiz', submitted: true, graded: true, score: 85 },
    { name: 'OS Project', submitted: true, graded: false, score: null },
  ];
  const submitted = assignments.filter(a => a.submitted).length;
  const total = assignments.length;
  return { assignments, completion: Math.round((submitted / total) * 100) };
};

const GradientCircleProgress = ({ percentage, size = 200 }: { percentage: number; size?: number }) => {
  const circumference = 2 * Math.PI * (size / 2 - 20);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 20}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 20}
          stroke="url(#progressGradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-bold text-white">{percentage}%</p>
        <p className="text-blue-300/50 text-xs">Productivity</p>
      </div>
    </div>
  );
};

export default function StudentAnalytics() {
  const [analyticsData] = useState<AnalyticsData>({
    productivityScore: 78,
    weeklyStudyHours: [4.5, 5.2, 3.8, 6.1, 4.3, 7.5, 3.2],
    attendancePercentage: 92,
    assignmentCompletion: 87,
    gpaScore: 3.65,
    studyStreak: 7,
  });

  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    setAnimateCharts(true);
  }, []);

  const weeklyData = generateWeeklyData();
  const attendanceData = generateAttendanceData();
  const { assignments, completion } = generateAssignmentData();

  const maxStudyHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-white text-2xl font-bold">Student Analytics</h2>
            <p className="text-blue-300/50 text-sm mt-1">Comprehensive performance dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{analyticsData.gpaScore}</p>
              <p className="text-blue-300/50 text-xs">Current GPA</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Star size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Productivity Score */}
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 border border-white/8 flex flex-col items-center">
          <GradientCircleProgress percentage={analyticsData.productivityScore} size={180} />
          <div className="mt-6 text-center w-full">
            <p className="text-white text-sm font-medium mb-2">Average This Week</p>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">+5% from last week</span>
            </div>
          </div>
        </div>

        {/* Weekly Study Hours */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Weekly Study Hours</h3>
              <p className="text-blue-300/50 text-xs mt-1">Track your study time</p>
            </div>
            <div className="text-right">
              <p className="text-white text-2xl font-bold">37.6h</p>
              <p className="text-blue-300/50 text-xs">Total this week</p>
            </div>
          </div>

          <div className="flex items-end gap-3 h-48 justify-around">
            {weeklyData.map((data, index) => {
              const percentage = (data.hours / maxStudyHours) * 100;
              const isAbovePlanned = data.hours >= data.planned;

              return (
                <div
                  key={data.day}
                  className="flex-1 flex flex-col items-center gap-2 group"
                  style={{
                    animation: animateCharts ? `slideUp 0.6s ease-out ${index * 80}ms both` : 'none',
                  }}
                >
                  <div className="relative w-full flex flex-col items-center">
                    <div className="w-full bg-white/5 rounded-t-lg overflow-hidden relative h-32">
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ${
                          isAbovePlanned
                            ? 'bg-gradient-to-t from-green-600 to-green-400'
                            : 'bg-gradient-to-t from-blue-600 to-blue-400'
                        } shadow-lg shadow-blue-500/20`}
                        style={{ height: `${percentage}%`, transitionDelay: `${index * 100}ms` }}
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold">{data.hours}h</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-blue-300/50 text-xs font-medium">{data.day}</span>
                  <span className={`text-[10px] ${isAbovePlanned ? 'text-green-400' : 'text-yellow-400'}`}>
                    {data.hours > data.planned ? '+' : ''}{(data.hours - data.planned).toFixed(1)}h
                  </span>
                </div>
              );
            })}
          </div>

          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </div>

      {/* Secondary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <div className="glass-card rounded-2xl p-6 border border-white/8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Attendance Trend</h3>
              <p className="text-blue-300/50 text-xs mt-1">6-week view</p>
            </div>
            <div className="text-right">
              <p className="text-white text-2xl font-bold">93%</p>
              <p className="text-green-400 text-xs flex items-center gap-1 justify-end">
                <TrendingUp size={12} /> +2% up
              </p>
            </div>
          </div>

          <div className="h-40 flex items-end gap-2">
            {attendanceData.map((data, index) => {
              const percentage = (data.percentage / 100) * 100;
              return (
                <div
                  key={data.week}
                  className="flex-1 flex flex-col items-center gap-2 group"
                  style={{
                    animation: animateCharts ? `slideUp 0.6s ease-out ${index * 100}ms both` : 'none',
                  }}
                >
                  <div className="w-full h-24 bg-white/5 rounded-t-lg overflow-hidden relative">
                    <div
                      className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all duration-1000 shadow-lg shadow-cyan-500/20"
                      style={{ height: `${percentage}%`, transitionDelay: `${index * 120}ms` }}
                    />
                    <div className="absolute inset-0 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-bold">{data.percentage}%</span>
                    </div>
                  </div>
                  <span className="text-blue-300/50 text-xs">{data.week}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-blue-300/50 text-xs">Average attendance: 91.25% | Best: Week 5 (96%)</p>
          </div>
        </div>

        {/* Assignment Completion */}
        <div className="glass-card rounded-2xl p-6 border border-white/8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg">Assignment Completion</h3>
              <p className="text-blue-300/50 text-xs mt-1">Current semester</p>
            </div>
            <div className="text-right">
              <p className="text-white text-2xl font-bold">{completion}%</p>
              <p className="text-green-400 text-xs flex items-center gap-1 justify-end">
                <CheckCircle2 size={12} /> On track
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                <defs>
                  <linearGradient id="assignmentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="url(#assignmentGradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(completion / 100) * 502} 502`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{ transitionDelay: '200ms' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{completion}%</span>
                <span className="text-blue-300/50 text-xs">Submitted</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">Submitted</p>
                  <p className="text-blue-300/50 text-xs">7 of 8</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-blue-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">Graded</p>
                  <p className="text-blue-300/50 text-xs">5 of 8</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">Pending</p>
                  <p className="text-blue-300/50 text-xs">1 assignment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-4 gap-4">
        {performanceInsights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={insight.id}
              className={`glass-card rounded-xl p-5 border border-white/8 hover:border-blue-500/20 transition-all ${
                animateCharts ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                {insight.trend && (
                  <div className={`flex items-center gap-0.5 ${insight.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {insight.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  </div>
                )}
              </div>
              <p className="text-white text-xl font-bold mb-1">{insight.value}</p>
              <p className="text-blue-300/50 text-xs mb-2">{insight.title}</p>
              <p className="text-blue-300/40 text-[10px]">{insight.description}</p>
            </div>
          );
        })}
      </div>

      {/* Subject Performance */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Subject Performance</h3>
            <p className="text-blue-300/50 text-xs mt-1">Individual course scores</p>
          </div>
          <button className="text-blue-400 text-xs hover:text-blue-300">View Details</button>
        </div>

        <div className="space-y-4">
          {subjectPerformances.map((subject, index) => {
            const Icon = subject.icon;
            const categoryColor =
              subject.score >= 85
                ? 'from-green-500 to-emerald-500'
                : subject.score >= 70
                  ? 'from-yellow-500 to-orange-500'
                  : 'from-red-500 to-pink-500';

            return (
              <div
                key={subject.subject}
                className={`flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/5 transition-all ${
                  animateCharts ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryColor} flex items-center justify-center shrink-0`}>
                  <Icon size={16} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium text-sm">{subject.subject}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{subject.score}%</span>
                      {subject.trend === 'up' && <TrendingUp size={14} className="text-green-400" />}
                      {subject.trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
                      {subject.trend === 'stable' && <Activity size={14} className="text-yellow-400" />}
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${categoryColor}`}
                      style={{
                        width: `${subject.score}%`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assignment List */}
      <div className="glass-card rounded-2xl p-6 border border-white/8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg">Recent Assignments</h3>
            <p className="text-blue-300/50 text-xs mt-1">Last 8 submissions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-blue-300/50 font-medium">Assignment</th>
                <th className="text-center py-3 px-4 text-blue-300/50 font-medium">Submitted</th>
                <th className="text-center py-3 px-4 text-blue-300/50 font-medium">Graded</th>
                <th className="text-center py-3 px-4 text-blue-300/50 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.name} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white">{assignment.name}</td>
                  <td className="py-3 px-4 text-center">
                    {assignment.submitted ? (
                      <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle2 size={14} /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 text-xs">
                        <AlertCircle size={14} /> No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {assignment.graded ? (
                      <span className="text-blue-300/70 text-xs">✓</span>
                    ) : (
                      <span className="text-yellow-400 text-xs">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {assignment.score ? (
                      <span className="text-white font-semibold">{assignment.score}%</span>
                    ) : (
                      <span className="text-blue-300/50">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-5 border border-white/8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame size={18} className="text-orange-400" />
            <span className="text-orange-400 font-semibold">Study Streak</span>
          </div>
          <p className="text-3xl font-bold text-white">{analyticsData.studyStreak}</p>
          <p className="text-blue-300/50 text-xs mt-1">consecutive days</p>
        </div>

        <div className="glass rounded-xl p-5 border border-white/8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={18} className="text-blue-400" />
            <span className="text-blue-400 font-semibold">Avg Study Time</span>
          </div>
          <p className="text-3xl font-bold text-white">5.4h</p>
          <p className="text-blue-300/50 text-xs mt-1">per day this week</p>
        </div>

        <div className="glass rounded-xl p-5 border border-white/8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart size={18} className="text-red-400" />
            <span className="text-red-400 font-semibold">Well-being Score</span>
          </div>
          <p className="text-3xl font-bold text-white">8.5/10</p>
          <p className="text-blue-300/50 text-xs mt-1">excellent balance</p>
        </div>
      </div>
    </div>
  );
}
