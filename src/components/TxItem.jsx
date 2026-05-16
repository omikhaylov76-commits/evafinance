import { motion } from 'framer-motion'
import useStore from '../store'
import { playDelete } from '../sounds'

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
const fmt = (n) => Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fdate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}` }

export default function TxItem({ tx, showDelete }) {
  const deleteTransaction = useStore((s) => s.deleteTransaction)
  const isIncome = tx.type === 'income'
  return (
    <motion.div layout initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, transition: { duration: 0.18 } }}
      style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: '1px solid var(--rose5)' }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: isIncome ? '#f0fdf6' : '#fff0f4', boxShadow: isIncome ? '0 2px 8px rgba(0,201,122,.15)' : '0 2px 8px rgba(255,61,139,.12)' }}>
        {tx.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 'clamp(14px, 3vw, 17px)', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--t0)' }}>{tx.desc || tx.cat}</div>
        <div style={{ fontSize: 'clamp(11px, 2.2vw, 13px)', fontWeight: 600, color: 'var(--t2)', marginTop: 3 }}>{tx.cat} · {fdate(tx.date)}</div>
      </div>
      <div style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 900, color: isIncome ? 'var(--green)' : 'var(--red)', whiteSpace: 'nowrap', flexShrink: 0 }}>
        {isIncome ? '+' : '-'}€{fmt(tx.amount)}
      </div>
      {showDelete && (
        <motion.button whileTap={{ scale: 0.8 }} whileHover={{ opacity: 1, scale: 1.1 }}
          onClick={() => { playDelete(); deleteTransaction(tx.id) }}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', opacity: 0.35, padding: 6, flexShrink: 0, transition: 'opacity .2s' }}>
          🗑️
        </motion.button>
      )}
    </motion.div>
  )
}