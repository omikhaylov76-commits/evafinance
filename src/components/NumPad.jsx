import { motion } from 'framer-motion'

const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','del']

export default function NumPad({ value, onChange }) {
  const handle = (k) => {
    if (k === 'del') {
      onChange(value.slice(0, -1))
      return
    }
    if (k === '.' && value.includes('.')) return
    if (k === '.' && value === '') { onChange('0.'); return }
    if (value === '0' && k !== '.') { onChange(k); return }
    if (value.includes('.') && value.split('.')[1]?.length >= 2) return
    if (value.replace('.','').length >= 7) return
    onChange(value + k)
  }

  const display = value === '' ? '0' : value

  return (
    <div>
      {/* Amount display */}
      <div style={{
        textAlign: 'center', padding: '10px 0 18px',
        borderBottom: '1.5px solid var(--rose5)',
        marginBottom: 16,
      }}>
        <motion.span
          key={display}
          initial={{ scale: 0.88, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          style={{
            fontFamily: "'Unbounded', sans-serif",
            fontSize: display === '0' ? 48 : 'clamp(30px, 12vw, 52px)',
            fontWeight: 900,
            letterSpacing: -2,
            color: display === '0' ? 'var(--rose4)' : 'var(--t0)',
          }}
        >
          {display}
        </motion.span>
        <span style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: 22, fontWeight: 900,
          color: 'var(--t2)', marginLeft: 6,
        }}>
          €
        </span>
      </div>

      {/* Keypad grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: 4,
      }}>
        {KEYS.map((k) => (
          <motion.button
            key={k}
            whileTap={{ scale: 0.88, backgroundColor: k === 'del' ? '#ffd6e8' : '#ffe0ef' }}
            onPointerDown={(e) => { e.preventDefault(); handle(k) }}
            style={{
              height: 62,
              borderRadius: 20,
              border: 'none',
              background: k === 'del' ? 'var(--rose5)' : '#fff',
              boxShadow: k === 'del' ? 'none' : '0 2px 10px rgba(255,61,139,.10)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: k === 'del' ? 'inherit' : "'Unbounded', sans-serif",
              fontSize: k === 'del' ? 22 : 22,
              fontWeight: 800,
              color: k === 'del' ? 'var(--t2)' : 'var(--t0)',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              touchAction: 'manipulation',
            }}
          >
            {k === 'del' ? '⌫' : k}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
