import { useState, useEffect } from 'react';
import {
  Brain, Lightbulb, TrendingUp, TrendingDown, Target, Sparkles,
  BookOpen, Clock, Zap, Award, AlertTriangle, CheckCircle2,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart, Calendar,
  Star, Coffee, Moon, Sun, Activity, Flame, Eye, Cpu
} from 'lucide-react';

interface StudyTip {
  id: string;
  title: string;
  description: string;
  category: 'focus' | 'retention' | 'time-management' | 'wellness';
  impact: 'high' | 'medium' | 'low';
  icon: React.ElementType;
}

interface WeakSubject {
  subject: string;
  currentGrade: string;
  gradeNumber: number;
  trend: 'improving' | 'declining' | 'stable';
  recommendation: string;
  priority: 'critical' | 'moderate' | 'attention';
  icon: React.ElementType;
}

interface ProductivityInsight {
  id: string;
  title: string;
  metric: string;
  change: number;
  isPositive: boolean;
  description: string;
  icon: React.ElementType;
}

interface SmartInsight {
  id: string;
  type: 'achievement' | 'warning' | 'suggestion' | 'prediction';
  title: string;
  message: string;
  icon: React.ElementType;
  color: string;
}

const subjects = [
  { name: 'Data Structures', icon: Cpu },
  { name: 'Operating Systems', icon: Activity },
  { name: 'Database Systems', icon: BarChart3 },
  { name: 'Computer Networks', icon: Eye },
  { name: 'Software Engineering', icon: BookOpen },
];

const studyTips: StudyTip[] = [
  {
    id: '1',
    title: 'Spaced Repetition for Data Structures',
    description: 'Your quiz scores improve 23% when you review material 24h, 72h, and 7 days after initial learning. Apply this to Binary Trees chapter.',
    category: 'retention',
    impact: 'high',
    icon: Brain,
  },
  {
    id: '2',
    title: 'Peak Focus Hours Identified',
    description: 'Based on your assignment submission times, you\'re most productive between 9-11 AM. Schedule complex problem-solving sessions then.',
    category: 'focus',
    impact: 'high',
    icon: Zap,
  },
  {
    id: '3',
    title: 'Take Break Every 52 Minutes',
    description: 'Your attention span analysis suggests 52-minute focus blocks with 17-minute breaks optimize your retention rate by 18%.',
    category: 'time-management',
    impact: 'medium',
    icon: Clock,
  },
  {
    id: '4',
    title: 'Active Recall for Operating Systems',
    description: 'Switch from passive reading to practice tests. Students using active recall score 31% higher on average in OS exams.',
    category: 'retention',
    impact: 'high',
    icon: Target,
  },
  {
    id: '5',
    title: 'Balance Study Sessions',
    description: 'You spent 68% of study time on 2 subjects last week. Distribute time across all 5 subjects for better overall GPA.',
    category: 'time-management',
    impact: 'medium',
    icon: Calendar,
  },
  {
    id: '6',
    title: 'Sleep Schedule Optimization',
    description: 'Students with 7-8 hours of sleep retain 40% more information. Your late-night sessions may be hurting retention.',
    category: 'wellness',
    impact: 'high',
    icon: Moon,
  },
];

const weakSubjects: WeakSubject[] = [
  {
    subject: 'Operating Systems',
    currentGrade: 'C+',
    gradeNumber: 68,
    trend: 'declining',
    recommendation: 'Focus on process scheduling algorithms. Attend office hours. Practice 3 problems daily from this topic.',
    priority: 'critical',
    icon: Activity,
  },
  {
    subject: 'Computer Networks',
    currentGrade: 'B-',
    gradeNumber: 72,
    trend: 'stable',
    recommendation: 'Review TCP/IP protocols. Create mind maps for network layers. Join study group discussions.',
    priority: 'moderate',
    icon: Eye,
  },
  {
    subject: 'Database Systems',
    currentGrade: 'B',
    gradeNumber: 78,
    trend: 'improving',
    recommendation: 'Continue current approach. Focus on query optimization for next exam.',
    priority: 'attention',
    icon: BarChart3,
  },
];

const productivityInsights: ProductivityInsight[] = [
  {
    id: '1',
    title: 'Weekly Study Hours',
    metric: '24.5 hrs',
    change: 12,
    isPositive: true,
    description: 'Up from last week',
    icon: Clock,
  },
  {
    id: '2',
    title: 'Assignment Completion Rate',
    metric: '87%',
    change: 5,
    isPositive: true,
    description: 'Above class average',
    icon: CheckCircle2,
  },
  {
    id: '3',
    title: 'Average Focus Score',
    metric: '7.2/10',
    change: -3,
    isPositive: false,
    description: 'Room for improvement',
    icon: Target,
  },
  {
    id: '4',
    title: 'Procrastination Index',
    metric: 'Low',
    change: 15,
    isPositive: true,
    description: 'Improved this month',
    icon: Zap,
  },
];

const smartInsights: SmartInsight[] = [
  {
    id: '1',
    type: 'prediction',
    title: 'Grade Prediction',
    message: 'Based on current trajectory, you\'re likely to achieve B+ in Data Structures. 15 more practice problems could push it to A-.',
    icon: TrendingUp,
    color: 'text-blue-400',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Attention Needed',
    message: 'Operating Systems quiz in 5 days. Your current preparation level is at 45%. Recommended: 6 more hours of study.',
    icon: AlertTriangle,
    color: 'text-yellow-400',
  },
  {
    id: '3',
    type: 'achievement',
    title: 'Milestone Reached',
    message: 'You\'ve maintained a 7-day study streak! This consistency correlates with 35% better exam performance.',
    icon: Award,
    color: 'text-green-400',
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'Optimization Found',
    message: 'Switching Operating Systems study time to morning could improve comprehension by 22% based on your cognitive patterns.',
    icon: Lightbulb,
    color: 'text-purple-400',
  },
  {
    id: '5',
    type: 'prediction',
    title: 'Workload Forecast',
    message: 'Next week has 3 assignments due. AI suggests starting the Database project by Wednesday for optimal time distribution.',
    icon: Calendar,
    color: 'text-cyan-400',
  },
];

const categoryColors: Record<string, string> = {
  focus: 'from-blue-500 to-cyan-500',
  retention: 'from-purple-500 to-pink-500',
  'time-management': 'from-green-500 to-emerald-500',
  wellness: 'from-yellow-500 to-orange-500',
};

const priorityColors: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400' },
  moderate: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  attention: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400' },
};

export default function AIRecommendations() {
  const [activeTab, setActiveTab] = useState<'overview' | 'weak-subjects' | 'productivity' | 'insights'>('overview');
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);


  const renderTipCard = (tip: StudyTip, index: number) => {
    const Icon = tip.icon;
    const gradient = categoryColors[tip.category];

    return (
      <div
        key={tip.id}
        className={`glass-card rounded-2xl p-5 border border-white/8 hover:border-blue-500/30 transition-all duration-500 ${
          animateCards ? 'animate-slide-up' : 'opacity-0'
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg`}>
            <Icon size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-white font-semibold text-sm">{tip.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                tip.impact === 'high' ? 'bg-green-500/15 text-green-400' :
                tip.impact === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
                'bg-gray-500/15 text-gray-400'
              }`}>
                {tip.impact} impact
              </span>
            </div>
            <p className="text-blue-200/60 text-xs leading-relaxed">{tip.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderWeakSubjectCard = (subject: WeakSubject, index: number) => {
    const Icon = subject.icon;
    const colors = priorityColors[subject.priority];

    return (
      <div
        key={subject.subject}
        className={`glass-card rounded-2xl p-6 border ${colors.border} hover:shadow-xl transition-all duration-500 ${
          animateCards ? 'animate-slide-up' : 'opacity-0'
        }`}
        style={{ animationDelay: `${index * 150}ms` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <Icon size={22} className={colors.text} />
            </div>
            <div>
              <h4 className="text-white font-semibold">{subject.subject}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-2xl font-bold ${
                  subject.gradeNumber >= 80 ? 'text-green-400' :
                  subject.gradeNumber >= 70 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {subject.currentGrade}
                </span>
                <span className="text-blue-300/40 text-sm">({subject.gradeNumber}%)</span>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${
            subject.trend === 'improving' ? 'text-green-400' :
            subject.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {subject.trend === 'improving' ? <TrendingUp size={16} /> :
             subject.trend === 'declining' ? <TrendingDown size={16} /> : <Activity size={16} />}
            <span className="text-xs capitalize">{subject.trend}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-blue-300/40">Current Performance</span>
            <span className={colors.text}>{subject.gradeNumber}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                subject.gradeNumber >= 80 ? 'bg-green-500' :
                subject.gradeNumber >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${subject.gradeNumber}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Lightbulb size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-blue-200/70 text-xs">{subject.recommendation}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderProductivityCard = (insight: ProductivityInsight & { icon: React.ElementType }, index: number) => {
    const Icon = insight.icon;

    return (
      <div
        key={insight.id}
        className={`glass rounded-xl p-4 border border-white/8 transition-all duration-500 ${
          animateCards ? 'animate-slide-up' : 'opacity-0'
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Icon size={18} className="text-blue-400" />
          </div>
          <div className={`flex items-center gap-1 ${insight.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {insight.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span className="text-xs font-medium">{Math.abs(insight.change)}%</span>
          </div>
        </div>
        <p className="text-white font-semibold text-lg">{insight.metric}</p>
        <p className="text-blue-300/50 text-xs mb-1">{insight.title}</p>
        <p className="text-blue-300/40 text-[10px]">{insight.description}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 border border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <Brain size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">AI Study Assistant</h2>
                  <p className="text-blue-300/50 text-xs">Powered by adaptive learning algorithms</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-green-400 text-xs">AI Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {(['overview', 'weak-subjects', 'productivity', 'insights'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl transition-all ${
              activeTab === tab
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-blue-300/50 hover:text-blue-200 hover:bg-white/5'
            }`}
          >
            {tab === 'overview' && <Sparkles size={16} />}
            {tab === 'weak-subjects' && <Target size={16} />}
            {tab === 'productivity' && <Zap size={16} />}
            {tab === 'insights' && <Eye size={16} />}
            <span className="capitalize">{tab.replace('-', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Personalized Study Tips */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-blue-400" />
              <h3 className="text-white font-semibold text-lg">Personalized Study Tips</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {studyTips.slice(0, 4).map((tip, i) => renderTipCard(tip, i))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-xl p-5 border border-white/8 text-center">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-blue-300/50 text-xs">Critical Subject</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-white/8 text-center">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                <TrendingUp size={18} className="text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">12%</p>
              <p className="text-blue-300/50 text-xs">Productivity Gain</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-white/8 text-center">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={18} className="text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">87%</p>
              <p className="text-blue-300/50 text-xs">Completion Rate</p>
            </div>
            <div className="glass-card rounded-xl p-5 border border-white/8 text-center">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-2">
                <Sparkles size={18} className="text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-white">23</p>
              <p className="text-blue-300/50 text-xs">Tips Generated</p>
            </div>
          </div>

          {/* Smart Insights Preview */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">Smart Insights</h3>
              <button onClick={() => setActiveTab('insights')} className="text-blue-400 text-xs hover:text-blue-300">View All</button>
            </div>
            <div className="space-y-3">
              {smartInsights.slice(0, 3).map((insight) => {
                const Icon = insight.icon;
                return (
                  <div key={insight.id} className="flex items-start gap-3 glass rounded-xl p-4">
                    <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0`}>
                      <Icon size={18} className={insight.color} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{insight.title}</p>
                      <p className="text-blue-300/60 text-xs mt-0.5">{insight.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Weak Subjects Tab */}
      {activeTab === 'weak-subjects' && (
        <>
          <div className="glass-card rounded-2xl p-5 border border-white/8 mb-4">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-400" />
              <div>
                <p className="text-white font-medium">Weak Subject Analysis</p>
                <p className="text-blue-300/50 text-xs">AI has identified subjects that need immediate attention</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {weakSubjects.map((subject, i) => renderWeakSubjectCard(subject, i))}
          </div>

          {/* Additional Tips */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass rounded-xl p-5 border border-white/8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                <Calendar size={20} className="text-white" />
              </div>
              <p className="text-white font-medium text-sm">Study Schedule</p>
              <p className="text-blue-300/50 text-xs mt-1">AI suggests 2hr blocks for weak subjects</p>
            </div>
            <div className="glass rounded-xl p-5 border border-white/8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
                <Coffee size={20} className="text-white" />
              </div>
              <p className="text-white font-medium text-sm">Study Groups</p>
              <p className="text-blue-300/50 text-xs mt-1">Join OS study group Tues 6PM</p>
            </div>
            <div className="glass rounded-xl p-5 border border-white/8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-3">
                <BookOpen size={20} className="text-white" />
              </div>
              <p className="text-white font-medium text-sm">Resources</p>
              <p className="text-blue-300/50 text-xs mt-1">3 new practice sets available</p>
            </div>
          </div>
        </>
      )}

      {/* Productivity Tab */}
      {activeTab === 'productivity' && (
        <>
          {/* Productivity Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {productivityInsights.map((insight, i) => renderProductivityCard(insight as ProductivityInsight & { icon: React.ElementType }, i))}
          </div>

          {/* Productivity Recommendations */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-4">Productivity Recommendations</h3>
            <div className="space-y-4">
              {studyTips.filter(t => t.category === 'focus' || t.category === 'time-management').map((tip, i) => (
                <div key={tip.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[tip.category]} flex items-center justify-center shrink-0`}>
                    <tip.icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{tip.title}</p>
                    <p className="text-blue-300/50 text-xs mt-0.5">{tip.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    tip.impact === 'high' ? 'bg-green-500/15 text-green-400' :
                    'bg-yellow-500/15 text-yellow-400'
                  }`}>
                    {tip.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Productivity Chart */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-4">Weekly Productivity Score</h3>
            <div className="flex items-end gap-2 h-40">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const score = [65, 78, 82, 71, 88, 45, 52][i];
                const height = score;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-white/5 rounded-t overflow-hidden relative h-32">
                      <div
                        className={`absolute bottom-0 w-full rounded-t transition-all duration-1000 ${
                          score >= 80 ? 'bg-gradient-to-t from-green-600 to-green-400' :
                          score >= 60 ? 'bg-gradient-to-t from-blue-600 to-blue-400' :
                          'bg-gradient-to-t from-red-600 to-red-400'
                        }`}
                        style={{ height: `${height}%`, transitionDelay: `${i * 100}ms` }}
                      />
                    </div>
                    <span className="text-blue-300/50 text-xs">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <>
          {/* AI Analytics Section */}
          <div className="glass-card rounded-2xl p-6 border border-white/8 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-blue-400" />
              <h3 className="text-white font-semibold text-lg">AI-Style Analytics</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4">
                <p className="text-blue-300/50 text-xs mb-2">Learning Efficiency</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">8.4</span>
                  <span className="text-green-400 text-sm mb-1">+1.2</span>
                </div>
                <p className="text-blue-300/40 text-xs mt-1">out of 10 this week</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-blue-300/50 text-xs mb-2">Knowledge Retention</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">76%</span>
                  <span className="text-green-400 text-sm mb-1">+5%</span>
                </div>
                <p className="text-blue-300/40 text-xs mt-1">Above class average</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-blue-300/50 text-xs mb-2">Focus Duration Avg</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">47m</span>
                  <span className="text-red-400 text-sm mb-1">-3m</span>
                </div>
                <p className="text-blue-300/40 text-xs mt-1">Target: 52 minutes</p>
              </div>
            </div>

            {/* Subject Performance Radar */}
            <div className="grid md:grid-cols-5 gap-3">
              {subjects.map((subject, i) => {
                const score = [85, 68, 78, 72, 88][i];
                return (
                  <div key={subject.name} className="glass rounded-xl p-3 text-center">
                    <subject.icon size={16} className={`mx-auto mb-2 ${
                      score >= 80 ? 'text-green-400' :
                      score >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <p className="text-white text-sm font-bold">{score}%</p>
                    <p className="text-blue-300/40 text-[10px] truncate">{subject.name.split(' ')[0]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Smart Insights */}
          <div className="glass-card rounded-2xl p-6 border border-white/8">
            <h3 className="text-white font-semibold text-lg mb-4">All Smart Insights</h3>
            <div className="space-y-3">
              {smartInsights.map((insight, i) => {
                const Icon = insight.icon;
                const typeColors: Record<string, string> = {
                  achievement: 'border-green-500/20 bg-green-500/5',
                  warning: 'border-yellow-500/20 bg-yellow-500/5',
                  suggestion: 'border-purple-500/20 bg-purple-500/5',
                  prediction: 'border-blue-500/20 bg-blue-500/5',
                };

                return (
                  <div
                    key={insight.id}
                    className={`glass rounded-xl p-4 border ${typeColors[insight.type]} ${
                      animateCards ? 'animate-slide-up' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0`}>
                        <Icon size={18} className={insight.color} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium text-sm">{insight.title}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-blue-300/60 capitalize">
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-blue-300/60 text-xs">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
