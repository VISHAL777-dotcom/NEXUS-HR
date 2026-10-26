export default function EmptyState({ title = 'Nothing here yet', hint = '' }) {
  return (
    <div className="empty-state">
      <div className="serif">{title}</div>
      {hint && <div style={{ fontSize: 12.5 }}>{hint}</div>}
    </div>
  );
}
