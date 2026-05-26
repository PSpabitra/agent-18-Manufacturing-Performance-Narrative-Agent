import { useState } from 'react'
import FileUploader from '../components/FileUploader'

export default function UploadPage() {
  const [last, setLast] = useState<{ rows: number; filename: string } | null>(null)
  return (
    <div className="container">
      <h1>Upload KPI File</h1>
      <p className="muted">Upload a CSV with manufacturing KPI rows. Required columns: <code>plant</code>, <code>date</code>; recommended: <code>line, shift, department, production_volume, target_volume, scrap_quantity, scrap_percent, oee, downtime_minutes, downtime_reason, mtbf, mttr, copq, expense_actual, expense_budget, period_type</code>.</p>
      <div className="mt-24">
        <FileUploader onUploaded={(rows, filename) => setLast({ rows, filename })} />
      </div>
      {last && (
        <div className="card mt-24">
          <h3>Last upload</h3>
          <div>File: <b>{last.filename}</b></div>
          <div>Rows parsed: <b>{last.rows}</b></div>
        </div>
      )}
    </div>
  )
}
