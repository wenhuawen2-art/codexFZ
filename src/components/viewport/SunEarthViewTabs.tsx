import clsx from 'clsx'
import { SUN_EARTH_VIEW_LABELS } from '../../constants/labels'
import type { SunEarthView } from '../../types/dashboard'

interface SunEarthViewTabsProps {
  value: SunEarthView
  onChange: (v: SunEarthView) => void
}

const views: SunEarthView[] = ['schematic', 'interactive']

function SunEarthViewTabs({ value, onChange }: SunEarthViewTabsProps) {
  return (
    <div className="pointer-events-auto absolute right-[64px] top-[38px] z-20 flex gap-4">
      {views.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={clsx(
            'flex size-[105px] items-center justify-center border border-hud-border bg-hud-card px-1 text-2xs leading-tight',
            value === v ? 'text-hud-accent' : 'text-hud-text',
          )}
        >
          {SUN_EARTH_VIEW_LABELS[v]}
        </button>
      ))}
    </div>
  )
}

export default SunEarthViewTabs
