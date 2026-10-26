const GRADIENTS = [
  'linear-gradient(135deg,var(--indigo),var(--purple))',
  'linear-gradient(135deg,var(--cyan),var(--indigo))',
  'linear-gradient(135deg,var(--orange),var(--purple))',
  'linear-gradient(135deg,var(--emerald),var(--cyan))',
  'linear-gradient(135deg,var(--purple),var(--orange))',
];

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function gradientFor(name = '') {
  const sum = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

export default function Avatar({ name, size = 40, fontSize, className = '' }) {
  return (
    <div
      className={`avatar ${className}`.trim()}
      style={{
        width: size,
        height: size,
        fontSize: fontSize || Math.round(size * 0.36),
        background: gradientFor(name),
      }}
    >
      {initials(name) || '?'}
    </div>
  );
}
