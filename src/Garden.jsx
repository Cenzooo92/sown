const STAGES = [
  { minDays: 0,  label: 'Seedling',    emoji: '🌱', premium: false },
  { minDays: 4,  label: 'Sprouting',   emoji: '🌿', premium: false },
  { minDays: 8,  label: 'Growing',     emoji: '🪴', premium: false },
  { minDays: 15, label: 'Flowering',   emoji: '🌸', premium: true  },
  { minDays: 31, label: 'Mighty tree', emoji: '🌳', premium: true  },
]

export default function Garden({ theme, streak, isPremium, onClose }) {
  let stageIdx = 0
  for (let i = 0; i < STAGES.length; i++) {
    if (streak >= STAGES[i].minDays) stageIdx = i
  }
  if (STAGES[stageIdx].premium && !isPremium) stageIdx = 2

  const stage = STAGES[stageIdx]
  const nextStage = STAGES[stageIdx + 1]
  const daysToNext = nextStage ? nextStage.minDays - streak : null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      background: '#FAF6F0', display: 'flex', flexDirection: 'column',
      fontFamily: 'Nunito, sans-serif', overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', color: theme.primary }}>My garden</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#7A6558' }}>×</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '120px', marginBottom: '1rem', lineHeight: 1 }}>{stage.emoji}</div>

        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', color: theme.primary, marginBottom: '8px', textAlign: 'center' }}>
          {stage.label}
        </div>
        <div style={{ fontSize: '15px', color: '#7A6558', marginBottom: '1.5rem' }}>
          🔥 {streak} day{streak !== 1 ? 's' : ''} of journaling
        </div>

        {daysToNext && nextStage && !nextStage.premium && (
          <div style={{ background: '#F0E8E0', borderRadius: '14px', padding: '12px 20px', fontSize: '14px', color: '#7A6558', textAlign: 'center', marginBottom: '8px' }}>
            {daysToNext} more day{daysToNext !== 1 ? 's' : ''} until your plant grows 🌱
          </div>
        )}

        {daysToNext && nextStage && nextStage.premium && !isPremium && (
          <div style={{ background: '#F0E8E0', borderRadius: '14px', padding: '12px 20px', fontSize: '14px', color: '#7A6558', textAlign: 'center', marginBottom: '8px' }}>
            Upgrade to Premium to unlock the next growth stage 🌸
          </div>
        )}

        {streak === 0 && (
          <div style={{ background: theme.light, borderRadius: '14px', padding: '12px 20px', fontSize: '14px', color: theme.primary, textAlign: 'center', fontWeight: '600' }}>
            Start journaling to grow your plant 🌱
          </div>
        )}
      </div>

      <div style={{ padding: '0 1.25rem 1rem' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#7A6558', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Growth stages</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
          {STAGES.map((s, i) => {
            const unlocked = i <= stageIdx
            const isLocked = s.premium && !isPremium
            return (
              <div key={i} style={{
                background: unlocked ? theme.light : '#F0E8E0',
                borderRadius: '12px', padding: '10px 4px', textAlign: 'center',
                border: i === stageIdx ? `2px solid ${theme.primary}` : '2px solid transparent',
                opacity: isLocked ? 0.4 : 1
              }}>
                <div style={{ fontSize: '22px', marginBottom: '4px' }}>{s.emoji}</div>
                <div style={{ fontSize: '9px', color: theme.primary, fontWeight: '600', lineHeight: 1.2 }}>
                  {isLocked ? '🔒' : s.label}
                </div>
                <div style={{ fontSize: '8px', color: '#7A6558', marginTop: '2px' }}>
                  Day {s.minDays}+
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}