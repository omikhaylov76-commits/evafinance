import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import useStore from '../store'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const RU_MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']

const PALETTE = [
  '#ff3d8b','#b44bff','#00c97a','#ffd60a',
  '#ff6aab','#4BC8FF','#ff4565','#a3e635',
]

const fmt = (n) =>
  Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// --- StatBox ---
function StatBox({ value, label, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      style={{
        flex: 1, borderRadius: 20, padding: '14px 10px', textAlign: 'center',
        background: color + '18', border: `1.5px solid ${color}44`,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 900, color, fontFamily: "'Unbounded', sans-serif" }}>
        {value}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 700, color: 'var(--t2)', marginTop: 4,
        textTransform: 'uppercase', letterSpacing: .5,
      }}>
        {label}
      </div>
    </motion.div>
  )
}

// --- Pie tooltip ---
function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value, payload: p } = payload[0]
  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--rose4)', borderRadius: 14,
      padding: '8px 14px', fontSize: 13, fontWeight: 700,
    }}>
      <span style={{ marginRight: 6 }}>{p.emoji}</span>
      {name}: <span style={{ color: p.color }}>-{fmt(value)}</span>
    </div>
  )
}

// --- Bar tooltip ---
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1.5px solid var(--rose4)', borderRadius: 14,
      padding: '8px 14px', fontSize: 12, fontWeight: 700,
    }}>
      <div style={{ marginBottom: 4, color: 'var(--t2)' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.fill }}>
          {p.name === 'income' ? '+' : '-'}{fmt(p.value)}
        </div>
      ))}
    </div>
  )
}

export default function StatsTab() {
  const transactions = useStore((s) => s.transactions)

  // --- Expense pie data: group by category ---
  const pieData = useMemo(() => {
    const map = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const key = t.cat || 'Другое'
        if (!map[key]) map[key] = { name: key, value: 0, emoji: t.emoji || '💸' }
        map[key].value += t.amount
      })
    return Object.values(map).sort((a, b) => b.value - a.value)
  }, [transactions])

  // --- Monthly bar data: last 6 months ---
  const barData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
      const m = d.getMonth()
      const y = d.getFullYear()
      const income = transactions
        .filter((t) => t.type === 'income' && new Date(t.date).getMonth() === m && new Date(t.date).getFullYear() === y)
        .reduce((s, t) => s + t.amount, 0)
      const expense = transactions
        .filter((t) => t.type === 'expense' && new Date(t.date).getMonth() === m && new Date(t.date).getFullYear() === y)
        .reduce((s, t) => s + t.amount, 0)
      return { month: RU_MONTHS[m], income, expense }
    })
  }, [transactions])

  const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance      = totalIncome - totalExpense
  const savings      = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0

  const noExpenses = pieData.length === 0
  const noData     = transactions.length === 0

  return (
    <div style={{ paddingTop: 16, paddingBottom: 24 }}>
      <motion.h2
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{
          fontFamily: "'Unbounded', sans-serif",
          fontSize: 'clamp(18px,4.5vw,26px)', fontWeight: 900,
          letterSpacing: -1, marginBottom: 14,
        }}
      >
        Статистика
      </motion.h2>

      {/* Stat boxes */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <StatBox value={`+${fmt(totalIncome)}`}   label="Доходы"  color="var(--green)" />
        <StatBox value={`-${fmt(totalExpense)}`}  label="Расходы" color="var(--red)"   />
        <StatBox value={`${savings}%`}             label="Копилка" color="#b44bff"      />
      </div>

      {noData ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--t2)' }}
        >
          <div style={{ fontSize: 52, marginBottom: 12 }}>📊</div>
          <p style={{ fontFamily: "'Comfortaa', sans-serif", fontSize: 15, fontWeight: 700 }}>
            Добавь первую трату или доход!
          </p>
        </motion.div>
      ) : (
        <>
          {/* Pie chart — expenses by category */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#fff', borderRadius: 24, padding: '18px 16px 10px',
              marginBottom: 16, boxShadow: '0 2px 18px rgba(255,61,139,.07)',
            }}
          >
            <div style={{
              fontFamily: "'Comfortaa', sans-serif", fontSize: 13, fontWeight: 800,
              color: 'var(--t1)', marginBottom: 12,
            }}>
              Расходы по категориям
            </div>

            {noExpenses ? (
              <p style={{ textAlign: 'center', color: 'var(--t2)', fontSize: 13, padding: '16px 0' }}>
                Расходов пока нет
              </p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={54}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PALETTE[index % PALETTE.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 4 }}>
                  {pieData.map((entry, i) => (
                    <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: 3,
                        background: PALETTE[i % PALETTE.length], flexShrink: 0,
                      }} />
                      <span style={{ color: 'var(--t1)' }}>{entry.emoji} {entry.name}</span>
                      <span style={{ color: 'var(--t2)' }}>{fmt(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Bar chart — monthly */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            style={{
              background: '#fff', borderRadius: 24, padding: '18px 16px 10px',
              boxShadow: '0 2px 18px rgba(255,61,139,.07)',
            }}
          >
            <div style={{
              fontFamily: "'Comfortaa', sans-serif", fontSize: 13, fontWeight: 800,
              color: 'var(--t1)', marginBottom: 12,
            }}>
              Доходы и расходы по месяцам
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barCategoryGap="30%" barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0e0ea" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 700, fill: '#b08090' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<BarTooltip />} cursor={{ fill: '#fce7f0' }} />
                <Bar dataKey="income"  name="income"  fill="#00c97a" radius={[6,6,0,0]} />
                <Bar dataKey="expense" name="expense" fill="#ff3d8b" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#00c97a' }}>&#9632; Доходы</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ff3d8b' }}>&#9632; Расходы</span>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
