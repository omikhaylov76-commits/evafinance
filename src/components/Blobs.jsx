import { motion } from 'framer-motion'

const blobs = [
  { w: 500, h: 500, bg: '#ff6aab', top: '-130px', left: '-100px', dur: 20 },
  { w: 360, h: 360, bg: '#b44bff', top: '18%', right: '-90px', dur: 26 },
  { w: 280, h: 280, bg: '#ff3d8b', bottom: '12%', left: '18%', dur: 22 },
  { w: 220, h: 220, bg: '#ffd60a', bottom: '4%', right: '8%', dur: 30, opacity: 0.15 },
]

export default function Blobs() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {blobs.map((b, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', width: b.w, height: b.h, borderRadius: '50%', background: `radial-gradient(circle, ${b.bg}, transparent)`, filter: 'blur(72px)', opacity: b.opacity ?? 0.3, top: b.top, left: b.left, right: b.right, bottom: b.bottom }}
          animate={{ x: [0, 35, 0], y: [0, 25, 0], scale: [1, 1.07, 1] }}
          transition={{ duration: b.dur, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        />
      ))}
    </div>
  )
}