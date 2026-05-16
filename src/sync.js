import { supabase } from './supabase'

export async function cloudLoad() {
  if (!supabase) return null
  try {
    const [txRes, goalsRes] = await Promise.all([
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('goals').select('*').order('created_at', { ascending: true }),
    ])
    if (txRes.error || goalsRes.error) return null
    return { transactions: txRes.data ?? [], goals: goalsRes.data ?? [] }
  } catch { return null }
}
export async function cloudAddTransaction(tx) { if (!supabase) return; try { await supabase.from('transactions').upsert(tx) } catch {} }
export async function cloudDeleteTransaction(id) { if (!supabase) return; try { await supabase.from('transactions').delete().eq('id', id) } catch {} }
export async function cloudAddGoal(goal) { if (!supabase) return; try { await supabase.from('goals').upsert(goal) } catch {} }
export async function cloudUpdateGoal(goal) { if (!supabase) return; try { await supabase.from('goals').upsert(goal) } catch {} }
export async function cloudDeleteGoal(id) { if (!supabase) return; try { await supabase.from('goals').delete().eq('id', id) } catch {} }
