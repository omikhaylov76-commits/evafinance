import { useState } from 'react'
import { motion } from 'framer-motion'
import ModalShell, { FormGroup, FormInput, CatGrid, SubmitBtn } from './ModalShell'
import useStore from '../store'
import { playSave, playKaching, playMoneyIn, playMoneyOut } from '../sounds'

const EXP_CATS = [
  {e:'🍦',n:'Сладости'},{e:'🎮',n:'Игры'},{e:'📚',n:'Учёба'},{e:'👗',n:'Одежда'},
  {e:'🎨',n:'Творчество'},{e:'🚌',n:'Транспорт'},{e:'🎁',n:'Подарки'},{e:'💝',n:'Другое'},
]
const INC_CATS = [
  {e:'💶',n:'Карманные'},{e:'🎂',n:'День рождения'},{e:'💪',n:'Заработала'},{e:'🎁',n:'Подарок'},
  {e:'📚',n:'Стипендия'},{e:'🏆',n:'Награда'},{e:'🛍️',n:'Продала'},{e:'🌟',n:'Другое'},
]

export default function TxModal({ type: initType, onClose, fireConfetti }) {
  const [txType, setTxType] = useState(initType)
  const [amount, setAmount] = useState('')
  const [desc, setDesc]     = useState('')
  const [cat, setCat]       = useState(initType === 'expense' ? EXP_CATS[0] : INC_CATS[0])
  const [shake, setShake]   = useState(false)
  const addTransaction      = useStore((s) => s.addTransaction)
  const cats = txType === 'expense' ? EXP_CATS : INC_CATS

  const handleTypeChange = (t) => { setTxType(t); setCat(t === 'expense' ? EXP_CATS[0] : INC_CATS[0]) }

  const handleSave = () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) { setShake(true); setTimeout(() => setShake(false), 400); return }
    addTransaction({ type: txType, amount: amt, desc: desc.trim() || cat.n, cat: cat.n, emoji: cat.e })
    if (txType === 'income') { playKaching(); playMoneyIn() } else { playSave(); playMoneyOut() }
    fireConfetti()
    onClose()
  }

  return (
    <ModalShell title={txType === 'expense' ? '➖ Добавить трату' : '➕ Добавить доход'} onClose={onClose}>
      <div style={{ display: 'flex', gap: 6, background: 'var(--rose5)', padding: 5, borderRadius: 18, marginBottom: 16 }}>
        {['expense', 'income'].map((t) => (
          <motion.button key={t} whileTap={{ scale: 0.97 }} onClick={() => handleTypeChange(t)}
            style={{ flex: 1, padding: 11, border: 'none', borderRadius: 14, fontFamily: 'inherit', fontSize: 14, fontWeight: 800, cursor: 'pointer', background: txType === t ? '#fff' : 'none', color: txType !== t ? 'var(--t2)' : t === 'expense' ? 'var(--red)' : 'var(--green)', boxShadow: txType === t ? '0 2px 10px rgba(0,0,0,.09)' : 'none', transition: 'all .22s' }}>
            {t === 'expense' ? '➖ Трата' : '➕ Доход'}
          </motion.button>
        ))}
      </div>
      <FormGroup label="Сумма €">
        <motion.div animate={shake ? { x: [-7, 7, -5, 5, 0] } : {}} transition={{ duration: 0.3 }}>
          <FormInput value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="decimal" placeholder="0.00" autoFocus />
        </motion.div>
      </FormGroup>
      {txType === 'expense' && (
        <FormGroup label="Описание">
          <FormInput value={desc} onChange={(e) => setDesc(e.target.value)} type="text" placeholder="На что?" />
        </FormGroup>
      )}
      <FormGroup label="Категория">
        <CatGrid cats={cats} selected={cat} onSelect={setCat} />
      </FormGroup>
      <SubmitBtn onClick={handleSave}>Сохранить 🎀</SubmitBtn>
    </ModalShell>
  )
}