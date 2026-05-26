import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const links = [{ to: '/', label: 'Chat' }, { to: '/tickets', label: 'Tickets' }]

  return (
    <nav style={{ borderBottom: '1px solid var(--border)', background: 'rgba(8,12,20,0.85)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '17px', letterSpacing: '-0.3px' }}>
            Smart<span style={{ color: '#3b82f6' }}>Desk</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '4px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px' }}>
          {links.map(({ to, label }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} style={{
                padding: '7px 20px', borderRadius: '9px', fontSize: '13px', fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.2s',
                background: active ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                color: active ? 'white' : 'var(--text-secondary)',
                boxShadow: active ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
              }}>
                {label}
              </Link>
            )
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '8px', height: '8px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#22c55e' }}></div>
            <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', background: 'rgba(34,197,94,0.3)', animation: 'pulse-ring 1.5s ease-out infinite' }}></div>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>AI Online</span>
        </div>

      </div>
    </nav>
  )
}

export default Navbar