import { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Ring from '../components/common/Ring';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import { useAuth } from '../hooks/useAuth';
import { getBalancesByUserAndYear } from '../api/leaveBalanceApi';
import {
  getLeaveRequestsByUser,
  getPendingRequests,
  createLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
} from '../api/leaveRequestApi';

const YEAR = new Date().getFullYear();
const MANAGER_ROLES = ['Admin', 'HR Manager'];

export default function Leave() {
  const { user } = useAuth();
  const isManager = MANAGER_ROLES.includes(user?.role);

  const [balances, setBalances] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' });
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    Promise.all([
      getBalancesByUserAndYear(user.userId, YEAR).catch(() => []),
      getLeaveRequestsByUser(user.userId).catch(() => []),
      isManager ? getPendingRequests().catch(() => []) : Promise.resolve([]),
    ]).then(([b, mine, pend]) => {
      setBalances(b);
      setMyRequests(mine);
      setPending(pend);
      setLoading(false);
    });
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createLeaveRequest(user.userId, form);
      setToast({ message: 'Leave request submitted.', type: 'success' });
      setForm({ leaveType: 'Annual', startDate: '', endDate: '', reason: '' });
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not submit the request.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleApprove(id) {
    try {
      await approveLeaveRequest(id, user.userId, 'Approved via NEXUS HR');
      setToast({ message: 'Request approved.', type: 'success' });
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not approve.', type: 'error' });
    }
  }

  async function handleReject(id) {
    try {
      await rejectLeaveRequest(id, user.userId, 'Rejected via NEXUS HR');
      setToast({ message: 'Request rejected.', type: 'default' });
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not reject.', type: 'error' });
    }
  }

  if (loading) return <LoadingSpinner label="Loading leave data…" />;

  return (
    <section>
      <div className="eyebrow">{pending.length} requests pending review</div>
      <h1 className="headline">Time off, <em>at a glance</em>.</h1>
      <p className="subhead">Balances update automatically when a request is approved.</p>

      <div className="bento">
        <Card span={5}>
          <div className="section-title">Your Balance ({YEAR})</div>
          {balances.length === 0 ? (
            <EmptyState title="No balance configured" hint="Ask HR to set up your leave entitlement." />
          ) : (
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {balances.map((b) => {
                const remaining = Number(b.totalDays) - Number(b.usedDays);
                const pct = (remaining / Number(b.totalDays)) * 100;
                return (
                  <div key={b.balanceId} style={{ textAlign: 'center' }}>
                    <Ring value={pct} size={90} stroke={8} color="var(--indigo)" big={false} />
                    <div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 6 }}>{b.leaveType}</div>
                    <div className="titanium" style={{ fontSize: 10 }}>{remaining} of {b.totalDays} left</div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card span={7}>
          <div className="section-title">Request Time Off</div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="field">
                <label>Leave type</label>
                <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                  <option value="Annual">Annual</option>
                  <option value="Sick">Sick</option>
                  <option value="WFH">WFH</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
              <div className="field">
                <label>Reason</label>
                <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Optional" />
              </div>
              <div className="field">
                <label>Start date</label>
                <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="field">
                <label>End date</label>
                <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        </Card>

        <Card span={12}>
          <div className="section-title">Your Requests</div>
          {myRequests.length === 0 ? (
            <EmptyState title="No requests yet" />
          ) : (
            <div className="row-list">
              {myRequests.slice().reverse().map((r) => (
                <div key={r.leaveId} className="row-item">
                  <div style={{ flex: 1, fontSize: 13 }}>{r.leaveType} &middot; {r.startDate} → {r.endDate}</div>
                  <div className="titanium" style={{ fontSize: 11.5, flex: 1 }}>{r.managerComment || r.reason || '—'}</div>
                  <span className={`pill-tag ${r.status === 'Approved' ? 'tag-emerald' : r.status === 'Rejected' ? 'tag-orange' : 'tag-indigo'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {isManager && (
          <Card span={12}>
            <div className="section-title">Pending Approvals (All Employees)</div>
            {pending.length === 0 ? (
              <EmptyState title="Nothing to review" hint="All caught up." />
            ) : (
              <div className="row-list">
                {pending.map((r) => (
                  <div key={r.leaveId} className="row-item">
                    <div style={{ flex: 1, fontSize: 13 }}>
                      <b>{r.user?.fullName}</b> &middot; {r.leaveType} &middot; {r.startDate} → {r.endDate}
                    </div>
                    <button className="btn btn-primary" style={{ padding: '7px 14px' }} onClick={() => handleApprove(r.leaveId)}>Approve</button>
                    <button className="btn btn-ghost" style={{ padding: '7px 14px' }} onClick={() => handleReject(r.leaveId)}>Reject</button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </section>
  );
}
