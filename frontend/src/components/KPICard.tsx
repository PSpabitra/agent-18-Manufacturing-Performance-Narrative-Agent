interface Props {
  label: string
  value: string | number | null | undefined
  hint?: string
  tone?: 'good' | 'bad' | 'neutral'
}
export default function KPICard({ label, value, hint, tone = 'neutral' }: Props) {
  const display = value === null || value === undefined || value === '' ? '—' : value
  return (
    <div className="card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value mt-12">{display}</div>
      {hint && (
        <div className={'kpi-delta mt-12 ' + (tone === 'good' ? 'good' : tone === 'bad' ? 'bad' : 'muted')}>
          {hint}
        </div>
      )}
    </div>
  )
}
