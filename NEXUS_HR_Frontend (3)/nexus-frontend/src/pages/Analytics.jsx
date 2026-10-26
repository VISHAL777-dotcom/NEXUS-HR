import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Ring from '../components/common/Ring';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAllUsers } from '../api/userApi';
import { getAllCandidates } from '../api/candidateApi';
import { getAllDepartments } from '../api/departmentApi';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

export default function Analytics() {
  const [users, setUsers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllUsers(), getAllCandidates(), getAllDepartments()])
      .then(([u, c, d]) => { setUsers(u); setCandidates(c); setDepartments(d); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Crunching the numbers…" />;

  const activeCount = users.filter((u) => u.status === 'Active').length;
  const inactiveCount = users.length - activeCount;
  const inactivityRate = users.length ? (inactiveCount / users.length) * 100 : 0;

  const deptHealth = departments.map((d) => {
    const members = users.filter((u) => u.department?.departmentId === d.departmentId);
    const activeMembers = members.filter((u) => u.status === 'Active').length;
    const pct = members.length ? Math.round((activeMembers / members.length) * 100) : 0;
    return { name: d.departmentName, pct, count: members.length };
  });

  const funnel = STAGES.map((stage) => ({
    stage,
    count: candidates.filter((c) => c.stage === stage).length,
  }));
  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1);

  return (
    <section>
      <div className="eyebrow">Executive briefing</div>
      <h1 className="headline">The numbers, <em>told as a story</em>.</h1>
      <p className="subhead">Computed live from your workforce and recruitment data.</p>

      <div className="bento">
        <Card span={4}>
          <div className="section-title">Headcount</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 34 }}>{users.length}</div>
          <div className="titanium" style={{ fontSize: 12 }}>{activeCount} active &middot; {inactiveCount} inactive</div>
        </Card>

        <Card span={4} style={{ textAlign: 'center' }}>
          <div className="section-title" style={{ justifyContent: 'center' }}>Inactivity Rate</div>
          <Ring value={inactivityRate} color="var(--orange)" label="Inactive" />
        </Card>

        <Card span={4}>
          <div className="section-title">Departments</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 34 }}>{departments.length}</div>
          <div className="titanium" style={{ fontSize: 12 }}>clusters tracked</div>
        </Card>

        <Card span={6}>
          <div className="section-title">Department Health</div>
          {deptHealth.length === 0 && <div className="titanium" style={{ fontSize: 12.5 }}>No departments yet.</div>}
          {deptHealth.map((d) => (
            <div key={d.name} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 4 }}>
                <span>{d.name}</span><span className="titanium mono">{d.pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 4, background: 'var(--pearl-dim)', overflow: 'hidden' }}>
                <div style={{ width: `${d.pct}%`, height: '100%', background: d.pct > 80 ? 'var(--emerald)' : d.pct > 50 ? 'var(--cyan)' : 'var(--orange)' }} />
              </div>
            </div>
          ))}
        </Card>

        <Card span={6}>
          <div className="section-title">Hiring Funnel</div>
          {funnel.map((f, i) => (
            <div key={f.stage} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, marginBottom: 5 }}>
                <span>{f.stage}</span><span className="titanium mono">{f.count}</span>
              </div>
              <div style={{ height: 16, borderRadius: 8, width: `${(f.count / maxFunnel) * 100}%`, minWidth: 4, background: 'linear-gradient(90deg,var(--indigo),var(--cyan))', opacity: 0.5 + i * 0.1 }} />
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
