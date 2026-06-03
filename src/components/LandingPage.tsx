import { useState, useEffect } from 'react';
import { BookOpen, Brain, BarChart2, Calendar, Bell, Zap, ChevronRight, Star, Users, Award, ArrowRight, Menu, X, Lightbulb, Target, Smartphone, TrendingUp, Heart, Globe, CheckCircle2, Sparkles, Code } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SmartCampusIntegration from './dashboard/SmartCampusIntegration';

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

const sdgGoals = [
  { id: 4, title: 'Quality Education', subtitle: 'Ensure inclusive and equitable quality education', color: 'from-red-600 to-red-400', icon: BookOpen, description: 'Democratizing access to learning tools for all students worldwide' },
  { id: 3, title: 'Good Health & Wellbeing', subtitle: 'Support mental health and work-life balance', color: 'from-green-600 to-green-400', icon: Heart, description: 'Promoting healthy study patterns and stress management' },
  { id: 17, title: 'Partnerships for Goals', subtitle: 'Build partnerships to achieve SDGs', color: 'from-blue-600 to-blue-400', icon: Users, description: 'Collaborating with educational institutions globally' },
];

const benefits = [
  { icon: Sparkles, title: 'Smart Organization', desc: 'AI-powered scheduling keeps you ahead' },
  { icon: TrendingUp, title: 'Real-time Analytics', desc: 'Track progress with beautiful visualizations' },
  { icon: Smartphone, title: 'Mobile Optimized', desc: 'Manage everything on any device' },
  { icon: Globe, title: 'Global Community', desc: 'Connect with students worldwide' },
  { icon: CheckCircle2, title: 'Task Management', desc: 'Never miss a deadline again' },
  { icon: Code, title: 'Smart Integration', desc: 'Syncs with your digital life' },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleStats, setVisibleStats] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const timer = setTimeout(() => setVisibleStats(true), 800);
    const testimonialTimer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      clearInterval(testimonialTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-mesh text-slate-900 dark:text-white overflow-x-hidden transition-colors">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 dark:bg-blue-600 rounded-full opacity-5 blur-3xl animate-pulse-slow" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-600 dark:bg-purple-600 rounded-full opacity-5 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg shadow-black/20 dark:shadow-black/30' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center glow-blue">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900 dark:text-white transition-colors tracking-tight">StudySphere</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 dark:text-blue-100/70 hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#sdg" className="text-sm text-slate-600 dark:text-blue-100/70 hover:text-slate-900 dark:hover:text-white transition-colors">Impact</a>
            <a href="#testimonials" className="text-sm text-slate-600 dark:text-blue-100/70 hover:text-slate-900 dark:hover:text-white transition-colors">Reviews</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => onNavigate('login')} className="text-sm text-slate-600 dark:text-blue-200 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2">Sign In</button>
            <ThemeToggle />
            <button onClick={() => onNavigate('login')} className="text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/30">Get Started</button>
          </div>
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button className="text-slate-900 dark:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass-dark border-t transition-theme border-slate-200/20 dark:border-white/10 px-6 py-4 flex flex-col gap-4">
            <a href="#features" className="text-slate-600 dark:text-blue-100/70 hover:text-slate-900 dark:hover:text-white transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#sdg" className="text-slate-600 dark:text-blue-100/70 hover:text-slate-900 dark:hover:text-white transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Impact</a>
            <a href="#testimonials" className="text-slate-600 dark:text-blue-100/70 hover:text-slate-900 dark:hover:text-white transition-colors text-sm" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
            <button onClick={() => onNavigate('login')} className="text-sm text-slate-600 dark:text-blue-200 text-left">Sign In</button>
            <button onClick={() => onNavigate('login')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl w-fit">Get Started</button>
          </div>
        )}
      </nav>

      <section className="relative pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-xs text-slate-600 dark:text-blue-300 border transition-theme border-slate-300/30 dark:border-blue-500/20">
            <Zap size={12} className="text-yellow-400" />
            <span>AI-Powered Student Dashboard</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-slate-900 dark:text-white transition-colors">Your Academic</span><br />
            <span className="text-gradient">Command Center</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-blue-100/60 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors">
            StudySphere brings together attendance tracking, assignment management, study planning, and expense monitoring — everything a student needs to excel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onNavigate('dashboard')} className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-blue-900/40 hover:shadow-blue-900/60 hover:scale-105">
              View Dashboard Demo <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => onNavigate('login')} className="flex items-center gap-3 glass hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border transition-theme border-slate-300/30 dark:border-white/10">
              Sign In <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-16 relative">
            <div className="glass-card rounded-3xl p-6 max-w-3xl mx-auto border transition-theme border-slate-300/20 dark:border-white/10 shadow-2xl shadow-black/40">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="glass rounded-2xl p-4 text-left">
                  <p className="text-slate-500 dark:text-blue-300/60 text-xs mb-1 transition-colors">Attendance</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">87%</p>
                  <div className="w-full h-1.5 bg-slate-300 dark:bg-white/10 rounded-full mt-2 transition-colors"><div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: '87%' }} /></div>
                </div>
                <div className="glass rounded-2xl p-4 text-left">
                  <p className="text-slate-500 dark:text-blue-300/60 text-xs mb-1 transition-colors">Assignments</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">4/5</p>
                  <p className="text-green-400 text-xs mt-1">On track</p>
                </div>
                <div className="glass rounded-2xl p-4 text-left">
                  <p className="text-slate-500 dark:text-blue-300/60 text-xs mb-1 transition-colors">Study Hours</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">37.6h</p>
                  <p className="text-blue-400 text-xs mt-1">This week</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const heights = [55, 75, 48, 88, 67, 95, 32];
                  return (
                    <div key={day} className="flex flex-col items-center gap-1">
                      <div className="w-6 bg-slate-300 dark:bg-white/5 rounded-full overflow-hidden transition-colors" style={{ height: 60 }}>
                        <div className="w-full rounded-full bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-1000" style={{ height: `${heights[i]}%`, marginTop: 'auto' }} />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-blue-300/40 transition-colors">{day}</span>
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
                <p className="text-slate-600 dark:text-blue-200/50 text-sm mt-1 transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Everything You Need</h2>
            <p className="text-slate-600 dark:text-blue-200/50 text-lg max-w-xl mx-auto transition-colors">One platform to manage your entire academic journey</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={feature.title} className="glass-card rounded-2xl p-6 group hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/20 cursor-default animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/30 to-blue-500/20 dark:from-blue-600/30 dark:to-blue-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/40 group-hover:to-blue-400/30 transition-all">
                  <feature.icon size={22} className="text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2 transition-colors">{feature.title}</h3>
                <p className="text-slate-600 dark:text-blue-200/50 text-sm leading-relaxed transition-colors">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sdg" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-xs text-slate-600 dark:text-blue-300 border transition-theme border-slate-300/30 dark:border-blue-500/20">
              <Globe size={12} className="text-green-400" />
              <span>Sustainable Development Goals</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Impact Beyond Academia</h2>
            <p className="text-slate-600 dark:text-blue-200/50 text-lg max-w-2xl mx-auto transition-colors">StudySphere aligns with UN SDGs to create positive global impact through education and wellbeing</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {sdgGoals.map((goal, i) => {
              const Icon = goal.icon;
              return (
                <div
                  key={goal.id}
                  className="glass-card rounded-2xl p-6 border transition-theme border-slate-300/20 dark:border-white/10 group hover:border-slate-400/40 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-slate-500 dark:text-blue-300/50 mb-1 transition-colors">SDG Goal {goal.id}</p>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg transition-colors">{goal.title}</h3>
                    <p className="text-slate-600 dark:text-blue-200/60 text-sm mt-1 transition-colors">{goal.subtitle}</p>
                  </div>
                  <p className="text-slate-600 dark:text-blue-200/50 text-sm leading-relaxed transition-colors">{goal.description}</p>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-2xl p-8 border transition-theme border-slate-300/30 dark:border-blue-500/20 bg-gradient-to-r from-blue-600/5 dark:from-blue-600/5 to-purple-600/5 dark:to-purple-600/5">
            <div className="grid md:grid-cols-6 gap-4">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="flex flex-col items-center text-center group cursor-default animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:bg-slate-300 dark:group-hover:bg-white/10 group-hover:scale-110 transition-all">
                      <Icon size={20} className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-semibold text-sm mb-1 transition-colors">{benefit.title}</h4>
                    <p className="text-slate-600 dark:text-blue-300/50 text-xs transition-colors">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Loved by Students</h2>
            <p className="text-slate-600 dark:text-blue-200/50 text-lg transition-colors">Join thousands of students achieving more</p>
          </div>

          <div className="relative">
            <div className="glass-card rounded-3xl p-8 border transition-theme border-slate-300/20 dark:border-white/10 min-h-80 flex flex-col justify-center">
              <div className="flex gap-1 mb-6">{Array.from({ length: testimonials[activeTestimonial].stars }).map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-xl text-slate-700 dark:text-blue-100/80 leading-relaxed mb-8 italic transition-colors">"{testimonials[activeTestimonial].text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">{testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <p className="text-slate-900 dark:text-white font-semibold transition-colors">{testimonials[activeTestimonial].name}</p>
                  <p className="text-slate-600 dark:text-blue-300/50 text-sm transition-colors">{testimonials[activeTestimonial].major}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeTestimonial ? 'bg-blue-400 w-8' : 'bg-slate-400 dark:bg-white/20 hover:bg-slate-500 dark:hover:bg-white/40 transition-colors'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {testimonials.map((t, idx) => (
              <div key={t.name} className={`glass-card rounded-2xl p-6 transition-all duration-300 cursor-pointer border transition-theme ${
                idx === activeTestimonial ? 'bg-slate-100 dark:bg-white/10 border-slate-400/40 dark:border-blue-500/30' : 'border-slate-300/20 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
              }`} onClick={() => setActiveTestimonial(idx)}>
                <div className="flex gap-1 mb-3">{Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-slate-600 dark:text-blue-100/60 text-xs leading-relaxed mb-3 line-clamp-3 transition-colors">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{t.name.split(' ').map(n => n[0]).join('')}</div>
                  <div><p className="text-slate-900 dark:text-white text-xs font-medium transition-colors">{t.name}</p><p className="text-slate-600 dark:text-blue-300/50 text-[10px] transition-colors">{t.major}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SmartCampusIntegration />

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-12 border transition-theme border-slate-300/20 dark:border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 dark:from-blue-600/10 to-purple-600/5 dark:to-purple-600/10 pointer-events-none" />
            <Users size={40} className="text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors">Ready to Excel?</h2>
            <p className="text-slate-600 dark:text-blue-200/60 text-lg mb-8 transition-colors">Join StudySphere today and transform the way you study.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => onNavigate('login')} className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg shadow-blue-900/40 hover:scale-105">Start Free Today <ArrowRight size={18} /></button>
              <button onClick={() => onNavigate('dashboard')} className="flex items-center justify-center gap-2 glass hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white px-8 py-4 rounded-2xl font-semibold transition-all border transition-theme border-slate-300/30 dark:border-white/10"><Award size={18} className="text-yellow-400" />Try Demo</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t transition-theme border-slate-300/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><BookOpen size={14} className="text-white" /></div>
            <span className="text-slate-900 dark:text-white font-semibold transition-colors">StudySphere</span>
          </div>
          <p className="text-slate-600 dark:text-blue-300/30 text-sm transition-colors">2026 StudySphere. Built for students, by students.</p>
        </div>
      </footer>

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.5);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .text-gradient {
          background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .text-gradient-blue {
          background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glow-blue {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
