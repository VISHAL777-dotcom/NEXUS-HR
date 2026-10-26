import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Ring from '../components/common/Ring';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import { useAuth } from '../hooks/useAuth';
import { getAttendanceByUser, clockIn, clockOut } from '../api/attendanceApi';

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  function load() {
    setLoading(true);
    getAttendanceByUser(user.userId)
      .then(setRecords)
      .catch(() => setToast({ message: 'Could not load attendance history.', type: 'error' }))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((r) => r.date === today);
  const isClockedIn = todayRecord && !todayRecord.clockOut;

  async function handleClockIn() {
    setBusy(true);
    try {
      await clockIn(user.userId, 'NEXUS HQ');
      setToast({ message: 'Clocked in. Have a great day!', type: 'success' });
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not clock in.', type: 'error' });
    } finally {
      setBusy(false);
    }
  }

  async function handleClockOut() {
    setBusy(true);
    try {
      await clockOut(user.userId);
      setToast({ message: 'Clocked out. Focus hours recorded.', type: 'success' });
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not clock out.', type: 'error' });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading your day…" />;

  const last7 = records.slice(-7);
  const avgFocus =
    last7.length > 0
      ? last7.reduce((sum, r) => sum + Number(r.focusHours || 0), 0) / last7.length
      : 0;

  return (
    <section>
      <div className="eyebrow">Live &middot; NEXUS HQ</div>
      <h1 className="headline">Your day, <em>as a journey</em>.</h1>
      <p className="subhead">Clock in and out here — focus hours are computed automatically by the backend.</p>

      <div className="bento">
        <Card span={4} style={{ textAlign: 'center' }}>
          <div className="section-title">Status</div>
          <Ring value={Math.min((avgFocus / 8) * 100, 100)} color="var(--cyan)" label={`${avgFocus.toFixed(1)} hrs avg`} />
          <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center' }}>
            {!isClockedIn ? (
              <button className="btn btn-primary" onClick={handleClockIn} disabled={busy}>Clock In</button>
            ) : (
              <button className="btn btn-danger" onClick={handleClockOut} disabled={busy}>Clock Out</button>
            )}
          </div>
        </Card>

        <Card span={8}>
          <div className="section-title">Weekly Trend</div>
          {last7.length === 0 ? (
            <EmptyState title="No attendance yet" hint="Clock in to start building your history." />
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, marginTop: 16 }}>
              {last7.map((r) => {
                const h = Math.min((Number(r.focusHours || 0) / 10) * 100, 100);
                return (
                  <div key={r.attendanceId} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: '100%', height: `${h}%`, minHeight: 4, borderRadius: '8px 8px 3px 3px', background: 'linear-gradient(180deg,var(--indigo),rgba(79,70,229,.3))' }} />
                    <span className="titanium" style={{ fontSize: 10.5 }}>{new Date(r.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card span={12}>
          <div className="section-title">History</div>
          <div className="row-list">
            {records.slice().reverse().map((r) => (
              <div key={r.attendanceId} className="row-item">
                <div style={{ flex: 1, fontSize: 13 }}>{new Date(r.date).toLocaleDateString()}</div>
                <div className="titanium mono" style={{ fontSize: 12 }}>
                  {r.clockIn ? new Date(r.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  {' → '}
                  {r.clockOut ? new Date(r.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In progress'}
                </div>
                <span className="pill-tag tag-indigo">{r.focusHours ?? 0}h</span>
                <span className="pill-tag tag-emerald">{r.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </section>
  );
}
