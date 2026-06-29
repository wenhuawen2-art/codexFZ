import clsx from 'clsx'
import { SCENE_LABELS } from '../../constants/labels'
import type { SceneId } from '../../types/dashboard'

interface SceneThumbnailProps {
  scene: SceneId
  active?: boolean
  onClick: () => void
}

function SceneThumbnail({ scene, active, onClick }: SceneThumbnailProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'hud-thumbnail flex aspect-[672/378] w-full min-w-0 max-w-[672px] flex-1 flex-col items-center justify-center p-1 transition-colors',
        active && 'border-hud-viewport bg-hud-card/40',
      )}
    >
      <span className="text-2xs text-hud-viewport">{SCENE_LABELS[scene]}</span>
      <span className="mt-0.5 text-2xs text-hud-muted">
        {active ? '主场景' : '点击切换'}
      </span>
    </button>
  )
}

export default SceneThumbnail
