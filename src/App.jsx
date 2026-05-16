import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomeTab from './components/HomeTab'
import WalletTab from './components/WalletTab'
import GoalsTab from './components/GoalsTab'
import StatsTab from './components/StatsTab'
import TxModal from './components/TxModal'
import GoalModal from './components/GoalModal'
import ContribModal from './components/ContribModal'
import Blobs from './components/Blobs'
import Confetti from './components/Confetti'
import { playTab } from './sounds'
import useStore from './store'

const TABS = ['home', 'wallet', 'goals', 'stats']

const tabVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [prevTab, setPrevTab] = useState('home')
  const [txModal, setTxModal] = useState(null)   // 'income' | 'expense' | null
  const [goalModal, setGoalModal] = useState(false)
  const [contribId, setContribId] = useState(null)
  const [confetti, setConfetti] = useState(false)
  const loadFromCloud = useStore((s) => s.loadFromCloud)

  // Pull latest data from Supabase on first render (no-op if not configured)
  useEffect(() => { loadFromCloud() }, []) // eslint-disable-line

  const direction = TABS.indexOf(tab) - TABS.indexOf(prevTab)

  const goTab = (t) => {
    if (t === tab) return
    playTab()
    setPrevTab(tab)
    setTab(t)
  }

  const fireConfetti = () => {
    setConfetti(true)
    setTimeout(() => setConfetti(false), 100)
  }

  const tabProps = { openTx: setTxModal, openGoal: () => setGoalModal(true), openContrib: setContribId, goTab, fireConfetti }

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100svh', maxWidth: 1024, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      <Blobs />
      <Confetti active={confetti} />

      <Header onAddExpense={() => setTxModal('expense')} onAddIncome={() => setTxModal('income')} />

      {/* scroll area */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={tab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, overflowY: tab === 'home' ? 'hidden' : 'auto', overflowX: 'hidden', padding: '0 14px 16px', display: 'flex', flexDirection: 'column' }}
          >
            {tab === 'home'   && <HomeTab   {...tabProps} />}
            {tab === 'wallet' && <WalletTab {...tabProps} />}
            {tab === 'goals'  && <GoalsTab  {...tabProps} />}
            {tab === 'stats'  && <StatsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav tab={tab} goTab={goTab} />

      <AnimatePresence>
        {txModal     && <TxModal     key="tx"     type={txModal}  onClose={() => setTxModal(null)}     fireConfetti={fireConfetti} />}
        {goalModal   && <GoalModal   key="goal"   onClose={() => setGoalModal(false)} fireConfetti={fireConfetti} />}
        {contribId   && <ContribModal key="contrib" goalId={contribId} onClose={() => setContribId(null)} fireConfetti={fireConfetti} />}
      </AnimatePresence>
    </div>
  )
}
