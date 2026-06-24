import clsx from 'clsx'
import type { ReactNode } from 'react'

export type HudSubCardStatus = 'normal' | 'active' | 'warn' | 'alert'

interface HudSubCardProps {
  className?: string
  status?: HudSubCardStatus
  children: ReactNode
}

const statusClasses: Record<HudSubCardStatus, string | undefined> = {
  normal: undefined,
  active: 'hud-sub-card-active',
  warn: 'hud-sub-card-warn',
  alert: 'hud-sub-card-alert',
}

function HudSubCard({ className, status = 'normal', children }: HudSubCardProps) {
  return (
    <div className={clsx('hud-sub-card', statusClasses[status], className)}>{children}</div>
  )
}

export default HudSubCard
