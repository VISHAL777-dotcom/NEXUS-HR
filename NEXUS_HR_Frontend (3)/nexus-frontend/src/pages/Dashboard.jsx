import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Ring from '../components/common/Ring';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { getAllUsers } from '../api/userApi';
import { getPendingRequests } from '../api/leaveRequestApi';
import { getAllCandidates } from '../api/candidateApi';
import { getAllLogs } from '../api/auditLogApi';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ users: [], pendingLeave: [], candidates: [], logs: [] });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [users, pendingLeave, candidates, logs] = await Promise.all([
          getAllUsers(),
          getPendingRequests(),
          getAllCandidates(),
          getAllLogs().catch(() => []),
        ]);
        if (mounted) setStats({ users, pendingLeave, candidates, logs });
      } catch (err) {
        if (mounted) setError('Could not load the dashboard. Is the backend running?');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingSpinner label="Assembling today's story…" />;
  if (error) return <Card span={12}><div className="empty-state">{error}</div></Card>;

  const activeUsers = stats.users.filter((u) => u.status === 'Active');
  const hiredCount = stats.candidates.filter((c) => c.stage === 'Hired').length;
  const inPipeline = stats.candidates.length - hiredCount;
  const deptCounts = activeUsers.reduce((acc, u) => {
    const name = u.department?.departmentName || 'Unassigned';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  return (
    <section>
      <div className="eyebrow">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} &middot; NEXUS HQ</div>
      <h1 className="headline">
        Good to see you, {user?.fullName?.split(' ')[0] || 'there'}. Nexus has <em>{stats.pendingLeave.length}</em> things waiting on you.
      </h1>
      <p className="subhead">A living view of your organization — pulled live from your NEXUS HR backend.</p>

      <div className="bento">
        <Card span={8} dark>
          <div className="eyebrow" style={{ color: 'var(--cyan)' }}>Today's story</div>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, lineHeight: 1.35, maxWidth: 520 }}>
            "{activeUsers.length} people are active across {Object.keys(deptCounts).length} departments, with {inPipeline} candidates moving through the hiring pipeline."
          </p>
          <div style={{ display: 'flex', gap: 22, marginTop: 24 }}>
            <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{activeUsers.length}</div><div className="titanium" style={{ fontSize: 10.5, textTransform: 'uppercase' }}>Active people</div></div>
            <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{stats.pendingLeave.length}</div><div className="titanium" style={{ fontSize: 10.5, textTransform: 'uppercase' }}>Pending leave</div></div>
            <div><div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{inPipeline}</div><div className="titanium" style={{ fontSize: 10.5, textTransform: 'uppercase' }}>In pipeline</div></div>
          </div>
        </Card>

        <Card span={4}>
          <div className="section-title">Workforce Pulse</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Ring value={stats.users.length ? (activeUsers.length / stats.users.length) * 100 : 0} color="var(--orange)" label="Active" />
          </div>
          <div className="titanium" style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>
            {activeUsers.length} of {stats.users.length} people currently active
          </div>
        </Card>

        <Card span={6}>
          <div className="section-title">Company Pulse<span className="see">By department</span></div>
          {Object.entries(deptCounts).length === 0 && <div className="titanium" style={{ fontSize: 12.5 }}>No department data yet.</div>}
          {Object.entries(deptCounts).map(([dept, count]) => {
            const pct = Math.round((count / activeUsers.length) * 100) || 0;
            return (
              <div key={dept} style={{ marginBottom: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                  <span>{dept}</span><span className="titanium mono">{count}</span>
                </div>
                <div style={{ height: 5, borderRadius: 4, background: 'var(--pearl-dim)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,var(--indigo),var(--cyan))' }} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card span={6}>
          <div className="section-title">Recruitment Snapshot</div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Ring value={stats.candidates.length ? (hiredCount / stats.candidates.length) * 100 : 0} size={90} stroke={8} color="var(--emerald)" big={false} label="Hired" />
            <div>
              <div className="titanium" style={{ fontSize: 12 }}>{stats.candidates.length} total candidates this cycle</div>
              <div className="pill-tag tag-emerald" style={{ marginTop: 8 }}>{hiredCount} hired</div>
            </div>
          </div>
        </Card>

        <Card span={12}>
          <div className="section-title">Recent Activity<span className="see">Latest {Math.min(stats.logs.length, 6)} events</span></div>
          {stats.logs.length === 0 && <div className="titanium" style={{ fontSize: 12.5 }}>No audit activity visible to your role yet.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {stats.logs.slice(0, 6).map((log) => (
              <div key={log.logId} className="card" style={{ padding: 16, boxShadow: 'none', borderColor: 'var(--card-line)' }}>
                <div className="pill-tag tag-indigo" style={{ marginBottom: 10 }}>{new Date(log.timestamp).toLocaleString()}</div>
                <div style={{ fontSize: 12.5 }}>
                  <b>{log.user?.fullName || 'System'}</b> {log.action.toLowerCase().replace(/_/g, ' ')} on {log.entityName}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
