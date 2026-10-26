export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="center-pad" style={{ flexDirection: 'column', gap: 12 }}>
      <div className="spinner" />
      <span className="titanium" style={{ fontSize: 12.5 }}>{label}</span>
    </div>
  );
}
