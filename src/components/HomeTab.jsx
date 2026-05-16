import { motion } from 'framer-motion'
import useStore from '../store'

const TIPS = [
  'Откладывай хотя бы 10% от любых денег, которые получаешь!',
  'Перед покупкой подожди 24 часа — может, оно и не нужно?',
  'Ставь конкретные цели: намного приятнее копить на мечту! 🌟',
  'Сравнивай цены — можно сэкономить очень много денег!',
  'Записывай каждую трату — так поймёшь, куда уходят деньги.',
  'Делай подарки своими руками — это приятнее и дешевле! 🎨',
  'Попроси родителей начислять % на сбережения — как настоящий банк!',
]

const fmt = (n) => Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function TxRow({ tx }) {
  const isIncome = tx.type === 'income'
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,61,139,.07)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 12, flexShrink: 0, background: isIncome ? 'linear-gradient(135deg,#e6fff4,#c3ffe4)' : 'linear-gradient(135deg,#fff0f7,#ffd6eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
        {tx.cat?.e ?? (isIncome ? '💰' : '💸')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, fontSize: 'clamp(12px,2.5vw,14px)', color: 'var(--t0)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tx.note || tx.cat?.n || (isIncome ? 'Доход' : 'Расход')}
        </div>
        <div style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 600, fontSize: 'clamp(10px,2vw,12px)', color: 'var(--t2)' }}>
          {new Date(tx.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
        </div>
      </div>
      <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(12px,2.5vw,15px)', color: isIncome ? '#00a362' : 'var(--rose)', flexShrink: 0 }}>
        {isIncome ? '+' : '−'}€{fmt(tx.amount)}
      </div>
    </motion.div>
  )
}

function GoalMini({ goal }) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100))
  const done = pct >= 100
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, fontSize: 'clamp(12px,2.5vw,14px)', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--t0)' }}>
          <span style={{ fontSize: 18 }}>{goal.emoji}</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>{goal.name}</span>
        </span>
        <span style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(10px,2vw,12px)', fontWeight: 800, color: done ? '#00a362' : 'var(--rose)', flexShrink: 0 }}>{pct}%</span>
      </div>
      <div style={{ height: 8, background: 'var(--rose4)', borderRadius: 10, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          style={{ height: '100%', borderRadius: 10, background: done ? 'linear-gradient(90deg,#00c97a,#00e68a)' : 'linear-gradient(90deg,#ff3d8b,#ff6aab)', boxShadow: done ? '0 0 8px rgba(0,201,122,.4)' : '0 0 8px rgba(255,61,139,.4)' }} />
      </div>
    </div>
  )
}

export default function HomeTab({ openTx, goTab }) {
  const transactions = useStore((s) => s.transactions)
  const goals = useStore((s) => s.goals)
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4)
  const tip = TIPS[new Date().getDate() % TIPS.length]

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 10, padding: '10px 0 6px', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flexShrink: 0 }}>
        <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={() => openTx('expense')}
          style={{ padding: '14px 10px', background: 'linear-gradient(145deg,#ff3d8b,#c0005a)', border: 'none', borderRadius: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: '0 6px 24px rgba(255,61,139,.4)' }}>
          <motion.span style={{ fontSize: 38, lineHeight: 1 }} animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}>💸</motion.span>
          <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(13px,3vw,17px)', color: '#fff', letterSpacing: -0.3 }}>Трата</span>
          <span style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, fontSize: 'clamp(9px,1.8vw,11px)', color: 'rgba(255,255,255,.75)' }}>Куда потратила</span>
        </motion.button>
        <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={() => openTx('income')}
          style={{ padding: '14px 10px', background: 'linear-gradient(145deg,#00d882,#007a4a)', border: 'none', borderRadius: 22, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: '0 6px 24px rgba(0,216,130,.4)' }}>
          <motion.span style={{ fontSize: 38, lineHeight: 1 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}>💰</motion.span>
          <span style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(13px,3vw,17px)', color: '#fff', letterSpacing: -0.3 }}>Доход</span>
          <span style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, fontSize: 'clamp(9px,1.8vw,11px)', color: 'rgba(255,255,255,.75)' }}>Пришли деньги</span>
        </motion.button>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={{ background: '#fff', borderRadius: 22, padding: '14px 14px 10px', boxShadow: '0 3px 18px rgba(180,40,120,.09)', border: '1px solid rgba(255,61,139,.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, fontSize: 'clamp(12px,2.5vw,15px)', color: 'var(--t0)', display: 'flex', alignItems: 'center', gap: 6 }}>🕐 Операции</span>
            <button onClick={() => goTab('wallet')} style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(11px,2vw,13px)', fontWeight: 700, color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Все →</button>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {recent.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--t2)' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🌸</div>
                <p style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(11px,2.2vw,13px)', fontWeight: 700, textAlign: 'center' }}>Пока пусто — добавь первую запись!</p>
              </div>
            ) : recent.map((tx, i) => <TxRow key={tx.id} tx={tx} />)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
          <div style={{ background: '#fff', borderRadius: 22, padding: '14px 14px 12px', boxShadow: '0 3px 18px rgba(180,40,120,.09)', border: '1px solid rgba(255,61,139,.06)', flex: goals.length > 0 ? '1.4' : '1', minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexShrink: 0 }}>
              <span style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, fontSize: 'clamp(12px,2.5vw,15px)', color: 'var(--t0)', display: 'flex', alignItems: 'center', gap: 6 }}>🎯 Цели</span>
              <button onClick={() => goTab('goals')} style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(11px,2vw,13px)', fontWeight: 700, color: 'var(--rose)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Все →</button>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              {goals.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--t2)' }}>
                  <div style={{ fontSize: 34, marginBottom: 6 }}>⭐</div>
                  <p style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(10px,2vw,12px)', fontWeight: 700, textAlign: 'center' }}>Добавь цель!</p>
                </div>
              ) : goals.slice(0, 3).map((g) => <GoalMini key={g.id} goal={g} />)}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            style={{ background: 'linear-gradient(135deg,#ff3d8b,#c0005a)', borderRadius: 22, padding: '13px 14px', boxShadow: '0 6px 22px rgba(255,61,139,.35)', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(10px,2.2vw,12px)', color: 'rgba(255,255,255,.75)', marginBottom: 5, letterSpacing: .3, textTransform: 'uppercase' }}>💡 Совет дня</div>
            <div style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(11px,2.2vw,13px)', fontWeight: 700, color: '#fff', lineHeight: 1.5 }}>{tip}</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}