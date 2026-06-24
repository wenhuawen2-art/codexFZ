import type { ReactNode } from 'react'
import PageNav from './PageNav'
import HudStatusStrip from '../hud/HudStatusStrip'

interface LeftSidebarShellProps {
  systemStatus: string
  children?: ReactNode
}

function LeftSidebarShell({ systemStatus, children }: LeftSidebarShellProps) {
  return (
    <aside className="flex h-full w-[226px] shrink-0 flex-col gap-2.5 overflow-hidden bg-hud-bg p-2">
      <div className="flex h-[78.75px] shrink-0 items-center">
        <img
          src="/images/title.png"
          alt="超窄带氦荧光共振超导大气激光雷达"
          className="h-full w-full object-contain object-left"
        />
      </div>

      <PageNav />

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">{children}</div>

      <HudStatusStrip systemStatus={systemStatus} />
    </aside>
  )
}

export default LeftSidebarShell
