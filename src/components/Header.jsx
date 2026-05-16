import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import useStore from '../store'

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
const WDAYS  = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
const STARS  = '✦✧★✨☆✦✧★✦'.split('')
const fmt = (n) => Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function AnimatedNumber({ value }) {
  return (
    <motion.span key={value} initial={{ y: -20, opacity: 0, filter: 'blur(4px)' }} animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', stiffness: 380, damping: 26 }} style={{ display: 'inline-block' }}>
      {fmt(value)}
    </motion.span>
  )
}

export default function Header() {
  const transactions = useStore((s) => s.transactions)
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance      = totalIncome - totalExpense
  const d = new Date()
  const dateStr = `${WDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`

  return (
    <header style={{ background: 'linear-gradient(145deg, #3b0a28 0%, #6b1248 45%, #9e1a6e 100%)', padding: '16px 20px 52px', borderRadius: '0 0 40px 40px', position: 'relative', overflow: 'hidden', zIndex: 1, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,106,171,.28), transparent), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(180,75,255,.2), transparent)' }} />
      <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,.07)', top: -80, right: -60, pointerEvents: 'none' }} />
      {STARS.map((s, i) => (
        <motion.span key={i} style={{ position: 'absolute', color: 'rgba(255,255,255,.45)', fontSize: 9 + (i % 4) * 3, left: `${6 + i * 9.5}%`, top: `${8 + (i % 3) * 20}%`, pointerEvents: 'none' }}
          animate={{ opacity: [0.12, 0.6, 0.12], scale: [1, 1.45, 1] }}
          transition={{ duration: 1.6 + i * 0.28, repeat: Infinity, delay: i * 0.18 }}
        >{s}</motion.span>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative', zIndex: 1, gap: 10, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
          <motion.div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(12px)', border: '1.5px solid rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23, flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,.28)' }}
            animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>🎀</motion.div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(20px, 5vw, 32px)', lineHeight: 1, color: '#fff', letterSpacing: '-0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>EVA</div>
            <div style={{ fontFamily: "'Comfortaa', sans-serif", fontWeight: 600, fontSize: 'clamp(11px, 2.5vw, 15px)', color: 'rgba(255,255,255,.65)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 1, whiteSpace: 'nowrap' }}>Finance</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.18)', color: 'rgba(255,255,255,.9)', fontSize: 'clamp(10px, 2vw, 13px)', fontWeight: 700, padding: '7px 12px', borderRadius: 20, whiteSpace: 'nowrap', flexShrink: 0 }}>{dateStr}</div>
      </div>
      <motion.div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 24, padding: '16px 18px', boxShadow: '0 8px 32px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.2)', overflow: 'hidden' }}
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 28 }}>
        <div style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.6)', letterSpacing: '.7px', textTransform: 'uppercase', marginBottom: 6 }}>Мой кошелёк</div>
        <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 8vw, 52px)', color: '#fff', lineHeight: 1, letterSpacing: '-1.5px', display: 'flex', alignItems: 'flex-start', gap: 5, flexWrap: 'nowrap', overflow: 'hidden' }}>
          <span style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(16px, 4vw, 28px)', fontWeight: 700, opacity: .7, marginTop: 'clamp(4px, 1vw, 8px)', flexShrink: 0 }}>€</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}><AnimatedNumber value={balance} /></span>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 12, flexWrap: 'wrap' }}>
          {[
            { label: '➕', val: totalIncome,  bg: 'rgba(0,201,122,.22)',  border: 'rgba(0,201,122,.35)' },
            { label: '➖', val: totalExpense, bg: 'rgba(255,69,101,.22)', border: 'rgba(255,69,101,.35)' },
          ].map(({ label, val, bg, border }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, background: bg, border: `1px solid ${border}`, color: '#fff', fontSize: 'clamp(11px, 2.5vw, 14px)', fontFamily: "'Comfortaa', sans-serif", fontWeight: 700, padding: '6px 11px', borderRadius: 12, backdropFilter: 'blur(8px)', whiteSpace: 'nowrap' }}>
              {label} €<AnimatedNumber value={val} />
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  )
}