// src/pages/NotFoundPage.jsx
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0d1f1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        color: '#eaf9fb',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <span style={{ fontSize: 64, fontWeight: 900, color: '#29c8d6' }}>404</span>
      <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Page Not Found</h1>
      <p style={{ color: '#54d3de', fontSize: 14, maxWidth: 320 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 8,
          padding: '10px 28px',
          background: '#29c8d6',
          color: '#061c1e',
          border: 'none',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          letterSpacing: '0.1em',
        }}
      >
        GO HOME
      </button>
    </div>
  );
};

export default NotFoundPage;