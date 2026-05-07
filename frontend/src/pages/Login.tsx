import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const { loginWithCredentials } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithCredentials(email, password);
      nav('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap" style={{ minHeight: '100vh', paddingTop: 'var(--nav-h)' }}>
      {/* Visual Panel */}
      <div className="auth-visual">
        <div className="auth-visual-bg" />
        <div className="auth-visual-word" aria-hidden="true">STYLE</div>
        <div className="auth-visual-content">
          <blockquote className="auth-visual-quote">
            "Fashion is the armor to survive the <em>reality of everyday life.</em>"
          </blockquote>
          <p className="auth-visual-sub">— Bill Cunningham</p>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-wrap">
        <div className="auth-form-inner page-enter">
          <Link to="/" className="auth-logo">FASHION<span>AI</span></Link>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your curated wardrobe.</p>

          {error && (
            <div role="alert" style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 6, fontSize: '.84rem', marginBottom: 16, borderLeft: '3px solid #e63946' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={submit} noValidate>
            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label" htmlFor="login-pw">Password</label>
                <span style={{ fontSize: '.75rem', color: 'var(--grey-400)', cursor: 'pointer' }}>Forgot password?</span>
              </div>
              <div className="input-icon-wrap">
                <input
                  id="login-pw"
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="input-icon-btn" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              className="btn btn-primary full-width"
              style={{ padding: '16px', fontSize: '.82rem', marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Signing In…' : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="auth-or">or</div>
          <button
            className="btn btn-ghost full-width"
            style={{ padding: '14px' }}
            onClick={() => {
              setEmail('demo@fashionai.com');
              setPassword('Demo1234!');
            }}
          >
            Use Demo Account
          </button>

          <div className="auth-footer" style={{ marginTop: 24 }}>
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
