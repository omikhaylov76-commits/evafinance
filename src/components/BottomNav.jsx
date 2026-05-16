import { motion } from 'framer-motion'

const TABS = [
  { id: 'home',   icon: '🏠', label: 'Главная' },
  { id: 'wallet', icon: '💳', label: 'Кошелёк' },
  { id: 'goals',  icon: '🎯', label: 'Цели' },
  { id: 'stats',  icon: '📊', label: 'Статистика' },
]

export default function BottomNav({ tab, goTab }) {
  return (
    <div style={{ padding: '0 14px max(14px, env(safe-area-inset-bottom))', position: 'relative', zIndex: 20 }}>
      <nav style={{ background: 'rgba(255,255,255,.72)', backdropFilter: 'blur(48px) saturate(200%)', WebkitBackdropFilter: 'blur(48px) saturate(200%)', border: '1.5px solid rgba(255,255,255,.75)', borderRadius: 30, display: 'flex', padding: 6, gap: 4, boxShadow: '0 8px 40px rgba(180,40,120,.18), 0 2px 8px rgba(0,0,0,.06), inset 0 1.5px 0 rgba(255,255,255,.95)', position: 'relative' }}>
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => goTab(t.id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 4px 8px', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 24, position: 'relative', zIndex: 1, WebkitTapHighlightColor: 'transparent' }}
            >
              {active && (
                <motion.div layoutId="nav-pill"
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(145deg,#ff3d8b,#c0005a)', borderRadius: 24, zIndex: -1, boxShadow: '0 4px 20px rgba(255,61,139,.5), inset 0 1px 0 rgba(255,255,255,.25)' }}
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                />
              )}
              <motion.span style={{ fontSize: 'clamp(24px,4.5vw,30px)', lineHeight: 1, display: 'block' }}
                animate={{ scale: active ? 1.15 : 1, y: active ? -1 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              >{t.icon}</motion.span>
              <motion.span animate={{ opacity: active ? 1 : 0.55 }} transition={{ duration: 0.18 }}
                style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(9px,1.9vw,11px)', fontWeight: active ? 800 : 600, color: active ? '#fff' : 'var(--t2)', lineHeight: 1, whiteSpace: 'nowrap' }}
              >{t.label}</motion.span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}