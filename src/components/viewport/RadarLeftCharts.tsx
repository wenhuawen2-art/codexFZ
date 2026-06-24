import type { ReactNode } from 'react'
import {
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ErrorBar,
} from 'recharts'
import UeLeftGlassPanel from './UeLeftGlassPanel'
import type { ConnectionStatus, SceneChartData } from '../../types/dashboard'

interface RadarLeftChartsProps {
  charts: SceneChartData
  photonStatus: ConnectionStatus
  heliumStatus: ConnectionStatus
  ccdStatus: ConnectionStatus
}

function MiniChart({ title, connected, children }: { title: string; connected: boolean; children: ReactNode }) {
  return (
    <UeLeftGlassPanel>
      <p className="mb-0.5 shrink-0 truncate text-2xs text-hud-viewport">{title}</p>
      {connected ? (
        <div className="min-h-0 flex-1">{children}</div>
      ) : (
        <p className="flex min-h-0 flex-1 items-center justify-center text-2xs text-hud-muted">未连接</p>
      )}
    </UeLeftGlassPanel>
  )
}

function CcdHeatmap({ data }: { data: number[][] }) {
  const flat = data.flat()
  const min = Math.min(...flat)
  const max = Math.max(...flat)
  const toColor = (v: number) => {
    const t = (v - min) / (max - min)
    const r = Math.round(55 + t * (255 - 55))
    const b = Math.round(255 - t * 200)
    return `rgb(${r},${Math.round(t * 80)},${b})`
  }
  return (
    <div
      className="grid h-full w-full gap-px"
      style={{
        gridTemplateColumns: `repeat(${data[0]?.length ?? 32}, 1fr)`,
        gridTemplateRows: `repeat(${data.length}, 1fr)`,
      }}
    >
      {data.flatMap((row, ri) =>
        row.map((v, ci) => (
          <div key={`${ri}-${ci}`} className="min-h-0 min-w-0" style={{ backgroundColor: toColor(v) }} />
        )),
      )}
    </div>
  )
}

function RadarLeftCharts({ charts, photonStatus, heliumStatus, ccdStatus }: RadarLeftChartsProps) {
  return (
    <>
      <MiniChart title="光子计数" connected={photonStatus === 'online'}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="x" tick={{ fontSize: 8, fill: '#79888d' }} />
            <YAxis dataKey="y" tick={{ fontSize: 8, fill: '#79888d' }} width={20} />
            <Scatter data={charts.photonCount} fill="#78c4e3" />
          </ScatterChart>
        </ResponsiveContainer>
      </MiniChart>
      <MiniChart title="亚稳态氦密度" connected={heliumStatus === 'online'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={charts.heliumDensity} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <XAxis dataKey="x" tick={{ fontSize: 8, fill: '#79888d' }} />
            <YAxis tick={{ fontSize: 8, fill: '#79888d' }} width={20} />
            <Line type="monotone" dataKey="y" stroke="#11e99d" dot={false} strokeWidth={1}>
              <ErrorBar dataKey="error" width={2} stroke="#79888d" direction="y" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </MiniChart>
      <MiniChart title="CCD成像" connected={ccdStatus === 'online'}>
        <CcdHeatmap data={charts.ccdHeatmap} />
      </MiniChart>
    </>
  )
}

export default RadarLeftCharts
