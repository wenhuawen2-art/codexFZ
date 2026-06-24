import clsx from 'clsx'

interface HudBadgeProps {
  label: string
  variant?: 'online' | 'offline' | 'simulated' | 'alert'
}

const variants = {
  online: 'bg-hud-active/20 text-hud-active',
  offline: 'bg-hud-muted/20 text-hud-muted',
  simulated: 'bg-hud-highlight/20 text-hud-highlight',
  alert: 'bg-hud-tag-alert/60 text-hud-alert',
}

function HudBadge({ label, variant = 'online' }: HudBadgeProps) {
  return (
    <span className={clsx('inline-block px-1 py-px text-2xs leading-none', variants[variant])}>
      {label}
    </span>
  )
}

export default HudBadge
