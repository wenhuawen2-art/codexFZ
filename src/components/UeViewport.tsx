import { useState } from 'react'
import clsx from 'clsx'
import { useDashboard } from '../hooks/useDashboard'
import SceneThumbnail from './viewport/SceneThumbnail'
import UeHudOverlay from './viewport/UeHudOverlay'
import UePlaceholderOverlay from './viewport/UePlaceholderOverlay'

/** 四边遮罩厚度（与 Tailwind spacing-2 一致） */
const FRAME_INSET_PX = 8
/** 虚线框 border-2 线宽 */
const FRAME_BORDER_PX = 2
/** UE 内容区 inset = 遮罩 + 边框，虚线框绘制在二者之间 */
const UE_CONTENT_INSET_PX = FRAME_INSET_PX + FRAME_BORDER_PX

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
    <main className="group relative min-h-0 min-w-0 flex-1 bg-transparent">
      <button
        type="button"
        aria-label={placeholderHidden ? '显示占位 UI' : '隐藏占位 UI'}
        title={placeholderHidden ? '显示占位 UI' : '隐藏占位 UI（UE 嵌入调试）'}
        onClick={() => setPlaceholderHidden((hidden) => !hidden)}
        className={clsx(
          'pointer-events-auto absolute right-2 top-2 z-30 flex h-5 w-5 items-center justify-center border border-hud-border/40 bg-hud-card/80 text-[10px] leading-none text-hud-muted backdrop-blur-sm transition-opacity hover:border-hud-viewport hover:text-hud-viewport',
          placeholderHidden ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
      >
        {placeholderHidden ? 'UI' : '×'}
      </button>

      {/* 四边遮罩：厚度覆盖虚线框 border 带（8px + 2px），虚线间隔处透出黑色 */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 bg-hud-bg"
          style={{ height: `${UE_CONTENT_INSET_PX}px` }}
        />
        <div
          className="absolute inset-x-0 bottom-0 bg-hud-bg"
          style={{ height: `${UE_CONTENT_INSET_PX}px` }}
        />
        <div
          className="absolute left-0 bg-hud-bg"
          style={{
            top: `${UE_CONTENT_INSET_PX}px`,
            bottom: `${UE_CONTENT_INSET_PX}px`,
            width: `${UE_CONTENT_INSET_PX}px`,
          }}
        />
        <div
          className="absolute right-0 bg-hud-bg"
          style={{
            top: `${UE_CONTENT_INSET_PX}px`,
            bottom: `${UE_CONTENT_INSET_PX}px`,
            width: `${UE_CONTENT_INSET_PX}px`,
          }}
        />
      </div>

      {/* 虚线框 + 四角：绘制在 UE 区域之外（遮罩与内容之间的 2px 边框带） */}
      <div
        className="pointer-events-none absolute inset-2 z-20 border-2 border-dashed border-hud-viewport"
        aria-hidden
      >
        <span className="pointer-events-none absolute -left-[2px] -top-[2px] h-4 w-4 border-l-2 border-t-2 border-hud-grid-major" />
        <span className="pointer-events-none absolute -right-[2px] -top-[2px] h-4 w-4 border-r-2 border-t-2 border-hud-grid-major" />
        <span className="pointer-events-none absolute -bottom-[2px] -left-[2px] h-4 w-4 border-b-2 border-l-2 border-hud-grid-major" />
        <span className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-4 w-4 border-b-2 border-r-2 border-hud-grid-major" />
      </div>

      {/* UE 内容区：虚线框内侧，透明透出 UE（含 HUD + 底部场景切换） */}
      <div
        className="absolute flex flex-col bg-transparent"
        style={{ inset: `${UE_CONTENT_INSET_PX}px` }}
      >
        {/* 占位 UI：网格底 */}
        <div
          className={clsx(
            'pointer-events-none absolute inset-0 z-0 hud-ue-grid-bg',
            placeholderHiddenClass,
          )}
          aria-hidden={placeholderHidden}
        />

        {/* UE 透出区 + HUD 悬浮层 */}
        <div className="relative z-[1] min-h-0 flex-1 bg-transparent">
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
        </div>

        {/* 占位 UI：缩略图行始终保留 DOM，避免 flex 重算高度 */}
        <div
          className={clsx(
            'pointer-events-auto relative z-[1] flex w-full shrink-0 justify-evenly pb-[40px]',
            placeholderHiddenClass,
          )}
          aria-hidden={placeholderHidden}
        >
          {thumbnailScenes.map((scene) => (
            <SceneThumbnail key={scene} scene={scene} onClick={() => swapScene(scene)} />
          ))}
        </div>

        {/* 历史曲线弹框：锚定虚线框内整体 UE 区（含底部场景切换） */}
        <div
          id="history-chart-portal"
          className="pointer-events-none absolute inset-0 z-30"
        />
      </div>
    </main>
  )
}

export default UeViewport
