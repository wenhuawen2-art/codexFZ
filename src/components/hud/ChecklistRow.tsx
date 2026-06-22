interface ChecklistRowProps {
  label: string
  active?: boolean
  value?: string
}

function ChecklistRow({ label, active, value }: ChecklistRowProps) {
  return (
    <div className="hud-check-row">
      <span className="uppercase tracking-wider text-hud-muted">{label}</span>
      <div className="flex items-center gap-2">
        {value && (
          <span className={active ? 'text-hud-active' : 'text-hud-muted'}>
            {value}
          </span>
        )}
        <span className={active ? 'hud-indicator-on' : 'hud-indicator-off'} />
      </div>
    </div>
  )
}

export default ChecklistRow
