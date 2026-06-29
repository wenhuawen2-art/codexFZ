import clsx from 'clsx'
import { LOG_CATEGORY_LABELS } from '../../constants/logs'
import type { LogCategory } from '../../types/logs'

interface LogCategoryNavProps {
  value: LogCategory
  onChange: (category: LogCategory) => void
}

const categories = Object.entries(LOG_CATEGORY_LABELS) as [LogCategory, string][]

function LogCategoryNav({ value, onChange }: LogCategoryNavProps) {
  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
      {categories.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={clsx(
            'hud-btn w-full text-left text-2xs',
            value === key && 'border-hud-active text-hud-active',
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}

export default LogCategoryNav
