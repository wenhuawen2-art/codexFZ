interface HudDataRowProps {
  label: string
  value: string
  title?: string
  valueClassName?: string
}

function HudDataRow({ label, value, title, valueClassName }: HudDataRowProps) {
  return (
    <div className="flex items-center justify-between gap-1 py-0.5 leading-tight" title={title ?? label}>
      <span className="truncate text-2xs text-hud-muted">{label}</span>
      <span className={`shrink-0 text-2xs ${valueClassName ?? 'text-hud-grid-cross'}`}>
        {value}
      </span>
    </div>
  )
}

export default HudDataRow
