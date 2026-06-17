import React, { useState } from 'react';
import { GraduationCap, BookOpen, Shield, Eye, EyeOff, ArrowLeft, Sparkles, Users, BarChart3 } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { UserRole } from '../types/database';

interface LoginPageProps {
  onBack: () => void;
}

type AuthMode = 'login' | 'signup';

const ROLES: { id: UserRole; label: string; description: string; icon: React.ElementType; color: string; accent: string }[] = [
  {
    id: 'student',
    label: 'Student',
    description: 'Access coursework, attendance & analytics',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
    accent: 'border-blue-500/40 bg-blue-500/10',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    description: 'Manage courses, assignments & students',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    accent: 'border-emerald-500/40 bg-emerald-500/10',
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Full platform administration & insights',
    icon: Shield,
    color: 'from-orange-500 to-amber-500',
    accent: 'border-orange-500/40 bg-orange-500/10',
  },
];

const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string; name: string }> = {
  student: { email: 'demo.student@studysphere.com', password: 'demo1234', name: 'Alex Johnson' },
  faculty: { email: 'demo.faculty@studysphere.com', password: 'demo1234', name: 'Dr. Sarah Chen' },
  admin: { email: 'demo.admin@studysphere.com', password: 'demo1234', name: 'Admin User' },
};

export default function LoginPage({ onBack }: LoginPageProps) {
  const { signIn, signUp } = useAuthContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedRoleConfig = ROLES.find(r => r.id === selectedRole)!;
  const Icon = selectedRoleConfig.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        if (!fullName.trim()) { setError('Full name is required'); setLoading(false); return; }
        await signUp(email, password, fullName, selectedRole);
      }
    } catch (err: any) {
      setError(err.message ?? 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    const demo = DEMO_ACCOUNTS[selectedRole];
    try {
      await signIn(demo.email, demo.password);
    } catch {
      try {
        await signUp(demo.email, demo.password, demo.name, selectedRole);
      } catch (err: any) {
        setError(err.message ?? 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>

        <div className="glass rounded-2xl p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedRoleConfig.color} mb-4 shadow-lg`}>
              <Icon size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-400 text-sm">
              {mode === 'login' ? 'Sign in to your StudySphere account' : 'Join StudySphere today'}
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map(role => {
              const RIcon = role.icon;
              const active = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role.id); setError(''); }}
                  className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${
                    active
                      ? `${role.accent} border-current`
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${role.color}`}>
                    <RIcon size={16} className="text-white" />
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-white' : 'text-slate-400'}`}>
                    {role.label}
                  </span>
                  {active && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Role description */}
          <p className="text-xs text-slate-400 text-center mb-6 bg-white/5 rounded-lg px-3 py-2">
            {selectedRoleConfig.description}
          </p>

          {/* Mode tabs */}
          <div className="flex rounded-xl bg-white/5 p-1 mb-6">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === m
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/8 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min. 6 characters' : '••••••••'}
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${selectedRoleConfig.color} hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Demo login */}
          <div className="mt-4">
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <button
              onClick={handleDemo}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 hover:border-white/20 transition-all duration-200 disabled:opacity-50"
            >
              <Sparkles size={15} className="text-amber-400" />
              Try Demo {selectedRoleConfig.label} Account
            </button>
          </div>

          {/* Toggle mode */}
          <p className="text-center text-xs text-slate-500 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Users, label: 'Multi-role access' },
            { icon: Shield, label: 'Secure & private' },
            { icon: BarChart3, label: 'Smart analytics' },
          ].map(({ icon: FIcon, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/3 border border-white/5">
              <FIcon size={16} className="text-slate-400" />
              <span className="text-xs text-slate-500 text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
