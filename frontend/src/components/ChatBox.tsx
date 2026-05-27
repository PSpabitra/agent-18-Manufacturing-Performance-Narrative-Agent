import { useState, useRef, useEffect } from 'react'
import { chatQuery } from '../api/apiClient'
import { useAuth } from '../context/AuthContext'

interface Msg { who: 'user' | 'bot'; text: string; sources?: any[] }

export default function ChatBox({ plant, periodType }: { plant?: string; periodType?: string }) {
const { username } = useAuth()
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: 'bot', text: 'Ask me anything about manufacturing performance, e.g. "Why did scrap increase this week?"' },
  ])
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [msgs, busy])

  async function send() {
    if (!q.trim() || busy) return
    const userMsg: Msg = { who: 'user', text: q }
    setMsgs((m) => [...m, userMsg])
    setBusy(true)
    const question = q
    setQ('')
    try {
      const res = await chatQuery({ question, plant, period_type: periodType,user_id: username || 'anonymous' })
      setMsgs((m) => [...m, { who: 'bot', text: res.answer, sources: res.sources }])
    } catch (e: any) {
      setMsgs((m) => [...m, { who: 'bot', text: `Error: ${e?.response?.data?.detail || e.message}` }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat-window">
      <div className="chat-messages" ref={scrollRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.who}`}>
            {m.text}
            {m.sources && m.sources.length > 0 && (
              <div className="muted" style={{ fontSize: 11, marginTop: 8 }}>
                Sources: {m.sources.slice(0, 4).map((s, j) => (
                  <span key={j} className="badge" style={{ marginRight: 4 }}>{s.type || 'ctx'}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && <div className="chat-bubble bot muted">Thinking...</div>}
      </div>
      <div className="chat-input-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          placeholder="Ask a question..."
        />
        <button onClick={send} disabled={busy || !q.trim()}>Send</button>
      </div>
    </div>
  )
}
