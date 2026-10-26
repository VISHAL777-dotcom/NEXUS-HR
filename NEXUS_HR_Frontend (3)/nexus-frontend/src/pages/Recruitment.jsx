import { useEffect, useState } from 'react';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';
import { getAllCandidates, createCandidate, moveStage } from '../api/candidateApi';

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

export default function Recruitment() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullName: '', appliedRole: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  function load() {
    getAllCandidates().then(setCandidates).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleAdvance(candidate) {
    const idx = STAGES.indexOf(candidate.stage);
    if (idx === STAGES.length - 1) return;
    const nextStage = STAGES[idx + 1];
    try {
      await moveStage(candidate.candidateId, nextStage);
      setToast({ message: `${candidate.fullName} moved to ${nextStage}.`, type: 'success' });
      load();
    } catch {
      setToast({ message: 'Could not move candidate.', type: 'error' });
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCandidate(form);
      setToast({ message: 'Candidate added to Applied.', type: 'success' });
      setForm({ fullName: '', appliedRole: '', email: '' });
      setShowForm(false);
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not add candidate.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading pipeline…" />;

  return (
    <section>
      <div className="eyebrow">{candidates.length} candidates in motion</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
        <div>
          <h1 className="headline">Hiring, <em>choreographed</em>.</h1>
          <p className="subhead">Move candidates forward as they clear each stage.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ Add candidate'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 24 }}>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'end' }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Full name</label>
              <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Applied role</label>
              <input required value={form.appliedRole} onChange={(e) => setForm({ ...form, appliedRole: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: 'span 3' }} disabled={submitting}>
              {submitting ? 'Adding…' : 'Add to pipeline'}
            </button>
          </form>
        </div>
      )}

      <div className="kanban">
        {STAGES.map((stage) => {
          const inStage = candidates.filter((c) => c.stage === stage);
          return (
            <div className="kb-col" key={stage}>
              <div className="kb-head">
                <span className="t">{stage}</span>
                <span className="n">{inStage.length}</span>
              </div>
              {inStage.map((c) => (
                <div className="cand-card" key={c.candidateId}>
                  <div className="cand-top">
                    <Avatar name={c.fullName} size={34} />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.fullName}</div>
                      <div className="titanium" style={{ fontSize: 11 }}>{c.appliedRole}</div>
                    </div>
                  </div>
                  {c.aiScore != null && (
                    <div className="cand-score">
                      <div className="bar"><i style={{ width: `${c.aiScore}%` }} /></div>
                      <div className="mono" style={{ fontSize: 10.5, fontWeight: 700 }}>{c.aiScore}</div>
                    </div>
                  )}
                  {stage !== 'Hired' && (
                    <button className="btn btn-ghost" style={{ marginTop: 10, width: '100%', justifyContent: 'center', padding: '6px 0', fontSize: 11 }} onClick={() => handleAdvance(c)}>
                      Move to {STAGES[STAGES.indexOf(stage) + 1]} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </section>
  );
}
