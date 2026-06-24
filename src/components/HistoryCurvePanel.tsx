import { useState } from 'react'
import dayjs from 'dayjs'
import clsx from 'clsx'
import HudPanel from './hud/HudPanel'
import HistoryCurveBody from './history/HistoryCurveBody'
import HistoryCurveChartPanel from './history/HistoryCurveChartPanel'
import type { HistoryPoint } from '../types/dashboard'
import { formatHistoryCsvValue } from '../constants/historyParams'
import { getDisplayParams } from './viewport/historyChartUtils'

interface HistoryCurvePanelProps {
  onQuery: (query: {
    start: string
    end: string
    params: string[]
  }) => Promise<HistoryPoint[]>
  className?: string
}

function exportCsv(data: HistoryPoint[], params: string[]) {
  const headers = ['time', ...params]
  const rows = data.map((row) =>
    headers.map((h) => formatHistoryCsvValue(h, row)).join(','),
  )
  const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `history_${dayjs().format('YYYYMMDDHHmmss')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function HistoryCurvePanel({ onQuery, className }: HistoryCurvePanelProps) {
  const [start, setStart] = useState(dayjs().subtract(2, 'hour').format('YYYY-MM-DDTHH:mm'))
  const [end, setEnd] = useState(dayjs().format('YYYY-MM-DDTHH:mm'))
  const [selected, setSelected] = useState<string[]>(['wavelengthNm', 'prfHz'])
  const [queriedParams, setQueriedParams] = useState<string[]>([])
  const [data, setData] = useState<HistoryPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [queried, setQueried] = useState(false)
  const [chartOpen, setChartOpen] = useState(false)

  const handleQuery = async () => {
    if (selected.length === 0) return

    setLoading(true)
    try {
      const result = await onQuery({ start, end, params: selected })
      setQueriedParams([...selected])
      setData(result)
      setQueried(true)
      setChartOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const toggleParam = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const sharedProps = {
    start,
    end,
    selected,
    queriedParams,
    data,
    loading,
    queried,
    onStartChange: setStart,
    onEndChange: setEnd,
    onToggleParam: toggleParam,
    onExportCsv: () => exportCsv(data, getDisplayParams(selected, queriedParams)),
  }

  return (
    <>
      <HudPanel title="历史曲线" className={clsx('flex shrink-0 flex-col', className)}>
        <HistoryCurveBody
          variant="sidebar"
          onQuery={handleQuery}
          showResultsButton={queried && !chartOpen}
          onShowResults={() => setChartOpen(true)}
          {...sharedProps}
        />
      </HudPanel>

      <HistoryCurveChartPanel
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        {...sharedProps}
      />
    </>
  )
}

export default HistoryCurvePanel
