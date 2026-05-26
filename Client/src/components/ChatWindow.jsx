import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import MessageBubble from './MessageBubble'

const API = import.meta.env.VITE_API_URL

const suggestions = [
  "My laptop won't connect to WiFi",
  "I forgot my system password",
  "My screen is flickering",
  "Software not installing properly",
]

function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [escalated, setEscalated] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const buildHistory = (msgs) =>
    msgs.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }))

  const sendMessage = async (text) => {
    const userText = text || input.trim()
    if (!userText) return

    const updatedMessages = [...messages, { role: 'user', text: userText }]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
  const { data } = await axios.post(`${API}/api/chat`, {
  message: userText,
  history: buildHistory(messages),
})

setMessages((prev) => [...prev, {
  role: 'ai',
  text: data.reply,
  emotion: data.emotion,
  confidence: data.confidence,
  proactive_tip: data.proactive_tip,
}])

if (data.escalate) {
  setEscalated(true)
}
    } catch {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

      {messages.length === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.5px' }}>
            How can I help you today?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '36px', maxWidth: '400px', lineHeight: 1.6 }}>
            Describe your IT issue and I'll resolve it instantly or connect you with a specialist.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '600px' }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => sendMessage(s)} style={{
                padding: '10px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: 500,
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.target.style.background = 'var(--surface-hover)'; e.target.style.borderColor = 'var(--border-strong)'; e.target.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.target.style.background = 'var(--surface)'; e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>
          {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div style={{ padding: '14px 18px', borderRadius: '18px 18px 18px 4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}

          {escalated && (
            <div style={{ padding: '14px 18px', borderRadius: '14px', background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span style={{ fontSize: '13px', color: '#eab308', fontWeight: 500 }}>Ticket created — a specialist will follow up shortly.</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: 'rgba(8,12,20,0.9)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '4px 4px 4px 16px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'border-color 0.2s' }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Describe your issue..."
              rows={1}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px', resize: 'none', fontFamily: 'DM Sans, sans-serif', lineHeight: '1.6', padding: '10px 0', maxHeight: '120px' }}
            />
          </div>
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
            width: '46px', height: '46px', borderRadius: '13px', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            background: input.trim() && !loading ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'var(--surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: input.trim() && !loading ? '0 4px 16px rgba(99,102,241,0.4)' : 'none',
            transition: 'all 0.2s',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? 'white' : '#475569'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

    </div>
  )
}

export default ChatWindow