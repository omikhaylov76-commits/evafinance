import { motion } from 'framer-motion'

export default function ModalShell({ title, onClose, children }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(30,5,22,.55)', backdropFilter: 'blur(12px)', zIndex: 500, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 36 }}
        style={{ background: '#fff', borderRadius: '36px 36px 0 0', padding: '0 20px max(28px, env(safe-area-inset-bottom))', width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ width: 38, height: 4, background: 'var(--rose4)', borderRadius: 2, margin: '14px auto 18px' }} />
        <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(16px, 4vw, 21px)', fontWeight: 900, textAlign: 'center', marginBottom: 18, letterSpacing: -.5, lineHeight: 1.2 }}>{title}</div>
        {children}
      </motion.div>
    </motion.div>
  )
}

export function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--t1)', display: 'block', marginBottom: 7, textTransform: 'uppercase', letterSpacing: .6 }}>{label}</label>
      {children}
    </div>
  )
}

export function FormInput({ value, onChange, ...props }) {
  return (
    <input value={value} onChange={onChange}
      style={{ width: '100%', padding: '15px 16px', border: '1.5px solid var(--rose4)', borderRadius: 18, fontSize: 'clamp(17px,3.5vw,20px)', fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, color: 'var(--t0)', background: 'var(--rose5)', outline: 'none' }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--rose)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,61,139,.12)' }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--rose4)'; e.target.style.boxShadow = 'none' }}
      {...props} />
  )
}

export function CatGrid({ cats, selected, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
      {cats.map((c) => {
        const on = selected?.e === c.e
        return (
          <motion.button key={c.e} whileTap={{ scale: 0.93 }} onClick={() => onSelect(c)}
            style={{ background: on ? 'linear-gradient(135deg,#ff3d8b,#c0005a)' : 'var(--rose5)', border: `1.5px solid ${on ? 'var(--rose)' : 'var(--rose4)'}`, borderRadius: 14, padding: '9px 4px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, fontWeight: 800, color: on ? '#fff' : 'var(--t1)', cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, boxShadow: on ? '0 4px 14px rgba(255,61,139,.3)' : 'none', transform: on ? 'translateY(-1px)' : 'none', transition: 'all .18s' }}>
            <span style={{ fontSize: 25 }}>{c.e}</span>
            {c.n}
          </motion.button>
        )
      })}
    </div>
  )
}

export function SubmitBtn({ children, onClick }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick}
      style={{ width: '100%', padding: 17, marginTop: 10, background: 'linear-gradient(135deg,#ff3d8b,#c0005a)', color: '#fff', border: 'none', borderRadius: 22, fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(16px,3.5vw,20px)', fontWeight: 900, cursor: 'pointer', letterSpacing: -.2, boxShadow: '0 8px 28px rgba(255,61,139,.4)' }}>
      {children}
    </motion.button>
  )
}