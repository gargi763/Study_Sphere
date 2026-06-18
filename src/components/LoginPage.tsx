import { useState } from 'react';
import { BookOpen, Eye, EyeOff, LogIn, ArrowLeft, Lock, Mail } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: 'landing' | 'login' | 'dashboard') => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onNavigate('dashboard'); }, 1200);
  };

  const handleDemoLogin = () => {
    setEmail('alex.johnson@university.edu');
    setPassword('demo1234');
    setLoading(true);
    setTimeout(() => { setLoading(false); onNavigate('dashboard'); }, 1000);
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-700 rounded-full opacity-8 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-700 rounded-full opacity-8 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <button onClick={() => onNavigate('landing')} className="absolute top-6 left-6 flex items-center gap-2 text-blue-300/60 hover:text-white transition-colors text-sm group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </button>

      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl shadow-black/40">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 glow-blue shadow-xl shadow-blue-900/40">
              <BookOpen size={26} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-blue-200/50 text-sm mt-1">Sign in to your StudySphere account</p>
          </div>

          <button onClick={handleDemoLogin} className="w-full glass hover:bg-white/10 border border-blue-500/30 text-blue-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-6 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Try with Demo Account
          </button>

          <div className="relative flex items-center mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-3 text-xs text-blue-300/40">or sign in manually</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>}
            <div className="space-y-1.5">
              <label className="text-xs text-blue-300/60 font-medium uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@university.edu" className="w-full glass bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-4 py-3 text-white placeholder-blue-300/30 text-sm outline-none transition-all duration-200 focus:bg-white/8" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-blue-300/60 font-medium uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400/50" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full glass bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl pl-11 pr-12 py-3 text-white placeholder-blue-300/30 text-sm outline-none transition-all duration-200 focus:bg-white/8" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400/50 hover:text-blue-300 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" /><span className="text-xs text-blue-300/50">Remember me</span></label>
              <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:scale-[1.01] flex items-center justify-center gap-2">
              {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>) : (<><LogIn size={16} />Sign In</>)}
            </button>
          </form>
          <p className="text-center text-blue-300/40 text-xs mt-6">Don't have an account? <button className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Sign up free</button></p>
        </div>
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="flex -space-x-2">
            {['TK', 'PR', 'SC', 'AM'].map((init, i) => (<div key={init} className="w-7 h-7 rounded-full border-2 border-blue-900 flex items-center justify-center text-xs font-bold text-white" style={{ background: `hsl(${210 + i * 20}, 70%, 40%)` }}>{init}</div>))}
          </div>
          <p className="text-blue-300/40 text-xs">50,000+ students studying smarter</p>
        </div>
      </div>
    </div>
  );
}
