interface BarGaugeProps {
  label: string
  value: number
  max?: number
  unit?: string
  active?: boolean
}

function BarGauge({ label, value, max = 100, unit, active }: BarGaugeProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-2xs">
        <span className="uppercase tracking-wider text-hud-muted">{label}</span>
        <span className="text-hud-highlight">
          {value}
          {unit && <span className="text-hud-muted"> {unit}</span>}
          {active && (
            <span className="ml-1 border border-hud-active px-1 text-2xs text-hud-active">
              ACTIVE
            </span>
          )}
        </span>
      </div>
      <div className="hud-bar-track">
        <div className="hud-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default BarGauge
