import { useState } from 'react'
import ChatBox from '../components/ChatBox'

export default function ChatbotPage() {
  const [plant, setPlant] = useState('')
  const [periodType, setPeriodType] = useState('')

  return (
    <div className="container flex-column" style={{ height: 'calc(100vh - 176px)', maxHeight: 'calc(100vh - 176px)' }}>
      <div style={{ flexShrink: 0 }}>
        <h1>Speak to Assistant</h1>
        <p className="muted">Ask grounded questions about KPI data, narratives, and definitions. Answers cite their sources and refuse if data is unavailable.</p>

        <div className="card mt-12">
          <div className="grid grid-3 gap-12">
            <div>
              <div className="kpi-label">Scope: Plant</div>
              <input value={plant} onChange={(e) => setPlant(e.target.value)} placeholder="optional, e.g. Plant-1" />
            </div>
            <div>
              <div className="kpi-label">Scope: Period</div>
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)}>
                <option value="">all</option>
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24" style={{ flex: 1, minHeight: 0 }}>
        <ChatBox plant={plant || undefined} periodType={periodType || undefined} />
      </div>
    </div>
  )
}
