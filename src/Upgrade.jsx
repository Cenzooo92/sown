import { useState } from 'react'

export default function Upgrade({ session, theme }) {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email
        })
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (e) {
      alert('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '0 1.25rem' }}>

      <div style={{
        background: theme.light, borderRadius: '18px',
        padding: '1.5rem', marginBottom: '1rem', textAlign: 'center'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
        <div style={{
          fontFamily: 'Playfair Display, serif', fontSize: '22px',
          color: theme.primary, marginBottom: '8px'
        }}>Sown Premium</div>
        <div style={{
          fontSize: '32px', fontWeight: '600', color: '#3D2B1F', marginBottom: '4px'
        }}>$6.99<span style={{ fontSize: '16px', fontWeight: '400', color: '#7A6558' }}>/month AUD</span></div>
        <div style={{ fontSize: '13px', color: '#7A6558', marginBottom: '1.5rem' }}>
          Cancel anytime
        </div>

        {[
          { icon: '✦', text: 'AI coaching insights' },
          { icon: '🌱', text: 'Unlimited habits' },
          { icon: '📸', text: 'Full photo storyboard' },
          { icon: '🎨', text: 'All themes' },
          { icon: '⚡', text: 'Early access to new features' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 0', borderBottom: i < 4 ? '1px solid #EDE4DC' : 'none',
            textAlign: 'left'
          }}>
            <span style={{ fontSize: '16px', width: '24px' }}>{item.icon}</span>
            <span style={{ fontSize: '14px', color: '#3D2B1F' }}>{item.text}</span>
          </div>
        ))}
      </div>

      <button onClick={handleUpgrade} disabled={loading} style={{
        width: '100%', padding: '14px', background: theme.primary, color: 'white',
        border: 'none', borderRadius: '16px', fontFamily: 'Playfair Display, serif',
        fontSize: '20px', cursor: 'pointer', marginBottom: '1rem',
        opacity: loading ? 0.7 : 1
      }}>
        {loading ? 'Loading...' : 'Upgrade to Premium ✦'}
      </button>

      <div style={{ textAlign: 'center', fontSize: '12px', color: '#7A6558' }}>
        Secure payment via Stripe · Cancel anytime
      </div>
    </div>
  )
}
