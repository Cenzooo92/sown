import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function History({ session, theme }) {
  const [entries, setEntries] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchEntries() }, [])

  const fetchEntries = async () => {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    if (data) setEntries(data)
    setLoading(false)
  }

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#7A6558' }}>
      Loading your entries...
    </div>
  )

  if (selected) return (
    <div style={{ padding: '0 1.25rem' }}>
      <button onClick={() => setSelected(null)} style={{
        background: 'none', border: 'none', color: theme.primary,
        fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: '600',
        cursor: 'pointer', marginBottom: '1rem', padding: 0
      }}>← Back to history</button>

      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: theme.primary, marginBottom: '1rem' }}>
        {selected.date}
      </div>

      {selected.grateful && (
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>🌿 Grateful for</div>
          <div style={{ fontSize: '14px', color: '#3D2B1F', lineHeight: 1.7 }}>{selected.grateful}</div>
        </div>
      )}

      {selected.accomplish && selected.accomplish.some(a => a) && (
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>✦ Goals</div>
          {selected.accomplish.filter(a => a).map((a, i) => (
            <div key={i} style={{ fontSize: '14px', color: '#3D2B1F', lineHeight: 1.7 }}>· {a}</div>
          ))}
        </div>
      )}

      {selected.affirmations && selected.affirmations.some(a => a) && (
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>💛 Affirmations</div>
          {selected.affirmations.filter(a => a).map((a, i) => (
            <div key={i} style={{ fontSize: '14px', color: '#3D2B1F', lineHeight: 1.7 }}>I am {a}</div>
          ))}
        </div>
      )}

      {selected.great && (
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>🌅 Great moments</div>
          <div style={{ fontSize: '14px', color: '#3D2B1F', lineHeight: 1.7 }}>{selected.great}</div>
        </div>
      )}

      {selected.letgo && (
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>🍂 Let go</div>
          <div style={{ fontSize: '14px', color: '#3D2B1F', lineHeight: 1.7 }}>{selected.letgo}</div>
        </div>
      )}

      {selected.photos_grateful && selected.photos_grateful.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>📷 Photos</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[...(selected.photos_grateful || []), ...(selected.photos_great || [])].map((url, i) => (
              <img key={i} src={url} style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ padding: '0 1.25rem' }}>
      {entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7A6558', fontSize: '14px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📖</div>
          <div>Your past entries will appear here.</div>
        </div>
      ) : (
        entries.map(entry => (
          <div key={entry.id} onClick={() => setSelected(entry)} style={{
            background: 'white', border: '1px solid #EDE4DC',
            borderRadius: '14px', padding: '14px 16px', marginBottom: '8px',
            cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '16px', color: '#3D2B1F', marginBottom: '4px', textAlign: 'center' }}>
    {entry.date}
  </div>
  <div style={{ fontSize: '13px', color: '#7A6558', textAlign: 'center' }}>
    {entry.grateful ? entry.grateful.slice(0, 50) + (entry.grateful.length > 50 ? '...' : '') : 'No entry'}
  </div>
</div>
            <div style={{ color: theme.primary, fontSize: '18px' }}>›</div>
          </div>
        ))
      )}
    </div>
  )
}

const cardStyle = {
  background: 'white', border: '1px solid #EDE4DC',
  borderRadius: '14px', padding: '14px 16px', marginBottom: '10px'
}
