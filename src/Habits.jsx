import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const ICONS = ['🧘','📖','💧','🏃','🥗','😴','✍️','🎯','💪','🌿']

export default function Habits({ session, theme }) {
  const [habits, setHabits] = useState([])
  const [logs, setLogs] = useState([])
  const [adding, setAdding] = useState(false)
  const [newHabit, setNewHabit] = useState({ name: '', icon: '🧘' })
  const today = new Date().toDateString()

  useEffect(() => { fetchHabits() }, [])

  const fetchHabits = async () => {
    const { data: habitsData } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at')

    const { data: logsData } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('date', today)

    if (habitsData) setHabits(habitsData)
    if (logsData) setLogs(logsData)
  }

  const toggleHabit = async (habit) => {
    const existing = logs.find(l => l.habit_id === habit.id)
    if (existing) {
      await supabase.from('habit_logs').delete().eq('id', existing.id)
      setLogs(logs.filter(l => l.habit_id !== habit.id))
    } else {
      const { data } = await supabase.from('habit_logs').insert({
        habit_id: habit.id,
        user_id: session.user.id,
        date: today,
        completed: true
      }).select().single()
      if (data) setLogs([...logs, data])
    }
  }

  const addHabit = async () => {
    if (!newHabit.name.trim()) return
    const { data } = await supabase.from('habits').insert({
      user_id: session.user.id,
      name: newHabit.name,
      icon: newHabit.icon,
    }).select().single()
    if (data) setHabits([...habits, data])
    setNewHabit({ name: '', icon: '🧘' })
    setAdding(false)
  }

  const deleteHabit = async (id) => {
    await supabase.from('habits').delete().eq('id', id)
    setHabits(habits.filter(h => h.id !== id))
    setLogs(logs.filter(l => l.habit_id !== id))
  }

  const isCompleted = (habitId) => logs.some(l => l.habit_id === habitId)
  const completedCount = habits.filter(h => isCompleted(h.id)).length

  return (
    <div style={{ padding: '0 1.25rem' }}>

      {/* Progress bar */}
      {habits.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#7A6558', marginBottom: '6px' }}>
            <span>Today's progress</span>
            <span style={{ fontWeight: '600', color: theme.primary }}>{completedCount}/{habits.length}</span>
          </div>
          <div style={{ height: '6px', background: '#EDE4DC', borderRadius: '3px' }}>
            <div style={{
              height: '6px', borderRadius: '3px', background: theme.primary,
              width: habits.length > 0 ? `${(completedCount / habits.length) * 100}%` : '0%',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Habit list */}
      {habits.map(habit => (
        <div key={habit.id} style={{
          background: 'white', border: `1px solid ${isCompleted(habit.id) ? theme.primary : '#EDE4DC'}`,
          borderRadius: '14px', padding: '12px 14px', marginBottom: '8px',
          display: 'flex', alignItems: 'center', gap: '12px',
          opacity: isCompleted(habit.id) ? 0.75 : 1
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: isCompleted(habit.id) ? theme.light : '#F5F0EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', flexShrink: 0
          }}>{habit.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '14px', fontWeight: '600', color: '#3D2B1F',
              textDecoration: isCompleted(habit.id) ? 'line-through' : 'none'
            }}>{habit.name}</div>
            <div style={{ fontSize: '12px', color: '#7A6558' }}>Daily habit</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div onClick={() => toggleHabit(habit)} style={{
              width: '28px', height: '28px', borderRadius: '50%',
              border: `1.5px solid ${isCompleted(habit.id) ? theme.primary : '#D8CFC8'}`,
              background: isCompleted(habit.id) ? theme.primary : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '14px', color: 'white'
            }}>{isCompleted(habit.id) ? '✓' : ''}</div>
            <div onClick={() => deleteHabit(habit.id)} style={{
              fontSize: '16px', cursor: 'pointer', color: '#C4B8B0', padding: '4px'
            }}>×</div>
          </div>
        </div>
      ))}

      {/* Add habit form */}
      {adding ? (
        <div style={{ background: 'white', border: '1px solid #EDE4DC', borderRadius: '14px', padding: '14px', marginBottom: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#7A6558', marginBottom: '10px' }}>Choose an icon</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {ICONS.map(icon => (
              <div key={icon} onClick={() => setNewHabit({ ...newHabit, icon })} style={{
                width: '36px', height: '36px', borderRadius: '10px', fontSize: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                background: newHabit.icon === icon ? theme.light : '#F5F0EB',
                border: newHabit.icon === icon ? `1.5px solid ${theme.primary}` : '1.5px solid transparent'
              }}>{icon}</div>
            ))}
          </div>
          <input
            value={newHabit.name}
            onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
            placeholder="Habit name e.g. Morning meditation"
            style={{
              width: '100%', padding: '10px 14px', border: '1px solid #EDE4DC',
              borderRadius: '12px', fontSize: '14px', fontFamily: 'Nunito, sans-serif',
              outline: 'none', boxSizing: 'border-box', marginBottom: '10px'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addHabit} style={{
              flex: 1, padding: '10px', background: theme.primary, color: 'white',
              border: 'none', borderRadius: '12px', fontFamily: 'Playfair Display, serif',
              fontSize: '16px', cursor: 'pointer'
            }}>Add habit</button>
            <button onClick={() => setAdding(false)} style={{
              padding: '10px 16px', background: 'transparent', color: '#7A6558',
              border: '1px solid #EDE4DC', borderRadius: '12px', cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', fontSize: '14px'
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          width: '100%', padding: '12px', background: 'transparent', color: theme.primary,
          border: `1.5px dashed ${theme.primary}`, borderRadius: '14px',
          fontFamily: 'Playfair Display, serif', fontSize: '17px', cursor: 'pointer',
          marginBottom: '1rem'
        }}>+ Add a habit</button>
      )}

      {habits.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#7A6558', fontSize: '14px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
          <div>Start building your daily habits</div>
        </div>
      )}
    </div>
  )
}