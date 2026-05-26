const emotionConfig = {
  calm:       { emoji: '😌', color: '#3b82f6', label: 'Calm' },
  confused:   { emoji: '🤔', color: '#a855f7', label: 'Confused' },
  frustrated: { emoji: '😤', color: '#f97316', label: 'Frustrated' },
  angry:      { emoji: '😠', color: '#ef4444', label: 'Angry' },
  panicked:   { emoji: '😰', color: '#eab308', label: 'Panicked' },
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const emotion = emotionConfig[message.emotion]

  return (
    <div className="animate-fade-up" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '20px', gap: '6px'
    }}>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', flexDirection: isUser ? 'row-reverse' : 'row' }}>

        <div style={{ width: '30px', height: '30px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isUser ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
          border: isUser ? '1px solid var(--border)' : 'none',
          boxShadow: isUser ? 'none' : '0 0 14px rgba(99,102,241,0.4)'
        }}>
          {isUser ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </div>

        <div style={{
          maxWidth: '70%', padding: '13px 17px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'rgba(255,255,255,0.05)',
          border: isUser ? 'none' : '1px solid var(--border)',
          fontSize: '14px', lineHeight: '1.7', color: 'var(--text-primary)',
          boxShadow: isUser ? '0 4px 20px rgba(99,102,241,0.3)' : 'none',
        }}>
          {message.text}
        </div>

      </div>

      {!isUser && (
        <div style={{ paddingLeft: '40px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

          {emotion && (
            <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '6px', fontWeight: 500,
              background: `${emotion.color}15`, border: `1px solid ${emotion.color}30`, color: emotion.color
            }}>
              {emotion.emoji} {emotion.label} detected
            </span>
          )}

          {message.confidence !== undefined && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {message.confidence}% confidence
            </span>
          )}

          {message.proactive_tip && (
            <div style={{ width: '100%', marginTop: '4px', padding: '10px 13px', borderRadius: '10px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '12px', color: '#a5b4fc', lineHeight: 1.6 }}>
              💡 {message.proactive_tip}
            </div>
          )}

        </div>
      )}

    </div>
  )
}

export default MessageBubble