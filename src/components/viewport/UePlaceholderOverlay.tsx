import clsx from 'clsx'
import { SCENE_LABELS } from '../../constants/labels'
import type { SceneId } from '../../types/dashboard'

interface UePlaceholderOverlayProps {
  mainScene: SceneId
  hiddenClass?: string
  hidden?: boolean
}

function UePlaceholderOverlay({ mainScene, hiddenClass, hidden }: UePlaceholderOverlayProps) {
  return (
    <>
      <div
        className={clsx(
          'pointer-events-none absolute left-2 top-2 z-[1] text-2xs text-hud-viewport',
          hiddenClass,
        )}
        aria-hidden={hidden}
      >
        {SCENE_LABELS[mainScene]} · UE视口
      </div>
    </>
  )
}

export default UePlaceholderOverlay
