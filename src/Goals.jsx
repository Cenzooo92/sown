import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function Goals({ session, theme, isPremium }) {
  const [goals, setGoals] = useState([])
  const [milestones, setMilestones] = useState([])
  const [view, setView] = useState('list')
  const [selected, setSelected] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newGoal, setNewGoal] = useState({ title: '', why: '', target_date: '' })
  const [newMilestones, setNewMilestones] = useState(['', ''])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchGoals() }, [])

  const fetchGoals = async () => {
    const { data: goalsData } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    const { data: milestonesData } = await supabase
      .from('milestones')
      .select('*')
      .eq('user_id', session.user.id)
      .order('order_index')

    if (goalsData) setGoals(goalsData)
    if (milestonesData) setMilestones(milestonesData)
    setLoading(false)
  }

  const addGoal = async () => {
    if (!newGoal.title.trim()) return
    const { data: goalData } = await supabase.from('goals').insert({
      user_id: session.user.id,
      title: newGoal.title,
      why: newGoal.why,
      target_date: newGoal.target_date,
    }).select().single()

    if (goalData) {
      const validMilestones = newMilestones.filter(m => m.trim())
      if (validMilestones.length > 0) {
        await supabase.from('milestones').insert(
          validMilestones.map((m, i) => ({
            goal_id: goalData.id,
            user_id: session.user.id,
            title: m,
            order_index: i
          }))
        )
      }
      await fetchGoals()
      setAdding(false)
      setNewGoal({ title: '', why: '', target_date: '' })
      setNewMilestones(['', '', ''])
    }
  }

  const toggleMilestone = async (milestone) => {
    const completed = !milestone.completed
    await supabase.from('milestones').update({
      completed,
      completed_at: completed ? new Date().toISOString() : null
    }).eq('id', milestone.id)
    setMilestones(milestones.map(m => m.id === milestone.id ? { ...m, completed } : m))

    const goalMilestones = milestones.map(m => m.id === milestone.id ? { ...m, completed } : m)
      .filter(m => m.goal_id === milestone.goal_id)
    const allDone = goalMilestones.every(m => m.completed)
    if (allDone && goalMilestones.length > 0) {
      await supabase.from('goals').update({ status: 'completed' }).eq('id', milestone.goal_id)
      setGoals(goals.map(g => g.id === milestone.goal_id ? { ...g, status: 'completed' } : g))
    } else {
      await supabase.from('goals').update({ status: 'active' }).eq('id', milestone.goal_id)
      setGoals(goals.map(g => g.id === milestone.goal_id ? { ...g, status: 'active' } : g))
    }
  }

  const deleteGoal = async (id) => {
    await supabase.from('goals').delete().eq('id', id)
    setGoals(goals.filter(g => g.id !== id))
    setMilestones(milestones.filter(m => m.goal_id !== id))
    setSelected(null)
    setView('list')
  }

  const getProgress = (goalId) => {
    const gm = milestones.filter(m => m.goal_id === goalId)
    if (gm.length === 0) return 0
    return Math.round((gm.filter(m => m.completed).length / gm.length) * 100)
  }

  const getDaysLeft = (targetDate) => {
    if (!targetDate) return null
    const diff = new Date(targetDate) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const canAddGoal = isPremium || activeGoals.length < 2

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#7A6558' }}>Loading your goals...</div>
  )

  if (view === 'detail' && selected) {
    const goalMilestones = milestones.filter(m => m.goal_id === selected.id)
    const progress = getProgress(selected.id)
    const daysLeft = getDaysLeft(selected.target_date)
    const circumference = 2 * Math.PI * 36

    return (
      <div style={{ padding: '0 1.25rem' }}>
        <button onClick={() => { setView('list'); setSelected(null) }} style={{
          background: 'none', border: 'none', color: theme.primary,
          fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: '600',
          cursor: 'pointer', marginBottom: '1rem', padding: 0
        }}>← Back to goals</button>

        <div style={{ background: 'white', border: '1px solid #EDE4DC', borderRadius: '18px', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#F0E8E0" strokeWidth="6"/>
              <circle cx="40" cy="40" r="36" fill="none" stroke={theme.primary} strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progress / 100)}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
              <text x="40" y="44" textAnchor="middle" fontSize="16" fontWeight="600" fill={theme.primary}>{progress}%</text>
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: '#3D2B1F', marginBottom: '4px' }}>{selected.title}</div>
              {selected.status === 'completed' && (
                <div style={{ background: '#EAF0E5', color: '#7A8C6E', fontSize: '12px', padding: '3px 10px', borderRadius: '8px', display: 'inline-block', fontWeight: '600' }}>✓ Completed</div>
              )}
              {daysLeft !== null && selected.status === 'active' && (
                <div style={{ fontSize: '12px', color: daysLeft < 7 ? '#C4673A' : '#7A6558', fontWeight: '600' }}>
                  {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : `${Math.abs(daysLeft)} days overdue`}
                </div>
              )}
            </div>
          </div>

          {selected.why && (
            <div style={{ background: theme.light, borderRadius: '12px', padding: '10px 14px', marginBottom: '1rem' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Why this matters</div>
              <div style={{ fontSize: '14px', color: '#3D2B1F', fontStyle: 'italic', lineHeight: 1.6 }}>"{selected.why}"</div>
            </div>
          )}

          <div style={{ fontSize: '13px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Milestones</div>

          {goalMilestones.length === 0 && (
            <div style={{ fontSize: '14px', color: '#C4B8B0', textAlign: 'center', padding: '1rem' }}>No milestones added</div>
          )}

          {goalMilestones.map((m, i) => (
            <div key={m.id} onClick={() => toggleMilestone(m)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 0', borderBottom: i < goalMilestones.length - 1 ? '1px solid #F0E8E0' : 'none',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                border: `1.5px solid ${m.completed ? theme.primary : '#D8CFC8'}`,
                background: m.completed ? theme.primary : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '14px'
              }}>{m.completed ? '✓' : ''}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px', color: '#3D2B1F',
                  textDecoration: m.completed ? 'line-through' : 'none',
                  opacity: m.completed ? 0.6 : 1
                }}>{m.title}</div>
                {m.completed_at && (
                  <div style={{ fontSize: '11px', color: '#7A6558' }}>
                    Completed {new Date(m.completed_at).toLocaleDateString('en-AU')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selected.status === 'completed' && (
          <div style={{ background: theme.light, borderRadius: '16px', padding: '1.25rem', textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌟</div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: theme.primary, marginBottom: '4px' }}>Goal achieved!</div>
            <div style={{ fontSize: '13px', color: '#7A6558' }}>This goes into your harvest — a permanent record of your wins.</div>
          </div>
        )}

        <button onClick={() => deleteGoal(selected.id)} style={{
          width: '100%', padding: '12px', background: 'transparent', color: '#C4B8B0',
          border: '1px solid #EDE4DC', borderRadius: '14px',
          fontFamily: 'Nunito, sans-serif', fontSize: '14px', cursor: 'pointer'
        }}>Delete this goal</button>
      </div>
    )
  }

  if (adding) return (
    <div style={{ padding: '0 1.25rem' }}>
      <button onClick={() => setAdding(false)} style={{
        background: 'none', border: 'none', color: theme.primary,
        fontFamily: 'Nunito, sans-serif', fontSize: '14px', fontWeight: '600',
        cursor: 'pointer', marginBottom: '1rem', padding: 0
      }}>← Cancel</button>

      <div style={{ background: 'white', border: '1px solid #EDE4DC', borderRadius: '18px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '19px', color: theme.primary, marginBottom: '1rem' }}>Plant a new goal</div>

        <div style={{ fontSize: '12px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>What is your goal?</div>
        <input value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
          placeholder="e.g. Run a 5K, Learn Spanish, Save $5000"
          style={inputStyle} />

        <div style={{ fontSize: '12px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', marginTop: '1rem' }}>Why does this matter to you?</div>
        <textarea value={newGoal.why} onChange={e => setNewGoal({ ...newGoal, why: e.target.value })}
          placeholder="Your reason will keep you motivated when it gets hard..."
          rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />

        <div style={{ fontSize: '12px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', marginTop: '1rem' }}>Target date (optional)</div>
        <input type="date" value={newGoal.target_date} onChange={e => setNewGoal({ ...newGoal, target_date: e.target.value })}
          style={inputStyle} />

        <div style={{ fontSize: '12px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', marginTop: '1rem' }}>
          Break it into milestones {!isPremium && <span style={{ color: '#C4B8B0' }}>(3 free, 5 with Premium)</span>}
        </div>
        {newMilestones.map((m, i) => (
          <input key={i} value={m} onChange={e => {
            const arr = [...newMilestones]
            arr[i] = e.target.value
            setNewMilestones(arr)
          }}
            placeholder={`Milestone ${i + 1}...`}
            style={{ ...inputStyle, marginBottom: '8px' }} />
        ))}
       {newMilestones.length < (isPremium ? 5 : 3) && (
          <span onClick={() => setNewMilestones([...newMilestones, ''])}
            style={{ fontSize: '13px', color: theme.primary, cursor: 'pointer', fontWeight: '600' }}>
            + add milestone {!isPremium && newMilestones.length === 2 && <span style={{ color: '#C4B8B0', fontSize: '11px' }}>(upgrade for more)</span>}
          </span>
        )}
      </div>

      <button onClick={addGoal} style={{
        width: '100%', padding: '14px', background: theme.primary, color: 'white',
        border: 'none', borderRadius: '16px', fontFamily: 'Playfair Display, serif',
        fontSize: '20px', cursor: 'pointer', marginBottom: '1rem'
      }}>Plant this goal 🌱</button>
    </div>
  )

  return (
    <div style={{ padding: '0 1.25rem' }}>

      {activeGoals.length > 0 && (
        <>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Active goals</div>
          {activeGoals.map(goal => {
            const progress = getProgress(goal.id)
            const daysLeft = getDaysLeft(goal.target_date)
            const circumference = 2 * Math.PI * 20

            return (
              <div key={goal.id} onClick={() => { setSelected(goal); setView('detail') }} style={{
                background: 'white', border: '1px solid #EDE4DC', borderRadius: '16px',
                padding: '14px 16px', marginBottom: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '14px'
              }}>
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#F0E8E0" strokeWidth="4"/>
                  <circle cx="24" cy="24" r="20" fill="none" stroke={theme.primary} strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * progress / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                  <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="600" fill={theme.primary}>{progress}%</text>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: '#3D2B1F', marginBottom: '3px' }}>{goal.title}</div>
                  <div style={{ fontSize: '12px', color: daysLeft !== null && daysLeft < 7 ? '#C4673A' : '#7A6558' }}>
                    {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : `${Math.abs(daysLeft)} days overdue`) : 'No deadline'}
                  </div>
                </div>
                <div style={{ color: theme.primary, fontSize: '18px' }}>›</div>
              </div>
            )
          })}
        </>
      )}

      {completedGoals.length > 0 && (
        <>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1rem 0 10px' }}>🌟 Harvest — completed goals</div>
          {completedGoals.map(goal => (
            <div key={goal.id} onClick={() => { setSelected(goal); setView('detail') }} style={{
              background: '#F5F0EB', border: '1px solid #EDE4DC', borderRadius: '16px',
              padding: '14px 16px', marginBottom: '10px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '14px', opacity: 0.8
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: theme.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🌟</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#3D2B1F', textDecoration: 'line-through', opacity: 0.7 }}>{goal.title}</div>
                <div style={{ fontSize: '12px', color: '#7A6558' }}>Achieved</div>
              </div>
              <div style={{ color: theme.primary, fontSize: '18px' }}>›</div>
            </div>
          ))}
        </>
      )}

      {goals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7A6558' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🌱</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', color: theme.primary, marginBottom: '8px' }}>Plant your first goal</div>
          <div style={{ fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>Every great achievement starts with a single seed. What do you want to grow?</div>
        </div>
      )}

      {canAddGoal ? (
        <button onClick={() => setAdding(true)} style={{
          width: '100%', padding: '14px', background: 'transparent', color: theme.primary,
          border: `1.5px dashed ${theme.primary}`, borderRadius: '16px',
          fontFamily: 'Playfair Display, serif', fontSize: '18px', cursor: 'pointer',
          marginTop: goals.length > 0 ? '0.5rem' : '0'
        }}>+ Plant a new goal 🌱</button>
      ) : (
        <div style={{ background: theme.light, borderRadius: '16px', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: theme.primary, fontWeight: '600', marginBottom: '4px' }}>Free plan — 2 active goals</div>
          <div style={{ fontSize: '12px', color: '#7A6558' }}>Upgrade to Premium for unlimited goals</div>
        </div>
      )}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', border: '1px solid #EDE4DC',
  borderRadius: '12px', fontSize: '14px', fontFamily: 'Nunito, sans-serif',
  outline: 'none', boxSizing: 'border-box', color: '#3D2B1F', background: 'white'
}