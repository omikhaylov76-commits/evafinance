import { useState } from 'react'
import ModalShell, { FormGroup, FormInput, SubmitBtn } from './ModalShell'
import useStore from '../store'
import { playCoinInJar, playGoalComplete, playCoinRain } from '../sounds'

export default function ContribModal({ goalId, onClose, fireConfetti }) {
  const [amount, setAmount] = useState('')
  const goals = useStore((s) => s.goals)
  const contributeToGoal = useStore((s) => s.contributeToGoal)
  const goal = goals.find((g) => g.id === goalId)

  const handleSave = () => {
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) return
    contributeToGoal(goalId, amt)
    const updated = { ...goal, saved: Math.min(goal.target, goal.saved + amt) }
    if (updated.saved >= updated.target) { playGoalComplete(); playCoinRain() }
    else playCoinInJar()
    fireConfetti()
    onClose()
  }

  return (
    <ModalShell title="💰 Пополнить копилку" onClose={onClose}>
      {goal && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--rose5)', border: '1.5px solid var(--rose4)', borderRadius: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>{goal.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{goal.name}</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 700 }}>
              €{Math.abs(goal.saved).toLocaleString('de-DE',{minimumFractionDigits:2})} из €{Math.abs(goal.target).toLocaleString('de-DE',{minimumFractionDigits:2})}
            </div>
          </div>
        </div>
      )}
      <FormGroup label="Сумма €">
        <FormInput value={amount} onChange={(e) => setAmount(e.target.value)} type="number" inputMode="decimal" placeholder="0.00" autoFocus />
      </FormGroup>
      <SubmitBtn onClick={handleSave}>Положить в копилку 🎀</SubmitBtn>
    </ModalShell>
  )
}