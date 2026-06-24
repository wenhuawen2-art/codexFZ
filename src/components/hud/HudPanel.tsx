import clsx from 'clsx'
import type { ReactNode } from 'react'

interface HudPanelProps {
  title?: string
  headerActions?: ReactNode
  className?: string
  children: ReactNode
}

function HudPanel({ title, headerActions, className, children }: HudPanelProps) {
  return (
    <div className={clsx('hud-panel', className)}>
      {title && (
        <div className="mb-1 flex items-center justify-between gap-1">
          <div className="hud-panel-title mb-0 min-w-0 truncate">{title}</div>
          {headerActions ? (
            <div className="flex shrink-0 items-center gap-0.5">{headerActions}</div>
          ) : null}
        </div>
      )}
      {children}
    </div>
  )
}

export default HudPanel
