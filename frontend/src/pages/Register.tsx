import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

function passwordStrength(p: string) {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[A-Z]/.test(p)) score++;
  if (/[0-9]/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  return score;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#e63946', '#f59e0b', '#3b82f6', '#22c55e'];

export default function Register() {
  const { loginWithCredentials } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const strength = passwordStrength(form.password);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (strength < 2) { setError('Please choose a stronger password.'); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      await loginWithCredentials(form.email, form.password);
      nav('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap" style={{ minHeight: '100vh', paddingTop: 'var(--nav-h)' }}>
      {/* Visual Panel */}
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-word" aria-hidden="true">JOIN</div>
        <div className="auth-visual-content">
          <blockquote className="auth-visual-quote">
            "Style is a way to say who you are <em>without having to speak.</em>"
          </blockquote>
          <p className="auth-visual-sub">— Rachel Zoe</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-wrap">
        <div className="auth-form-inner page-enter">
          <Link to="/" className="auth-logo">FASHION<span>AI</span></Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-sub">Join thousands discovering their style with AI.</p>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, fontSize: '.84rem', marginBottom: 16, borderLeft: '3px solid #e63946' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={submit} noValidate>
            <div className="input-group">
              <label className="input-label" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" className="input" type="text" placeholder="Jane Doe" value={form.name} onChange={set('name')} required autoComplete="name" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-email">Email</label>
              <input id="reg-email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-pw">Password</label>
              <div className="input-icon-wrap">
                <input
                  id="reg-pw"
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                  autoComplete="new-password"
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <>
                  <div className="password-strength">
                    <div className={`password-strength-bar strength-${strength}`} style={{ background: STRENGTH_COLORS[strength] }} />
                  </div>
                  <div className="strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                    {STRENGTH_LABELS[strength]}
                  </div>
                </>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                className="input"
                type="password"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={set('confirm')}
                required
                style={form.confirm && form.confirm !== form.password ? { borderColor: '#e63946' } : {}}
              />
            </div>

            <button
              type="submit"
              id="register-submit"
              className="btn btn-primary full-width"
              style={{ padding: '16px', fontSize: '.82rem', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Creating Account…' : <>Create Account <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
