import clsx from 'clsx'
import type { ReactNode } from 'react'

interface HudPanelProps {
  title?: string
  className?: string
  children: ReactNode
}

function HudPanel({ title, className, children }: HudPanelProps) {
  return (
    <div className={clsx('hud-panel', className)}>
      {title && <div className="hud-panel-title">{title}</div>}
      {children}
    </div>
  )
}

export default HudPanel
