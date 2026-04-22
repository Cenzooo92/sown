import { useState } from 'react'
import { supabase } from './supabase'

const themes = {
  terra: { primary: '#C4673A', light: '#FAECE7', name: 'Terra' },
  sage:  { primary: '#7A8C6E', light: '#EAF0E5', name: 'Sage' },
  gold:  { primary: '#BA7517', light: '#FFF8EE', name: 'Gold' },
}

const goals = [
  { id: 'mindfulness', emoji: '🧘', label: 'Practice mindfulness' },
  { id: 'positivity', emoji: '🌟', label: 'Build a positive mindset' },
  { id: 'growth', emoji: '🌱', label: 'Track my personal growth' },
  { id: 'stress', emoji: '🍃', label: 'Reduce stress & anxiety' },
  { id: 'habits', emoji: '💪', label: 'Build better habits' },
  { id: 'reflect', emoji: '📖', label: 'Reflect on my day' },
]

export default function Onboarding({ session, onComplete }) {
  const [screen, setScreen] = useState(1)
  const [name, setName] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('terra')
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [saving, setSaving] = useState(false)

  const theme = themes[selectedTheme]

  const handleComplete = async () => {
    if (!selectedGoal) return
    setSaving(true)
    await supabase.from('profiles').upsert({
      id: session.user.id,
      name: name.trim(),
      theme: selectedTheme,
      journal_goal: selectedGoal,
      onboarding_complete: true,
      streak: 0,
    })
    setSaving(false)
    onComplete()
  }

  return (
    <div style={{ background: '#FAF6F0', minHeight: '100vh', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '0 1.25rem' }}>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingTop: '3rem', marginBottom: '2.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              width: i === screen ? '24px' : '8px',
              height: '8px', borderRadius: '4px',
              background: i === screen ? theme.primary : '#D8CFC8',
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        {screen === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '1.5rem' }}>🌱</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#3D2B1F', marginBottom: '1rem', lineHeight: 1.3 }}>
              Welcome to Sown
            </div>
            <div style={{ fontSize: '15px', color: '#7A6558', lineHeight: 1.8, marginBottom: '1rem' }}>
              A daily gratitude journal designed to help you grow, reflect, and find joy in the everyday.
            </div>
            <div style={{ fontSize: '15px', color: '#7A6558', lineHeight: 1.8, marginBottom: '3rem' }}>
              Just a few minutes each day can transform the way you see your life.
            </div>

            {[
              { emoji: '🌿', text: 'Daily gratitude prompts' },
              { emoji: '✦', text: 'Track your habits & goals' },
              { emoji: '📖', text: 'Reflect on your journey' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                background: 'white', border: '1px solid #EDE4DC',
                borderRadius: '14px', padding: '12px 16px', marginBottom: '8px',
                textAlign: 'left'
              }}>
                <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                <span style={{ fontSize: '14px', color: '#3D2B1F', fontWeight: '600' }}>{item.text}</span>
              </div>
            ))}

            <button onClick={() => setScreen(2)} style={{
              width: '100%', padding: '16px', background: theme.primary, color: 'white',
              border: 'none', borderRadius: '18px', fontFamily: 'Playfair Display, serif',
              fontSize: '20px', cursor: 'pointer', marginTop: '2rem'
            }}>
              Let's begin ✦
            </button>
          </div>
        )}

        {screen === 2 && (
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#3D2B1F', marginBottom: '8px' }}>
              Make it yours
            </div>
            <div style={{ fontSize: '14px', color: '#7A6558', marginBottom: '2rem', lineHeight: 1.6 }}>
              Personalise your Sown experience
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Your first name
              </div>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name..."
                style={{
                  width: '100%', padding: '14px 16px',
                  border: '1.5px solid #EDE4DC', borderRadius: '14px',
                  fontSize: '16px', fontFamily: 'Nunito, sans-serif',
                  color: '#3D2B1F', outline: 'none', boxSizing: 'border-box',
                  background: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Choose your theme
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {Object.entries(themes).map(([key, val]) => (
                  <div key={key} onClick={() => setSelectedTheme(key)} style={{
                    flex: 1, padding: '16px 12px', borderRadius: '16px',
                    background: selectedTheme === key ? val.light : 'white',
                    border: selectedTheme === key ? `2px solid ${val.primary}` : '1.5px solid #EDE4DC',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: val.primary, margin: '0 auto 8px'
                    }} />
                    <div style={{ fontSize: '12px', fontWeight: '600', color: val.primary }}>
                      {val.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { if (name.trim()) setScreen(3) }}
              disabled={!name.trim()}
              style={{
                width: '100%', padding: '16px', background: name.trim() ? theme.primary : '#D8CFC8',
                color: 'white', border: 'none', borderRadius: '18px',
                fontFamily: 'Playfair Display, serif', fontSize: '20px',
                cursor: name.trim() ? 'pointer' : 'default', transition: 'background 0.2s ease'
              }}>
              Continue ✦
            </button>
          </div>
        )}

        {screen === 3 && (
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '26px', color: '#3D2B1F', marginBottom: '8px' }}>
              What brings you here, {name}?
            </div>
            <div style={{ fontSize: '14px', color: '#7A6558', marginBottom: '2rem', lineHeight: 1.6 }}>
              Choose what resonates most with you
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2rem' }}>
              {goals.map(goal => (
                <div key={goal.id} onClick={() => setSelectedGoal(goal.id)} style={{
                  padding: '16px 12px', borderRadius: '16px', textAlign: 'center',
                  background: selectedGoal === goal.id ? theme.light : 'white',
                  border: selectedGoal === goal.id ? `2px solid ${theme.primary}` : '1.5px solid #EDE4DC',
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{goal.emoji}</div>
                  <div style={{
                    fontSize: '12px', fontWeight: '600',
                    color: selectedGoal === goal.id ? theme.primary : '#3D2B1F',
                    lineHeight: 1.3
                  }}>{goal.label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={!selectedGoal || saving}
              style={{
                width: '100%', padding: '16px',
                background: selectedGoal ? theme.primary : '#D8CFC8',
                color: 'white', border: 'none', borderRadius: '18px',
                fontFamily: 'Playfair Display, serif', fontSize: '20px',
                cursor: selectedGoal ? 'pointer' : 'default',
                opacity: saving ? 0.7 : 1, transition: 'all 0.2s ease'
              }}>
              {saving ? 'Setting up your journal...' : 'Start my journey ✦'}
            </button>
          </div>
        )}

      </div>
    </div>
  )
}