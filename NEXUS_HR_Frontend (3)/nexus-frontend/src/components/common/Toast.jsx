import { useEffect } from 'react';

export default function Toast({ message, type = 'default', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;
  return <div className={`toast ${type}`}>{message}</div>;
}
