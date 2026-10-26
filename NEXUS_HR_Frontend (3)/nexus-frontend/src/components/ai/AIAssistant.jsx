import { useState } from 'react';

const SUGGESTIONS = [
  { q: 'Summarize this employee', a: 'This employee has a strong delivery record with no flight-risk signals in the last 90 days.' },
  { q: 'Who might resign soon?', a: 'Based on attendance and focus-hour trends, 1 employee currently shows early flight-risk signals. Worth a 1:1.' },
  { q: 'Draft an announcement', a: 'Draft ready: "Team — great progress this sprint, details in #announcements." Want me to post it?' },
  { q: 'Who deserves a promotion?', a: 'Two employees are tracking well against their growth goals this cycle. I can prep the review docs.' },
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi — ask me anything about your people, attendance, or payroll.' },
  ]);
  const [input, setInput] = useState('');

  function send(text, replyOverride) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: 'bot', text: replyOverride || 'Got it — pulling that together now. I\'ll have insights ready shortly.' },
      ]);
    }, 500);
  }

  return (
    <>
      <div className="ai-fab" onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      </div>
      <div className={`ai-panel${open ? ' open' : ''}`}>
        <div className="ai-panel-head">
          <div className="orb" />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15 }}>Nexus Intelligence</div>
            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>Ask anything about your people</div>
          </div>
        </div>
        <div className="ai-body">
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.from === 'bot' ? 'bot' : 'user'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, padding: '0 18px 14px 18px' }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.q}
              onClick={() => send(s.q, s.a)}
              style={{ fontSize: 11, padding: '7px 12px', borderRadius: 999, background: 'var(--pearl-dim)', fontWeight: 600 }}
            >
              {s.q}
            </button>
          ))}
        </div>
        <div className="ai-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask Nexus…"
          />
          <button
            onClick={() => send(input)}
            style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
