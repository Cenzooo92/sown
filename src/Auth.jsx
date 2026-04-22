import { useState } from 'react'
import { supabase } from './supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [isForgot, setIsForgot] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else if (data.user) {
        await supabase.from('profiles').insert({ id: data.user.id, name })
        setMessage('Account created! You can now sign in.')
        setIsLogin(true)
      }
    }
    setLoading(false)
  }

  const handleForgot = async () => {
    if (!email) { setMessage('Please enter your email address.'); return }
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://sown-seven.vercel.app'
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Password reset email sent! Check your inbox.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#FAF6F0', fontFamily: 'Nunito, sans-serif'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '2rem',
        width: '100%', maxWidth: '380px', border: '1px solid #EDE4DC'
      }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontSize: '36px',
          color: '#C4673A', textAlign: 'center', marginBottom: '4px'
        }}>Sown</h1>
        <p style={{ textAlign: 'center', color: '#7A6558', fontSize: '13px', marginBottom: '1.5rem' }}>
          your daily gratitude journal
        </p>

        {isForgot ? (
          <>
            <p style={{ fontSize: '13px', color: '#7A6558', marginBottom: '1rem' }}>
              Enter your email and we'll send you a reset link.
            </p>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            {message && (
              <p style={{ fontSize: '13px', color: '#C4673A', marginBottom: '1rem' }}>{message}</p>
            )}
            <button onClick={handleForgot} disabled={loading} style={btnStyle}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A6558', marginTop: '1rem' }}>
              <span onClick={() => { setIsForgot(false); setMessage('') }}
                style={{ color: '#C4673A', cursor: 'pointer', fontWeight: '600' }}>
                Back to sign in
              </span>
            </p>
          </>
        ) : (
          <>
            {!isLogin && (
              <input
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
              />
            )}
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
            {message && (
              <p style={{ fontSize: '13px', color: '#C4673A', marginBottom: '1rem' }}>{message}</p>
            )}
            <button onClick={handleAuth} disabled={loading} style={btnStyle}>
              {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Create account'}
            </button>
            {isLogin && (
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A6558', marginTop: '0.75rem' }}>
                <span onClick={() => { setIsForgot(true); setMessage('') }}
                  style={{ color: '#C4673A', cursor: 'pointer', fontWeight: '600' }}>
                  Forgot password?
                </span>
              </p>
            )}
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#7A6558', marginTop: '0.5rem' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setIsLogin(!isLogin)}
                style={{ color: '#C4673A', cursor: 'pointer', fontWeight: '600' }}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', marginBottom: '12px',
  border: '1px solid #EDE4DC', borderRadius: '12px', fontSize: '14px',
  fontFamily: 'Nunito, sans-serif', outline: 'none', boxSizing: 'border-box'
}

const btnStyle = {
  width: '100%', padding: '12px', background: '#C4673A', color: 'white',
  border: 'none', borderRadius: '14px', fontSize: '16px', cursor: 'pointer',
  fontFamily: 'Playfair Display, serif'
}