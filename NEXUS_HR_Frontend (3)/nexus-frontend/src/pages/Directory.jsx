import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { getAllUsers } from '../api/userApi';

const GRADIENTS = [
  'linear-gradient(135deg,var(--indigo),var(--purple))',
  'linear-gradient(135deg,var(--cyan),var(--indigo))',
  'linear-gradient(135deg,var(--orange),var(--purple))',
  'linear-gradient(135deg,var(--emerald),var(--cyan))',
];

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setError('Could not load the directory.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading people…" />;
  if (error) return <EmptyState title={error} />;

  const filtered = users.filter((u) =>
    `${u.fullName} ${u.designation || ''} ${u.department?.departmentName || ''}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <section>
      <div className="eyebrow">{users.length} people</div>
      <h1 className="headline">Every person, <em>one story</em> each.</h1>
      <p className="subhead">Hover a card to see availability and role. Data pulled live from /api/users.</p>

      <div className="field" style={{ maxWidth: 320, marginBottom: 24 }}>
        <input placeholder="Search by name, role, or department…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No one matches that search" hint="Try a different name or department." />
      ) : (
        <div className="directory-grid">
          {filtered.map((u, i) => (
            <div key={u.userId} className="card profile-card" onClick={() => navigate(`/profile?id=${u.userId}`)}>
              <div className="pc-cover" style={{ background: GRADIENTS[i % GRADIENTS.length] }} />
              <div className="pc-body">
                <Avatar name={u.fullName} size={72} className="pc-avatar" />
                <div className="pc-name">{u.fullName}</div>
                <div className="pc-role">{u.designation || 'Team member'} &middot; {u.department?.departmentName || 'Unassigned'}</div>
                <div className="pc-skills">
                  <span className="pc-skill">{u.employeeCode || '—'}</span>
                  <span className="pc-skill">{u.email}</span>
                </div>
                <div className="pc-more">
                  <p style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                    Joined {u.dateOfJoining ? new Date(u.dateOfJoining).toLocaleDateString() : '—'}.
                  </p>
                  <div className="pc-stats">
                    <div className="pc-avail">
                      <span className="status-dot" style={{ background: u.status === 'Active' ? 'var(--emerald)' : 'var(--titanium)' }} />
                      {u.status}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700 }} className="mono">{u.phone || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
