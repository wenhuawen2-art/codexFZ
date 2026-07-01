import { useState } from 'react'
import clsx from 'clsx'
import UeFrame from '../layout/UeFrame'
import DaylightTimeline from './DaylightTimeline'
import {
  EQUIPMENT_VIEW_LABELS,
  type EquipmentViewPreset,
} from '../../constants/equipmentRoom'
import {
  syncDaylightTime,
  syncEquipmentView,
} from '../../lib/ueBridge'

interface EquipmentRoomViewportProps {
  sunrise: string
  sunset: string
  transparentMode: boolean
  onTransparentToggle: () => void
}

const VIEW_PRESETS: EquipmentViewPreset[] = ['default', 'top', 'section']

function parseHour(time: string): number {
  const match = time.match(/^(\d{1,2})/)
  return match ? Number(match[1]) : 6
}

function EquipmentRoomViewport({
  sunrise,
  sunset,
  transparentMode,
  onTransparentToggle,
}: EquipmentRoomViewportProps) {
  const [placeholderHidden, setPlaceholderHidden] = useState(false)
  const [viewPreset, setViewPreset] = useState<EquipmentViewPreset>('default')
  const [hour, setHour] = useState(14)
  const [weatherFxEnabled, setWeatherFxEnabled] = useState(true)

  const sunriseHour = parseHour(sunrise)
  const sunsetHour = parseHour(sunset)
  const placeholderHiddenClass = placeholderHidden ? 'invisible pointer-events-none' : undefined

  const handleViewChange = (preset: EquipmentViewPreset) => {
    setViewPreset(preset)
    syncEquipmentView(preset)
  }

  const handleHourChange = (nextHour: number) => {
    setHour(nextHour)
    syncDaylightTime({ hour: nextHour, weatherFxEnabled })
  }

  const handleWeatherFxToggle = () => {
    const next = !weatherFxEnabled
    setWeatherFxEnabled(next)
    syncDaylightTime({ hour, weatherFxEnabled: next })
  }

  return (
    <UeFrame
      placeholderHidden={placeholderHidden}
      onTogglePlaceholder={() => setPlaceholderHidden((h) => !h)}
      gridClassName="hud-ue-coordinate-grid"
      bottomSlot={
        <DaylightTimeline
          hour={hour}
          sunriseHour={sunriseHour}
          sunsetHour={sunsetHour}
          weatherFxEnabled={weatherFxEnabled}
          onHourChange={handleHourChange}
          onWeatherFxToggle={handleWeatherFxToggle}
        />
      }
    >
      <div
        className={clsx(
          'pointer-events-none absolute left-2 top-2 z-[1] text-2xs text-hud-viewport',
          placeholderHiddenClass,
        )}
      >
        设备间 · UE视口
      </div>

      <div
        className={clsx(
          'pointer-events-auto absolute right-2 top-2 z-20 flex gap-1',
          placeholderHiddenClass,
        )}
      >
        {VIEW_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleViewChange(preset)}
            className={clsx(
              'hud-btn px-2 text-2xs',
              viewPreset === preset && 'border-hud-accent text-hud-accent',
            )}
          >
            {EQUIPMENT_VIEW_LABELS[preset]}
          </button>
        ))}
        <button
          type="button"
          onClick={onTransparentToggle}
          className={clsx(
            'hud-btn px-2 text-2xs',
            transparentMode && 'border-hud-accent text-hud-accent',
          )}
        >
          透明/剖切
        </button>
      </div>
    </UeFrame>
  )
}

export default EquipmentRoomViewport
