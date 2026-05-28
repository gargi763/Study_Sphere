import { useState, useEffect } from 'react';
import { BookOpen, Brain, BarChart2, Calendar, Bell, Zap, ChevronRight, Star, Users, Award, ArrowRight, Menu, X } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'login' | 'dashboard') => void;
}

const features = [
  { icon: BarChart2, title: 'Analytics Dashboard', desc: 'Track your study hours, productivity scores, and academic performance with beautiful charts.' },
  { icon: Calendar, title: 'Smart Study Planner', desc: 'Plan your day with an intuitive drag-and-drop scheduler tailored for students.' },
  { icon: Bell, title: 'Smart Notifications', desc: 'Never miss a deadline with intelligent reminders for assignments and exams.' },
  { icon: Brain, title: 'AI Study Insights', desc: 'Get personalized recommendations to optimize your learning patterns.' },
  { icon: BookOpen, title: 'Assignment Tracker', desc: 'Manage all your assignments in one place with priority levels and progress tracking.' },
  { icon: Zap, title: 'Expense Tracker', desc: 'Monitor your student budget with visual breakdowns and spending insights.' },
];

const stats = [
  { value: '50K+', label: 'Active Students' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '2.4x', label: 'Productivity Boost' },
  { value: '200+', label: 'Universities' },
];

const testimonials = [
  { name: 'Priya Sharma', major: 'Computer Science', text: 'StudySphere completely transformed how I manage my academic life. My GPA went from 3.2 to 3.8!', stars: 5 },
  { name: 'Marcus Williams', major: 'Engineering', text: 'The expense tracker alone saved me $300 last semester. This app is a game changer.', stars: 5 },
  { name: 'Sofia Chen', major: 'Pre-Med', text: 'The study planner keeps me on track even during the most intense exam periods. Highly recommend!', stars: 5 },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleStats, setVisibleStats] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => setVisibleStats(true), 800);
    return () => { window.removeEventListener('scroll', handleScroll); clearTimeout(timer); };
  }, []);

  return (
    <div className="min-h-screen bg-mesh text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full opacity-5 blur-3xl animate-pulse-slow" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-600 rounded-full opacity-5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg shadow-black/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-blue">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">StudySphere</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-blue-100/70 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-sm text-blue-100/70 hover:text-white transition-colors">About</a>
            <a href="#testimonials" className="text-sm text-blue-100/70 hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => onNavigate('login')} className="text-sm text-blue-200 hover:text-white transition-colors px-4 py-2">Sign In</button>
            <button onClick={() => onNavigate('login')} className="text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30">Get Started</button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass-dark border-t border-white/10 px-6 py-4 flex flex-col gap-4">
            <a href="#features" className="text-blue-100/70 hover:text-white transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <button onClick={() => onNavigate('login')} className="text-sm text-blue-200 text-left">Sign In</button>
            <button onClick={() => onNavigate('login')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl w-fit">Get Started</button>
          </div>
        )}
      </nav>

      <section className="relative pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-xs text-blue-300 border border-blue-500/20">
            <Zap size={12} className="text-yellow-400" />
            <span>AI-Powered Student Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-white">Your Academic</span><br />
            <span className="text-gradient">Command Center</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            StudySphere brings together attendance tracking, assignment management, study planning, and expense monitoring — everything a student needs to excel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('dashboard')} className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-105">
              View Dashboard Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => onNavigate('login')} className="flex items-center gap-3 glass hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border border-white/10">
              Sign In <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-16 relative">
            <div className="glass-card rounded-3xl p-6 max-w-3xl mx-auto border border-white/10 shadow-2xl shadow-black/40">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="glass rounded-2xl p-4 text-left">
                  <p className="text-blue-300/60 text-xs mb-1">Attendance</p>
                  <p className="text-2xl font-bold text-white">87%</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full mt-2"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '87%' }} /></div>
                </div>
                <div className="glass rounded-2xl p-4 text-left">
                  <p className="text-blue-300/60 text-xs mb-1">Assignments</p>
                  <p className="text-2xl font-bold text-white">4/5</p>
                  <p className="text-green-400 text-xs mt-1">On track</p>
                </div>
                <div className="glass rounded-2xl p-4 text-left">
                  <p className="text-blue-300/60 text-xs mb-1">Study Hours</p>
                  <p className="text-2xl font-bold text-white">37.6h</p>
                  <p className="text-blue-400 text-xs mt-1">This week</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [55, 75, 48, 88, 67, 95, 32];
                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-white/5 rounded-full overflow-hidden" style={{ height: 60 }}>
                        <div className="w-full rounded-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000" style={{ height: `${heights[i]}%`, marginTop: 'auto' }} />
                      </div>
                      <span className="text-xs text-blue-300/40">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`glass-card rounded-2xl p-6 text-center transition-all duration-700 ${visibleStats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="text-3xl md:text-4xl font-bold text-gradient-blue">{stat.value}</p>
                <p className="text-blue-200/50 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-blue-200/50 text-lg max-w-xl mx-auto">One platform to manage your entire academic journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={feature.title} className="glass-card rounded-2xl p-6 group hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/20 cursor-default animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/40 group-hover:to-blue-400/30 transition-all">
                  <feature.icon size={22} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-blue-200/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by Students</h2>
            <p className="text-blue-200/50 text-lg">Join thousands of students achieving more</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="glass-card rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex gap-1 mb-4">{Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-blue-100/70 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><p className="text-white text-sm font-medium">{t.name}</p><p className="text-blue-300/50 text-xs">{t.major}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none" />
            <Users size={40} className="text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Excel?</h2>
            <p className="text-blue-200/60 text-lg mb-8">Join StudySphere today and transform the way you study.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => onNavigate('login')} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-900/40 hover:scale-105">Start Free Today <ArrowRight size={18} /></button>
              <button onClick={() => onNavigate('dashboard')} className="flex items-center justify-center gap-2 glass hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold transition-all border border-white/10"><Award size={18} className="text-yellow-400" />Try Demo</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><BookOpen size={14} className="text-white" /></div>
            <span className="text-white font-semibold">StudySphere</span>
          </div>
          <p className="text-blue-300/30 text-sm">2026 StudySphere. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
}
