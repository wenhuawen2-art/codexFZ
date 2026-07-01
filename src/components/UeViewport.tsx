import { useState } from 'react'
import clsx from 'clsx'
import { useDashboard } from '../hooks/useDashboard'
import UeFrame from './layout/UeFrame'
import SceneThumbnail from './viewport/SceneThumbnail'
import UeHudOverlay from './viewport/UeHudOverlay'
import UePlaceholderOverlay from './viewport/UePlaceholderOverlay'

function UeViewport() {
  const [placeholderHidden, setPlaceholderHidden] = useState(false)
  const {
    state,
    swapScene,
    setRadarView,
    setSunEarthView,
    patchSunEarthSettings,
    setMagneticView,
    patchMagneticSettings,
    refreshNoise,
  } = useDashboard()
  const {
    mainScene,
    thumbnailScenes,
    radarView,
    sunEarthView,
    sunEarthSettings,
    magneticView,
    magneticSettings,
    realtime,
  } = state

  const photonConn = realtime.connections.find((c) => c.key === 'laser1')
  const heliumConn = realtime.connections.find((c) => c.key === 'tel1')
  const ccdConn = realtime.connections.find((c) => c.key === 'ccd')
  const snspdConn = realtime.connections.find((c) => c.key === 'snspd')

  const placeholderHiddenClass = placeholderHidden ? 'invisible pointer-events-none' : undefined

  return (
    <UeFrame
      placeholderHidden={placeholderHidden}
      onTogglePlaceholder={() => setPlaceholderHidden((hidden) => !hidden)}
      portalId="history-chart-portal"
      gridClassName="hud-ue-coordinate-grid"
      bottomSlot={
        <div
          className={clsx(
            'flex w-full justify-center overflow-hidden px-2 pb-[40px]',
            placeholderHiddenClass,
          )}
          aria-hidden={placeholderHidden}
        >
          <div className="flex min-w-0 w-full max-w-[1360px] gap-4">
            {thumbnailScenes.map((scene) => (
              <SceneThumbnail key={scene} scene={scene} onClick={() => swapScene(scene)} />
            ))}
          </div>
        </div>
      }
    >
      <UePlaceholderOverlay
        mainScene={mainScene}
        hiddenClass={placeholderHiddenClass}
        hidden={placeholderHidden}
      />
      <UeHudOverlay
        mainScene={mainScene}
        radarView={radarView}
        sunEarthView={sunEarthView}
        sunEarthSettings={sunEarthSettings}
        magneticView={magneticView}
        magneticSettings={magneticSettings}
        charts={realtime.sceneCharts}
        spaceEnv={realtime.spaceEnv}
        localSunrise={realtime.localSunrise}
        localSunset={realtime.localSunset}
        photonStatus={photonConn?.status ?? 'disconnected'}
        heliumStatus={heliumConn?.status ?? 'disconnected'}
        ccdStatus={ccdConn?.status ?? 'disconnected'}
        snspdStatus={snspdConn?.status ?? 'disconnected'}
        onRadarViewChange={setRadarView}
        onSunEarthViewChange={setSunEarthView}
        onSunEarthSettingsChange={patchSunEarthSettings}
        onMagneticViewChange={setMagneticView}
        onMagneticSettingsChange={patchMagneticSettings}
        onRefreshNoise={refreshNoise}
      />
    </UeFrame>
  )
}

export default UeViewport
