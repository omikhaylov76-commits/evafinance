import { useState } from 'react'
import ModalShell, { FormGroup, FormInput, CatGrid, SubmitBtn } from './ModalShell'
import useStore from '../store'
import { playCoinClink } from '../sounds'

const EMOJIS = [
  {e:'🎀',n:'Бантик'},{e:'📱',n:'Телефон'},{e:'🎮',n:'Игра'},{e:'👟',n:'Кроссы'},
  {e:'🎨',n:'Творчество'},{e:'🐱',n:'Питомец'},{e:'✈️',n:'Поездка'},{e:'⭐',n:'Другое'},
]

export default function GoalModal({ onClose, fireConfetti }) {
  const [name, setName]     = useState('')
  const [target, setTarget] = useState('')
  const [emoji, setEmoji]   = useState(EMOJIS[0])
  const addGoal = useStore((s) => s.addGoal)

  const handleSave = () => {
    const t = parseFloat(target)
    if (!name.trim() || !t || t <= 0) return
    addGoal({ name: name.trim(), target: t, emoji: emoji.e })
    playCoinClink()
    fireConfetti()
    onClose()
  }

  return (
    <ModalShell title="🎯 Новая цель" onClose={onClose}>
      <FormGroup label="Название">
        <FormInput value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Например: новые кроссовки 👟" autoFocus />
      </FormGroup>
      <FormGroup label="Нужно накопить €">
        <FormInput value={target} onChange={(e) => setTarget(e.target.value)} type="number" inputMode="decimal" placeholder="0.00" />
      </FormGroup>
      <FormGroup label="Иконка">
        <CatGrid cats={EMOJIS} selected={emoji} onSelect={setEmoji} />
      </FormGroup>
      <SubmitBtn onClick={handleSave}>Создать цель ✨</SubmitBtn>
    </ModalShell>
  )
}