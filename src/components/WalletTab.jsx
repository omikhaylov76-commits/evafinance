import { AnimatePresence, motion } from 'framer-motion'
import Card from './Card'
import TxItem from './TxItem'
import ActionButtons from './ActionButtons'
import useStore from '../store'

export default function WalletTab({ openTx }) {
  const transactions = useStore((s) => s.transactions)
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date))
  return (
    <div style={{ paddingTop: 16 }}>
      <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(18px,4.5vw,26px)', fontWeight: 900, letterSpacing: -1, marginBottom: 12, position: 'relative', zIndex: 1 }}>
        🧾 Кошелёк
      </motion.h2>
      <Card>
        <div style={{ maxHeight: 360, overflowY: 'auto' }}>
          <AnimatePresence>
            {sorted.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--t2)' }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🌸</div>
                <p style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 15, fontWeight: 700 }}>Пока пусто!</p>
              </motion.div>
            ) : sorted.map((tx) => <TxItem key={tx.id} tx={tx} showDelete />)}
          </AnimatePresence>
        </div>
      </Card>
      <ActionButtons openTx={openTx} />
    </div>
  )
}