import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function Insights({ session, theme }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState([])

  useEffect(() => { fetchEntries() }, [])

  const fetchEntries = async () => {
    const dates = []
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      dates.push(d.toDateString())
    }

    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', session.user.id)
      .in('date', dates)
      .order('created_at', { ascending: false })

    if (data) setEntries(data)
  }

  const generateInsights = async () => {
    if (entries.length === 0) {
      setInsights([{
        tag: 'Not enough data',
        title: 'Keep journaling',
        text: 'Write a few more entries and your AI coach will start spotting patterns for you.'
      }])
      return
    }

    setLoading(true)

    const journalText = entries.map(e => `
Date: ${e.date}
Grateful: ${e.grateful || ''}
Great moments: ${e.great || ''}
Let go: ${e.letgo || ''}
Accomplished: ${(e.accomplish || []).join(', ')}
    `).join('\n---\n')

    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journalText })
      })

      const parsed = await response.json()
      if (parsed.error) {
        setInsights([{
          tag: 'Error',
          title: 'API Error',
          text: parsed.error
        }])
      } else {
        setInsights(parsed)
      }
    } catch (e) {
      setInsights([{
        tag: 'Error',
        title: 'Something went wrong',
        text: e.message || 'Unable to generate insights right now. Please try again later.'
      }])
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '0 1.25rem' }}>

      <div style={{ marginBottom: '1rem', fontSize: '13px', color: '#7A6558', lineHeight: 1.6 }}>
        Your AI coach analyses your last 14 journal entries and surfaces patterns you might not notice yourself.
      </div>

      {entries.length > 0 && (
        <div style={{ background: theme.light, borderRadius: '12px', padding: '10px 14px', marginBottom: '1rem', fontSize: '13px', color: theme.primary, fontWeight: '600' }}>
          {entries.length} entries analysed · last 14 days
        </div>
      )}

      {!insights && (
        <button onClick={generateInsights} disabled={loading} style={{
          width: '100%', padding: '14px', background: theme.primary, color: 'white',
          border: 'none', borderRadius: '16px', fontFamily: 'Playfair Display, serif',
          fontSize: '20px', cursor: 'pointer', marginBottom: '1rem',
          opacity: loading ? 0.7 : 1
        }}>
          {loading ? 'Reading your journal...' : 'Generate my insights ✦'}
        </button>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7A6558' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌿</div>
          <div style={{ fontSize: '14px' }}>Your AI coach is reading 14 days of entries...</div>
        </div>
      )}

      {insights && insights.map((insight, i) => (
        <div key={i} style={{
          background: 'white', border: '1px solid #EDE4DC',
          borderRadius: '14px', padding: '14px 16px', marginBottom: '10px'
        }}>
          <div style={{
            display: 'inline-block', background: theme.light, color: theme.primary,
            fontSize: '11px', padding: '3px 10px', borderRadius: '8px',
            fontWeight: '600', marginBottom: '8px'
          }}>{insight.tag}</div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#3D2B1F', marginBottom: '6px' }}>
            {insight.title}
          </div>
          <div style={{ fontSize: '13px', color: '#7A6558', lineHeight: 1.6 }}>
            {insight.text}
          </div>
        </div>
      ))}

      {insights && (
        <button onClick={() => { setInsights(null); generateInsights() }} style={{
          width: '100%', padding: '12px', background: 'transparent', color: theme.primary,
          border: `1.5px dashed ${theme.primary}`, borderRadius: '14px',
          fontFamily: 'Nunito, sans-serif', fontSize: '14px', cursor: 'pointer',
          marginTop: '4px', fontWeight: '600'
        }}>
          Refresh insights
        </button>
      )}

      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7A6558', fontSize: '14px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📖</div>
          <div>Journal for a few days and your AI coach will start spotting patterns.</div>
        </div>
      )}
    </div>
  )
}
