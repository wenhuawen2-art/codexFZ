import { useState } from 'react'
import HudPanel from './hud/HudPanel'
import StatusTile from './hud/StatusTile'
import HudValueCard from './hud/HudValueCard'
import ParamEditDialog from './controls/ParamEditDialog'
import HistoryCurvePanel from './HistoryCurvePanel'
import { SKYLIGHT_LABELS } from '../constants/labels'
import type { HistoryPoint, RealtimeData } from '../types/dashboard'

interface LeftDashboardProps {
  realtime: RealtimeData
  onParamChange: (
    key: 'samplingTime' | 'heightResolutionKm',
    value: string | number,
  ) => void
  onQuery: (query: {
    start: string
    end: string
    params: string[]
  }) => Promise<HistoryPoint[]>
}

type EditField = 'samplingTime' | 'heightResolutionKm' | null

function LeftDashboard({
  realtime,
  onParamChange,
  onQuery,
}: LeftDashboardProps) {
  const { weather, params } = realtime
  const [editField, setEditField] = useState<EditField>(null)

  const skylightStatus =
    params.skylightStatus === 'open'
      ? 'active'
      : params.skylightStatus === 'fault'
        ? 'alert'
        : 'warn'

  const handleConfirmEdit = (value: string) => {
    if (editField === 'samplingTime') {
      onParamChange('samplingTime', value)
    } else if (editField === 'heightResolutionKm') {
      onParamChange('heightResolutionKm', parseFloat(value) || 0)
    }
    setEditField(null)
  }

  return (
    <>
      <HudPanel title="天气 / 环境">
        {weather.error ? (
          <p className="text-2xs text-hud-alert">天气数据获取失败</p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            <StatusTile
              label="温度"
              value={`${weather.temperature}℃`}
              status="active"
            />
            <StatusTile label="湿度" value={`${weather.humidity}%`} />
            <StatusTile label="气压" value={`${weather.pressure}hPa`} />
            <StatusTile label="风向" value={weather.windDirection} />
            <StatusTile label="风速" value={`${weather.windSpeed}m/s`} />
            <StatusTile label="风力" value={`${weather.windLevel}级`} />
            <StatusTile label="云量" value={`${weather.cloudCover}%`} />
          </div>
        )}
      </HudPanel>

      <HudPanel title="系统参数">
        <div className="grid grid-cols-2 gap-1.5">
          <HudValueCard
            className="col-span-2"
            label="采样时间"
            value={params.samplingTime}
            editable
            onEdit={() => setEditField('samplingTime')}
          />
          <StatusTile
            label="PRF"
            value={`${params.prfHz} Hz`}
            status="active"
          />
          <StatusTile label="波长" value={`${params.wavelengthNm} nm`} />
          <StatusTile label="原始计数" value={String(params.rawAccumulation)} />
          <HudValueCard
            label="高度分辨率"
            value={`${params.heightResolutionKm} km`}
            editable
            onEdit={() => setEditField('heightResolutionKm')}
          />
          <StatusTile label="激光室温" value={`${params.laserRoomTemp}℃`} />
          <StatusTile label="激光室湿" value={`${params.laserRoomHumidity}%`} />
          <StatusTile
            label="望远镜室温"
            value={`${params.telescopeRoomTemp}℃`}
          />
          <StatusTile
            label="望远镜室湿"
            value={`${params.telescopeRoomHumidity}%`}
          />
          <StatusTile
            label="累计时间"
            value={`${params.accumulatedTimeSec}s`}
          />
          <StatusTile
            label="天窗"
            value={SKYLIGHT_LABELS[params.skylightStatus]}
            status={skylightStatus}
          />
        </div>
      </HudPanel>

      <HistoryCurvePanel className="shrink-0" onQuery={onQuery} />

      <ParamEditDialog
        open={editField === 'samplingTime'}
        title="编辑采样时间"
        label="采样时间"
        value={params.samplingTime}
        inputType="text"
        onConfirm={handleConfirmEdit}
        onCancel={() => setEditField(null)}
      />
      <ParamEditDialog
        open={editField === 'heightResolutionKm'}
        title="编辑高度分辨率"
        label="高度分辨率"
        value={String(params.heightResolutionKm)}
        inputType="number"
        step="0.1"
        unit="km"
        onConfirm={handleConfirmEdit}
        onCancel={() => setEditField(null)}
      />
    </>
  )
}

export default LeftDashboard
