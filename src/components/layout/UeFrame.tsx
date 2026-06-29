import type { ReactNode } from 'react'
import clsx from 'clsx'
import { AppWindow, X } from 'lucide-react'

/** 四边遮罩厚度（与 Tailwind spacing-2 一致） */
export const FRAME_INSET_PX = 8
/** 虚线框 border-2 线宽 */
export const FRAME_BORDER_PX = 2
/** UE 内容区 inset = 遮罩 + 边框，虚线框绘制在二者之间 */
export const UE_CONTENT_INSET_PX = FRAME_INSET_PX + FRAME_BORDER_PX

interface UeFrameProps {
  children: ReactNode
  bottomSlot?: ReactNode
  placeholderHidden?: boolean
  onTogglePlaceholder?: () => void
  portalId?: string
  className?: string
}

function UeFrame({
  children,
  bottomSlot,
  placeholderHidden = false,
  onTogglePlaceholder,
  portalId,
  className,
}: UeFrameProps) {
  const placeholderHiddenClass = placeholderHidden ? 'invisible pointer-events-none' : undefined

  return (
    <main className={clsx('group relative min-h-0 min-w-0 flex-1 overflow-hidden bg-transparent', className)}>
      {onTogglePlaceholder && (
        <button
          type="button"
          aria-label={placeholderHidden ? '显示占位 UI' : '隐藏占位 UI'}
          title={placeholderHidden ? '显示占位 UI' : '隐藏占位 UI（UE 嵌入调试）'}
          onClick={onTogglePlaceholder}
          className={clsx(
            'pointer-events-auto absolute right-2 top-2 z-30 flex h-5 w-5 items-center justify-center border border-hud-border/40 bg-hud-card/80 text-[10px] leading-none text-hud-muted backdrop-blur-sm transition-opacity hover:border-hud-secondary hover:text-hud-secondary',
            placeholderHidden ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        >
          {placeholderHidden ? (
            <AppWindow className="h-3 w-3" strokeWidth={2} aria-hidden />
          ) : (
            <X className="h-3 w-3" strokeWidth={2} aria-hidden />
          )}
        </button>
      )}

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

      <div
        className="pointer-events-none absolute inset-2 z-20 border-2 border-dashed border-hud-viewport"
        aria-hidden
      >
        <span className="pointer-events-none absolute -left-[2px] -top-[2px] h-4 w-4 border-l-2 border-t-2 border-hud-grid-major" />
        <span className="pointer-events-none absolute -right-[2px] -top-[2px] h-4 w-4 border-r-2 border-t-2 border-hud-grid-major" />
        <span className="pointer-events-none absolute -bottom-[2px] -left-[2px] h-4 w-4 border-b-2 border-l-2 border-hud-grid-major" />
        <span className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-4 w-4 border-b-2 border-r-2 border-hud-grid-major" />
      </div>

      <div
        className="absolute flex flex-col bg-transparent"
        style={{ inset: `${UE_CONTENT_INSET_PX}px` }}
      >
        <div
          className={clsx(
            'pointer-events-none absolute inset-0 z-0 hud-ue-grid-bg',
            placeholderHiddenClass,
          )}
          aria-hidden={placeholderHidden}
        />

        <div className="relative z-[1] min-h-0 flex-1 overflow-hidden bg-transparent">{children}</div>

        {bottomSlot && (
          <div
            className={clsx(
              'pointer-events-auto relative z-[1] min-w-0 shrink-0 overflow-hidden',
              placeholderHiddenClass,
            )}
            aria-hidden={placeholderHidden}
          >
            {bottomSlot}
          </div>
        )}

        {portalId && (
          <div
            id={portalId}
            className="pointer-events-none absolute inset-0 z-30"
          />
        )}
      </div>
    </main>
  )
}

export default UeFrame
