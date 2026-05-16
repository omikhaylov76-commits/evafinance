import { motion } from 'framer-motion'

export const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, type: 'spring', stiffness: 300, damping: 28 } }),
}

export default function Card({ children, style, custom }) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show" custom={custom}
      style={{ background: '#fff', borderRadius: 'var(--r-xl)', padding: '18px', boxShadow: '0 3px 18px rgba(180,40,120,.09)', marginBottom: 13, border: '1px solid rgba(255,61,139,.06)', position: 'relative', zIndex: 1, ...style }}>
      {children}
    </motion.div>
  )
}

export function CardTitle({ children, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <div style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(14px,3vw,17px)', fontWeight: 700, color: 'var(--t0)', display: 'flex', alignItems: 'center', gap: 8 }}>{children}</div>
      {right}
    </div>
  )
}