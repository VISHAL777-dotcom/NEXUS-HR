export default function Card({ children, span = 12, dark = false, className = '', style = {} }) {
  return (
    <div className={`card span-${span} ${dark ? 'card-dark' : ''} ${className}`} style={style}>
      {children}
    </div>
  );
}
