import { useState } from 'react';
import { BookOpen, Eye, EyeOff, LogIn, ArrowLeft, Lock, Mail, UserPlus } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

interface LoginPageProps {
  onNavigate: (page: 'landing' | 'login' | 'dashboard') => void;
}

type AuthMode = 'login' | 'signup';

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { signIn, signUp } = useAuthContext();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password, {
          name,
          major: 'Computer Science',
          year: '3rd Year',
          university: 'Tech University',
        });
      }
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@studysphere.com');
    setPassword('demo1234');
    setLoading(true);
    try {
      await signIn('demo@studysphere.com', 'demo1234');
      onNavigate('dashboard');
    } catch {
      try {
        await signUp('demo@studysphere.com', 'demo1234', {
          name: 'Alex Johnson',
          major: 'Computer Science',
          year: '3rd Year',
          university: 'Tech University',
          student_id: 'STU-2024-0847',
        });
        onNavigate('dashboard');
      } catch (err: any) {
        setError(err.message || 'Demo login failed. Please sign up manually.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-700 rounded-full opacity-8 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-700 rounded-full opacity-8 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 dark:text-blue-300/60 hover:text-slate-900 dark:hover:text-white transition-colors text-sm group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card rounded-3xl p-8 border transition-theme border-slate-300/20 dark:border-white/10 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 glow-blue shadow-xl shadow-blue-900/40">
              <BookOpen size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-600 dark:text-blue-200/50 text-sm mt-1 transition-colors">
              {mode === 'login' ? 'Sign in to your StudySphere account' : 'Join StudySphere and start studying smarter'}
            </p>
          </div>

          {mode === 'login' && (
            <button onClick={handleDemoLogin} disabled={loading} className="w-full glass hover:bg-slate-100 dark:hover:bg-white/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-white py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-6 flex items-center justify-center gap-2 disabled:opacity-60">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Try with Demo Account
            </button>
          )}

          {mode === 'login' && (
            <div className="relative flex items-center mb-6">
              <div className="flex-1 h-px bg-slate-300 dark:bg-white/10 transition-colors" />
              <span className="px-3 text-xs text-slate-600 dark:text-blue-300/40 transition-colors">or sign in manually</span>
              <div className="flex-1 h-px bg-slate-300 dark:bg-white/10 transition-colors" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl px-4 py-3 text-red-600 dark:text-red-300 text-sm transition-colors">{error}</div>}

            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 dark:text-blue-300/60 font-medium uppercase tracking-wide transition-colors">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full glass bg-white/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-blue-300/30 text-sm outline-none transition-all duration-200 focus:bg-white/8"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 dark:text-blue-300/60 font-medium uppercase tracking-wide transition-colors">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-blue-400/50" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@university.edu" className="w-full glass bg-white/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-blue-300/30 text-sm outline-none transition-all duration-200 focus:bg-white/8" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-600 dark:text-blue-300/60 font-medium uppercase tracking-wide transition-colors">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-blue-400/50" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full glass bg-white/5 dark:bg-white/5 border border-slate-300 dark:border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-12 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-blue-300/30 text-sm outline-none transition-all duration-200 focus:bg-white/8" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-blue-400/50 hover:text-slate-600 dark:hover:text-blue-300 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:scale-[1.01] flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                <>{mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}{mode === 'login' ? 'Sign In' : 'Create Account'}</>
              )}
            </button>
          </form>

          <p className="text-center text-slate-600 dark:text-blue-300/40 text-xs mt-6 transition-colors">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium ml-1"
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex -space-x-2">
            {['TK', 'PR', 'SC', 'AM'].map((init, i) => (<div key={init} className="w-7 h-7 rounded-full border-2 border-slate-200 dark:border-blue-900 flex items-center justify-center text-xs font-bold text-white" style={{ background: `hsl(${210 + i * 20}, 70%, 40%)` }}>{init}</div>))}
          </div>
          <p className="text-slate-600 dark:text-blue-300/40 text-xs transition-colors">50,000+ students studying smarter</p>
        </div>
      </div>
    </div>
  );
}
