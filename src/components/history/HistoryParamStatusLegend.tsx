import HistoryParamStatusIcon from './HistoryParamStatusIcon'
import {
  HISTORY_PARAM_DATA_STATUSES,
  getParamDataStatusLegendLabel,
} from '../viewport/historyChartUtils'

function HistoryParamStatusLegend() {
  return (
    <div
      className="mt-0.5 flex flex-nowrap gap-x-2 overflow-hidden border-t border-hud-border/20 pt-1"
      aria-label="查询项状态图例"
    >
      {HISTORY_PARAM_DATA_STATUSES.map((status) => (
        <div
          key={status}
          className="flex shrink-0 items-center gap-1 text-2xs leading-none text-hud-muted"
        >
          <HistoryParamStatusIcon status={status} size="compact" />
          <span className="truncate">{getParamDataStatusLegendLabel(status)}</span>
        </div>
      ))}
    </div>
  )
}

export default HistoryParamStatusLegend
