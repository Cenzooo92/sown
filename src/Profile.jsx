import { useState, useRef } from 'react'
import { supabase } from './supabase'

const quotes = [
  { text: "Gratitude turns what we have into enough.", author: "Melody Beattie" },
  { text: "Start each day with a grateful heart.", author: "Unknown" },
  { text: "Joy is the simplest form of gratitude.", author: "Karl Barth" },
  { text: "When you are grateful, fear disappears.", author: "Anthony Robbins" },
  { text: "Enough is a feast.", author: "Buddhist proverb" },
  { text: "What you appreciate, appreciates.", author: "Lynne Twist" },
  { text: "Gratitude is the fairest blossom from the soul.", author: "Henry Ward Beecher" },
]

const themes = {
  terra: { primary: '#C4673A', light: '#FAECE7' },
  sage:  { primary: '#7A8C6E', light: '#EAF0E5' },
  gold:  { primary: '#BA7517', light: '#FFF8EE' },
}

export default function Profile({ session, profile, setProfile, onEnter, theme }) {
  const [editing, setEditing] = useState(null)
  const [tempVal, setTempVal] = useState('')
  const [uploading, setUploading] = useState(false)
  const [totalEntries, setTotalEntries] = useState(null)
  const fileRef = useRef()

  useState(() => {
    supabase
      .from('entries')
      .select('id', { count: 'exact' })
      .eq('user_id', session.user.id)
      .then(({ count }) => setTotalEntries(count || 0))
  }, [])

  const save = async (field, value) => {
    setProfile(p => ({ ...p, [field]: value }))
    await supabase.from('profiles').update({ [field]: value }).eq('id', session.user.id)
    setEditing(null)
  }

  const uploadAvatar = async (file) => {
    setUploading(true)
    const fileName = `${session.user.id}/avatar.jpg`
    const { error } = await supabase.storage.from('photos').upload(fileName, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('photos').getPublicUrl(fileName)
      await save('avatar_url', data.publicUrl + '?t=' + Date.now())
    }
    setUploading(false)
  }

  const isPremium = profile?.is_premium

  const PremiumLock = ({ label }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      background: 'rgba(0,0,0,0.15)', borderRadius: '8px',
      padding: '2px 7px', fontSize: '10px', color: 'rgba(255,255,255,0.75)',
      marginLeft: '6px', verticalAlign: 'middle'
    }}>⭐ {label || 'Premium'}</span>
  )

  return (
    <div style={{ background: '#FAF6F0', minHeight: '100vh', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>

        <div style={{
          background: theme.primary, color: 'white',
          padding: '2rem 1.5rem 1.5rem',
          borderRadius: '0 0 28px 28px', marginBottom: '1.25rem'
        }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <div onClick={() => isPremium && fileRef.current.click()} style={{
                width: '68px', height: '68px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                border: '2.5px solid rgba(255,255,255,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px', fontFamily: 'Playfair Display, serif',
                color: 'white', overflow: 'hidden',
                cursor: isPremium ? 'pointer' : 'default'
              }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : profile?.name?.[0]?.toUpperCase()
                }
              </div>
              {!isPremium && (
                <div style={{
                  position: 'absolute', bottom: 0, right: 0,
                  background: 'rgba(0,0,0,0.3)', borderRadius: '50%',
                  width: '22px', height: '22px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '11px'
                }}>🔒</div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => e.target.files[0] && uploadAvatar(e.target.files[0])} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px' }}>
                {profile?.name}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>
                member since {new Date(session.user.created_at).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
              </div>
              {isPremium && (
                <div style={{
                  display: 'inline-block', marginTop: '6px',
                  background: 'rgba(255,255,255,0.2)', borderRadius: '10px',
                  padding: '2px 10px', fontSize: '11px'
                }}>⭐ Premium</div>
              )}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 14px', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
              Bio <PremiumLock />
            </div>
            {editing === 'bio' ? (
              <div>
                <textarea value={tempVal} onChange={e => setTempVal(e.target.value)}
                  rows={2} placeholder="Write something about yourself..."
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.2)', border: 'none',
                    borderRadius: '8px', color: 'white', fontSize: '13px',
                    fontFamily: 'Nunito, sans-serif', padding: '6px', outline: 'none',
                    resize: 'none', boxSizing: 'border-box'
                  }} />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button onClick={() => save('bio', tempVal)} style={{
                    flex: 1, padding: '6px', background: 'rgba(255,255,255,0.3)',
                    border: 'none', borderRadius: '8px', color: 'white',
                    fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
                  }}>Save</button>
                  <button onClick={() => setEditing(null)} style={{
                    padding: '6px 12px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
                    color: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div onClick={() => { if (isPremium) { setEditing('bio'); setTempVal(profile?.bio || '') } }}
                style={{ fontSize: '13px', lineHeight: 1.5, cursor: isPremium ? 'pointer' : 'default',
                  color: profile?.bio ? 'white' : 'rgba(255,255,255,0.4)', fontStyle: profile?.bio ? 'normal' : 'italic' }}>
                {profile?.bio || (isPremium ? 'Tap to add your bio...' : 'Unlock with Premium to add your story')}
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 14px' }}>
            <div style={{ fontSize: '10px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '5px' }}>
              Favourite quote <PremiumLock />
            </div>
            {editing === 'quote' ? (
              <div>
                <textarea value={tempVal} onChange={e => setTempVal(e.target.value)}
                  rows={2} placeholder="Your favourite quote..."
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.2)', border: 'none',
                    borderRadius: '8px', color: 'white', fontSize: '13px',
                    fontFamily: 'Playfair Display, serif', fontStyle: 'italic',
                    padding: '6px', outline: 'none', resize: 'none', boxSizing: 'border-box'
                  }} />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <button onClick={() => save('favourite_quote', tempVal)} style={{
                    flex: 1, padding: '6px', background: 'rgba(255,255,255,0.3)',
                    border: 'none', borderRadius: '8px', color: 'white',
                    fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
                  }}>Save</button>
                  <button onClick={() => setEditing(null)} style={{
                    padding: '6px 12px', background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px',
                    color: 'white', fontSize: '12px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div onClick={() => { if (isPremium) { setEditing('quote'); setTempVal(profile?.favourite_quote || '') } }}
                style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '13px',
                  lineHeight: 1.5, cursor: isPremium ? 'pointer' : 'default',
                  color: profile?.favourite_quote ? 'white' : 'rgba(255,255,255,0.4)' }}>
                {profile?.favourite_quote || (isPremium ? 'Tap to add your favourite quote...' : 'Unlock with Premium to set your quote')}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            {[
              { num: `🔥 ${profile?.streak || 0}`, label: 'day streak' },
              { num: totalEntries ?? '...', label: 'total entries' },
              { num: profile?.longest_streak || profile?.streak || 0, label: 'longest streak' },
              { num: isPremium ? '⭐' : '🔒', label: isPremium ? 'premium member' : 'free plan' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'white', border: '1px solid #EDE4DC',
                borderRadius: '14px', padding: '12px 14px'
              }}>
                <div style={{ fontSize: '22px', fontWeight: '600', color: '#3D2B1F' }}>{s.num}</div>
                <div style={{ fontSize: '11px', color: '#7A6558', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 1.25rem', marginBottom: '1rem' }}>
          <div style={{ background: 'white', border: '1px solid #EDE4DC', borderRadius: '14px', padding: '12px 14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Theme</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {Object.entries(themes).map(([key, val]) => (
                <div key={key} onClick={async () => {
                  setProfile(p => ({ ...p, theme: key }))
                  await supabase.from('profiles').update({ theme: key }).eq('id', session.user.id)
                }} style={{
                  width: '32px', height: '32px', borderRadius: '50%', background: val.primary,
                  border: profile?.theme === key ? '3px solid #3D2B1F' : '2px solid transparent',
                  cursor: 'pointer', outline: profile?.theme === key ? `2px solid ${val.primary}` : 'none',
                  outlineOffset: '2px'
                }} />
              ))}
              {!isPremium && (
                <div style={{ fontSize: '12px', color: '#7A6558', marginLeft: '4px', opacity: 0.5 }}>
                  more themes coming for Premium ⭐
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: '0 1.25rem 2rem' }}>
          <button onClick={onEnter} style={{
            width: '100%', padding: '16px', background: theme.primary, color: 'white',
            border: 'none', borderRadius: '18px', fontFamily: 'Playfair Display, serif',
            fontSize: '20px', cursor: 'pointer'
          }}>
            Begin today's entry ✦
          </button>

          {!isPremium && (
            <div style={{
              marginTop: '10px', background: theme.light, borderRadius: '14px',
              padding: '12px 14px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '13px', color: theme.primary, fontWeight: '600', marginBottom: '2px' }}>
                ⭐ Unlock Premium
              </div>
              <div style={{ fontSize: '12px', color: '#7A6558' }}>
                Profile photo, bio, custom quote, shareable card & more
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}