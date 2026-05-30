import { useEffect, useState } from 'react'
import axios from 'axios'
import TicketCard from '../components/TicketCard'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'

const API = import.meta.env.VITE_API_URL

const emotionColors = {
  calm:       '#3b82f6',
  confused:   '#a855f7',
  frustrated: '#f97316',
  angry:      '#ef4444',
  panicked:   '#eab308',
}

const statusColors = {
  open:      '#3b82f6',
  escalated: '#eab308',
  resolved:  '#22c55e',
}

function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchTickets = async () => {
    try {
      const { data } = await axios.get(`${API}/api/tickets`)
      setTickets(data)
    } catch {
      console.error('Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API}/api/tickets/${id}`, { status })
      setTickets(prev => prev.map(t => t._id === id ? { ...t, status } : t))
    } catch {
      console.error('Failed to update ticket')
    }
  }

  useEffect(() => { fetchTickets() }, [])

  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    escalated: tickets.filter(t => t.status === 'escalated').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  }

  const avgConfidence = tickets.length
    ? Math.round(tickets.reduce((sum, t) => sum + (t.confidence || 0), 0) / tickets.length)
    : 0

  // Emotion distribution for pie chart
  const emotionData = Object.entries(
    tickets.reduce((acc, t) => {
      const e = t.emotion || 'calm'
      acc[e] = (acc[e] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  // Daily ticket volume for bar chart
  const dailyData = tickets.reduce((acc, t) => {
    const date = new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const barData = Object.entries(dailyData)
    .slice(-7)
    .map(([date, count]) => ({ date, count }))

  const filters = ['all', 'open', 'escalated', 'resolved']

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Support Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Live overview of all conversations and sentiment trends
        </p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Tickets', value: counts.all, color: '#3b82f6' },
          { label: 'Escalated', value: counts.escalated, color: '#eab308' },
          { label: 'Resolved', value: counts.resolved, color: '#22c55e' },
          { label: 'Avg Confidence', value: `${avgConfidence}%`, color: '#a855f7' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px' }}>
            <p style={{ fontSize: '28px', fontWeight: 700, color }}>{value}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      {tickets.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>

          {/* Emotion Pie Chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-secondary)' }}>
              EMOTION DISTRIBUTION
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={emotionData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {emotionData.map((entry) => (
                    <Cell key={entry.name} fill={emotionColors[entry.name] || '#3b82f6'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px', justifyContent: 'center' }}>
              {emotionData.map(({ name }) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: emotionColors[name] || '#3b82f6' }}></div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Volume Bar Chart */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '20px', color: 'var(--text-secondary)' }}>
              TICKET VOLUME (LAST 7 DAYS)
            </p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} barSize={20}>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0d1220', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
            background: filter === f ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
            color: filter === f ? 'white' : 'var(--text-secondary)',
            boxShadow: filter === f ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {counts[f] > 0 && `(${counts[f]})`}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading tickets...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          No tickets found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(ticket => (
            <TicketCard key={ticket._id} ticket={ticket} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

    </div>
  )
}

export default TicketsPage