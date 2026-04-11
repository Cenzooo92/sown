export default function Cancel() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#FAF6F0',
      fontFamily: 'Nunito, sans-serif', padding: '2rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '2rem',
        maxWidth: '380px', width: '100%', textAlign: 'center',
        border: '1px solid #EDE4DC'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🍂</div>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontSize: '28px',
          color: '#C4673A', marginBottom: '8px'
        }}>No worries</div>
        <div style={{ fontSize: '15px', color: '#7A6558', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          You haven't been charged. You can upgrade to Premium anytime from the app.
        </div>
        <button onClick={() => window.location.href = '/'} style={{
          width: '100%', padding: '14px', background: '#C4673A', color: 'white',
          border: 'none', borderRadius: '16px', fontFamily: 'Playfair Display, serif',
          fontSize: '20px', cursor: 'pointer'
        }}>Back to Sown ✦</button>
      </div>
    </div>
  )
}
