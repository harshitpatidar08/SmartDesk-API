import { useEffect, useState } from 'react'
import axios from 'axios'
import TicketCard from '../components/TicketCard'

const API = import.meta.env.VITE_API_URL

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
  const counts = { all: tickets.length, open: tickets.filter(t => t.status === 'open').length, escalated: tickets.filter(t => t.status === 'escalated').length, resolved: tickets.filter(t => t.status === 'resolved').length }
  const filters = ['all', 'open', 'escalated', 'resolved']

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '6px' }}>Support Tickets</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage and resolve escalated issues</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
        {[
          { label: 'Total', value: counts.all, color: '#3b82f6' },
          { label: 'Escalated', value: counts.escalated, color: '#eab308' },
          { label: 'Resolved', value: counts.resolved, color: '#22c55e' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 20px' }}>
            <p style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Syne, sans-serif', color }}>{value}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 16px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s',
            background: filter === f ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
            color: filter === f ? 'white' : 'var(--text-secondary)',
            boxShadow: filter === f ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} {counts[f] > 0 && `(${counts[f]})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Loading tickets...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px' }}>
          No tickets found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(ticket => <TicketCard key={ticket._id} ticket={ticket} onStatusChange={handleStatusChange} />)}
        </div>
      )}

    </div>
  )
}

export default TicketsPage