import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ username: email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.04), var(--color-bg) 60%)' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl italic text-gold">AURA</Link>
        </div>

        {/* Card */}
        <div className="rounded-lg p-8" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
          <h2 className="font-display text-2xl text-text mb-1">Welcome back</h2>
          <p className="text-text-3 text-sm mb-6">Sign in to your account</p>

          {error && <div className="text-red text-sm mb-4 p-3 rounded" style={{ background: 'rgba(224,92,92,0.1)' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-text-2 tracking-wider block mb-1.5">USERNAME</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 text-sm rounded-md outline-none transition-colors focus:border-gold/40" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label className="text-xs text-text-2 tracking-wider block mb-1.5">PASSWORD</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2.5 text-sm rounded-md outline-none transition-colors focus:border-gold/40 pr-12" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 text-xs hover:text-text-2">{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 text-[13px] tracking-[0.15em] font-medium rounded-md transition-all hover:opacity-90 disabled:opacity-50" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-3 mt-6">
          Don't have an account? <Link to="/register" className="text-gold hover:text-gold-light transition-colors">Create one →</Link>
        </p>
      </div>
    </div>
  );
}
