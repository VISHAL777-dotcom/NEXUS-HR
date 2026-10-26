import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="login-shell">
      <div style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center' }}>404</div>
        <h1 className="headline" style={{ fontSize: 32 }}>This page <em>doesn't exist</em>.</h1>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
          Back to Today's Story
        </Link>
      </div>
    </div>
  );
}
