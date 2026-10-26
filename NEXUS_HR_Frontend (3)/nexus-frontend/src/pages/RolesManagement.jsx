import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Toast from '../components/common/Toast';
import { useAuth } from '../hooks/useAuth';
import { getAllRoles, createRole, updateRole, deleteRole } from '../api/roleApi';

const ADMIN_ROLES = ['Admin', 'HR Manager'];
const EMPTY_FORM = { roleName: '', description: '' };

export default function RolesManagement() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function load() {
    setLoading(true);
    getAllRoles()
      .then(setRoles)
      .catch(() => setToast({ message: 'Could not load roles.', type: 'error' }))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  // Not an admin/HR manager? Don't even render the page - bounce home.
  if (!isAdmin) return <Navigate to="/" replace />;

  function startEdit(role) {
    setEditingId(role.roleId);
    setForm({ roleName: role.roleName, description: role.description || '' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateRole(editingId, form);
        setToast({ message: 'Role updated.', type: 'success' });
      } else {
        await createRole(form);
        setToast({ message: 'Role created — it now appears on the registration form.', type: 'success' });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not save this role.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(role) {
    if (!window.confirm(`Delete the "${role.roleName}" role? Any user still assigned to it will break their login.`)) {
      return;
    }
    try {
      await deleteRole(role.roleId);
      setToast({ message: 'Role deleted.', type: 'default' });
      load();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not delete this role — it may still be in use.', type: 'error' });
    }
  }

  if (loading) return <LoadingSpinner label="Loading roles…" />;

  return (
    <section>
      <div className="eyebrow">{roles.length} roles configured</div>
      <h1 className="headline">Access, <em>defined here</em>.</h1>
      <p className="subhead">
        Roles created here immediately become selectable on the registration page — no database access required.
      </p>

      <div className="bento">
        <Card span={5}>
          <div className="section-title">{editingId ? 'Edit Role' : 'New Role'}</div>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Role name</label>
              <input
                required
                value={form.roleName}
                onChange={(e) => setForm({ ...form, roleName: e.target.value })}
                placeholder="e.g. Recruiter"
              />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What this role can do"
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : editingId ? 'Save changes' : 'Create role'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
              )}
            </div>
          </form>
        </Card>

        <Card span={7}>
          <div className="section-title">Existing Roles</div>
          {roles.length === 0 ? (
            <EmptyState title="No roles yet" hint="Create the first one on the left." />
          ) : (
            <div className="row-list">
              {roles.map((r) => (
                <div key={r.roleId} className="row-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.roleName}</div>
                    <div className="titanium" style={{ fontSize: 11.5 }}>{r.description || 'No description'}</div>
                  </div>
                  <button className="btn btn-ghost" style={{ padding: '7px 14px' }} onClick={() => startEdit(r)}>Edit</button>
                  <button className="btn btn-danger" style={{ padding: '7px 14px' }} onClick={() => handleDelete(r)}>Delete</button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </section>
  );
}
