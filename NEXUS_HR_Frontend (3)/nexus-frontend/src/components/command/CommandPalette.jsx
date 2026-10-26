import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ITEMS = [
  { icon: '🏠', label: "Back to Today's Story", to: '/' },
  { icon: '👤', label: 'Go to Directory', to: '/directory' },
  { icon: '⏱', label: 'Check Attendance', to: '/attendance' },
  { icon: '💰', label: 'Open Payroll', to: '/payroll' },
  { icon: '🗓', label: 'Review Leave requests', to: '/leave' },
  { icon: '🧩', label: 'Open Recruitment pipeline', to: '/recruitment' },
  { icon: '🧭', label: 'View Organization graph', to: '/organization' },
  { icon: '📊', label: 'Open Analytics', to: '/analytics' },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const filtered = ITEMS.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="cmdk-overlay" onClick={onClose}>
      <div className="cmdk-box" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-input">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search people, payslips, policies…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="cmdk-results">
          {filtered.length === 0 && (
            <div style={{ padding: 20, textAlign: 'center', color: 'var(--titanium)', fontSize: 13 }}>
              No matches
            </div>
          )}
          {filtered.map((item) => (
            <div
              key={item.to}
              className="cmdk-item"
              onClick={() => {
                navigate(item.to);
                onClose();
              }}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
