import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    try {
      await login(email, password);
      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="login-shell">
      <div className="aurora-blob b1" />
      <div className="aurora-blob b2" />
      <div className="login-card">
        <div className="brand" style={{ padding: 0, marginBottom: 28 }}>
          <div className="brand-mark" />
          <div className="brand-text">
            <div className="name">NEXUS HR</div>
            <div className="tag">People &middot; Intelligence &middot; Future</div>
          </div>
        </div>

        <div className="eyebrow">Welcome back</div>
        <h1 className="headline" style={{ fontSize: 28, marginBottom: 24 }}>
          Sign in to your <em>workspace</em>.
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@nexushr.com"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {formError && <div className="field-error" style={{ marginBottom: 14 }}>{formError}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12.5, color: 'var(--titanium)' }}>
          New to NEXUS HR? <Link to="/register" style={{ color: 'var(--indigo)', fontWeight: 600 }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
}
