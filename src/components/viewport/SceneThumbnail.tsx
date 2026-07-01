import clsx from 'clsx'
import { SCENE_LABELS } from '../../constants/labels'
import type { SceneId } from '../../types/dashboard'

interface SceneThumbnailProps {
  scene: SceneId
  active?: boolean
  onClick: () => void
}

function SceneThumbnail({ scene, active, onClick }: SceneThumbnailProps) {
  const imageSrc =
    scene === 'magnetic'
      ? `${import.meta.env.BASE_URL}images/geomagnetic-field.png`
      : scene === 'sunEarth'
        ? `${import.meta.env.BASE_URL}images/sun-earth-spatial-configuration.png`
        : null
  const hasGeneratedImage = imageSrc !== null

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'hud-thumbnail relative flex aspect-[672/378] w-full min-w-0 max-w-[672px] flex-1 flex-col items-center overflow-hidden p-1 transition-colors',
        hasGeneratedImage ? 'justify-end' : 'justify-center',
        active && 'border-hud-viewport bg-hud-card/40',
      )}
    >
      {hasGeneratedImage && (
        <img
          src={imageSrc}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      )}

      <span
        className={clsx(
          'relative z-[1] flex flex-col items-center',
          hasGeneratedImage && 'mb-1 border border-hud-viewport/40 bg-hud-card/80 px-2 py-1 backdrop-blur-sm',
        )}
      >
        <span className="text-2xs text-hud-viewport">{SCENE_LABELS[scene]}</span>
        <span className="mt-0.5 text-2xs text-hud-muted">
          {active ? '主场景' : '点击切换'}
        </span>
      </span>
    </button>
  )
}

export default SceneThumbnail
