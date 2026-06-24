import clsx from 'clsx'
import type { ReactNode } from 'react'

interface HudSectionProps {
  title: string
  expanded: boolean
  onToggle: () => void
  summary?: string
  children: ReactNode
}

function HudSection({ title, expanded, onToggle, summary, children }: HudSectionProps) {
  return (
    <div className="hud-section">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-1 py-0.5 text-left"
      >
        <span className="text-2xs text-hud-viewport">{expanded ? '▼' : '▶'}</span>
        <span className="flex-1 truncate text-2xs font-bold uppercase tracking-wider text-hud-text">
          {title}
        </span>
        {!expanded && summary && (
          <span className="truncate text-2xs text-hud-muted">{summary}</span>
        )}
      </button>
      <div className={clsx(!expanded && 'hidden')}>{children}</div>
    </div>
  )
}

export default HudSection
