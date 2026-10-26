export default function Ring({ value, size = 110, stroke = 10, color = 'var(--indigo)', label = '', big = true }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  const offset = c - (clamped / 100) * c;

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className="ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-center">
        <div className="num" style={{ fontSize: big ? 26 : 18 }}>
          {Math.round(clamped)}%
        </div>
        {label && <div className="lbl">{label}</div>}
      </div>
    </div>
  );
}
