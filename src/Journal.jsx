import { useState, useEffect, useRef } from 'react'
import Habits from './Habits'
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

export default function Journal({ session }) {
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('grateful')
  const [entry, setEntry] = useState({
    grateful: '', accomplish: ['', '', ''], affirmations: ['', ''],
    great: '', letgo: ''
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState({ grateful: [], great: [] })
  const [uploading, setUploading] = useState(false)
  const gratefulFileRef = useRef(null)
  const greatFileRef = useRef(null)
  const today = new Date().toDateString()
  const quote = quotes[new Date().getDate() % quotes.length]

  useEffect(() => { fetchProfile() }, [])

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (data) setProfile(data)

    const { data: existingEntry } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', today)
      .single()
    if (existingEntry) {
      setEntry({
        grateful: existingEntry.grateful || '',
        accomplish: existingEntry.accomplish || ['', '', ''],
        affirmations: existingEntry.affirmations || ['', ''],
        great: existingEntry.great || '',
        letgo: existingEntry.letgo || '',
      })
    }
  }

  const saveEntry = async () => {
    setLoading(true)
    const { data: existing } = await supabase
      .from('entries')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('date', today)
      .single()

    if (existing) {
      await supabase.from('entries').update({
        grateful: entry.grateful,
        accomplish: entry.accomplish,
        affirmations: entry.affirmations,
        great: entry.great,
        letgo: entry.letgo,
      }).eq('id', existing.id)
    } else {
      await supabase.from('entries').insert({
        user_id: session.user.id,
        date: today,
        grateful: entry.grateful,
        accomplish: entry.accomplish,
        affirmations: entry.affirmations,
        great: entry.great,
        letgo: entry.letgo,
      })
      const newStreak = (profile?.streak || 0) + 1
      await supabase.from('profiles').update({
        streak: newStreak,
        last_entry_date: today
      }).eq('id', session.user.id)
      setProfile(p => ({ ...p, streak: newStreak }))
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const signOut = async () => { await supabase.auth.signOut() }

  const uploadPhoto = async (file, section) => {
    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.user.id}/${section}/${Date.now()}.${fileExt}`
    const { error } = await supabase.storage
      .from('photos')
      .upload(fileName, file)
    if (error) {
      alert('Upload failed: ' + error.message)
    } else {
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)
      setPhotos(prev => ({
        ...prev,
        [section]: [...prev[section], urlData.publicUrl]
      }))
    }
    setUploading(false)
  }

  const handleFileChange = async (e, section) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      await uploadPhoto(file, section)
    }
  }

  const removePhoto = (section, index) => {
    setPhotos(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  const theme = themes[profile?.theme || 'terra']
  const days = ['S','M','T','W','T','F','S']
  const todayIdx = new Date().getDay()

  const setAccomplish = (i, val) => {
    const arr = [...entry.accomplish]
    arr[i] = val
    setEntry({ ...entry, accomplish: arr })
  }

  const setAffirmation = (i, val) => {
    const arr = [...entry.affirmations]
    arr[i] = val
    setEntry({ ...entry, affirmations: arr })
  }

  const setTheme = async (t) => {
    setProfile(p => ({ ...p, theme: t }))
    await supabase.from('profiles').update({ theme: t }).eq('id', session.user.id)
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (!profile) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#FAF6F0',
      fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#C4673A' }}>
      Sown...
    </div>
  )

  return (
    <div style={{ background: '#FAF6F0', minHeight: '100vh', fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto' }}>

        <div style={{ background: theme.primary, color: 'white', padding: '1.25rem 1.25rem 1rem', borderRadius: '0 0 24px 24px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px' }}>
                {greeting()}, {profile.name}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>
                {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '6px 12px', fontSize: '13px' }}>
                🔥 {profile.streak} days
              </div>
              <div onClick={signOut} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px', fontFamily: 'Playfair Display, serif' }}>
                {profile.name?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '14px', padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '14px', fontStyle: 'italic', lineHeight: 1.5 }}>"{quote.text}"</div>
            <div style={{ fontSize: '11px', opacity: 0.75, marginTop: '4px' }}>— {quote.author}</div>
          </div>

          <div style={{ display: 'flex', gap: '5px', marginTop: '0.75rem' }}>
            {days.map((d, i) => (
              <div key={i} style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: i === todayIdx ? 'rgba(255,255,255,0.9)' : i < todayIdx && profile.streak > todayIdx - i ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: '600',
                color: i === todayIdx ? theme.primary : 'white'
              }}>{d}</div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>theme</span>
            {Object.entries(themes).map(([key, val]) => (
              <div key={key} onClick={() => setTheme(key)} style={{
                width: '20px', height: '20px', borderRadius: '50%', background: val.primary,
                border: profile.theme === key ? '2px solid white' : '2px solid rgba(255,255,255,0.4)',
                cursor: 'pointer'
              }} />
            ))}
          </div>
        </div>

       <div style={{ display: 'flex', gap: '6px', padding: '0 1.25rem', marginBottom: '1rem', overflowX: 'auto' }}>
          {[
            { id: 'grateful', label: 'Grateful' },
            { id: 'accomplish', label: "Today's goals" },
            { id: 'affirmations', label: 'I am...' },
            { id: 'great', label: 'Great moments' },
            { id: 'letgo', label: 'Let go' },
            { id: 'habits', label: '🌱 Habits' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flexShrink: 0, padding: '7px 14px', borderRadius: '20px', fontSize: '12px',
              cursor: 'pointer', border: tab === t.id ? `1px solid ${theme.primary}` : '1px solid #E8DDD5',
              background: tab === t.id ? theme.light : 'white',
              color: tab === t.id ? theme.primary : '#7A6558', fontWeight: '600',
              fontFamily: 'Nunito, sans-serif'
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: '0 1.25rem' }}>

          {tab === 'grateful' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌿</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>What I'm grateful for</div>
              <textarea value={entry.grateful} onChange={e => setEntry({ ...entry, grateful: e.target.value })}
                placeholder="Today I'm grateful for..." rows={6} style={textareaStyle} />
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Add to your story</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {photos.grateful.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                      <img src={url} style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover' }} />
                      <button onClick={() => removePhoto('grateful', i)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: theme.primary, color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1.5px dashed #D8CFC8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', color: '#7A6558', fontFamily: 'Nunito, sans-serif', fontWeight: '600' }}>
                  📷 {uploading ? 'Uploading...' : 'Add a photo'}
                  <input type="file" accept="image/*" multiple onChange={e => handleFileChange(e, 'grateful')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}

          {tab === 'accomplish' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>✦</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>3 things I will accomplish today</div>
              {entry.accomplish.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1.5px solid #D8CFC8', flexShrink: 0 }} />
                  <input value={item} onChange={e => setAccomplish(i, e.target.value)}
                    placeholder={`${i === 0 ? 'First' : i === 1 ? 'Second' : 'Third'} thing...`}
                    style={{ flex: 1, border: 'none', borderBottom: '1px solid #F0E8E0', outline: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#3D2B1F', background: 'transparent', padding: '4px 0' }} />
                </div>
              ))}
            </div>
          )}

          {tab === 'affirmations' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>💛</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>Daily affirmations</div>
              {entry.affirmations.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', color: theme.primary, flexShrink: 0 }}>I am</span>
                  <input value={item} onChange={e => setAffirmation(i, e.target.value)}
                    placeholder="grateful and present"
                    style={{ flex: 1, border: 'none', borderBottom: `1.5px solid #E8DDD5`, outline: 'none', fontFamily: 'Nunito, sans-serif', fontSize: '16px', color: '#3D2B1F', background: 'transparent', padding: '4px 0' }} />
                </div>
              ))}
              <span onClick={() => setEntry({ ...entry, affirmations: [...entry.affirmations, ''] })}
                style={{ fontSize: '13px', color: theme.primary, cursor: 'pointer', fontWeight: '600' }}>
                + add another
              </span>
            </div>
          )}

          {tab === 'great' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌅</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>Great things that happened today</div>
              <textarea value={entry.great} onChange={e => setEntry({ ...entry, great: e.target.value })}
                placeholder="Something wonderful..." rows={6} style={textareaStyle} />
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Capture the moment</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {photos.great.map((url, i) => (
                    <div key={i} style={{ position: 'relative', width: '72px', height: '72px' }}>
                      <img src={url} style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover' }} />
                      <button onClick={() => removePhoto('great', i)} style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', background: theme.primary, color: 'white', border: 'none', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', border: '1.5px dashed #D8CFC8', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', color: '#7A6558', fontFamily: 'Nunito, sans-serif', fontWeight: '600' }}>
                  📷 {uploading ? 'Uploading...' : 'Add a photo'}
                  <input type="file" accept="image/*" multiple onChange={e => handleFileChange(e, 'great')} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}


{tab === 'letgo' && (
            <div style={cardStyle}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🍂</div>
              <div style={{ ...sectionTitle, color: theme.primary }}>Biggest challenges & things I want to let go</div>
              <textarea value={entry.letgo} onChange={e => setEntry({ ...entry, letgo: e.target.value })}
                placeholder="I release..." rows={6} style={textareaStyle} />
            </div>
          )}
          {tab === 'habits' && (
            <Habits session={session} theme={theme} />
          )}


          <button onClick={saveEntry} disabled={loading} style={{
            width: '100%', padding: '14px', background: theme.primary, color: 'white',
            border: 'none', borderRadius: '16px', fontFamily: 'Playfair Display, serif',
            fontSize: '20px', cursor: 'pointer', marginBottom: '2rem',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Saving...' : saved ? '✓ Saved!' : 'Save today\'s entry ✦'}
          </button>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'white', border: '1px solid #EDE4DC',
  borderRadius: '18px', padding: '1rem 1.25rem', marginBottom: '1rem'
}

const sectionTitle = {
  fontFamily: 'Playfair Display, serif', fontSize: '19px', marginBottom: '10px'
}

const textareaStyle = {
  width: '100%', border: 'none', outline: 'none', resize: 'none',
  fontFamily: 'Nunito, sans-serif', fontSize: '15px', color: '#3D2B1F',
  background: 'transparent', lineHeight: 1.8
}