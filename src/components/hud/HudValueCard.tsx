import clsx from 'clsx'
import { Pencil } from 'lucide-react'
import HudSubCard from './HudSubCard'

interface HudValueCardProps {
  label: string
  value: string
  status?: 'normal' | 'active' | 'warn' | 'alert'
  className?: string
  editable?: boolean
  onEdit?: () => void
}

const statusColors = {
  normal: 'text-hud-text',
  active: 'text-hud-highlight',
  warn: 'text-hud-accent',
  alert: 'text-hud-alert',
}

function HudValueCard({
  label,
  value,
  status = 'normal',
  className,
  editable,
  onEdit,
}: HudValueCardProps) {
  return (
    <HudSubCard
      status={status}
      className={clsx(
        'group relative',
        editable && 'cursor-default',
        className,
      )}
    >
      {editable && onEdit && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute right-1 top-1 flex h-3 w-3 items-center justify-center text-2xs text-hud-viewport opacity-0 transition-opacity group-hover:opacity-100"
          title="编辑"
          aria-label={`编辑${label}`}
        >
          <Pencil className="h-2.5 w-2.5" strokeWidth={2} aria-hidden />
        </button>
      )}
      <p className="truncate text-2xs uppercase leading-tight tracking-wider text-hud-muted">{label}</p>
      <p className={clsx('mt-px truncate text-2xs font-bold leading-tight', statusColors[status])}>
        {value}
      </p>
    </HudSubCard>
  )
}

export default HudValueCard
