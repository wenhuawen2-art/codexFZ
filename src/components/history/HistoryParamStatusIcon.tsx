import clsx from 'clsx'
import type { HistoryChartSize, HistoryParamDataStatus } from '../viewport/historyChartUtils'

interface HistoryParamStatusIconProps {
  status: HistoryParamDataStatus
  size?: HistoryChartSize
}

const SIZE = {
  compact: 10,
  expanded: 12,
} as const

function HistoryParamStatusIcon({ status, size = 'compact' }: HistoryParamStatusIconProps) {
  const px = SIZE[size]
  const strokeWidth = size === 'expanded' ? 1.5 : 1.25

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 10 10"
      className={clsx(
        'shrink-0',
        status === 'unqueried' && 'text-hud-muted',
        status === 'has-data' && 'text-hud-active',
        status === 'no-data' && 'text-hud-alert',
      )}
      aria-hidden
    >
      {status === 'unqueried' && (
        <circle
          cx="5"
          cy="5"
          r="3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      )}
      {status === 'has-data' && <circle cx="5" cy="5" r="3.5" fill="currentColor" />}
      {status === 'no-data' && (
        <>
          <circle
            cx="5"
            cy="5"
            r="3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <path
            d="M2.5 2.5 L7.5 7.5 M7.5 2.5 L2.5 7.5"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="square"
          />
        </>
      )}
    </svg>
  )
}

export default HistoryParamStatusIcon
