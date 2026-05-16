import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import useStore from '../store'

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
const COLORS  = ['#ff3d8b','#ff6aab','#c0005a','#ff9ec8','#b44bff','#ffd60a','#ff4565','#00c97a']
const fmt     = (n) => Math.abs(n).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function StatBox({ value, label, color, grad }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      style={{ flex: 1, borderRadius: 20, padding: '13px 8px', textAlign: 'center', background: grad, border: `1.5px solid ${color}22` }}>
      <div style={{ fontSize: 19, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--t2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1.5px solid var(--rose4)', borderRadius: 14, padding: '10px 14px', fontSize: 13, fontWeight: 700 }}>
      <p style={{ marginBottom: 4, color: 'var(--t2)' }}>{label}</p>
      {payload.map((p) => <p key={p.name} style={{ color: p.color }}>€{fmt(p.value)}</p>)}
    </div>
  )
}

export default function StatsTab() {
  const transactions = useStore((s) => s.transactions)
  const totalInc = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExp = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const bal      = totalInc - totalExp

  const catMap = {}
  transactions.filter(t => t.type === 'expense').forEach(t => { const k = `${t.emoji} ${t.cat}`; catMap[k] = (catMap[k] || 0) + t.amount })
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }))

  const barData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().slice(0, 10)
    return {
      name: `${d.getDate()} ${MONTHS[d.getMonth()]}`,
      Доходы:  transactions.filter(t => t.type === 'income'  && t.date.startsWith(ds)).reduce((s, t) => s + t.amount, 0),
      Расходы: transactions.filter(t => t.type === 'expense' && t.date.startsWith(ds)).reduce((s, t) => s + t.amount, 0),
    }
  })

  const baseText = { fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: 11, fill: '#c490ac' }

  return (
    <div style={{ paddingTop: 16 }}>
      <motion.h2 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(18px,4.5vw,26px)', fontWeight: 900, letterSpacing: -1, marginBottom: 12, position: 'relative', zIndex: 1 }}>
        📊 Статистика
      </motion.h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 13, position: 'relative', zIndex: 1 }}>
        <StatBox value={`€${fmt(totalInc)}`} label="Доходы"  color="#00c97a" grad="linear-gradient(135deg,#f0fff8,#d4fae9)" />
        <StatBox value={`€${fmt(totalExp)}`} label="Расходы" color="#ff4565" grad="linear-gradient(135deg,#fff2f5,#ffe0e5)" />
        <StatBox value={`€${fmt(bal)}`}      label="Остаток" color="#ff3d8b" grad="linear-gradient(135deg,#fdf5fa,#ffe6f4)" />
      </div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: '#fff', borderRadius: 28, padding: '18px', boxShadow: '0 3px 18px rgba(180,40,120,.09)', marginBottom: 13, border: '1px solid rgba(255,61,139,.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>🍩 По категориям (расходы)</div>
        {pieData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--t2)', fontSize: 13, fontWeight: 700 }}>Нет расходов</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#fff" strokeWidth={3} />)}
              </Pie>
              <Tooltip formatter={(v) => `€${fmt(v)}`} contentStyle={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, borderRadius: 14, border: '1.5px solid var(--rose4)' }} />
              <Legend iconSize={11} iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
        style={{ background: '#fff', borderRadius: 28, padding: '18px', boxShadow: '0 3px 18px rgba(180,40,120,.09)', marginBottom: 13, border: '1px solid rgba(255,61,139,.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>📅 Последние 7 дней</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,173,208,.3)" />
            <XAxis dataKey="name" tick={baseText} axisLine={false} tickLine={false} />
            <YAxis tick={baseText} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconSize={11} wrapperStyle={{ fontSize: 11, fontWeight: 700, color: 'var(--t1)' }} />
            <Bar dataKey="Доходы"  fill="#00c97a" radius={[8,8,0,0]} />
            <Bar dataKey="Расходы" fill="#ff3d8b" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}