import { useState, useRef, useEffect } from 'react'
import { uploadFile } from '../api/apiClient'

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
  ChevronDown: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
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
  )
}

export default function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error' | 'info'; text: string } | null>(null)
  const [connectors, setConnectors] = useState([
    { name: 'CSV Connector', type: 'CSV', detail: 'Not configured', status: 'Not Configured' }
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBusy(true)
    setMsg({ kind: 'info', text: 'Uploading and parsing...' })
    try {
      const res = await uploadFile(file)
      setMsg({ kind: 'success', text: `Successfully uploaded ${res.filename}` })

      const newConnector = {
        name: res.filename,
        type: 'CSV',
        detail: `Successfully parsed ${res.rows_parsed} rows`,
        status: 'Active'
      }

      setConnectors(prev => [newConnector, ...prev.filter(c => c.status !== 'Active')])

      setTimeout(() => {
        setIsModalOpen(false)
        setMsg(null)
      }, 1500)
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err.message || 'Upload failed'
      setMsg({ kind: 'error', text: detail })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex items-center justify-between" style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <div className="search-bar">
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              <Icons.Search />
            </span>
            <input type="text" placeholder="Search name or type" />
          </div>

          <div className="toolbar">
            <button className="btn-icon-only" title="Refresh">
              <Icons.Refresh />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              <span style={{ fontSize: '18px', marginRight: '4px' }}>+</span> Add Connector
            </button>
          </div>
        </div>

        <div className="scroll-x">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b' }}>CONNECTOR NAME</th>
                <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b' }}>TYPE</th>
                <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b' }}>DETAILS & CONFIG</th>
                <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b' }}>STATUS</th>
                <th style={{ padding: '12px 24px', fontSize: '11px', color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {connectors.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center gap-12">
                      <div style={{ color: '#10b981', background: '#ecfdf5', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                        <Icons.CSV />
                      </div>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '11px', textTransform: 'uppercase' }}>{c.type}</span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#64748b' }}>{c.detail}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="status-indicator">
                      <div className="dot" style={{ background: c.status === 'Active' ? '#10b981' : '#94a3b8' }}></div>
                      {c.status}
                    </div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      className="btn-icon-only"
                      style={{ padding: '6px', borderRadius: '8px' }}
                      onClick={() => setIsModalOpen(true)}
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-12">
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '20px' }}>+</span>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Add Connector</h2>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <Icons.Close />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Connector Name *</label>
                <input type="text" className="form-input" placeholder="e.g. Manufacturing Lines Data" />
              </div>

              <div className="form-group">
                <label>Connector Type *</label>
                <div className="connector-type-select">
                  <div className="flex items-center gap-12">
                    <div style={{ color: '#10b981' }}>
                      <Icons.CSV />
                    </div>
                    <span>CSV File</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>CSV Source Files *</label>
                <div
                  className="file-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '1px dashed #cbd5e1', padding: '48px 24px' }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                  <div style={{ color: '#3b82f6', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                    <Icons.CloudUpload />
                  </div>
                  <div className="dropzone-text">
                    <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Drag and drop or browse files</h4>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>Supports multiple .csv files</p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>Automatic anomaly analysis starts instantly upon drop</p>
                  </div>
                </div>
              </div>

              {msg && <div className={`alert ${msg.kind} mt-12`}>{msg.text}</div>}
              {busy && (
                <div className="mt-12" style={{ textAlign: 'center', color: 'var(--primary)', fontWeight: 500 }}>
                  Processing upload...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
