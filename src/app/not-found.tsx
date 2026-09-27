import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px',
      }}
    >
      <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px', color: '#ff6700' }}>
        404
      </h1>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#111' }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: '14px', color: '#666', maxWidth: '400px', marginBottom: '24px' }}>
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-rezoni">
        Back to Home
      </Link>
    </div>
  );
}
