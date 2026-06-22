import clsx from 'clsx'
import HudSubCard from './HudSubCard'

interface StatusTileProps {
  label: string
  value: string
  status?: 'normal' | 'active' | 'warn' | 'alert'
}

const statusColors = {
  normal: 'text-hud-text',
  active: 'text-hud-active',
  warn: 'text-hud-accent',
  alert: 'text-hud-alert',
}

function StatusTile({ label, value, status = 'normal' }: StatusTileProps) {
  return (
    <HudSubCard>
      <p className="text-2xs uppercase tracking-wider text-hud-muted">{label}</p>
      <p className={clsx('mt-0.5 text-xs font-bold uppercase', statusColors[status])}>
        {value}
      </p>
    </HudSubCard>
  )
}

export default StatusTile
