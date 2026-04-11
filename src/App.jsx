import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'
import Journal from './Journal'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#FAF6F0',
      fontFamily: 'Playfair Display, serif', fontSize: '24px', color: '#C4673A'
    }}>
      Sown...
    </div>
  )

  if (!session) return <Auth />

  return <Journal session={session} />
}

export default App

