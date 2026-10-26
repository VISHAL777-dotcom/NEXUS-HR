import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../components/common/Avatar';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { getAllDepartments } from '../api/departmentApi';
import { getAllUsers } from '../api/userApi';

export default function Organization() {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getAllDepartments(), getAllUsers()])
      .then(([d, u]) => { setDepartments(d); setUsers(u); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Mapping the organization…" />;

  const unassigned = users.filter((u) => !u.department);

  return (
    <section>
      <div className="eyebrow">{departments.length} clusters &middot; {users.length} people</div>
      <h1 className="headline">The company, <em>as a living graph</em>.</h1>
      <p className="subhead">Each cluster below is a department pulled live from /api/departments.</p>

      <div className="bento">
        {departments.map((dept) => {
          const members = users.filter((u) => u.department?.departmentId === dept.departmentId);
          const head = users.find((u) => u.userId === dept.headUserId);
          return (
            <Card span={6} key={dept.departmentId}>
              <div className="section-title">
                {dept.departmentName}
                <span className="pill-tag tag-indigo">{members.length} people</span>
              </div>
              {head && (
                <div style={{ fontSize: 12, color: 'var(--titanium)', marginBottom: 12 }}>
                  Led by <b style={{ color: 'var(--ink)' }}>{head.fullName}</b>
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {members.length === 0 && <div className="titanium" style={{ fontSize: 12 }}>No members assigned yet.</div>}
                {members.map((m) => (
                  <div
                    key={m.userId}
                    onClick={() => navigate(`/profile?id=${m.userId}`)}
                    style={{ textAlign: 'center', cursor: 'pointer', width: 64 }}
                  >
                    <Avatar name={m.fullName} size={44} />
                    <div style={{ fontSize: 10, marginTop: 4, lineHeight: 1.2 }}>{m.fullName.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {departments.length === 0 && (
          <Card span={12}><EmptyState title="No departments yet" hint="Create one from /api/departments to see it mapped here." /></Card>
        )}

        {unassigned.length > 0 && (
          <Card span={12}>
            <div className="section-title">Unassigned</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {unassigned.map((m) => (
                <div key={m.userId} onClick={() => navigate(`/profile?id=${m.userId}`)} style={{ textAlign: 'center', cursor: 'pointer', width: 64 }}>
                  <Avatar name={m.fullName} size={44} />
                  <div style={{ fontSize: 10, marginTop: 4 }}>{m.fullName.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
