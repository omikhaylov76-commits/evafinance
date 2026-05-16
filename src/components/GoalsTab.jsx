import { AnimatePresence, motion } from 'framer-motion'
import useStore from '../store'
import { playDelete } from '../sounds'

const fmt = (n) => Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function GoalCard({ goal, openContrib, onDelete }) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100))
  const done = pct >= 100
  return (
    <motion.div layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, boxShadow: '0 10px 32px rgba(255,61,139,.17)' }}
      style={{ background: 'linear-gradient(135deg,#fff8fc,#fff0f7)', border: '1.5px solid var(--rose4)', borderRadius: 22, padding: 16, marginBottom: 12, position: 'relative', zIndex: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 2px 10px rgba(255,61,139,.15)', flexShrink: 0 }}>{goal.emoji}</div>
          <div>
            <div style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(15px,3.5vw,19px)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              {goal.name}
              {done && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} style={{ fontSize: 11, fontWeight: 800, background: 'linear-gradient(135deg,#00c97a,#00a362)', color: '#fff', padding: '3px 8px', borderRadius: 8 }}>🎉 Цель!</motion.span>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(16px,3.5vw,20px)', fontWeight: 900 }}>€{fmt(goal.saved)}</div>
          <div style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(11px,2.2vw,13px)', fontWeight: 700, color: 'var(--t2)' }}>из €{fmt(goal.target)}</div>
        </div>
      </div>
      <div style={{ height: 14, background: 'var(--rose4)', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
          style={{ height: '100%', borderRadius: 10, background: done ? 'linear-gradient(90deg,#00c97a,#00e68a)' : 'linear-gradient(90deg,#ff3d8b,#ff6aab)', boxShadow: done ? '0 0 12px rgba(0,201,122,.5)' : '0 0 10px rgba(255,61,139,.5)', position: 'relative', overflow: 'hidden' }}>
          <motion.div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent)' }} animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
        </motion.div>
      </div>
      <div style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(12px,2.5vw,14px)', fontWeight: 700, color: done ? 'var(--green)' : 'var(--rose)', marginBottom: 12 }}>{pct}% накоплено</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={() => openContrib(goal.id)}
          style={{ flex: 1, padding: 10, background: 'linear-gradient(135deg,#ff3d8b,#c0005a)', color: '#fff', border: 'none', borderRadius: 14, fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(13px,3vw,16px)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,61,139,.3)' }}>
          💰 Добавить в копилку
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onDelete}
          style={{ padding: '10px 14px', background: '#fff', border: '1.5px solid var(--rose4)', borderRadius: 14, fontSize: 16, cursor: 'pointer' }}>
          🗑️
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function GoalsTab({ openGoal, openContrib }) {
  const goals = useStore((s) => s.goals)
  const deleteGoal = useStore((s) => s.deleteGoal)
  return (
    <div style={{ paddingTop: 16 }}>
      <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(18px,4.5vw,26px)', fontWeight: 900, letterSpacing: -1, marginBottom: 12, position: 'relative', zIndex: 1 }}>
        🎯 Цели
      </motion.h2>
      <AnimatePresence>
        {goals.length === 0 && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--t2)', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>⭐</div>
            <p style={{ fontSize: 14, fontWeight: 700 }}>Добавь цель и начни копить!</p>
          </motion.div>
        )}
        {goals.map((g) => <GoalCard key={g.id} goal={g} openContrib={openContrib} onDelete={() => { playDelete(); deleteGoal(g.id) }} />)}
      </AnimatePresence>
      <motion.button whileTap={{ scale: 0.97 }} whileHover={{ background: 'var(--rose4)', borderColor: 'var(--rose)' }} onClick={openGoal}
        style={{ width: '100%', padding: 15, background: 'var(--rose5)', border: '2px dashed var(--rose3)', borderRadius: 22, fontFamily: 'inherit', fontSize: 14, fontWeight: 800, color: 'var(--rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, position: 'relative', zIndex: 1 }}>
        ✨ Добавить новую цель
      </motion.button>
    </div>
  )
}