import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/** Returns the visible viewport height, shrinking when keyboard appears */
function useVisualViewportHeight() {
  const [height, setHeight] = useState(
    () => window.visualViewport?.height ?? window.innerHeight
  )
  useEffect(() => {
    const vp = window.visualViewport
    if (!vp) return
    const update = () => setHeight(vp.height)
    vp.addEventListener('resize', update)
    vp.addEventListener('scroll', update)
    return () => {
      vp.removeEventListener('resize', update)
      vp.removeEventListener('scroll', update)
    }
  }, [])
  return height
}

export default function ModalShell({ title, onClose, children }) {
  const vpHeight = useVisualViewportHeight()
  // Leave 48px gap at top so user can tap backdrop to close
  const maxH = Math.min(vpHeight - 48, 680)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(30,5,22,.55)', backdropFilter: 'blur(12px)',
        zIndex: 500,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
      }}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 36 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '36px 36px 0 0',
          padding: '0 20px max(20px, env(safe-area-inset-bottom))',
          width: '100%', maxWidth: 640,
          maxHeight: maxH,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 38, height: 4, background: 'var(--rose4)',
          borderRadius: 2, margin: '14px auto 18px',
        }} />
        {/* Title */}
        <div style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: 'clamp(16px, 4vw, 21px)', fontWeight: 900,
          textAlign: 'center', marginBottom: 18,
          letterSpacing: -.5, lineHeight: 1.2,
        }}>
          {title}
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

export function FormGroup({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{
        fontSize: 11, fontWeight: 800, color: 'var(--t1)',
        display: 'block', marginBottom: 7,
        textTransform: 'uppercase', letterSpacing: .7,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export function FormInput(props) {
  return (
    <input
      {...props}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '14px 16px', borderRadius: 18,
        border: '2px solid var(--rose4)',
        background: 'var(--rose5)',
        fontFamily: "'Comfortaa', sans-serif",
        fontSize: 16, fontWeight: 700, color: 'var(--t0)',
        outline: 'none',
        transition: 'border-color .18s',
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = 'var(--pink)'
        props.onFocus?.(e)
      }}
      onBlur={(e) => {
        e.target.style.borderColor = 'var(--rose4)'
        props.onBlur?.(e)
      }}
    />
  )
}

export function CatGrid({ cats, selected, onSelect }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
    }}>
      {cats.map((c) => {
        const active = selected?.n === c.n
        return (
          <motion.button
            key={c.n}
            whileTap={{ scale: 0.93 }}
            onClick={() => onSelect(c)}
            style={{
              padding: '10px 4px', borderRadius: 18, border: 'none',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 5,
              background: active ? 'var(--pink)' : 'var(--rose5)',
              boxShadow: active ? '0 4px 14px rgba(255,61,139,.28)' : 'none',
              transition: 'all .18s',
            }}
          >
            <span style={{ fontSize: 26 }}>{c.e}</span>
            <span style={{
              fontSize: 10, fontWeight: 800,
              color: active ? '#fff' : 'var(--t1)',
              textAlign: 'center', lineHeight: 1.2,
            }}>
              {c.n}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}

export function SubmitBtn({ onClick, children }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: '100%', padding: '17px', marginTop: 18, marginBottom: 4,
        border: 'none', borderRadius: 22, cursor: 'pointer',
        background: 'linear-gradient(135deg, #ff3d8b 0%, #c0005a 100%)',
        boxShadow: '0 6px 22px rgba(255,61,139,.35)',
        color: '#fff', fontFamily: "'Unbounded', sans-serif",
        fontSize: 15, fontWeight: 900, letterSpacing: -.3,
      }}
    >
      {children}
    </motion.button>
  )
}
