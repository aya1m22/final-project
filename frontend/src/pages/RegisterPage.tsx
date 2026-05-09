import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', email: '', password: '', password2: '' });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) { setError('Passwords do not match.'); return; }
    try {
      await register(form);
      navigate('/');
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data ? Object.values(data).flat().join(' ') : 'Registration failed.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.04), var(--color-bg) 60%)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl italic text-gold">AURA</Link>
        </div>

        <div className="rounded-lg p-8" style={{ background: 'var(--color-bg-2)', border: '1px solid var(--color-border)' }}>
          <h2 className="font-display text-2xl text-text mb-1">Create Account</h2>
          <p className="text-text-3 text-sm mb-6">Join AURA for personalized styling</p>

          {error && <div className="text-red text-sm mb-4 p-3 rounded" style={{ background: 'rgba(224,92,92,0.1)' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-text-2 tracking-wider block mb-1.5">FIRST NAME</label>
                <input type="text" value={form.first_name} onChange={e => set('first_name', e.target.value)} required className="w-full px-3 py-2.5 text-sm rounded-md outline-none" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label className="text-xs text-text-2 tracking-wider block mb-1.5">LAST NAME</label>
                <input type="text" value={form.last_name} onChange={e => set('last_name', e.target.value)} required className="w-full px-3 py-2.5 text-sm rounded-md outline-none" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-2 tracking-wider block mb-1.5">USERNAME</label>
              <input type="text" value={form.username} onChange={e => set('username', e.target.value)} required className="w-full px-4 py-2.5 text-sm rounded-md outline-none" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label className="text-xs text-text-2 tracking-wider block mb-1.5">EMAIL</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className="w-full px-4 py-2.5 text-sm rounded-md outline-none" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label className="text-xs text-text-2 tracking-wider block mb-1.5">PASSWORD</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required className="w-full px-4 py-2.5 text-sm rounded-md outline-none" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <div>
              <label className="text-xs text-text-2 tracking-wider block mb-1.5">CONFIRM PASSWORD</label>
              <input type="password" value={form.password2} onChange={e => set('password2', e.target.value)} required className="w-full px-4 py-2.5 text-sm rounded-md outline-none" style={{ background: 'var(--color-bg-1)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
            <button type="submit" disabled={isLoading} className="w-full py-3 text-[13px] tracking-[0.15em] font-medium rounded-md transition-all hover:opacity-90 disabled:opacity-50" style={{ background: 'var(--color-gold)', color: 'var(--color-bg)' }}>
              {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-3 mt-6">
          Already have an account? <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
