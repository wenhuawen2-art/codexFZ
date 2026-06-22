import dayjs from 'dayjs'
import BarGauge from './hud/BarGauge'
import HudPanel from './hud/HudPanel'
import StatusTile from './hud/StatusTile'
import RadarChart from './RadarChart'
import type { DeviceStatus } from './StatusPanel'
import type { IntensityPoint } from './RadarChart'

interface LeftDashboardProps {
  status: DeviceStatus
  chartData: IntensityPoint[]
}

function LeftDashboard({ status, chartData }: LeftDashboardProps) {
  const powerPct = Math.round((status.scanRate / 25) * 100)

  return (
    <aside className="flex w-[226px] shrink-0 flex-col gap-3 overflow-y-auto bg-hud-bg p-3">
      <HudPanel title="LASER RADAR // SYSTEM">
        <p className="text-2xs leading-relaxed text-hud-muted">
          {status.connected ? 'DATA CONNECTING...' : 'SIGNAL LOST'}
        </p>
        <p className="mt-1 text-xs text-hud-active">{status.deviceName}</p>
      </HudPanel>

      <HudPanel title="STATUS GRID">
        <div className="grid grid-cols-2 gap-1.5">
          <StatusTile
            label="Scan Rate"
            value={`${status.scanRate} HZ`}
            status="active"
          />
          <StatusTile label="Point Cloud" value="NORMAL" status="normal" />
          <StatusTile
            label="Connection"
            value={status.connected ? 'ACTIVE' : 'OFFLINE'}
            status={status.connected ? 'active' : 'alert'}
          />
          <StatusTile
            label="Firmware"
            value={status.firmwareVersion.toUpperCase()}
            status="normal"
          />
        </div>
      </HudPanel>

      <HudPanel title="MODULE STATUS">
        <div className="space-y-3">
          <BarGauge label="Main Sensor" value={powerPct} unit="%" active />
          <BarGauge label="Scan Power" value={status.scanRate} max={25} unit="Hz" />
          <BarGauge
            label="Point Density"
            value={Math.round(status.pointCount / 2000)}
            max={80}
            unit="K"
          />
        </div>
      </HudPanel>

      <HudPanel title="INTENSITY TREND" className="flex-1">
        <RadarChart data={chartData} compact />
      </HudPanel>

      <p className="text-2xs text-hud-tag">
        SYNC {dayjs(status.lastUpdate).format('HH:mm:ss')}
      </p>
    </aside>
  )
}

export default LeftDashboard
