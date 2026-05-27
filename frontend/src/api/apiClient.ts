import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 600000,
})

export interface UploadResponse {
  success: boolean
  file_id: number
  filename: string
  rows_parsed: number
  message: string
}

export interface KPIRecord {
  id: number
  plant?: string
  department?: string
  line?: string
  shift?: string
  metric_date?: string
  period_type?: string
  production_volume?: number
  target_volume?: number
  scrap_quantity?: number
  scrap_percent?: number
  oee?: number
  downtime_minutes?: number
  downtime_reason?: string
  mtbf?: number
  mttr?: number
  copq?: number
  expense_actual?: number
  expense_budget?: number
  created_at?: string
}

export interface ReportSummary {
  id: number
  plant?: string
  period_type?: string
  period_start?: string
  period_end?: string
  executive_summary?: string
  docx_url?: string
  pdf_url?: string
  created_at?: string
}

export interface ReportDetail {
  success?: boolean
  report_id: number
  plant?: string
  period_type?: string
  period_start?: string
  period_end?: string
  executive_summary?: string
  full_narrative?: string
  kpi_scorecard?: Record<string, any>
  anomalies?: any[]
  drivers?: any[]
  recommendations?: string[]
  docx_url?: string
  pdf_url?: string
  created_at?: string
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await api.post('/files/upload', fd, {
    // headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function listKpis(params: {
  plant?: string
  line?: string
  shift?: string
  period_type?: string
  start_date?: string
  end_date?: string
  limit?: number
}): Promise<{ success: boolean; count: number; data: KPIRecord[] }> {
  const { data } = await api.get('/kpis', { params })
  return data
}

export async function generateReport(payload: {
  plant: string
  period_type: string
  period_start: string
  period_end: string
}): Promise<ReportDetail> {
  const { data } = await api.post('/reports/generate', payload)
  return data
}

export async function listReports(): Promise<{ success: boolean; count: number; data: ReportSummary[] }> {
  const { data } = await api.get('/reports')
  return data
}

export async function getReport(id: number): Promise<ReportDetail> {
  const { data } = await api.get(`/reports/${id}`)
  return data
}

export interface ChatResponse {
  success: boolean
  answer: string
  sources: any[]
}

export async function chatQuery(payload: {
  question: string
  plant?: string
  period_type?: string
  user_id?: string
}): Promise<ChatResponse> {
  const { data } = await api.post('/chat/query', payload)
  return data
}

export function downloadDocxUrl(id: number) {
  return `${API_BASE}/reports/${id}/download/docx`
}
export function downloadPdfUrl(id: number) {
  return `${API_BASE}/reports/${id}/download/pdf`
}

export interface LoginResponse {
  success: boolean
  message: string
  persona?: string
  username?: string
}

export async function loginAPI(payload: { username: string, password: string }): Promise<LoginResponse> {
  const { data } = await api.post('/auth/login', payload)
  return data
}

// ─── Connector APIs ────────────────────────────────────────────────────────────

export interface ConnectorRecord {
  id: number
  name: string
  connector_type: string
  detail?: string
  status: string
  source_url?: string
  file_path?: string
  last_file_id?: number
  last_synced_at?: string
  created_at: string
  updated_at: string
}

export interface ConnectorCreatePayload {
  name: string
  connector_type: string
  detail?: string
  status?: string
  source_url?: string
  file_path?: string
}

export async function createConnector(
  payload: ConnectorCreatePayload
): Promise<{ success: boolean; message: string; rows_parsed?: number; data: ConnectorRecord }> {
  const { data } = await api.post('/connectors', payload)
  return data
}

export async function listConnectors(): Promise<{
  success: boolean
  count: number
  data: ConnectorRecord[]
}> {
  const { data } = await api.get('/connectors')
  return data
}

export async function updateConnector(
  id: number,
  payload: Partial<ConnectorCreatePayload>
): Promise<{ success: boolean; message: string; rows_parsed?: number; data: ConnectorRecord }> {
  const { data } = await api.put(`/connectors/${id}`, payload)
  return data
}

export default api
