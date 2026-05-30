import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import MessageBubble from './MessageBubble'

const API = import.meta.env.VITE_API_URL

const suggestions = [
  { icon: '📶', text: "My laptop won't connect to WiFi" },
  { icon: '🔑', text: "I forgot my system password" },
  { icon: '🖥️', text: "My screen is flickering" },
  { icon: '📦', text: "Software not installing properly" },
]

const getSessionId = () => {
  let id = localStorage.getItem("resolveiq_session")
  if (!id) {
    id = "session_" + Math.random().toString(36).substr(2, 9)
    localStorage.setItem("resolveiq_session", id)
  }
  return id
}

function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [escalated, setEscalated] = useState(false)
  const [memory, setMemory] = useState(null)
  const [greeting, setGreeting] = useState("")
  const [listening, setListening] = useState(false)
  const sessionId = getSessionId()
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    const loadMemory = async () => {
      try {
        const { data } = await axios.get(`${API}/api/memory/${sessionId}`)
        setMemory(data)
        if (data.issueHistory && data.issueHistory.length > 0) {
          const last = data.issueHistory[data.issueHistory.length - 1]
          setGreeting(`Welcome back. Last time: "${last}"`)
        }
      } catch {
        console.error("Could not load memory")
      }
    }
    loadMemory()
  }, [])

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

    if (textareaRef.current) textareaRef.current.style.height = 'auto'

    try {
      const { data } = await axios.post(`${API}/api/chat`, {
        message: userText,
        history: buildHistory(updatedMessages),
        memory,
      })

      setMessages((prev) => [...prev, {
        role: 'ai',
        text: data.reply,
        emotion: data.emotion,
        confidence: data.confidence,
        proactive_tip: data.proactive_tip,
      }])

      if (data.escalate) setEscalated(true)

      try {
        await axios.post(`${API}/api/memory/${sessionId}`, {
          issue: userText,
          summary: `User reported: ${userText}. Emotion: ${data.emotion}. Confidence: ${data.confidence}%.`,
        })
        setMemory((prev) => ({
          ...prev,
          issueHistory: [...(prev?.issueHistory || []), userText],
        }))
      } catch {
        console.error("Memory save failed")
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

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px'
  }

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { alert("Use Chrome for voice input."); return }

    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.continuous = false

    rec.onstart = () => { setListening(true); setInput('') }
    rec.onend = () => setListening(false)
    rec.onresult = (e) => {
      let t = ''
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript
      setInput(t)
    }
    rec.onerror = () => setListening(false)
    rec.start()
  }

  const canSend = input.trim() && !loading

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="fade-in" style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '40px 24px', textAlign: 'center',
        }}>

          {/* Logo mark */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '18px', marginBottom: '28px',
            background: 'linear-gradient(135deg, #4f8ef7 0%, #7c6af7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 1px rgba(79,142,247,0.2), 0 8px 32px rgba(79,142,247,0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3.5" fill="white"/>
              <path d="M12 2v5M12 17v5M2 12h5M17 12h5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M5.6 18.4l3.5-3.5M14.9 9.1l3.5-3.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.6px', marginBottom: '10px', color: 'var(--text-1)' }}>
            How can I help you?
          </h1>

          {greeting && (
            <div style={{
              padding: '10px 16px', borderRadius: '10px', marginBottom: '20px',
              background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.12)',
              fontSize: '13px', color: '#7aabf7', maxWidth: '380px',
            }}>
              👋 {greeting}
            </div>
          )}

          <p style={{ color: 'var(--text-3)', fontSize: '14px', marginBottom: '36px', maxWidth: '340px', lineHeight: 1.7 }}>
            Describe your issue and I'll resolve it instantly or connect you with a specialist.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxWidth: '520px', width: '100%' }}>
            {suggestions.map((s) => (
              <button key={s.text} onClick={() => sendMessage(s.text)} style={{
                padding: '13px 16px', borderRadius: '12px', textAlign: 'left',
                background: 'var(--bg-2)', border: '1px solid var(--border)',
                color: 'var(--text-2)', cursor: 'pointer', transition: 'all 0.18s ease',
                fontSize: '13px', lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: '10px',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-2)'; e.currentTarget.style.color = 'var(--text-2)' }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{s.icon}</span>
                <span>{s.text}</span>
              </button>
            ))}
          </div>

        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px 8px', maxWidth: '780px', width: '100%', margin: '0 auto' }}>
          {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}

          {/* Typing */}
          {loading && (
            <div className="fade-in" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, background: 'linear-gradient(135deg, #4f8ef7, #7c6af7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(79,142,247,0.3)', marginTop: '2px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3.5" fill="white" stroke="none"/>
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ padding: '13px 16px', borderRadius: '4px 16px 16px 16px', background: 'var(--bg-2)', border: '1px solid var(--border)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}

          {/* Escalation notice */}
          {escalated && (
            <div className="fade-in" style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--yellow)', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'var(--yellow)' }}>Ticket created — a specialist will follow up shortly.</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '16px 24px 20px', borderTop: '1px solid var(--border)', background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '8px',
            background: 'var(--bg-2)', border: '1px solid var(--border-2)',
            borderRadius: '16px', padding: '10px 10px 10px 16px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
            onFocusCapture={e => { e.currentTarget.style.borderColor = 'rgba(79,142,247,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,142,247,0.08)' }}
            onBlurCapture={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKey}
              placeholder="Describe your issue..."
              rows={1}
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: 'var(--text-1)', fontSize: '14px', resize: 'none',
                fontFamily: 'Geist, -apple-system, sans-serif', lineHeight: '1.6',
                padding: '4px 0', maxHeight: '140px', overflowY: 'auto',
              }}
            />

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
              {/* Mic */}
              <button onClick={startVoice} title="Voice input" style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: listening ? 'rgba(247,85,85,0.12)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
              }}
                onMouseEnter={e => !listening && (e.currentTarget.style.background = 'var(--surface-2)')}
                onMouseLeave={e => !listening && (e.currentTarget.style.background = 'transparent')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={listening ? 'var(--red)' : 'var(--text-3)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </button>

              {/* Send */}
              <button onClick={() => sendMessage()} disabled={!canSend} style={{
                width: '36px', height: '36px', borderRadius: '10px', border: 'none',
                cursor: canSend ? 'pointer' : 'not-allowed',
                background: canSend ? 'linear-gradient(135deg, #4f8ef7, #7c6af7)' : 'var(--bg-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s', flexShrink: 0,
                boxShadow: canSend ? '0 2px 12px rgba(79,142,247,0.35)' : 'none',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={canSend ? 'white' : 'var(--text-3)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-3)', marginTop: '10px' }}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

    </div>
  )
}

export default ChatWindow