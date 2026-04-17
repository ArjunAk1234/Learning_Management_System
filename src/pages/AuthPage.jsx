import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        if (!form.name.trim()) { setError('Name is required'); return; }
        await signup(form.name, form.email, form.password);
      }
      navigate('/dashboard');
    } catch {
      setError('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--surface)' }}>
      {/* Left Panel — Branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #0c1a2e 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--primary), transparent)' }} />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--secondary), transparent)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
            <GraduationCap size={22} color="white" />
          </div>
          <span className="text-2xl font-bold gradient-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Learnify
          </span>
        </div>

        {/* Main text */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
            Unlock Your <span className="gradient-text">Learning</span> Potential
          </h1>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Access world-class courses, track your progress, and achieve your goals with our intelligent learning platform.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '50K+', label: 'Students' },
              { value: '200+', label: 'Courses' },
              { value: '98%', label: 'Satisfaction' },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className="relative z-10 glass rounded-xl p-5">
          <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
            "Education is the most powerful weapon which you can use to change the world."
          </p>
          <p className="text-xs font-semibold mt-2" style={{ color: 'var(--primary-light)' }}>— Nelson Mandela</p>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md fade-in-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Learnify
            </span>
          </div>

          {/* Tabs */}
          <div className="flex p-1 rounded-xl mb-8"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'transparent',
                  color: mode === m ? 'white' : 'var(--text-secondary)',
                  boxShadow: mode === m ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Welcome back 👋' : 'Create your account'}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login' ? 'Sign in to continue your learning journey.' : 'Join 50,000+ students learning today.'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field pl-9"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field pl-9"
                required
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-field pl-9 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>
                {error}
              </p>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" className="text-xs hover:underline" style={{ color: 'var(--primary-light)' }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary justify-center py-3 text-sm mt-1">
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> {mode === 'login' ? 'Signing in...' : 'Creating account...'}</>
              ) : (
                <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-4 rounded-xl text-center"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.3)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Demo: Enter any email & password to log in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
