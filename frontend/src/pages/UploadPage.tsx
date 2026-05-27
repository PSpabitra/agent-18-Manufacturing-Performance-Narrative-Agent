import { useState, useRef, useEffect, useCallback } from 'react'
import { uploadFile, createConnector, updateConnector, listConnectors, ConnectorRecord } from '../api/apiClient'

const POLL_INTERVAL_MS = 15_000   // match backend sync interval

const Icons = {
  Search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Refresh: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  CSV: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Google: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 12.5H12v-1h8v4.5A8 8 0 1 1 12 4a7.94 7.94 0 0 1 5.5 2.18l-1.42 1.43A5.95 5.95 0 0 0 12 6a6 6 0 1 0 6 6z"></path>
    </svg>
  ),
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  CloudUpload: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      <path d="M12 11v6"></path>
      <path d="M9 14l3-3 3 3"></path>
    </svg>
  ),
  Spinner: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Sync: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
}

const typeColour: Record<string, { bg: string; fg: string }> = {
  CSV:    { bg: '#ecfdf5', fg: '#10b981' },
  GOOGLE: { bg: '#eff6ff', fg: '#3b82f6' },
}

function ConnectorTypeIcon({ type }: { type: string }) {
  const col = typeColour[type] ?? { bg: '#f1f5f9', fg: '#64748b' }
  return (
    <div style={{ color: col.fg, background: col.bg, padding: '6px', borderRadius: '6px', display: 'flex' }}>
      {type === 'GOOGLE' ? <Icons.Google /> : <Icons.CSV />}
    </div>
  )
}

/** Format an ISO timestamp as a human-readable "X seconds ago" string */
function timeAgo(iso: string): string {
  const diffSec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diffSec < 5)   return 'just now'
  if (diffSec < 60)  return `${diffSec}s ago`
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  return `${Math.floor(diffSec / 3600)}h ago`
}

type ModalMode = 'add' | 'edit'

export default function UploadPage() {
  // ── list state ────────────────────────────────────────────────────────────
  const [connectors, setConnectors]   = useState<ConnectorRecord[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [listError, setListError]     = useState<string | null>(null)
  const [search, setSearch]           = useState('')
  const [, forceRender]               = useState(0)  // tick every second to re-render "X ago" labels

  // ── modal state ───────────────────────────────────────────────────────────
  const [modalMode, setModalMode]             = useState<ModalMode>('add')
  const [editingConnector, setEditingConnector] = useState<ConnectorRecord | null>(null)
  const [isModalOpen, setIsModalOpen]         = useState(false)
  const [connectorName, setConnectorName]     = useState('')
  const [selectedType, setSelectedType]       = useState('CSV')
  const [sheetsUrl, setSheetsUrl]             = useState('')
  const [busy, setBusy]                       = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── fetch list ────────────────────────────────────────────────────────────
  const fetchConnectors = useCallback(async (silent = false) => {
    if (!silent) setLoadingList(true)
    setListError(null)
    try {
      const res = await listConnectors()
      setConnectors(res.data)
    } catch {
      if (!silent) setListError('Failed to load connectors. Is the backend running?')
    } finally {
      if (!silent) setLoadingList(false)
    }
  }, [])

  // Initial load
  useEffect(() => { fetchConnectors() }, [fetchConnectors])

  // Auto-poll every 15s to pick up backend sync updates (silent — no spinner)
  useEffect(() => {
    const poll = setInterval(() => fetchConnectors(true), POLL_INTERVAL_MS)
    return () => clearInterval(poll)
  }, [fetchConnectors])

  // Tick every second to keep "X ago" labels fresh
  useEffect(() => {
    const tick = setInterval(() => forceRender(n => n + 1), 1000)
    return () => clearInterval(tick)
  }, [])

  // ── open / close helpers ──────────────────────────────────────────────────
  const openAddModal = () => {
    setModalMode('add'); setEditingConnector(null)
    setConnectorName(''); setSelectedType('CSV'); setSheetsUrl('')
    setMsg(null); setBusy(false); setIsModalOpen(true)
  }

  const openEditModal = (c: ConnectorRecord) => {
    setModalMode('edit'); setEditingConnector(c)
    setConnectorName(c.name); setSelectedType(c.connector_type)
    setSheetsUrl(c.source_url ?? '')
    setMsg(null); setBusy(false); setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false); setEditingConnector(null)
    setMsg(null); setBusy(false)
  }

  // ── CSV upload (Add mode) ─────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setMsg({ kind: 'info', text: 'Uploading and parsing CSV…' })
    try {
      const res = await uploadFile(file)
      const name = connectorName.trim() || 'CSV Connector'
      await createConnector({
        name, connector_type: 'CSV',
        detail: `Parsed ${res.rows_parsed} rows from ${res.filename}`,
        status: 'Active', file_path: res.filename,
      })
      setMsg({ kind: 'success', text: `✅ "${name}" created — ${res.rows_parsed} rows parsed.` })
      await fetchConnectors()
      setTimeout(closeModal, 1800)
    } catch (err: any) {
      setMsg({ kind: 'error', text: `❌ ${err?.response?.data?.detail || err.message}` })
    } finally { setBusy(false) }
  }

  // ── Google Sheets connect / update ────────────────────────────────────────
  const handleGoogleConnect = async () => {
    if (!sheetsUrl.trim()) { setMsg({ kind: 'error', text: 'Please enter a Google Sheets URL.' }); return }
    const name = connectorName.trim() || 'Google Sheets Connector'
    setBusy(true)
    setMsg({ kind: 'info', text: '🔗 Connecting to Google Sheets and fetching data…' })
    try {
      let res
      if (modalMode === 'edit' && editingConnector) {
        res = await updateConnector(editingConnector.id, { name, connector_type: 'GOOGLE', source_url: sheetsUrl.trim() })
      } else {
        res = await createConnector({ name, connector_type: 'GOOGLE', detail: sheetsUrl.trim(), status: 'Active', source_url: sheetsUrl.trim() })
      }
      const rows = res.rows_parsed
      const verb = modalMode === 'edit' ? 'updated' : 'connected'
      setMsg({ kind: 'success', text: rows != null ? `✅ "${name}" ${verb} — ${rows} rows imported. Auto-syncing every 15s.` : `✅ "${name}" ${verb}.` })
      await fetchConnectors()
      setTimeout(closeModal, 2200)
    } catch (err: any) {
      setMsg({ kind: 'error', text: `❌ ${err?.response?.data?.detail || err.message}` })
    } finally { setBusy(false) }
  }

  // ── Save CSV edit (name only) ─────────────────────────────────────────────
  const handleSaveCSVEdit = async () => {
    if (!editingConnector) return
    const name = connectorName.trim()
    if (!name) { setMsg({ kind: 'error', text: 'Connector Name is required.' }); return }
    setBusy(true); setMsg({ kind: 'info', text: 'Saving changes…' })
    try {
      await updateConnector(editingConnector.id, { name, connector_type: selectedType })
      setMsg({ kind: 'success', text: `✅ "${name}" updated.` })
      await fetchConnectors()
      setTimeout(closeModal, 1500)
    } catch (err: any) {
      setMsg({ kind: 'error', text: `❌ ${err?.response?.data?.detail || err.message}` })
    } finally { setBusy(false) }
  }

  const filtered = connectors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.connector_type.toLowerCase().includes(search.toLowerCase())
  )
  const hasGoogleActive = connectors.some(c => c.connector_type === 'GOOGLE' && c.status === 'Active')
  const isEditMode = modalMode === 'edit'

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="container" style={{ paddingTop: '20px' }}>

        {/* ── auto-sync badge ── */}
        {/* {hasGoogleActive && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#eff6ff', color: '#3b82f6',
            border: '1px solid #bfdbfe', borderRadius: '20px',
            padding: '4px 12px', fontSize: '12px', fontWeight: 500,
            marginBottom: '12px',
          }}>
            <Icons.Sync /> Auto-syncing Google Sheets every 15 seconds
          </div>
        )} */}

        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>

          {/* ── toolbar ── */}
          <div className="flex items-center justify-between" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
            <div className="search-bar">
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><Icons.Search /></span>
              <input type="text" placeholder="Search name or type" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="toolbar">
              <button className="btn-icon-only" title="Refresh now" onClick={() => fetchConnectors()} disabled={loadingList}>
                {loadingList ? <Icons.Spinner /> : <Icons.Refresh />}
              </button>
              <button onClick={openAddModal} style={{ padding: '10px 20px', fontSize: '14px' }}>
                <span style={{ fontSize: '18px', marginRight: '4px' }}>+</span> Add Connector
              </button>
            </div>
          </div>

          {/* ── table ── */}
          <div className="scroll-x">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b', textAlign: 'left' }}>CONNECTOR NAME</th>
                  <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b', textAlign: 'left' }}>TYPE</th>
                  <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b', textAlign: 'left' }}>DETAILS & CONFIG</th>
                  <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b', textAlign: 'left' }}>STATUS</th>
                  {/* <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b', textAlign: 'left' }}>LAST SYNCED</th> */}
                  <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loadingList && (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <Icons.Spinner /> &nbsp;Loading connectors…
                  </td></tr>
                )}
                {!loadingList && listError && (
                  <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#ef4444' }}>{listError}</td></tr>
                )}
                {!loadingList && !listError && filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    No connectors found. Click <strong>+ Add Connector</strong> to get started.
                  </td></tr>
                )}
                {!loadingList && filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex items-center gap-12">
                        <ConnectorTypeIcon type={c.connector_type} />
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className="badge" style={{
                        background: typeColour[c.connector_type]?.bg ?? '#f1f5f9',
                        color: typeColour[c.connector_type]?.fg ?? '#64748b',
                        fontSize: '11px', textTransform: 'uppercase',
                      }}>{c.connector_type}</span>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#64748b', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.detail ?? 'Not configured'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="status-indicator">
                        <div className="dot" style={{ background: c.status === 'Active' ? '#10b981' : '#94a3b8' }}></div>
                        {c.status}
                      </div>
                    </td>
                    {/* <td style={{ padding: '16px 24px' }}>
                      {c.connector_type === 'GOOGLE' && c.last_synced_at ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#3b82f6', fontSize: '13px' }}>
                          <Icons.Sync />
                          <span title={new Date(c.last_synced_at).toLocaleString()}>
                            {timeAgo(c.last_synced_at)}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: '13px' }}>—</span>
                      )}
                    </td> */}
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button
                        className="btn-icon-only"
                        style={{ padding: '6px', borderRadius: '8px' }}
                        title={`Edit "${c.name}"`}
                        onClick={() => openEditModal(c)}
                      >
                        <Icons.Edit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── modal ── */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="flex items-center gap-12">
                  <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '20px' }}>{isEditMode ? '✎' : '+'}</span>
                  <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{isEditMode ? 'Edit Connector' : 'Add Connector'}</h2>
                </div>
                <button className="close-btn" onClick={closeModal}><Icons.Close /></button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Connector Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Manufacturing Lines Data"
                    value={connectorName} onChange={e => setConnectorName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Connector Type *</label>
                  <select className="form-input" style={{ background: '#f8fafc', fontWeight: 500 }}
                    value={selectedType} onChange={e => setSelectedType(e.target.value)} disabled={isEditMode}>
                    <option value="CSV">CSV File</option>
                    <option value="GOOGLE">Google Sheets</option>
                  </select>
                  {isEditMode && <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Connector type cannot be changed after creation.</p>}
                </div>

                {selectedType === 'CSV' && (
                  isEditMode ? (
                    <div className="form-group">
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>
                        📄 <strong>Current file:</strong> {editingConnector?.file_path ?? 'Unknown'}
                        <br /><span style={{ fontSize: '12px' }}>To update the data, delete this connector and add a new one with a fresh file.</span>
                      </div>
                      <button style={{ marginTop: '16px', padding: '10px 20px', fontSize: '14px', width: '100%' }}
                        onClick={handleSaveCSVEdit} disabled={busy}>
                        {busy ? <><Icons.Spinner /> Saving…</> : '💾 Save Changes'}
                      </button>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>CSV Source File *</label>
                      <div className="file-dropzone" onClick={() => fileInputRef.current?.click()}
                        style={{ border: '1px dashed #cbd5e1', padding: '48px 24px', cursor: 'pointer' }}>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".csv" onChange={handleFileUpload} />
                        <div style={{ color: '#3b82f6', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                          {busy ? <Icons.Spinner /> : <Icons.CloudUpload />}
                        </div>
                        <div className="dropzone-text">
                          <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Drag and drop or browse files</h4>
                          <p style={{ color: '#64748b', fontSize: '13px' }}>Supports .csv files</p>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {selectedType === 'GOOGLE' && (
                  <div className="form-group">
                    <label>Google Sheets URL *</label>
                    <input type="text" className="form-input"
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      value={sheetsUrl} onChange={e => setSheetsUrl(e.target.value)} />
                    <div className="mt-12">
                      <button className="ghost" style={{ width: '100%', padding: '12px', borderStyle: 'dashed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        opacity: busy ? 0.75 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
                        onClick={handleGoogleConnect} disabled={busy}>
                        {busy ? <><Icons.Spinner /> Fetching sheet data…</> : isEditMode ? '🔗 Update & Re-fetch Sheet' : '🔗 Connect Now'}
                      </button>
                    </div>
                    {!busy && (
                      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', textAlign: 'center' }}>
                        ⚠️ Sheet must be shared as <strong>"Anyone with the link can view"</strong>
                      </p>
                    )}
                    {!busy && !isEditMode && (
                      <p style={{ fontSize: '12px', color: '#3b82f6', marginTop: '4px', textAlign: 'center' }}>
                        🔄 Once connected, data auto-syncs every 15 seconds
                      </p>
                    )}
                  </div>
                )}

                {msg && <div className={`alert ${msg.kind} mt-12`}>{msg.text}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
