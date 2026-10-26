import { useEffect, useState } from 'react';

export default function Topbar({ onOpenSearch }) {
  const [today, setToday] = useState('');

  useEffect(() => {
    setToday(new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }));
  }, []);

  return (
    <div className="topbar">
      <div className="search-pill" onClick={onOpenSearch}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        Search everything — people, leave, payslips…
        <kbd className="mono" style={{ marginLeft: 'auto', fontSize: 10.5, background: 'var(--pearl-dim)', padding: '3px 7px', borderRadius: 6 }}>
          ⌘K
        </kbd>
      </div>
      <div className="top-right">
        <div className="top-date mono">{today}</div>
        <div className="icon-btn">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3a5 5 0 0 0-5 5v3.5L5 15v1h14v-1l-2-3.5V8a5 5 0 0 0-5-5z" />
            <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
          </svg>
        </div>
      </div>
    </div>
  );
}
