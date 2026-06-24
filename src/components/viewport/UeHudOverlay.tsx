import Scene1LeftCharts from './Scene1LeftCharts'
import Scene2InteractivePanel from './Scene2InteractivePanel'
import Scene2SpacePanel from './Scene2SpacePanel'
import Scene3MagneticPanel from './Scene3MagneticPanel'
import MagneticViewTabs from './MagneticViewTabs'
import RadarViewTabs from './RadarViewTabs'
import SunEarthViewTabs from './SunEarthViewTabs'
import type {
  ConnectionStatus,
  MagneticSettings,
  MagneticView,
  RadarView,
  SceneChartData,
  SceneId,
  SpaceEnvData,
  SunEarthSettings,
  SunEarthView,
} from '../../types/dashboard'

interface UeHudOverlayProps {
  mainScene: SceneId
  radarView: RadarView
  sunEarthView: SunEarthView
  sunEarthSettings: SunEarthSettings
  magneticView: MagneticView
  magneticSettings: MagneticSettings
  charts: SceneChartData
  spaceEnv: SpaceEnvData
  localSunrise: string
  localSunset: string
  photonStatus: ConnectionStatus
  heliumStatus: ConnectionStatus
  ccdStatus: ConnectionStatus
  snspdStatus: ConnectionStatus
  onRadarViewChange: (view: RadarView) => void
  onSunEarthViewChange: (view: SunEarthView) => void
  onSunEarthSettingsChange: (patch: Partial<SunEarthSettings>) => void
  onMagneticViewChange: (view: MagneticView) => void
  onMagneticSettingsChange: (patch: Partial<MagneticSettings>) => void
  onRefreshNoise?: () => void
}

function UeHudOverlay({
  mainScene,
  radarView,
  sunEarthView,
  sunEarthSettings,
  magneticView,
  magneticSettings,
  charts,
  spaceEnv,
  localSunrise,
  localSunset,
  photonStatus,
  heliumStatus,
  ccdStatus,
  snspdStatus,
  onRadarViewChange,
  onSunEarthViewChange,
  onSunEarthSettingsChange,
  onMagneticViewChange,
  onMagneticSettingsChange,
  onRefreshNoise,
}: UeHudOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {mainScene === 'radar' && (
        <>
          <RadarViewTabs value={radarView} onChange={onRadarViewChange} />
          <Scene1LeftCharts
            charts={charts}
            photonStatus={photonStatus}
            heliumStatus={heliumStatus}
            ccdStatus={ccdStatus}
            snspdStatus={snspdStatus}
            radarView={radarView}
            onRefreshNoise={onRefreshNoise}
          />
        </>
      )}

      {mainScene === 'sunEarth' && (
        <>
          <SunEarthViewTabs value={sunEarthView} onChange={onSunEarthViewChange} />
          {sunEarthView === 'schematic' ? (
            <Scene2SpacePanel data={spaceEnv} />
          ) : (
            <Scene2InteractivePanel
              settings={sunEarthSettings}
              localSunrise={localSunrise}
              localSunset={localSunset}
              onChange={onSunEarthSettingsChange}
            />
          )}
        </>
      )}

      {mainScene === 'magnetic' && (
        <>
          <MagneticViewTabs value={magneticView} onChange={onMagneticViewChange} />
          <Scene3MagneticPanel
            settings={magneticSettings}
            sectionMode={magneticView === 'section'}
            onChange={onMagneticSettingsChange}
          />
        </>
      )}
    </div>
  )
}

export default UeHudOverlay
