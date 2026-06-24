import { RADAR_VIEW_LABELS } from '../../constants/labels'
import type { RadarView } from '../../types/dashboard'
import clsx from 'clsx'

interface RadarViewTabsProps {
  value: RadarView
  onChange: (v: RadarView) => void
}

const views: RadarView[] = ['top', 'isometric', 'snspd']

function RadarViewTabs({ value, onChange }: RadarViewTabsProps) {
  return (
    <div className="pointer-events-auto absolute right-[64px] top-[38px] z-20 flex gap-8">
      {views.map((v, index) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={clsx(
            'flex items-center justify-center border border-hud-border bg-hud-card px-1 text-2xs leading-tight',
            index < 2 ? 'size-[105px]' : 'h-[105px] w-[135px]',
            value === v ? 'text-hud-accent' : 'text-hud-text',
          )}
        >
          {RADAR_VIEW_LABELS[v]}
        </button>
      ))}
    </div>
  )
}

export default RadarViewTabs
