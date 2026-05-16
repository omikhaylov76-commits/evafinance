import { motion } from 'framer-motion'

const BTNS = [
  { type: 'expense', icon: '💸', label: 'Трата', sub: 'Куда потратила', grad: 'linear-gradient(145deg, #ff3d8b 0%, #c0005a 100%)', shadow: '0 8px 28px rgba(255,61,139,.42)' },
  { type: 'income',  icon: '💰', label: 'Доход', sub: 'Пришли деньги',  grad: 'linear-gradient(145deg, #00d882 0%, #007a4a 100%)', shadow: '0 8px 28px rgba(0,201,122,.38)' },
]

export default function ActionButtons({ openTx }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
      {BTNS.map((btn) => (
        <motion.button key={btn.type} whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.02 }}
          onClick={() => openTx(btn.type)}
          style={{ padding: '20px 12px 18px', border: 'none', borderRadius: 24, fontFamily: 'inherit', color: '#fff', cursor: 'pointer', background: btn.grad, boxShadow: btn.shadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,.12)', pointerEvents: 'none' }} />
          <motion.span style={{ fontSize: 44, lineHeight: 1, position: 'relative', zIndex: 1 }}
            animate={{ rotate: [0, -8, 8, 0], y: [0, -2, 2, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: btn.type === 'income' ? 0.8 : 0 }}
          >{btn.icon}</motion.span>
          <span style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(14px, 3.5vw, 20px)', fontWeight: 900, letterSpacing: '-0.3px', lineHeight: 1, position: 'relative', zIndex: 1 }}>{btn.label}</span>
          <span style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(9px, 2vw, 12px)', fontWeight: 600, opacity: 0.75, lineHeight: 1, position: 'relative', zIndex: 1 }}>{btn.sub}</span>
        </motion.button>
      ))}
    </div>
  )
}