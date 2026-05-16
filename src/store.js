import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  cloudAddTransaction, cloudDeleteTransaction,
  cloudAddGoal, cloudUpdateGoal, cloudDeleteGoal,
} from './sync'

const useStore = create(
  persist(
    (set) => ({
      transactions: [],
      goals: [],
      loadFromCloud: async () => {
        const { cloudLoad } = await import('./sync')
        const data = await cloudLoad()
        if (!data) return
        set({ transactions: data.transactions, goals: data.goals })
      },
      addTransaction: (tx) => {
        const newTx = { ...tx, id: Date.now().toString(), date: new Date().toISOString() }
        set((s) => ({ transactions: [newTx, ...s.transactions] }))
        cloudAddTransaction(newTx)
      },
      deleteTransaction: (id) => {
        set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }))
        cloudDeleteTransaction(id)
      },
      addGoal: (goal) => {
        const newGoal = { ...goal, id: Date.now().toString(), saved: 0 }
        set((s) => ({ goals: [...s.goals, newGoal] }))
        cloudAddGoal(newGoal)
      },
      contributeToGoal: (id, amount) => {
        set((s) => {
          const goals = s.goals.map((g) => g.id === id ? { ...g, saved: Math.min(g.target, g.saved + amount) } : g)
          const updated = goals.find((g) => g.id === id)
          if (updated) cloudUpdateGoal(updated)
          return { goals }
        })
      },
      deleteGoal: (id) => {
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }))
        cloudDeleteGoal(id)
      },
    }),
    {
      name: 'eva-finance-data',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ transactions: state.transactions, goals: state.goals }),
      merge: (persisted, current) => ({ ...current, transactions: persisted?.transactions ?? [], goals: persisted?.goals ?? [] }),
    }
  )
)
export default useStore
