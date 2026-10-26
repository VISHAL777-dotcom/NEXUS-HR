import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllRoles } from '../api/roleApi';

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [rolesError, setRolesError] = useState('');
  const [loadingRoles, setLoadingRoles] = useState(true);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    designation: '',
    dateOfJoining: new Date().toISOString().slice(0, 10),
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllRoles()
      .then((data) => {
        setRoles(data);
        if (data.length > 0) {
          setForm((f) => ({ ...f, roleId: String(data[0].roleId) }));
        }
      })
      .catch(() => setRolesError('Could not load roles. Ask your admin to create one first.'))
      .finally(() => setLoadingRoles(false));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (!form.roleId) {
      setFormError('Please select a role.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        roleId: Number(form.roleId),
        designation: form.designation || undefined,
        dateOfJoining: form.dateOfJoining,
      });
      // Registration succeeded - log the new user straight in for a seamless flow
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="aurora-blob b1" />
      <div className="aurora-blob b2" />
      <div className="login-card" style={{ width: 440 }}>
        <div className="brand" style={{ padding: 0, marginBottom: 24 }}>
          <div className="brand-mark" />
          <div className="brand-text">
            <div className="name">NEXUS HR</div>
            <div className="tag">People &middot; Intelligence &middot; Future</div>
          </div>
        </div>

        <div className="eyebrow">New here</div>
        <h1 className="headline" style={{ fontSize: 26, marginBottom: 20 }}>
          Create your <em>workspace</em> account.
        </h1>

        {rolesError && <div className="field-error" style={{ marginBottom: 14 }}>{rolesError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              required
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              placeholder="Aarav Kapoor"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@nexushr.com"
              autoComplete="username"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                required
                value={form.roleId}
                onChange={(e) => update('roleId', e.target.value)}
                disabled={loadingRoles || roles.length === 0}
              >
                {loadingRoles && <option>Loading…</option>}
                {!loadingRoles && roles.length === 0 && <option value="">No roles available</option>}
                {roles.map((r) => (
                  <option key={r.roleId} value={r.roleId}>{r.roleName}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="designation">Designation</label>
              <input
                id="designation"
                value={form.designation}
                onChange={(e) => update('designation', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="dateOfJoining">Date of joining</label>
            <input
              id="dateOfJoining"
              type="date"
              required
              value={form.dateOfJoining}
              onChange={(e) => update('dateOfJoining', e.target.value)}
            />
          </div>

          {formError && <div className="field-error" style={{ marginBottom: 14 }}>{formError}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={submitting || loadingRoles || roles.length === 0}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12.5, color: 'var(--titanium)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--indigo)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
