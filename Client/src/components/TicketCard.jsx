const statusConfig = {
  open:      { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.2)',  label: 'Open' },
  escalated: { color: '#eab308', bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.2)',   label: 'Escalated' },
  resolved:  { color: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   label: 'Resolved' },
}

function TicketCard({ ticket, onStatusChange }) {
  const s = statusConfig[ticket.status] || statusConfig.open

  return (
    <div className="animate-fade-up" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px', transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.5, flex: 1 }}>
          {ticket.userMessage}
        </p>
        <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.color, flexShrink: 0, letterSpacing: '0.3px' }}>
          {s.label}
        </span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
        {ticket.aiResponse}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        <select value={ticket.status} onChange={e => onStatusChange(ticket._id, e.target.value)} style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px',
          color: 'var(--text-secondary)', fontSize: '12px', padding: '5px 10px', cursor: 'pointer', outline: 'none',
        }}>
          <option value="open">Open</option>
          <option value="escalated">Escalated</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
    </div>
  )
}

export default TicketCard