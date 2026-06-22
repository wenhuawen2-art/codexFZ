import clsx from 'clsx'
import type { ReactNode } from 'react'

interface HudSubCardProps {
  className?: string
  children: ReactNode
}

function HudSubCard({ className, children }: HudSubCardProps) {
  return <div className={clsx('hud-sub-card', className)}>{children}</div>
}

export default HudSubCard
