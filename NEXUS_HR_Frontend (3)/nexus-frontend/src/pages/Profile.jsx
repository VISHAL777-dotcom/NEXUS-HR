import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/common/Card';
import Ring from '../components/common/Ring';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../hooks/useAuth';
import { getUserById } from '../api/userApi';
import { getReviewsByUser } from '../api/performanceReviewApi';
import { getPayrollByUser } from '../api/payrollApi';
import { getAttendanceByUser } from '../api/attendanceApi';

function heatmapColor(status) {
  if (status === 'Present') return 'rgba(79,70,229,0.75)';
  if (status === 'WFH') return 'rgba(34,211,238,0.6)';
  if (status === 'Late') return 'rgba(249,115,22,0.6)';
  return 'var(--card-line)';
}

export default function Profile() {
  const { user: authUser } = useAuth();
  const [params] = useSearchParams();
  const userId = params.get('id') || authUser?.userId;

  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      getUserById(userId),
      getReviewsByUser(userId).catch(() => []),
      getPayrollByUser(userId).catch(() => []),
      getAttendanceByUser(userId).catch(() => []),
    ])
      .then(([u, r, p, a]) => {
        setUser(u);
        setReviews(r);
        setPayroll(p);
        setAttendance(a);
      })
      .catch(() => setError('Could not load this profile.'))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner label="Loading profile…" />;
  if (error || !user) return <EmptyState title={error || 'Profile not found'} />;

  const latestReview = reviews[reviews.length - 1];
  const latestPayroll = payroll[payroll.length - 1];

  return (
    <section>
      <div className="profile-hero">
        <Avatar name={user.fullName} size={100} fontSize={32} className="ph-avatar" />
        <div className="ph-info">
          <h1>{user.fullName}</h1>
          <div className="r">{user.designation || 'Team member'} &middot; {user.department?.departmentName || 'Unassigned'} &middot; Joined {user.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : '—'}</div>
          <div className="ph-tags">
            <span className="pill-tag" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>
              {user.status === 'Active' ? '🟢' : '⚪'} {user.status}
            </span>
            <span className="pill-tag" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>{user.role?.roleName}</span>
            <span className="pill-tag" style={{ background: 'rgba(255,255,255,.12)', color: '#fff' }}>{user.employeeCode || 'No code'}</span>
          </div>
        </div>
      </div>

      <div className="bento" style={{ marginTop: 18 }}>
        <Card span={4}>
          <div className="section-title">Latest Performance</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Ring value={latestReview?.performanceScore ?? 0} color="var(--indigo)" label={latestReview?.reviewPeriod || 'No review yet'} />
          </div>
        </Card>

        <Card span={4}>
          <div className="section-title">Latest Payslip</div>
          {latestPayroll ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>₹{Number(latestPayroll.netPay).toLocaleString()}</div>
              <div className="titanium" style={{ fontSize: 12 }}>{latestPayroll.payPeriod} &middot; {latestPayroll.status}</div>
            </>
          ) : (
            <div className="titanium" style={{ fontSize: 12.5 }}>No payroll records yet.</div>
          )}
        </Card>

        <Card span={4}>
          <div className="section-title">Contact</div>
          <div style={{ fontSize: 12.5, lineHeight: 2 }}>
            <div>{user.email}</div>
            <div>{user.phone || 'No phone on file'}</div>
          </div>
        </Card>

        <Card span={7}>
          <div className="section-title">Performance History</div>
          {reviews.length === 0 && <div className="titanium" style={{ fontSize: 12.5 }}>No performance reviews recorded yet.</div>}
          <div className="row-list">
            {reviews.slice().reverse().map((r) => (
              <div key={r.reviewId} className="row-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.reviewPeriod}</div>
                  <div className="titanium" style={{ fontSize: 11.5 }}>{r.strengths || 'No notes recorded'}</div>
                </div>
                <span className="pill-tag tag-indigo">{r.performanceScore ?? '—'}</span>
                <span className="pill-tag tag-emerald">{r.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card span={5}>
          <div className="section-title">Attendance Heatmap</div>
          <div className="heatmap-grid">
            {Array.from({ length: 60 }).map((_, i) => {
              const record = attendance[attendance.length - 60 + i];
              return <div key={i} className="heatmap-cell" style={{ background: heatmapColor(record?.status) }} title={record?.date} />;
            })}
          </div>
        </Card>

        <Card span={12}>
          <div className="section-title">Payroll Timeline</div>
          {payroll.length === 0 && <div className="titanium" style={{ fontSize: 12.5 }}>No payroll history yet.</div>}
          <div className="row-list">
            {payroll.slice().reverse().map((p) => (
              <div key={p.payrollId} className="row-item">
                <div style={{ flex: 1, fontSize: 13 }}>{p.payPeriod}</div>
                <div className="mono" style={{ fontSize: 13 }}>₹{Number(p.netPay).toLocaleString()}</div>
                <span className="pill-tag tag-cyan">{p.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
