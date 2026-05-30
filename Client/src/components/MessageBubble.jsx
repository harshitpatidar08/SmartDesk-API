function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className="fade-up" style={{
      display: 'flex', gap: '12px',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start', marginBottom: '24px',
    }}>

      {/* Avatar */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUser ? 'var(--bg-3)' : 'linear-gradient(135deg, #4f8ef7, #7c6af7)',
        border: isUser ? '1px solid var(--border-2)' : 'none',
        boxShadow: isUser ? 'none' : '0 0 16px rgba(79,142,247,0.3)',
        marginTop: '2px',
      }}>
        {isUser ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" fill="white" stroke="none"/>
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser
            ? 'linear-gradient(135deg, #4f8ef7, #7c6af7)'
            : 'var(--bg-2)',
          border: isUser ? 'none' : '1px solid var(--border)',
          fontSize: '14px', lineHeight: '1.65', color: 'var(--text-1)',
          boxShadow: isUser ? '0 4px 24px rgba(79,142,247,0.25)' : 'none',
          whiteSpace: 'pre-wrap',
        }}>
          {message.text}
        </div>

        {!isUser && message.proactive_tip && (
          <div style={{
            padding: '9px 13px', borderRadius: '10px',
            background: 'rgba(79,142,247,0.06)',
            border: '1px solid rgba(79,142,247,0.15)',
            fontSize: '12px', color: '#7aabf7', lineHeight: 1.6,
          }}>
            💡 {message.proactive_tip}
          </div>
        )}
      </div>

    </div>
  )
}

export default MessageBubble