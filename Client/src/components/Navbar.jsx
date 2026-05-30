import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const { pathname } = useLocation()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 24px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f8ef7 0%, #7c6af7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(79,142,247,0.3), 0 4px 20px rgba(79,142,247,0.25)',
            flexShrink: 0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)" stroke="none"/>
              <circle cx="12" cy="12" r="3" fill="white" stroke="none"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontWeight: 600, fontSize: '15px', letterSpacing: '-0.3px', color: 'var(--text-1)' }}>
            Resolve<span style={{ color: 'var(--accent)' }}>IQ</span>
          </span>
        </div>

        {/* Nav */}
        <nav style={{
          display: 'flex', gap: '2px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '3px',
        }}>
          {[{ to: '/', label: 'Chat' }, { to: '/tickets', label: 'Dashboard' }].map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link key={to} to={to} style={{
                padding: '6px 16px', borderRadius: '9px',
                fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.18s ease',
                background: active ? 'var(--bg-3)' : 'transparent',
                color: active ? 'var(--text-1)' : 'var(--text-2)',
                border: active ? '1px solid var(--border-2)' : '1px solid transparent',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
              }}>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ position: 'relative', width: '7px', height: '7px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--green)' }} />
            <div style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', background: 'rgba(61,214,140,0.4)', animation: 'pulseRing 2s ease-out infinite' }} />
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-3)', fontWeight: 500 }}>Online</span>
        </div>

      </div>
    </header>
  )
}

export default Navbar