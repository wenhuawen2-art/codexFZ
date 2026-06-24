import clsx from 'clsx'
import { MAGNETIC_VIEW_LABELS } from '../../constants/labels'
import type { MagneticView } from '../../types/dashboard'

interface MagneticViewTabsProps {
  value: MagneticView
  onChange: (v: MagneticView) => void
}

const views: MagneticView[] = ['field', 'section']

function MagneticViewTabs({ value, onChange }: MagneticViewTabsProps) {
  return (
    <div className="pointer-events-auto absolute right-[64px] top-[38px] z-20 flex gap-8">
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
          {MAGNETIC_VIEW_LABELS[v]}
        </button>
      ))}
    </div>
  )
}

export default MagneticViewTabs
